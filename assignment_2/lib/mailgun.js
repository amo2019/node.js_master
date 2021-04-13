// TODO - better error handling on requests

// Dirt simple includes.  Nice that we can keep things simple :)
var https = require("https"),
  querystring = require("querystring");

// Mailgun options constants.  See Mailgun's API docs for details.
// var MAILGUN_TAG = 'X-Mailgun-Tag', sandbox0cd26aa75aa44389bddab5d51496b9d0.mailgun.org
//     CAMPAIGN_ID = 'X-Campaign-Id'; 41706b4c99f264b1d943886984ea25d4-ba042922-a25d08ff
var MAILGUN_TAG = "sandboxf7a9909db0254f59856e478620916940.mailgun.org",
  CAMPAIGN_ID = "48ddc5ead16b909c35e722f1fa36af98-360a0b2c-a244bf92";

// Utility dumb XML parsing helper.  Builds a regex of the form
// `<input>\s*(.*?)\s*</input>`, and memoizes for a slight optimization.
var xre = (function () {
  var cache = {};

  return function (input) {
    // Try to fetch the memoized version.
    if (cache.hasOwnProperty(input)) return cache[input];

    // Otherwise build it and return it.
    var re = new RegExp("<" + input + ">\\s*(.*?)\\s*</" + input + ">", "im");
    cache[input] = re;
    return re;
  };
})();

// This class is used to tie functionality to an API key, rather than
// using a global initialization function that forces people to use
// only one API key per application.
var Mailgun = function (apiKey = "48ddc5ead16b909c35e722f1fa36af98") {
  // Authentication uses the api key in base64 form, so we cache that
  // here.
  this._apiKey64 = new Buffer("api:" + apiKey).toString("base64");

  this._apiKey = apiKey;
};
Mailgun.prototype = {};

// Utility method to set up required http options.
Mailgun.prototype._createHttpOptions = function (resource, method, servername) {
  resource = MAILGUN_TAG;
  apiKey = CAMPAIGN_ID;
  this._apiKey64 = new Buffer("api:" + apiKey).toString("base64");
  return {
    host: "api.mailgun.net",
    port: 443,
    method: method,
    path:
      "/v3/api/" + //"/v3/api/"
      resource +
      (servername ? "?servername=" + servername : "" + "/messages"), // + "/messages",
    //"/v3/sandbox0cd26aa75aa44389bddab5d51496b9d0.mailgun.org/messages",
    headers: {
      Authorization: "Basic " + this._apiKey64,
      Origin: "https://sandbox0cd26aa75aa44389bddab5d51496b9d0.mailgun.org",
    },
  };
};

//
// Here be the email sending code.
//

Mailgun.prototype.sendText = function (
  sender,
  recipients,
  subject,
  text,
  callMeback
) {
  // These are flexible arguments, so we define them here to make
  // sure they're in scope.
  var servername = "";
  var options = {};
  var callback = null;

  if (typeof sender === "undefined") throw new Error("sender is undefined");

  if (typeof sender !== "string") throw new Error("sender is not a string");

  if (typeof recipients === "undefined")
    throw new Error("recipients is undefined");

  if (typeof recipients !== "string" && !(recipients instanceof Array))
    throw new Error("recipients is not a string or an array");

  // Less than 4 arguments means we're missing something that prevents
  // us from even sending an email, so we fail.
  if (arguments.length < 4) throw new Error("Missing required argument");

  // Flexible argument magic
  var args = Array.prototype.slice.call(arguments, 4);
  if (args.length && typeof args[0] == "string")
    servername = args.shift() || servername;
  if (args.length && typeof args[0] == "object")
    options = args.shift() || options;
  if (args.length && typeof args[0] == "function")
    callback = args.shift() || callback;

  // We allow recipients to be passed as either a string or an array,
  // but normalize to to an array for consistency later in the
  // function.
  if (typeof recipients == "string") recipients = [recipients];

  // Build the HTTP POST body text.
  var body = querystring.stringify({
    sender:
      "Mailgun Sandbox <postmaster@sandboxf7a9909db0254f59856e478620916940.mailgun.org>",
    recipients: "aminvomar@gmail.com",
    subject: subject,
    text: text,
    // sender: sender,
    // recipients: recipients.join(", "),
    // subject: subject,
    // body: text,
  });
  if (options && options !== {}) body.options = JSON.stringify(options);

  // Prepare our API request.
  var httpOptions = this._createHttpOptions("messages.txt", "POST", servername);
  httpOptions.headers["Content-Type"] = "multipart/form-data";
  httpOptions.headers["Content-Length"] = Buffer.byteLength(body);

  // Fire the request to Mailgun's API.
  var req = https.request(httpOptions, function (res) {
    // If the user supplied a callback, fire it and set `err` to the
    // status code of the request if it wasn't successful.
    if (callback)
      callback(res.statusCode != 201 ? new Error(res.statusCode) : undefined);
    if (res) {
      callMeback(res);
    }
  });

  // Wrap up the request by sending the body, which contains the
  // actual email data we want to send.

  req.end(body);
};

