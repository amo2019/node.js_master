/*
 * Helpers for various tasks
 *
 */

// Dependencies
var config = require("./config");
var crypto = require("crypto");
var https = require("https");
var querystring = require("querystring");
var path = require("path");
var fs = require("fs");

// Container for all the helpers
var helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function (str) {
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

// Create a SHA256 hash
helpers.hash = function (str) {
  if (typeof str == "string" && str.length > 0) {
    var hash = crypto
      .createHmac("sha256", config.hashingSecret)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function (strLength) {
  strLength = typeof strLength == "number" && strLength > 0 ? strLength : false;
  if (strLength) {
    // Define all the possible characters that could go into a string
    var possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

    // Start the final string
    var str = "";
    for (i = 1; i <= strLength; i++) {
      // Get a random charactert from the possibleCharacters string
      var randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      // Append this character to the string
      str += randomCharacter;
    }
    // Return the final string
    return str;
  } else {
    return false;
  }
};

helpers.sendStripe = function (total, stripeToken, custId, srcId, callback) {
  // Validate parameters
  // phone =
  //   typeof phone == "string" && phone.trim().length == 10
  //     ? phone.trim()
  //     : false;
  // msg =
  //   typeof msg == "string" && msg.trim().length > 0 && msg.trim().length <= 1600
  //     ? msg.trim()
  //     : false;
  if (total && stripeToken) {
    // Configure the request payload
    var payload = {
      amount: 1000,
      // amount: parseInt(total) * 100,
      currency: "usd",
      description: "Test payment from stripe.test.",
      customer: custId, // Id
      source: srcId,
    };

    var stringPayload = querystring.stringify(payload);

    // Configure the request details
    var requestDetails = {
      protocol: "https:",
      hostname: "api.stripe.com",
      method: "POST",
      path: "/v1/charges",
      auth:
        "Bearer sk_test_51HlXwADvgdKXdPFVZ9vAV5hE2LVNT1gaNao2bF8QCIX3f68N9PRJp0Ks5rXH0oONmvzMRnyT2MXVlvtWInwGYsqJ00iuFnZRIs",
      headers: {
        Authorization:
          "Bearer sk_test_51HlXwADvgdKXdPFVZ9vAV5hE2LVNT1gaNao2bF8QCIX3f68N9PRJp0Ks5rXH0oONmvzMRnyT2MXVlvtWInwGYsqJ00iuFnZRIs",
        "Content-Type": "application/x-www-form-urlencoded",
        "Stripe-Account": "acct_1HlXwADvgdKXdPFV",
        "Content-Length": Buffer.byteLength(stringPayload),
      },
    };

    // Instantiate the request object
    var req = https.request(requestDetails, function (res) {
      // Grab the status of the sent request
      var status = res.statusCode;
      // Callback successfully if the request went through
      if (status == 200 || status == 201) {
        callback(false);
      } else {
        callback("Status code returned was " + status);
      }
    });

    // Bind to the error event so it doesn't get thrown
    req.on("error", function (e) {
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
  } else {
    callback("Given parameters were missing or invalid");
  }
};

helpers.createSourceStripe = function (stripeToken, Id, callback) {
  // Validate parameters
  // phone =
  //   typeof phone == "string" && phone.trim().length == 10
  //     ? phone.trim()
  //     : false;
  // msg =
  //   typeof msg == "string" && msg.trim().length > 0 && msg.trim().length <= 1600
  //     ? msg.trim()
  //     : false;
  if (Id) {
    // Configure the request payload
    var payloadx = {
      type: "ach_credit_transfer",
      currency: "usd",
      "owner[email]": "aminvpython@gmail.com",
    };

    var stringPayload = querystring.stringify(payloadx);
    console.log("stringPayload:"), stringPayload, payloadx;
    // Configure the request details
    var requestDetails = {
      protocol: "https:",
      hostname: "api.stripe.com",
      method: "POST",
      path: "/v1/sources", //`/v1/sources/:${Id}`,
      auth:
        "Bearer sk_test_51HlXwADvgdKXdPFVZ9vAV5hE2LVNT1gaNao2bF8QCIX3f68N9PRJp0Ks5rXH0oONmvzMRnyT2MXVlvtWInwGYsqJ00iuFnZRIs",
      headers: {
        Authorization:
          "Bearer sk_test_51HlXwADvgdKXdPFVZ9vAV5hE2LVNT1gaNao2bF8QCIX3f68N9PRJp0Ks5rXH0oONmvzMRnyT2MXVlvtWInwGYsqJ00iuFnZRIs",
        "Content-Type": "application/x-www-form-urlencoded",
        "Stripe-Account": "acct_1HlXwADvgdKXdPFV",
        "Content-Length": Buffer.byteLength(stringPayload),
      },
    };

    // Instantiate the request object
    var req = https.request(requestDetails, function (res) {
      // Grab the status of the sent request
      var dataSource = "";
      res.on("data", function (dataBuffer) {
        dataSource += dataBuffer;

        var dataQ = JSON.parse(dataSource);

        if (dataQ.id) {
          console.log(":Source::", dataQ.id);
          callback(dataQ);
        }
      });
      res.on("end", function (dataQueue) {
        // if (status == 200 || status == 201) {
        console.log(":data:res:", dataQueue);
        callback(dataQueue);
        // } else {
        //   callback(dataQueue);
        // }
      });
    });

    // Bind to the error event so it doesn't get thrown
    req.on("error", function (e) {
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
  } else {
    callback("Given parameters were missing or invalid");
  }
};

helpers.sendStripeCust = async function (callback) {
  // Validate parameters
  // phone =
  //   typeof phone == "string" && phone.trim().length == 10
  //     ? phone.trim()
  //     : false;
  // msg =
  //   typeof msg == "string" && msg.trim().length > 0 && msg.trim().length <= 1600
  //     ? msg.trim()
  //     : false;

  // Configure the request payload
  var payload = {
    description: "Test Customer (created for API docs)",
  };
  var stringPayload = querystring.stringify(payload);

  // Configure the request details
  var requestDetails = {
    protocol: "https:",
    hostname: "api.stripe.com",
    method: "POST",
    path: "/v1/customers",
    auth:
      "Bearer sk_test_51HlXwADvgdKXdPFVZ9vAV5hE2LVNT1gaNao2bF8QCIX3f68N9PRJp0Ks5rXH0oONmvzMRnyT2MXVlvtWInwGYsqJ00iuFnZRIs",
    headers: {
      Authorization:
        "Bearer sk_test_51HlXwADvgdKXdPFVZ9vAV5hE2LVNT1gaNao2bF8QCIX3f68N9PRJp0Ks5rXH0oONmvzMRnyT2MXVlvtWInwGYsqJ00iuFnZRIs",
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Account": "acct_1HlXwADvgdKXdPFV",
      "Content-Length": Buffer.byteLength(stringPayload),
    },
  };

  // Instantiate the request object
  var req = https.request(requestDetails, function (res) {
    // Grab the status of the sent request
    var status = res.statusCode;
    // Callback successfully if the request went through
    var dataQueue = "";
    res.on("data", function (dataBuffer) {
      dataQueue += dataBuffer;

      var dataQ = JSON.parse(dataQueue);

      if (dataQ.id) {
        console.log(":dataQ::", dataQ.id);
        callback(dataQ);
      }
    });
    res.on("end", function (dataQueue) {
      // if (status == 200 || status == 201) {
      console.log(":data:res:", dataQueue);
      callback(dataQueue);
      // } else {
      //   callback(dataQueue);
      // }
    });

    res.on("error", function (dataQueue) {
      // if (status == 200 || status == 201) {
      console.log(":data:error:", dataQueue);
      callback(dataQueue);
      // } else {
      //   callback(dataQueue);
      // }
    });
  });

  // Bind to the error event so it doesn't get thrown
  // req.on("error", function (e) {
  //   callback(e);
  // });

  // Add the payload
  req.write(stringPayload);

  // End the request
  req.end();
};

helpers.sourceToCustStripe = async function (sourceId, custId, callback) {
  // Validate parameters
  // phone =
  //   typeof phone == "string" && phone.trim().length == 10
  //     ? phone.trim()
  //     : false;
  // msg =
  //   typeof msg == "string" && msg.trim().length > 0 && msg.trim().length <= 1600
  //     ? msg.trim()
  //     : false;

  // Configure the request payload
  var payload = {
    source: sourceId,
  };
  var stringPayload = querystring.stringify(payload);

  // Configure the request details
  var requestDetails = {
    protocol: "https:",
    hostname: "api.stripe.com",
    method: "POST",
    path: `/v1/customers/${custId}/sources`,
    auth:
      "Bearer sk_test_51HlXwADvgdKXdPFVZ9vAV5hE2LVNT1gaNao2bF8QCIX3f68N9PRJp0Ks5rXH0oONmvzMRnyT2MXVlvtWInwGYsqJ00iuFnZRIs",
    headers: {
      Authorization:
        "Bearer sk_test_51HlXwADvgdKXdPFVZ9vAV5hE2LVNT1gaNao2bF8QCIX3f68N9PRJp0Ks5rXH0oONmvzMRnyT2MXVlvtWInwGYsqJ00iuFnZRIs",
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Account": "acct_1HlXwADvgdKXdPFV",
      "Content-Length": Buffer.byteLength(stringPayload),
    },
  };

  // Instantiate the request object
  var req = https.request(requestDetails, function (res) {
    // Grab the status of the sent request
    var status = res.statusCode;
    // Callback successfully if the request went through
    var dataQueue = "";
    res.on("data", function (dataBuffer) {
      dataQueue += dataBuffer;

      var dataQ = JSON.parse(dataQueue);

      if (dataQ.client_secret) {
        console.log(":client_secret::", dataQ.client_secret);
        callback(dataQ.client_secret);
      }
    });
    res.on("end", function (dataQueue) {
      // if (status == 200 || status == 201) {
      console.log(":data:res:", dataQueue);
      callback(dataQueue);
      // } else {
      //   callback(dataQueue);
      // }
    });

    res.on("error", function (dataQueue) {
      // if (status == 200 || status == 201) {
      console.log(":data:error:", dataQueue);
      callback(dataQueue);
      // } else {
      //   callback(dataQueue);
      // }
    });
  });

  // Bind to the error event so it doesn't get thrown
  // req.on("error", function (e) {
  //   callback(e);
  // });

  // Add the payload
  req.write(stringPayload);

  // End the request
  req.end();
};

helpers.sendTwilioSms = function (phone, msg, callback) {
  // Validate parameters
  phone =
    typeof phone == "string" && phone.trim().length == 10
      ? phone.trim()
      : false;
  msg =
    typeof msg == "string" && msg.trim().length > 0 && msg.trim().length <= 1600
      ? msg.trim()
      : false;
  if (phone && msg) {
    // Configure the request payload
    var payload = {
      From: config.twilio.fromPhone,
      To: "+1" + phone,
      Body: msg,
    };
    var stringPayload = querystring.stringify(payload);

    // Configure the request details
    var requestDetails = {
      protocol: "https:",
      hostname: "api.twilio.com",
      method: "POST",
      path:
        "/2010-04-01/Accounts/" + config.twilio.accountSid + "/Messages.json",
      auth: config.twilio.accountSid + ":" + config.twilio.authToken,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(stringPayload),
      },
    };

    // Instantiate the request object
    var req = https.request(requestDetails, function (res) {
      // Grab the status of the sent request
      var status = res.statusCode;
      // Callback successfully if the request went through
      if (status == 200 || status == 201) {
        callback(false);
      } else {
        callback("Status code returned was " + status);
      }
    });

    // Bind to the error event so it doesn't get thrown
    req.on("error", function (e) {
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
  } else {
    callback("Given parameters were missing or invalid");
  }
};

// Get the string content of a template, and use provided data for string interpolation
helpers.getTemplate = function (templateName, data, callback) {
  templateName =
    typeof templateName == "string" && templateName.length > 0
      ? templateName
      : false;
  data = typeof data == "object" && data !== null ? data : {};
  if (templateName) {
    var templatesDir = path.join(__dirname, "/../templates/");
    fs.readFile(
      templatesDir + templateName + ".html",
      "utf8",
      function (err, str) {
        if (!err && str && str.length > 0) {
          // Do interpolation on the string
          var finalString = helpers.interpolate(str, data);
          callback(false, finalString);
        } else {
          callback("No template could be found");
        }
      }
    );
  } else {
    callback("A valid template name was not specified");
  }
};

// Add the universal header and footer to a string, and pass provided data object to header and footer for interpolation
helpers.addUniversalTemplates = function (str, data, callback) {
  str = typeof str == "string" && str.length > 0 ? str : "";
  data = typeof data == "object" && data !== null ? data : {};
  // Get the header
  helpers.getTemplate("_header", data, function (err, headerString) {
    if (!err && headerString) {
      // Get the footer
      helpers.getTemplate("_footer", data, function (err, footerString) {
        if (!err && headerString) {
          // Add them all together
          var fullString = headerString + str + footerString;
          callback(false, fullString);
        } else {
          callback("Could not find the footer template");
        }
      });
    } else {
      callback("Could not find the header template");
    }
  });
};

// Take a given string and data object, and find/replace all the keys within it
helpers.interpolate = function (str, data) {
  str = typeof str == "string" && str.length > 0 ? str : "";
  data = typeof data == "object" && data !== null ? data : {};

  // Add the templateGlobals to the data object, prepending their key name with "global."
  for (var keyName in config.templateGlobals) {
    if (config.templateGlobals.hasOwnProperty(keyName)) {
      data["global." + keyName] = config.templateGlobals[keyName];
    }
  }
  // For each key in the data object, insert its value into the string at the corresponding placeholder
  for (var key in data) {
    if (data.hasOwnProperty(key) && typeof (data[key] == "string")) {
      var replace = data[key];
      var find = "{" + key + "}";
      str = str.replace(find, replace);
    }
  }
  return str;
};

// Get the contents of a static (public) asset
helpers.getStaticAsset = function (fileName, callback) {
  fileName =
    typeof fileName == "string" && fileName.length > 0 ? fileName : false;
  if (fileName) {
    var publicDir = path.join(__dirname, "/../public/");
    fs.readFile(publicDir + fileName, function (err, data) {
      if (!err && data) {
        callback(false, data);
      } else {
        callback("No file could be found");
      }
    });
  } else {
    callback("A valid file name was not specified");
  }
};

// Export the module
module.exports = helpers;
