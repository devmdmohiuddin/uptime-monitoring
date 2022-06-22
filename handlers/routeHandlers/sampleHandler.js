/**
 * Title: Sample Handler
 * Application sample handler
 * Author: Md Mohiuddin
 * Date: 21/06/2022
 */

// module scaffolding
const handler = {};

handler.sampleHandler = (requestedProperties, callback) => {
  callback(200, {
    message: "This is sample handler"
  });
}

module.exports = handler