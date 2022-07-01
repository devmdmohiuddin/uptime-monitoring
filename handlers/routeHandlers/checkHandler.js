/**
 * Title: Check Handler
 * Application check handler
 * Author: Md Mohiuddin
 * Date: 01/30/2022
 */

// dependencies
// const data = require("../../lib/data");
// const {
//   _token: { verify },
// } = require("../routeHandlers/tokenHandler");
// const { hash } = require("../../utilities/utilities");
// const { parseJSON } = require("../../utilities/utilities");

// module scaffolding
const handler = {};

handler.checkHandler = (requestedProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestedProperties.method) > -1) {
    handler._check[requestedProperties.method](requestedProperties, callback);
  } else {
    callback(405);
  }
};

handler._check = {};

handler._check.post = (requestedProperties, callback) => {};

handler._check.get = (requestedProperties, callback) => {
};

handler._check.put = (requestedProperties, callback) => {};

handler._check.delete = (requestedProperties, callback) => {};

module.exports = handler;
