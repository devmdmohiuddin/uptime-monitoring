/**
 * Title: Uptime Monitoring Application
 * A RESTFull API to monitoring up or down time user defined links
 * Author: Md Mohiuddin
 * Date: 21/06/2022
 */

// dependencies
const http = require("http");
const { handleReqRes } = require('./helpers/handleReqRes')

// app object - module scaffolding
const app = {};

// configaration
app.config = {
  port: 8080,
};

// create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`Server is running on port ${app.config.port}`);
  });
};

// handle Request and Response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
