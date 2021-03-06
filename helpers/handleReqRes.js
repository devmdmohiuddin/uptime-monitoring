/**
 * Title: Handle Request and Response
 * Handling Request and Response
 * Author: Md Mohiuddin
 * Date: 21/06/2022
 */

// dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const {
  notFoundHandler,
} = require("../handlers/routeHandlers/notFoundHandler");
const routes = require("../routes");
const {parseJSON} = require('../utilities/utilities')

// hanlder object - module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  // handling request
  // get the date from the url and parse it
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method.toLowerCase();
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const queryStringObject = parsedUrl.query;
  const headerObject = req.headers;

  const requestedProperties = {
    path,
    parsedUrl,
    trimmedPath,
    method,
    queryStringObject,
    headerObject,
  };

  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  const decoder = new StringDecoder("utf-8");
  let realData = "";
  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    decoder.end();

    requestedProperties.body = parseJSON(realData);

    chosenHandler(requestedProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : {};

      const payloadString = JSON.stringify(payload);

      // return the final response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
};

module.exports = handler;
