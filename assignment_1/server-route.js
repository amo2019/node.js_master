// Hello World API
// Routing Response

const http = require("http");
const url = require("url");

const server = http.createServer(function (req, res) {
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
      typeof routes[path] !== "undefined" ? routes[path] : routes["notFound"];
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

server.listen(3001, function () {
  console.log("Listening on port 3001");
});

let routes = {
  hello: function (data, res) {
    // this function called if the path is 'kenny'
    let payload = {
      salute: "Hello there...",
    };
    let payloadStr = JSON.stringify(payload);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);
    res.write(payloadStr);
    res.end("\n");
  },
  notFound: function (data, res) {
    //this route gets called if no route matches
    let payload = {
      message: "Page Not Found",
      code: 404,
    };
    let payloadStr = JSON.stringify(payload);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(404);

    res.write(payloadStr);
    res.end("\n");
  },
};