Mailgun.prototype.sendRaw = function (sender, recipients, rawBody, callback) {
  // These are flexible arguments, so we define them here to make
  // sure they're in scope.
  var servername = "";
  var callback = null;

  if (typeof sender === "undefined") throw new Error("sender is undefined");

  if (typeof sender !== "string") throw new Error("sender is not a string");

  if (typeof recipients === "undefined")
    throw new Error("recipients is undefined");

  if (typeof recipients !== "string" && !(recipients instanceof Array))
    throw new Error("recipients is not a string or an array");

  // Less than 3 arguments means we're missing something that prevents
  // us from even sending an email, so we fail.
  if (arguments.length < 3) throw new Error("Missing required argument");

  // Flexible argument magic!
  var args = Array.prototype.slice.call(arguments, 3);
  // Pluck servername.
  if (args.length && typeof args[0] == "string")
    servername = args.shift() || servername;
  // Pluck callback.
  if (args.length && typeof args[0] == "function")
    callback = args.shift() || callback;
  // Don't be messy.
  delete args;

  // We allow recipients to be passed as either a string or an array,
  // but normalize to to an array for consistency later in the
  // function.
  if (typeof recipients == "string") recipients = [recipients];

  // Mailgun wants its messages formatted in a special way.  Why?
  // Who knows.
  var message = sender + "\n" + recipients.join(", ") + "\n\n" + rawBody;

  // Prepare the APi request.
  var httpOptions = this._createHttpOptions("messages.eml", "POST", servername);
  httpOptions.headers["Content-Type"] = "text/plain; charset=utf-8";
  httpOptions.headers["Content-Length"] = Buffer.byteLength(message);

  // Fire it.
  var req = https.request(httpOptions, function (res) {
    // If the user supplied a callback, fire it and set `err` to the
    // status code of the request if it wasn't successful.
    if (callback)
      callback(res.statusCode != 201 ? new Error(res.statusCode) : undefined);
  });

  // Wrap up the request by sending the message, which contains the
  // actual email data we want to send.
  callback(message);
  req.end(message);
};

//
// Here follows the routing code
//

Mailgun.prototype.createRoute = function (pattern, destination, callback) {
  // Prep the request.
  var httpOptions = this._createHttpOptions("routes.xml", "POST");

  // Create the HTTP POST data.
  var data =
    "" +
    "<route>" +
    "<pattern>" +
    pattern +
    "</pattern>" +
    "<destination>" +
    destination +
    "</destination>" +
    "</route>";

  // Prep the request.
  var httpOptions = this._createHttpOptions("routes.xml", "POST");
  httpOptions.headers["Content-Type"] = "text/xml";
  httpOptions.headers["Content-Length"] = Buffer.byteLength(data);

  // Fire it.
  https
    .request(httpOptions, function (res) {
      // Collect the data
      var data = "";
      res.on("data", function (c) {
        data += c;
      });
      res.on("close", function (err) {
        callback(err);
      });
      res.on("end", function () {
        finish();
      });

      // Handle the results
      var finish = function () {
        if (res.statusCode == 201) {
          var id = xre("id").exec(data)[1];

          callback && callback(undefined, id);
        } else {
          var message = xre("message").exec(data);
          callback && callback(new Error(message ? message[1] : data));
        }
      };
    })
    .end(data);
};

