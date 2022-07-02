/**
 * Title: Check Handler
 * Application check handler
 * Author: Md Mohiuddin
 * Date: 01/30/2022
 */

// dependencies
const data = require("../../lib/data");
const {
  _token: { verify },
} = require("../routeHandlers/tokenHandler");
const { parseJSON, createRandomString } = require("../../utilities/utilities");
const environments = require("../../helpers/environments");

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

handler._check.post = (requestedProperties, callback) => {
  const protocol =
    typeof requestedProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestedProperties.body.protocol) > -1
      ? requestedProperties.body.protocol
      : null;

  const url =
    typeof requestedProperties.body.url === "string" &&
    requestedProperties.body.url.length > 0
      ? requestedProperties.body.url
      : null;

  const method =
    typeof requestedProperties.method === "string" &&
    ["get", "post", "put", "delete"].indexOf(requestedProperties.method) > -1
      ? requestedProperties.method
      : null;

  const statusCodes =
    typeof requestedProperties.body.statusCodes === "object" &&
    requestedProperties.body.statusCodes instanceof Array &&
    requestedProperties.body.statusCodes.length < environments.maxChecks
      ? requestedProperties.body.statusCodes
      : [];

  const timeoutSeconds =
    typeof requestedProperties.body.timeoutSeconds === "number" &&
    requestedProperties.body.timeoutSeconds >= 1 &&
    requestedProperties.body.timeoutSeconds <= environments.maxChecks
      ? requestedProperties.body.timeoutSeconds
      : null;

  if (protocol && url && method && statusCodes && timeoutSeconds) {
    const token =
      typeof requestedProperties.headerObject.token === "string"
        ? requestedProperties.headerObject.token
        : null;

    data.read("tokens", token, (err1, tokenData) => {
      if (!err1) {
        const tokenObj = parseJSON(tokenData);
        const phone = tokenObj.phone;

        data.read("users", phone, (err2, userData) => {
          const userObj = parseJSON(userData);
          const userChecks =
            typeof userObj.checks === "object" &&
            userObj.checks instanceof Array
              ? userObj.checks
              : [];

          if (!err2 && userChecks.length < environments.maxChecks) {
            const checkId = createRandomString(20);
            verify(token, phone, (isValidToken) => {
              if (isValidToken) {
                const checkObj = {
                  id: checkId,
                  phone,
                  protocol,
                  url,
                  method,
                  statusCodes,
                  timeoutSeconds,
                };

                data.create("checks", checkId, checkObj, (err3) => {
                  if (!err3) {
                    userObj.checks = userChecks;
                    userObj.checks.push(checkId);

                    data.update("users", phone, userObj, (err4) => {
                      if (!err4) {
                        callback(200, checkObj);
                      } else {
                        callback(500, {
                          error: "There was a problem in the server",
                        });
                      }
                    });
                  } else {
                    callback(400, {
                      error: "There was a problem in the server",
                    });
                  }
                });
              } else {
                callback(403, { error: "Authentication problem." });
              }
            });
          }
        });
      } else {
        callback(400, { error: "Something wrong in your token" });
      }
    });
  } else {
    callback(400, { error: "You have a problen in your request" });
  }
};

handler._check.get = (requestedProperties, callback) => {
  const id =
    typeof requestedProperties.queryStringObject.id === "string" &&
    requestedProperties.queryStringObject.id.trim().length > 0
      ? requestedProperties.queryStringObject.id
      : null;

  const token =
    typeof requestedProperties.headerObject.token === "string"
      ? requestedProperties.headerObject.token
      : null;

  console.log(token);

  if (id) {
    data.read("checks", id, (err, checkData) => {
      if (!err) {
        const checkObj = parseJSON(checkData);
        const { phone } = checkObj;

        verify(token, phone, (isTokenValid) => {
          console.log("sdfasdfasfasd");
          if (isTokenValid) {
            callback(200, checkObj);
          } else {
            callback(403, { message: "Authentication failed" });
          }
        });
      } else {
        callback(400, { error: "You have a problem in your request" });
      }
    });
  } else {
    callback(400, { error: "You have a problem in your request" });
  }
};

