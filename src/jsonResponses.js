// Node's built-in cryptography module.
// Requires openssl to be installed (usually on every OS).
// Openssl does the cryptography/encryption for most
// OSes and languages.
// You can actually see all the algorithms on your OS
// by opening git bash typing the following (without quotes)
// 'openssl  list-message-digest-algorithms'
const crypto = require('crypto');

// Note this object is purely in memory
// When node shuts down this will be cleared.
// Same when your heroku app shuts down from inactivity
// We will be working with databases in the next few weeks.
const users = {};

// sha1 is a bit of a quicker hash algorithm for insecure things
// It's a standard library for insecure data hashes
// For more security, you want sha512 or an actual encryption algorithm
// Those algorithms are *FAR* more expensive, but will increase security.
// You just want to ensure you know whether you want encryption or hashing.
// For VERY fast INSECURE hashing, you can use xxhash (not built into node).
let etag = crypto.createHash('sha1').update(JSON.stringify(users));
let digest = etag.digest('hex');

//function to respond with a json object
//takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {
  //object for our headers
  //Content-Type for json
  //etag to version response 
  //etag is a unique versioning number of an object
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };
  
  //send response with json object
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

//function to respond without json body
//takes request, response and status code
const respondJSONMeta = (request, response, status) => {
  //object for our headers
  //Content-Type for json
  //etag to version response 
  //etag is a unique versioning number of an object
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };

  //send response without json object, just headers
  response.writeHead(status, headers);
  response.end();
};

// get user object
// should calculate a 200 or 304 based on etag
const getUsers = (request, response) => {
  //json object to send
  const responseJSON = {
    users,
  };

  //check the client's if-none-match header to see the version
  //number the client is returning (from etag)
  //If the version number (originally set by the server in etag)
  //is the same as our current one, then send a 304
  //304 cannot have a body in it.
  if (request.headers['if-none-match'] === digest) {
    //return 304 response without message 
    //304 is not modified and cannot have a body field
    //304 will tell the browser to pull from cache instead
    return respondJSONMeta(request, response, 304);
  }

  //return 200 with message
  return respondJSON(request, response, 200, responseJSON);
};

// get meta info about user object
// should calculate a 200 or 304 based on etag
const getUsersMeta = (request, response) => {
  //check the client's if-none-match header to see the version
  //number the client is returning (from etag)
  //If the version number (originally set by the server in etag)
  //is the same as our current one, then send a 304
  //304 cannot have a body in it.
  if (request.headers['if-none-match'] === digest) {
    return respondJSONMeta(request, response, 304);
  }

  //return 200 without message, just the meta data
  return respondJSONMeta(request, response, 200);
};

//function just to update our object and recalculate etag
const updateUser = (request, response) => {
  //change to make to user
  //This is just a dummy object for example
  const newUser = {
    createdAt: Date.now(),
  };

  // modifying our dummy object
  // just indexing by time for now
  users[newUser.createdAt] = newUser;
  
  //creating a new hash object 
  etag = crypto.createHash('sha1').update(JSON.stringify(users));
  //recalculating the hash digest for etag
  digest = etag.digest('hex');

  //return a 201 created status
  return respondJSON(request, response, 201, newUser);
};

// function for 404 not found requests with message
const notFound = (request, response) => {
  //create error message for response
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  //return a 404 with an error message
  respondJSON(request, response, 404, responseJSON);
};

// function for 404 not found without message
const notFoundMeta = (request, response) => {
  //return a 404 without an error message
  respondJSONMeta(request, response, 404);
};

//set public modules
module.exports = {
  getUsers,
  getUsersMeta,
  updateUser,
  notFound,
  notFoundMeta,
};
