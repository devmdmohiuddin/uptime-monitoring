/**
 * Title: Token Handler
 * Application token handler
 * Author: Md Mohiuddin
 * Date: 30/06/2022
 */

// dependencies
// const data = require("../../lib/data");
// const { hash } = require("../../utilities/utilities");
// const { parseJSON } = require("../../utilities/utilities");

// module scaffolding
const handler = {};

handler.tokenHandler = (requestedProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestedProperties.method) > -1) {
    handler._token[requestedProperties.method](requestedProperties, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

handler._token.post = (requestedProperties, callback) => {};

handler._token.get = (requestedProperties, callback) => {};

handler._token.put = (requestedProperties, callback) => {};

handler._token.delete = (requestedProperties, callback) => {};

module.exports = handler;
