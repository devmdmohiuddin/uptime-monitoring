/**
 * Title: Environment Handling
 * Setup the environment variable
 * Author: Md Mohiuddin
 * Date: 21/06/2022
 */

// module scaffloding
const environments = {};

// development
environments.development = {
  port: 3000,
  envName: "development",
};

// production
environments.production = {
  port: 5000,
  envName: "production",
};

// determin which environment was passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string"
    ? process.env.NODE_ENV
    : "development";

// export corresponding environment object
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.development;

module.exports = environmentToExport;
