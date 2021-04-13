var http = require("http");
const httpPort = "3001";

var api = {};

api.makeRequest = function (path, callback) {
  var reqDetails = {
    protocol: "http:",
    hostname: "localhost",
    method: "GET",
    path: path,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    var req = http.request(reqDetails, function (res) {
      callback(res);
    });
    req.end();
  } catch (error) {
    console.log("error Code:", error);
    req.end();
  }
};

module.exports = api;
