/**
 * Title: Uptime Monitoring Application
 * A RESTFull API to monitoring up or down time user defined links
 * Author: Md Mohiuddin
 * Date: 21/06/2022
 */

// dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const env = require('./helpers/environments')
const { sendTwilioSms } = require('./helpers/notifications')

// app object - module scaffolding
const app = {};

sendTwilioSms('01850301867', 'Hello', (err) => {
  console.log(`this is the error`, err);
})

// configaration
// app.config = {
//   port: 8080,
// };


// create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(env.port, () => {
    console.log(
      `Server is running ${env.envName} on port ${env.port}`
    );
  });
};

// handle Request and Response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
