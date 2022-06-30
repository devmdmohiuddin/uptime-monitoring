/**
 * Title: User Handler
 * Application user handler
 * Author: Md Mohiuddin
 * Date: 28/06/2022
 */

// dependencies
const data = require("../../lib/data");
const { hash } = require("../../utilities/utilities");
const { parseJSON } = require("../../utilities/utilities");

// module scaffolding
const handler = {};

handler.userHandler = (requestedProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestedProperties.method) > -1) {
    handler._user[requestedProperties.method](requestedProperties, callback);
  } else {
    callback(405);
  }
};

handler._user = {};

handler._user.post = (requestedProperties, callback) => {
  // const {firstName, lastName, password, phone, tosAgreement} = requestedProperties.body

  const firstName =
    typeof requestedProperties.body.firstName === "string" &&
    requestedProperties.body.lastName.trim().length > 0
      ? requestedProperties.body.firstName
      : null;

  const lastName =
    typeof requestedProperties.body.lastName === "string" &&
    requestedProperties.body.lastName.trim().length > 0
      ? requestedProperties.body.lastName
      : null;

  const phone =
    typeof requestedProperties.body.phone === "string" &&
    requestedProperties.body.phone.trim().length === 11
      ? requestedProperties.body.phone
      : null;

  const password =
    typeof requestedProperties.body.password === "string" &&
    requestedProperties.body.lastName.trim().length > 0
      ? requestedProperties.body.password
      : null;

  const tosAgreement =
    typeof requestedProperties.body.tosAgreement === "boolean"
      ? requestedProperties.body.tosAgreement
      : null;

  if (firstName && lastName && phone && password && tosAgreement) {
    data.read("users", phone, (err1, user) => {
      if (err1) {
        const userData = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };
        data.create("users", phone, userData, (err2, user) => {
          if (!err2) {
            callback(201, { message: "User created successfully." });
          } else {
            callback(500, { error: "There was a problem in the server" });
          }
        });
      } else {
        callback(500, {
          error: "There was an error in the server.",
        });
      }
    });
  } else {
    callback(400, { error: "You have a problem in your request." });
  }
};

handler._user.get = (requestedProperties, callback) => {
  const phone =
    typeof requestedProperties.queryStringObject.phone === "string" &&
    requestedProperties.queryStringObject.phone.trim().length === 11
      ? requestedProperties.queryStringObject.phone
      : null;

  if (phone) {
    data.read("users", phone, (err, user) => {
      if (!err) {
        const userObj = { ...parseJSON(user) };
        delete userObj.password;
        callback(200, userObj);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { message: "User doesn't exist." });
  }
};

handler._user.put = (requestedProperties, callback) => {
  const phone =
    typeof requestedProperties.queryStringObject.phone === "string" &&
    requestedProperties.queryStringObject.phone.trim().length === 11
      ? requestedProperties.queryStringObject.phone
      : null;

  const firstName =
    typeof requestedProperties.body.firstName === "string" &&
    requestedProperties.body.firstName.trim().length > 0
      ? requestedProperties.body.firstName
      : null;

  const lastName =
    typeof requestedProperties.body.lastName === "string" &&
    requestedProperties.body.lastName.trim().length > 0
      ? requestedProperties.body.lastName
      : null;

  const password =
    typeof requestedProperties.body.password === "string" &&
    requestedProperties.body.password.trim().length > 0
      ? requestedProperties.body.password
      : null;

  if (phone) {
    data.read("users", phone, (err1, user) => {
      if (!err1) {
        const userObj = parseJSON(user);
        userObj.firstName = firstName || userObj.firstName;
        userObj.lastName = lastName || userObj.lastName;
        userObj.password = password ? hash(password) : userObj.password;

        data.update("users", phone, userObj, (err2, user) => {
          if (!err2) {
            callback(200, { message: "Updated successfully" });
          } else {
            callback(500, { message: "server problem" });
          }
        });
      } else {
        callback(500, { error: "Something problem in the database" });
      }
    });
  } else {
    callback(400, { error: "User not found" });
  }
};

handler._user.delete = (requestedProperties, callback) => {
  const phone =
    typeof requestedProperties.queryStringObject.phone === "string" &&
    requestedProperties.queryStringObject.phone.trim().length === 11
      ? requestedProperties.queryStringObject.phone
      : null;

  if (phone) {
    data.delete("users", phone, (err1) => {
      if (!err1) {
        callback(204, { message: "delete successfull" });
      } else {
        callback(400, { error: "back request" });
      }
    });
  } else {
    callback(404, { error: "User not found" });
  }
};

module.exports = handler;