handler._check.put = (requestedProperties, callback) => {
  const id =
    typeof requestedProperties.queryStringObject.id === "string" &&
    requestedProperties.queryStringObject.id.trim().length > 0
      ? requestedProperties.queryStringObject.id
      : null;

  const token =
    typeof requestedProperties.headerObject.token === "string"
      ? requestedProperties.headerObject.token
      : null;

  const protocol =
    typeof requestedProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestedProperties.body.protocol) > -1
      ? requestedProperties.body.protocol
      : null;

  const url =
    typeof requestedProperties.body.url === "string" &&
    requestedProperties.body.url.length > 0
      ? requestedProperties.body.url
      : null;

  const statusCodes =
    typeof requestedProperties.body.statusCodes === "object" &&
    requestedProperties.body.statusCodes instanceof Array &&
    requestedProperties.body.statusCodes.length < environments.maxChecks
      ? requestedProperties.body.statusCodes
      : [];

  const timeoutSeconds =
    typeof requestedProperties.body.timeoutSeconds === "number" &&
    requestedProperties.body.timeoutSeconds >= 1 &&
    requestedProperties.body.timeoutSeconds <= environments.maxChecks
      ? requestedProperties.body.timeoutSeconds
      : null;

  if (id) {
    data.read("checks", id, (err1, checkData) => {
      if (!err1) {
        const checkObj = parseJSON(checkData);
        const { phone } = checkObj;

        verify(token, phone, (isTokenValid) => {
          if (isTokenValid) {
            if (protocol || url || statusCodes || timeoutSeconds) {
              checkObj.protocol = protocol || checkObj.protocol;
              checkObj.url = url || checkObj.url;
              checkObj.statusCodes =
                statusCodes.length === 0 ? checkObj.statusCodes : statusCodes;
              checkObj.timeoutSeconds =
                timeoutSeconds || checkObj.timeoutSeconds;

              data.update("checks", id, checkObj, (err2) => {
                if (!err2) {
                  callback(200, checkObj);
                } else {
                  callback(500, { error: "Something happeded in the server" });
                }
              });
            } else {
              callback(400, "Must be given at lest one filed");
            }
          } else {
            callback(403, { error: "Authentication problem" });
          }
        });
      } else {
        callback(500, "Something wrong in server");
      }
    });
  } else {
    callback(400, { error: "You have a problem in your request" });
  }
};

handler._check.delete = (requestedProperties, callback) => {
  const id =
    typeof requestedProperties.queryStringObject.id === "string" &&
    requestedProperties.queryStringObject.id.trim().length > 0
      ? requestedProperties.queryStringObject.id
      : null;

  const token =
    typeof requestedProperties.headerObject.token === "string"
      ? requestedProperties.headerObject.token
      : null;

  if (id) {
    data.read("checks", id, (err1, checkData) => {
      if (!err1) {
        const checkObj = parseJSON(checkData);
        const { phone } = checkObj;

        verify(token, phone, (isValidToken) => {
          if (isValidToken) {
            data.delete("checks", id, (err2) => {
              if (!err2) {
                data.read("users", phone, (err3, userData) => {
                  if (!err3) {
                    const userObj = parseJSON(userData);
                    const positionCheckId = userObj.checks.indexOf(id);
                    userObj.checks.splice(positionCheckId, 1);

                    data.update('users', phone, userObj, (err4) => {
                      if (!err4) {
                        callback(204)
                      } else {
                        callback(500, { error: "Server problem" });
                      }
                    });
                  } else {
                    callback(500, { error: "Server problem" });
                  }
                });
              } else {
                callback(500, { error: "Server problem" });
              }
            });
          } else {
            callback(403, { error: "Authenticatin prbolem" });
          }
        });
      } else {
        callback(400, { error: "Your request doesn't valid" });
      }
    });
  } else {
    callback(400, { error: "You have a problem in your request" });
  }
};

module.exports = handler;
