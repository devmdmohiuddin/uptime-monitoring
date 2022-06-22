/**
 * Title: Not Found Handler
 * Application Not Found Handler
 * Author: Md Mohiuddin
 * Date: 21/06/2022
 */

// module scaffolding
const handler = {};

handler.notFoundHandler = (requestedProperties, callback) => {
  callback(404, { message: "This is not valid url" });
};

module.exports = handler;
