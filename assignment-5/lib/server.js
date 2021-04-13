// Dependencies
var http = require("http");
var https = require("https");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var fs = require("fs");
//var handlers = require("./handlers");
//var helpers = require("./helpers");
var path = require("path");
var util = require("util");
var debug = util.debuglog("server");

// Instantiate the server module object
var server = {};
const httpPort = "4000";
const httpsPort = "4001";
// Instantiate the HTTP server
server.httpServer = http.createServer(function (req, res) {
  server.unifiedServer(req, res);
});

// All the server logic for both the http and https server
server.unifiedServer = function (req, res) {
  // Parse the url
  var parsedUrl = url.parse(req.url, true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the HTTP method
  var method = req.method.toLowerCase();

  //Get the headers as an object
  var headers = req.headers;

  // Get the payload,if any
  var decoder = new StringDecoder("utf-8");
  var buffer = "";
  req.on("data", function (data) {
    buffer += decoder.write(data);
  });
  req.on("end", function () {
    buffer += decoder.end();

    // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
    var chosenHandler =
      typeof server.router[trimmedPath] !== "undefined"
        ? server.router[trimmedPath]
        : handlers.notFound;

    // If the request is within the public directory use to the public handler instead
    chosenHandler =
      trimmedPath.indexOf("public/") > -1 ? handlers.public : chosenHandler;

    // Construct the data object to send to the handler
    var data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    // Route the request to the handler specified in the router
    try {
      chosenHandler(data, function (statusCode, payload, contentType) {
        server.processHandlerResponse(
          res,
          method,
          trimmedPath,
          statusCode,
          payload,
          contentType
        );
      });
    } catch (e) {
      debug(e);
      server.processHandlerResponse(
        res,
        method,
        trimmedPath,
        500,
        { Error: "An unknown error has occured" },
        "json"
      );
    }
  });
};

// Process the response from the handler
server.processHandlerResponse = function (
  res,
  method,
  trimmedPath,
  statusCode,
  payload,
  contentType
) {
  // Determine the type of response (fallback to JSON)
  contentType = typeof contentType == "string" ? contentType : "json";

  // Use the status code returned from the handler, or set the default status code to 200
  statusCode = typeof statusCode == "number" ? statusCode : 200;

  // Return the response parts that are content-type specific
  var payloadString = "";
  if (contentType == "json") {
    res.setHeader("Content-Type", "application/json");
    payload = typeof payload == "object" ? payload : {};
    payloadString = JSON.stringify(payload);
  }

  if (contentType == "plain") {
    res.setHeader("Content-Type", "text/plain");
    payloadString = typeof payload !== "undefined" ? payload : "";
  }

  // Return the response-parts common to all content-types
  res.writeHead(statusCode);
  res.end(payloadString);

  // If the response is 200, print green, otherwise print red
  if (statusCode == 200) {
    debug(
      "\x1b[32m%s\x1b[0m",
      method.toUpperCase() + " /" + trimmedPath + " " + statusCode
    );
  } else {
    debug(
      "\x1b[31m%s\x1b[0m",
      method.toUpperCase() + " /" + trimmedPath + " " + statusCode
    );
  }
};

// Define all the handlers
var handlers = {};

// Ping
handlers.ping = function (data, callback) {
  callback(200);
};

// Users
handlers.users = function (data, callback) {
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    callback(400);
  } else {
    callback(405);
  }
};

// Error example (this is why we're wrapping the handler caller in a try catch)
handlers.exampleError = function (data, callback) {
  var err = new Error("This is an example error.");
  throw err;
};

// Not-Found
handlers.notFound = function (data, callback) {
  callback(404);
};

//helpers container
var helpers = {};

// Sample for testing that simply returns a number
helpers.getANumber = function () {
  return 1;
};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function (str) {
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

// Define the request router
server.router = {
  ping: handlers.ping,
  "": handlers.notFound,
  "api/users": handlers.users,
  "examples/error": handlers.exampleError,
};
// Init script
server.init = function () {
  // Start the HTTP server
  server.httpServer.listen(httpPort, function () {
    console.log(
      "\x1b[36m%s\x1b[0m",
      "The HTTP server is running on port " + httpPort
    );
  });
};

// Export the module
module.exports = server;
