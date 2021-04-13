let testsCompleted = 0;

// Dependencies
var app = require("./../index");
var http = require("http");
const httpPort = "4000";
const httpsPort = "4001";
var assert = require("assert");
const test = require("./test");

lib = {};

// Holder for Tests

// Assert that the getANumber function is returning a number
lib["Test item for delete"] = function (done) {
  test.deletePizzaTest();
  done();
};

// Assert that the getANumber function is returning 1
lib["add pizza test 1 item should exist"] = function (done) {
  test.addPizzaTest();
  done();
};
// Assert that the getANumber function is returning 2
lib["async test Callback function should passed true"] = function (done) {
  test.doAsyncTest();
  done();
};
// Logs.truncate should not throw if the logId doesnt exist
lib["throw error test"] = function (done) {
  test.throwsErrorTest();
  done();
};

lib["deepEqual checks the elements in the objects are identical"] = function (
  done
) {
  test.objectEquality();
  done();
};

//API Test

// Helpers
var helpers = {};
helpers.makeGetRequest = function (path, callback) {
  // Configure the request details

  var requestDetails = {
    protocol: "http:",
    hostname: "localhost",
    port: httpPort,
    method: "GET",
    path: path,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Send the request
  var req = http.request(requestDetails, function (res) {
    callback(res);
  });
  req.end();
};

// The main init() function should be able to run without throwing.
lib["app.init should start without throwing"] = function (done) {
  assert.doesNotThrow(function () {
    app.init(function (err) {
      done();
    });
  }, TypeError);
};

// Make a request to /ping
lib["/ping should respond to GET with 200"] = function (done) {
  helpers.makeGetRequest("/ping", function (res) {
    assert.equal(res.statusCode, 200);
    done();
  });
};

// Export the tests to the runner
module.exports = lib;
