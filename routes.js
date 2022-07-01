/**
 * Title: Routes
 * Application Routes
 * Author: Md Mohiuddin
 * Date: 21/06/2022
 */

// dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");
const { checkHandler } = require("./handlers/routeHandlers/checkHandler");

// module scaffolding
const routes = {
  sample: sampleHandler,
  users: userHandler,
  tokens: tokenHandler,
  checks: checkHandler,
};

module.exports = routes;
