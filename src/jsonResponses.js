// Node's built-in cryptography module.
const crypto = require('crypto');

// Note this object is purely in memory
const users = {};

// sha1 is a bit of a quicker hash algorithm for insecure things
let etag = crypto.createHash('sha1').update(JSON.stringify(users));
//grab the hash as a hex string
let digest = etag.digest('hex');

const respondJSON = (request, response, status, object) => {

};

const respondJSONMeta = (request, response, status) => {

};

const getUsers = (request, response) => {

};

const updateUser = (request, response) => {

};

const getUsersMeta = (request, response) => {

};

const notFound = (request, response) => {

};

const notFoundMeta = (request, response) => {

};

module.exports = {
  getUsers,
  getUsersMeta,
  updateUser,
  notFound,
  notFoundMeta,
};
