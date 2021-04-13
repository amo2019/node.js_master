/*
 * Primary API
 *
 */

// Dependencies
var server = require("./lib/server");

// Declare the app
var app = {};

// Init function
app.init = function (callback) {
  // Start the server
  server.init();

  // Start the workers
  // workers.init();

  // Start the CLI, but make sure it starts last
  setTimeout(function () {
    callback();
  }, 60);
};

// Self invoking only if required directly
if (require.main === module) {
  app.init(function () {});
}

// Export the app
module.exports = app;
