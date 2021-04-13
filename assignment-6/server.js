// Hello World API
// Routing Response

const http = require("http");
const url = require("url");
var cluster = require("cluster");

var server = {};
serverHttp = http.createServer(function (req, res) {
  let parsedURL = url.parse(req.url, true);
  let path = parsedURL.pathname;

  path = path.replace(/^\/+|\/+$/g, "");
  console.log(path);
  let qs = parsedURL.query;
  let headers = req.headers;
  let method = req.method.toLowerCase();

  req.on("data", function () {
    console.log("got some data");
  });
  req.on("end", function () {
    console.log("send a response");
    let route =
      typeof server.routes[path] !== "undefined"
        ? server.routes[path]
        : server.routes["notFound"];
    //console.log("routes[path]", routes[path]);
    let data = {
      path: path,
      queryString: qs,
      headers: headers,
      method: method,
    };
    route(data, res);
  });
});

server.routes = {
  hello: function (data, res) {
    // this function called if the path is 'kenny'
    let payload = {
      salute: `(Process ID: ${process.pid}) Hello there...`,
    };
    let payloadStr = JSON.stringify(payload);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);
    res.write(payloadStr);
    res.end("\n");
    cluster.worker.kill();
  },

  login: function (data, res) {
    // this function called if the path is 'kenny'
    let payload = {
      login: `(Process ID: ${process.pid}) You are loged in...`,
    };
    let payloadStr = JSON.stringify(payload);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);
    res.write(payloadStr);
    res.end("\n");
    cluster.worker.kill();
  },
  notFound: function (data, res) {
    //this route gets called if no route matches
    console.log("Not found");
    let payload = {
      message: `(Process ID: ${process.pid}) Page Not Found`,
      code: 404,
    };
    let payloadStr = JSON.stringify(payload);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(404);

    res.write(payloadStr);
    res.end("\n");
    cluster.worker.kill();
  },
};
server.init = function () {
  serverHttp.listen(3001, function () {
    console.log(
      "Process ID:",
      "\x1b[36m\x1b[0m",
      process.pid,
      "Listening on port 3001"
    );
  });
};
//server.init();
// exporting the module
module.exports = server;