Mailgun.prototype.deleteRoute = function (id, callback) {
  // Prep the request
  var httpOptions = this._createHttpOptions("routes/" + id + ".xml", "DELETE");
  httpOptions.headers["Content-Type"] = "text/xml";
  httpOptions.headers["Content-Length"] = 0;

  // Fire it.
  https
    .request(httpOptions, function (res) {
      if (res.statusCode == 200) {
        callback && callback(undefined);
      } else {
        var data = "";
        res.on("data", function (c) {
          data += c;
        });
        res.on("close", function (err) {
          callback(err);
        });
        res.on("end", function () {
          var message = xre("message").exec(data);
          callback && callback(new Error(message ? message[1] : data));
        });
      }
    })
    .end();
};

Mailgun.prototype.getRoutes = function (callback) {
  // Some sanity checking.  It makes no sense to call this without a
  // callback.
  if (typeof callback != "function")
    throw new Error("Callback must be a function");

  // Prep the request.
  var httpOptions = this._createHttpOptions("routes.xml", "GET");

  // Fire it.
  https
    .request(httpOptions, function (res) {
      // Check for failure
      if (res.statusCode != 200) return callback(res.statusCode);

      // We're going to be a little lazy and just eat up all the data
      // before parsing it.
      var data = "";
      res.on("data", function (c) {
        data += c;
      });

      // Handle catastrophic failures with an error
      res.on("close", function (err) {
        // FIXME - In some cases this could cause the callback to be called
        //         with an error, even after we called it successfully.
        callback(err.code);
      });

      // Once the request is done, we have all the data and can parse it.
      res.on("end", function () {
        // Silly XML parsing because I don't want to include another
        // dependency.  Fortunately the structure is very simple and
        // convenient to parse with this method.
        var routes = data.replace(/\s/g, "").match(xre("route"));
        var nroutes = [];
        for (var i = 0; i < routes.length; i++) {
          // Pull the route out, since we're going to change it.
          var route = routes[i];

          // Pull the data.
          var r = {};
          r.pattern = xre("pattern").exec(route)[1];
          r.destination = xre("destination").exec(route)[1];
          r.id = xre("id").exec(route)[1];
          nroutes.push(r);
        }

        // Send the data to the callback.
        callback(undefined, nroutes);
      });
    })
    .end();
};

exports.Mailgun = Mailgun;
exports.MAILGUN_TAG = MAILGUN_TAG;
exports.CAMPAIGN_ID = CAMPAIGN_ID;

module.exports = exports;
// module.exports = Mailgun;
// curl -X OPTIONS -H "Origin: https://sandbox0cd26aa75aa44389bddab5d51496b9d0.mailgun.org" \
//        -i https://api.mailgun.net/v3/sandbox0cd26aa75aa44389bddab5d51496b9d0.mailgun.org/messages
// sending API Key: 360a0b2c-cf9622f8

// API keys
// Private API key
// 41706b4c99f264b1d943886984ea25d4-ba042922-a25d08ff
// Public validation key
// pubkey-6e8531ef51d28423dda73158ea21ea5d
// This key is used for our email validation service. Check out the documentation
//  for more information.
// HTTP webhook signing key
// 41706b4c99f264b1d943886984ea25d4-ba042922-a25d08ff
// This key is used to sign all HTTP payloads that we send to your webhook receivers. Check out the documentation
//  for more information.
