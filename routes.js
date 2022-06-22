/**
 * Title: Routes
 * Application Routes
 * Author: Md Mohiuddin
 * Date: 21/06/2022
 */

// dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler')

// module scaffolding
const routes = {
  'sample': sampleHandler
}

module.exports = routes