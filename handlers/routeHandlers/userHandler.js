/**
 * Title: User Handler
 * Application user handler
 * Author: Md Mohiuddin
 * Date: 28/06/2022
 */

// dependencies
const data = require("../../lib/data");
const { hash } = require("../../utilities/utilities");

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

  const password =
    typeof requestedProperties.body.password === "string" &&
    requestedProperties.body.lastName.trim().length > 0
      ? requestedProperties.body.password
      : null;

  const phone =
    typeof requestedProperties.body.phone === "string" &&
    requestedProperties.body.phone.trim().length === 11
      ? requestedProperties.body.phone
      : null;

  const tosAgreement =
    typeof requestedProperties.body.tosAgreement === "boolean"
      ? requestedProperties.body.tosAgreement
      : null;


  if (firstName && lastName && phone && password) {
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
    callback(400, { error: "You have a problem in your request."})
  }
};

handler._user.get = () => {};

handler._user.put = () => {};

handler._user.delete = () => {};

module.exports = handler;
