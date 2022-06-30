/**
 * Title: File handling
 * CRUD operation on file
 * Author: Md Mohiuddin
 * Date: 23/06/2022
 */

// dependencies
const crypto = require("crypto");
const environments = require("../helpers/environments");

// module scaffloding
const utilities = {};

// parsing string to object
utilities.parseJSON = (stringData) => {
  let output = null;

  if (typeof stringData === "string" && stringData.length > 0) {
    output = JSON.parse(stringData);
  } else {
    output = {};
  }
  return output;
};

utilities.createRandomString = (strlen) => {
  const characters = "abcdefghijklmnopqrstuvwxyz1234567890";
  let output = "";
  for (let i = 0; i < strlen; i++) {
    output += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return output;
};

utilities.hash = (str) => {
  const hash = crypto
    .createHmac("sha256", environments.secretKey)
    .update(str)
    .digest("hex");
  return hash;
};

module.exports = utilities;
