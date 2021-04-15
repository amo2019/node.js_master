/*
 * Create and export configuration variables
 *
 */ 
var constants = require("./constants");
 const API_BASE = constants.url.API_BASE
 console.log("API_BASE:", API_BASE)
 console.log("process.env.NODE_ENV-config:", process.env.NODE_ENV);
// Container for all environments
var environments = {};

// Staging (default) environment
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging",
  hashingSecret: "thisIsASecret",
  maxChecks: 5,
  twilio: {
    accountSid: "ACb32d411ad7fe886aac54c665d25e5c5d",
    authToken: "9455e3eb3109edc12e3d8c92768f7a67",
    fromPhone: "+15005550006",
  },
  templateGlobals: {
    appName: "Pizza Store",
    companyName: "Company, Inc.",
    yearCreated: "2020",
    baseUrl: API_BASE,
  },
};

// Production environment
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production",
  hashingSecret: "thisIsAlsoASecret",
  maxChecks: 10,
  twilio: {
    accountSid: "",
    authToken: "",
    fromPhone: "",
  },
  templateGlobals: {
    appName: "Pizza Store",
    companyName: "Company, Inc.",
    yearCreated: "2020",
    baseUrl: API_BASE,
  },
};

// Determine which environment was passed as a command-line argument
var currentEnvironment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

// Check that the current environment is one of the environments above, if not default to staging
var environmentToExport =
  typeof environments[currentEnvironment] == "object"
    ? environments[currentEnvironment]
    : environments.staging;

// Export the module
module.exports = environmentToExport;
