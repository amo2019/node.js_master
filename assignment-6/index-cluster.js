var server = require("./server");
var api = require("./api");
var cluster = require("cluster");
var os = require("os");

// Declaring the app
var app = {};

// Init function
app.init = function () {
  if (cluster.isMaster) {
    // sending api request
    /*  api.makeRequest("hello", function (res) {
      console.log("Status Code:", res.statusCode);
    }); */

    // Forking the processes
    for (var i = 0; i < os.cpus().length; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
      console.log("\x1b[36m%s\x1b[0m", worker.process.pid, " worker is died");
      // Refork the process
      cluster.fork();
    });
  } else {
    //starting the HTTP server
    server.init();
  }
};

// Self invoking only if required directly
if (require.main === module) {
  app.init(function () {});
}

module.exports = app;
