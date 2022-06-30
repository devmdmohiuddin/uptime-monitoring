/**
 * Title: Token Handler
 * Application token handler
 * Author: Md Mohiuddin
 * Date: 30/06/2022
 */

// dependencies
const data = require("../../lib/data");
const {
  hash,
  parseJSON,
  createRandomString,
} = require("../../utilities/utilities");

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

handler._token.post = (requestedProperties, callback) => {
  const phone =
    typeof requestedProperties.body.phone === "string" &&
    requestedProperties.body.phone.trim().length === 11
      ? requestedProperties.body.phone
      : null;

  const password =
    typeof requestedProperties.body.password === "string" &&
    requestedProperties.body.password.trim().length > 0
      ? requestedProperties.body.password
      : null;

  if (password && phone) {
    data.read("users", phone, (err1, userData) => {
      if (!err1) {
        const hashedPassword = hash(password);
        if (hashedPassword === parseJSON(userData).password) {
          const tokenId = createRandomString(20);
          const expires = Date.now() + 60 * 60 * 1000;
          const tokenObj = {
            phone,
            expires,
            id: tokenId,
          };
          data.create("tokens", tokenId, tokenObj, (err2, tokenData) => {
            if (!err2) {
              callback(200, { message: "Token created successfully." });
            } else {
              // callback(500, { message: 'There was a problem in the server.'})
              console.log(err2);
            }
          });
        } else {
          callback(400, { message: "Password doesn't valid" });
        }
      } else {
        callback(404, { message: "User not found." });
      }
    });
  }
};

handler._token.get = (requestedProperties, callback) => {
  const id =
    typeof requestedProperties.queryStringObject.id === "string" &&
    requestedProperties.queryStringObject.id.trim().length === 20
      ? requestedProperties.queryStringObject.id
      : null;

  if (id) {
    data.read("tokens", id, (err, tokenData) => {
      if (!err) {
        const tokenObj = { ...parseJSON(tokenData) };
        callback(200, tokenObj);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { message: "Token doesn't exist." });
  }
};

handler._token.put = (requestedProperties, callback) => {
  const id =
    typeof requestedProperties.body.id === "string" &&
    requestedProperties.body.id.trim().length === 20
      ? requestedProperties.body.id
      : null;

  const extend =
    typeof requestedProperties.body.extend === "boolean" &&
    requestedProperties.body.extend === true
      ? requestedProperties.body.extend
      : null;

  if (id && extend) {
    data.read("tokens", id, (err1, tokenData) => {
      if (!err1) {
        const tokenObj = parseJSON(tokenData);

        if (tokenObj.expires > Date.now()) {
          tokenObj.expires = Date.now() + 60 * 60 * 1000;

          data.update("tokens", id, tokenObj, (err2) => {
            if (!err2) {
              callback(200, tokenObj);
            } else {
              callback(500, { message: "There was a problem in the server" });
            }
          });
        } else {
          callback(400, { message: "Token already expires" });
        }
      } else {
        callback(400, { message: "Token doesn't exist" });
      }
    });
  } else {
    callback(400, { message: "Token doesn't match" });
  }
};

handler._token.delete = (requestedProperties, callback) => {
  const id =
    typeof requestedProperties.queryStringObject.id === "string" &&
    requestedProperties.queryStringObject.id.trim().length === 20
      ? requestedProperties.queryStringObject.id
      : null;

  if (id) {
    data.delete("tokens", id, (err1) => {
      if (!err1) {
        callback(204, { message: "delete successfull" });
      } else {
        callback(500, { error: "There was a problem in the server." });
      }
    });
  } else {
    callback(404, { error: "Token not found" });
  }
};

handler._token.verify = (id, phone, callback) => {
  data.read("tokens", id, (err1, tokenData) => {
    if (!err1 && tokenData) {
      const tokenObj = parseJSON(tokenData);
      if (tokenObj.phone === phone && tokenObj.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = handler;
