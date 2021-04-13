/*
 * Request Handlers
 *
 */

// Dependencies
var _data = require("./data");
var helpers = require("./helpers");
var config = require("./config");
const http = require("http");
const https = require("https");
const url = require("url");
const mailgun = require("./mailgun");
var path = require("path");
var fs = require("fs");
var querystring = require("querystring");

const stripeSecretKey =
  "pk_test_51HlXwADvgdKXdPFVWxIEaM268V5Ezr5Gm5izaDjrdN9gJxrCiusBSeHOFJG2clFeZ4suudDieLYFQdCEwCNvyLWt008v5HeoDZ";
const stripePublicKey =
  "sk_test_51HlXwADvgdKXdPFVZ9vAV5hE2LVNT1gaNao2bF8QCIX3f68N9PRJp0Ks5rXH0oONmvzMRnyT2MXVlvtWInwGYsqJ00iuFnZRIs";
// Define all the handlers
var handlers = {};

/*
 * HTML Handlers
 *
 */

// Index
handlers.index = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method == "get") {
    // Prepare data for interpolation
    var templateData = {
      "head.title": "Uptime Monitoring - Made Simple",
      "head.description":
        "We offer free, simple uptime monitoring for HTTP/HTTPS sites all kinds. When your site goes down, we'll send you a text to let you know",
      "body.class": "index",
    };
    // Read in a template as a string
    helpers.getTemplate("index", templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Create Account
handlers.accountCreate = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method == "get") {
    // Prepare data for interpolation
    var templateData = {
      "head.title": "Create an Account",
      "head.description": "Signup is easy and only takes a few seconds.",
      "body.class": "accountCreate",
    };
    // Read in a template as a string
    helpers.getTemplate("accountCreate", templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Create New Session
handlers.sessionCreate = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method == "get") {
    // Prepare data for interpolation
    var templateData = {
      "head.title": "Login to your account.",
      "head.description":
        "Please enter your email number and password to access your account.",
      "body.class": "sessionCreate",
    };
    // Read in a template as a string
    helpers.getTemplate("sessionCreate", templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Edit Your Account
handlers.accountEdit = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method == "get") {
    // Prepare data for interpolation
    var templateData = {
      "head.title": "Account Settings",
      "body.class": "accountEdit",
    };
    // Read in a template as a string
    helpers.getTemplate("accountEdit", templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Session has been deleted
handlers.sessionDeleted = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method == "get") {
    // Prepare data for interpolation
    var templateData = {
      "head.title": "Logged Out",
      "head.description": "You have been logged out of your account.",
      "body.class": "sessionDeleted",
    };
    // Read in a template as a string
    helpers.getTemplate("sessionDeleted", templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Account has been deleted
handlers.accountDeleted = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method == "get") {
    // Prepare data for interpolation
    var templateData = {
      "head.title": "Account Deleted",
      "head.description": "Your account has been deleted.",
      "body.class": "accountDeleted",
    };
    // Read in a template as a string
    helpers.getTemplate("accountDeleted", templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Dashboard (view all stores)
handlers.storeList = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method == "get") {
    // Prepare data for interpolation
    var templateData = {
      "head.title": "Dashboard",
      "body.class": "storeList",
    };
    // Read in a template as a string
    helpers.getTemplate("store", templateData, function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// Favicon
handlers.favicon = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method == "get") {
    // Read in the favicon's data
    helpers.getStaticAsset("favicon.ico", function (err, data) {
      if (!err && data) {
        // Callback the data
        callback(200, data, "favicon");
      } else {
        callback(500);
      }
    });
  } else {
    callback(405);
  }
};

// Public assets
handlers.public = function (data, callback) {
  // Reject any request that isn't a GET
  if (data.method == "get") {
    // Get the filename being requested
    var trimmedAssetName = data.trimmedPath.replace("public/", "").trim();
    if (trimmedAssetName.length > 0) {
      // Read in the asset's data
      helpers.getStaticAsset(trimmedAssetName, function (err, data) {
        if (!err && data) {
          // Determine the content type (default to plain text)
          var contentType = "plain";

          if (trimmedAssetName.indexOf(".css") > -1) {
            contentType = "css";
          }

          if (trimmedAssetName.indexOf(".png") > -1) {
            contentType = "png";
          }

          if (trimmedAssetName.indexOf(".jpg") > -1) {
            contentType = "jpg";
          }

          if (trimmedAssetName.indexOf(".ico") > -1) {
            contentType = "favicon";
          }

          // Callback the data
          callback(200, data, contentType);
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }
  } else {
    callback(405);
  }
};

/*
 * JSON API Handlers
 *
 */

// Ping
handlers.ping = function (data, callback) {
  callback(200);
};

// Not-Found
handlers.notFound = function (data, callback) {
  callback(404);
};

// Users
handlers.users = function (data, callback) {
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the users methods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, email, password, tosAgreement
// Optional data: none
handlers._users.post = function (data, callback) {
  // Check that all required fields are filled out
  var firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  var lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  var address =
    typeof data.payload.address == "string" &&
    data.payload.address.trim().length > 0
      ? data.payload.address.trim()
      : false;
  var email =
    typeof data.payload.email == "string" &&
    data.payload.email.trim().length > 7
      ? data.payload.email.trim()
      : false;
  var password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  var tosAgreement =
    typeof data.payload.tosAgreement == "boolean" &&
    data.payload.tosAgreement == true
      ? true
      : false;

  var hashedemail = helpers.hash(email);
  if (firstName && lastName && address && email && password) {
    // Make sure the user doesnt already exist
    _data.read("users", email, function (err, data) {
      if (!data) {
        // Hash the password
        var hashedPassword = helpers.hash(password);

        // Create the user object
        if (hashedPassword) {
          var userObject = {
            firstName: firstName,
            lastName: lastName,
            address: address,
            email: email,
            hashedPassword: hashedPassword,
            tosAgreement: true,
          };

          // Store the user
          _data.create("users", email, userObject, function (err) {
            if (!err) {
              callback(200);
            } else {
              callback(500, { Error: "Could not create the new user" });
            }
          });
        } else {
          callback(500, { Error: "Could not hash the user's password." });
        }
      } else {
        // User alread exists
        callback(400, {
          Error: "A user with that email already exists",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required fields" });
    console.log("x1, data", data);
  }
};

// handlers._users.post2 = function (data, callback) {
// var firstName =
//   typeof data.payload.firstName == "string" &&
//   data.payload.firstName.trim().length > 0
//     ? data.payload.firstName.trim()
//     : false;
// var lastName =
//   typeof data.payload.lastName == "string" &&
//   data.payload.lastName.trim().length > 0
//     ? data.payload.lastName.trim()
//     : false;
// var email =
//   typeof data.payload.email == "string" &&
//   data.payload.email.trim().length > 7
//     ? data.payload.email.trim()
//     : false;
// var password =
//   typeof data.payload.password == "string" &&
//   data.payload.password.trim().length > 0
//     ? data.payload.password.trim()
//     : false;
// var tosAgreement =
//   typeof data.payload.tosAgreement == "boolean" &&
//   data.payload.tosAgreement == true
//     ? true
//     : false;
//   var hashedemail = helpers.hash(email);
//   var hashedPassword = helpers.hash(password);
//   var dirResult = _data.readDir(
//     _data.baseDir + "users",
//     [".json"],
//     email,
//     hashedemail,
//     hashedPassword
//   );
//   //simulate route that needs a valid token to access
//   const header = data.headers["Authorization"];
//   if (header) {
//     const [type, token] = header.split(" ");
//   } else {
//     (type = "undefined"), (token = "undefined");
//   }
//   if (type === "Bearer" && typeof token !== "undefined") {
//     var tokenResult = _data.readDir(
//       _data.baseDir + "tokens",
//       [".json"],
//       email,
//       hashedemail,
//       hashedPassword
//     );
//   }
//   var tokenResult = _data.readDir(
//     _data.baseDir + "tokens",
//     [".json"],
//     email,
//     hashedemail,
//     hashedPassword
//   );
//   // console.log("header: ", data);
//   console.log("tokenResult: ", tokenResult.token.exist);
//   // console.log("dirResult.targetFile: ", dirResult.targetFile);
//   let userMatch = false;
//   if (dirResult.targetFile !== "") {
//     userMatch = true;
//   }
//   if (!userMatch && !tokenResult.token.exist && hashedemail) {
//     //TODO: hash the password
//     var pwd = data.payload.password;
//     var hashPwd = helpers.hash(pwd);
//     //route to get a token
//     let tokenId = Math.random().toString(36).substring(2, 32);
//     let limit = 60 * 3; // 180 seconds
//     let expires = Math.floor(Date.now() / 1000) + limit;
//     let payload = {
//       _id: tokenId,
//       email: data.payload.email,
//       password: hashPwd,
//       exp: expires,
//     };
//     var newUser = {
//       _id: Date.now(),
//       firstName: firstName,
//       lastName: lastName,
//       email: email,
//       hashedPassword: hashedPassword,
//     };
//     var userCreated = false;
//     _data.create("users", hashedemail, newUser, function (err) {
//       if (!err) {
//         userCreated = true;
//         console.log("users: 200");
//       }
//       //  else {
//       //   callback(500, { Error: "Could not create the new user" });
//       // }
//     });
//     _data.create("tokens", hashedemail, payload, function (err) {
//       if (!err) {
//         // && userCreated) {
//         console.log("tokens: 200");
//         callback(200);
//       } else {
//         callback(500, { Error: "Could not create the new user" });
//       }
//     });
//     // callback(200);
//   } else {
//     callback(400, { Error: "email address already used or empty" });
//   }
// };

// Required data: email
// Optional data: none
handlers._users.get = function (data, callback) {
  // Check that email is valid
  var email =
    typeof data.queryStringObject.email == "string" &&
    data.queryStringObject.email.trim().length > 7
      ? data.queryStringObject.email.trim()
      : false;

  if (email) {
    // Get token from headers
    var token =
      typeof data.queryStringObject.id == "string"
        ? data.queryStringObject.id
        : false;

    // Verify that the given token is valid for the email number
    var hashedemail = helpers.hash(email);
    handlers._tokens.verifyToken(token, email, function (tokenIsValid) {
      if (tokenIsValid) {
        // Lookup the user
        _data.read("users", email, function (err, data) {
          if (!err && data) {
            // Remove the hashed password from the user user object before returning it to the requester

            delete data.hashedPassword;
            callback(200, data);
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, {
          Error: "Missing required token in header, or token is invalid.",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Required data: email
// Optional data: firstName, lastName, password (at least one must be specified)
handlers._users.put = function (data, callback) {
  // Check for required field
  var email =
    typeof data.payload.email == "string" &&
    data.payload.email.trim().length > 7
      ? data.payload.email.trim()
      : false;

  // Check for optional fields
  var firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  var lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  var address =
    typeof data.payload.address == "string" &&
    data.payload.address.trim().length > 0
      ? data.payload.address.trim()
      : false;
  var password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  // Error if email is invalid
  if (email) {
    // Error if nothing is sent to update
    if (firstName || lastName || address || password) {
      // Get token from headers
      var token =
        typeof data.headers.token == "string" ? data.headers.token : false;

      var hashedemail = helpers.hash(email);
      // Verify that the given token is valid for the email number
      handlers._tokens.verifyToken(token, email, function (tokenIsValid) {
        if (tokenIsValid) {
          // Lookup the user
          _data.read("users", email, function (err, userData) {
            if (!err && userData) {
              // Update the fields if necessary
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (address) {
                userData.address = address;
              }
              if (password) {
                userData.hashedPassword = helpers.hash(password);
              }
              // Store the new updates
              _data.update("users", email, userData, function (err) {
                if (!err) {
                  callback(200);
                } else {
                  callback(500, { Error: "Could not update the user." });
                }
              });
            } else {
              callback(400, { Error: "Specified user does not exist." });
            }
          });
        } else {
          callback(403, {
            Error: "Missing required token in header, or token is invalid.",
          });
        }
      });
    } else {
      callback(400, { Error: "Missing fields to update." });
    }
  } else {
    callback(400, { Error: "Missing required field." });
  }
};

// Required data: email
// Cleanup old checks associated with the user
handlers._users.delete = function (data, callback) {
  // Check that email number is valid
  var email =
    typeof data.queryStringObject.email == "string" &&
    data.queryStringObject.email.trim().length > 6
      ? data.queryStringObject.email.trim()
      : false;
  if (email) {
    // Get token from headers
    var token =
      typeof data.headers.token == "string" ? data.headers.token : false;
    var hashedemail = helpers.hash(email);

    // Verify that the given token is valid for the email number
    handlers._tokens.verifyToken(token, email, function (tokenIsValid) {
      if (tokenIsValid) {
        // Lookup the user
        _data.read("users", email, function (err, userData) {
          if (!err && userData) {
            // Delete the user's data
            _data.delete("users", email, function (err) {
              if (!err) {
                callback(200);
              }
            });
          }
        });
      }
    });
    _data.delete("tokens", email, function (err) {
      if (!err) {
        console.log("Token Deleted..");
      }
    });
  }
};

// Store
handlers.stores = function (data, callback) {
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._stores[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for Store methods
handlers._stores = {};

handlers._stores.get = function (data, callback) {
  var baseDir = path.join(__dirname, "/../.data/");

  fs.readFile(
    baseDir + "data" + "/" + "items" + ".json",
    "utf8",
    function (error, fileData) {
      if (error) {
        console.log("couldn not read a file 864");
        callback(500, { Error: "couldn not read items file." });
      } else {
        var userEmail = data.headers.useremail;

        _data.read("purchases", userEmail, function (err, purchaseData) {
          if (err) {
            let payload = JSON.stringify({
              // stripePublicKey: stripePublicKey,
              items: JSON.parse(fileData),
            });
            callback(200, {
              // stripePublicKey: stripePublicKey,
              data: JSON.parse(payload),
            });
            console.log("couldn not read a file purchases", err);
            // callback(500, { Error: "couldn not read purchases file." });
          } else {
            var itemsPurchase = purchaseData.items;
            var itemsToBuy = purchaseData.itemsToBuy;
            var itemsToBuy2 = [];

            if (itemsPurchase && itemsToBuy) {
              itemsPurchase.forEach((item) => {
                for (let item2 of itemsToBuy) {
                  if (item.id === item2.id) {
                    item2.quantity = item.quantity;
                    itemsToBuy2.push(item2);

                    break;
                  }
                }
              });
            }

            let payloadStr = JSON.stringify({
              // stripePublicKey: stripePublicKey,
              items: JSON.parse(fileData),
              itemsToBuy: itemsToBuy2,
              itemsQuantity: purchaseData.items,
            });

            callback(200, {
              // stripePublicKey: stripePublicKey,
              data: JSON.parse(payloadStr),
            });
            // callback(200, {
            //   stripePublicKey: stripePublicKey,
            //   data: JSON.parse(purchaseData),
            // });
          }
        });
      }
    }
  );
};

// Purchase
handlers.purchases = function (data, callback) {
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._purchases[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for Purchase methods
handlers._purchases = {};

handlers._purchases.get = function (data, callback) {
  callback(200, {
    msg: "Hits Purchase API",
  });
};

// ------------------------------------
handlers._purchases.add = function (data, callback) {
  var userEmail =
    typeof data.userEmail == "string" && data.userEmail.trim().length > 0
      ? data.userEmail.trim()
      : false;
  if (data) {
    // Lookup the user who matches that email number
    var hashedemail = helpers.hash(userEmail);

    _data.read("purchases", userEmail, function (err, userData) {
      if (!err) {
        // Hash the sent password, and compare it to the password stored in the user object
        var hashedPassword = helpers.hash(userEmail);
        // err.code == "EEXIST"
        // console.log("data+:", data);
        let purchaseId = Math.random().toString(36).substring(2, 32);
        var purchaseObject = {
          email: email,
          id: data.stripeTokenId,
          items: data.items,
          itemsToBuy: data.itemsToBuy,
        };

        // Store the token
        // callback(200, purchaseObject);
        _data.update("purchases", userEmail, purchaseObject, function (err) {
          if (!err) {
            console.log("purchase created::", purchaseId);
            //{ token: purchaseId });JSON.stringify({ id: purchaseId })
          } else {
            //callback(200, purchaseObject);
            console.log("purchase not created::", purchaseId);
          }
        });
      } else {
        // If valid, create a new token with a random name. Set an expiration date 1 hour in the future.
        var purchaseObject = {
          email: email,
          id: data.stripeTokenId,
          items: data.items,
          itemsToBuy: data.itemsToBuy,
        };

        // Store the token
        // callback(200, purchaseObject);
        _data.create("purchases", userEmail, purchaseObject, function (err) {
          if (!err) {
            console.log("new purchase created");
            // callback(200, { id: purchaseId, email: email }); //{ token: purchaseId });JSON.stringify({ id: purchaseId })
          } else {
            //callback(200, purchaseObject);
            console.log("Could not create the new purchase");
            // callback(500, { Error: "Could not create the new purchase" });
          }
        });

        // console.log("Could not find the specified user!.");
        // callback(400, { Error: "Could not find the specified user!." });
      }
    });
  } else {
    callback(400, { Error: "Missing required field(s)." });
  }
};
// ------------------------------------

handlers._purchases.post = function (data, callMeback) {
  let sendMail = function (email = "aminvomar@gmail.com", subject, text, cb) {
    const mailOptions = {
      from: "aminvomar@gmail.com", // TODO replace this with your own email
      to: email, // TODO: the receiver email has to be authorized for the free tier
      subject,
      text,
    };
    var stringPayload = querystring.stringify(mailOptions);
    const options = {
      host: "api.mailgun.net",
      port: 443,
      path: "/v3/sandbox0cd26aa75aa44389bddab5d51496b9d0.mailgun.org/messages",
      headers: {
        Authorization: "Basic 48ddc5ead16b909c35e722f1fa36af98",
        "Content-Type": "multipart/form-data",
        "Content-Length": Buffer.byteLength(stringPayload),
        Origin: "https://sandbox0cd26aa75aa44389bddab5d51496b9d0.mailgun.org",
      },
      method: "POST",
      body: JSON.stringify(mailOptions),
    };

    const request = https.request(options, (res) => {
      res.setEncoding("utf8");
      var dataToCollect = "";
      res.on("data", function (body) {
        dataToCollect = +body;
      });
      cb(res);
    });

    request.on("error", (e) => {
      cb(e);
    });
  };
  sendMail(
    (email = "aminvomar@gmail.com"),
    "subject",
    "Hi there!!!!",
    function (err, eData) {
      if (err) {
        if (err.code === "ECONNRESET") {
          console.log("Timeout occurs");
          return;
        }
        console.log("ERROR_Email: ", err);
      }
      console.log("Email sent!!!");
      res.end();
    }
  );

  var baseDir = path.join(__dirname, "/../.data/");

  // console.log("hit purchase");
  fs.readFile(
    baseDir + "data" + "/" + "items" + ".json",
    async function (error, itemsData) {
      if (error) {
        callMeback(500, { Error: "couldn not read a file." });
        console.log("couldn not read a file 938");
      } else {
        const itemsArray = JSON.parse(itemsData);
        // const itemsArray = itemsJson.music.concat(itemsJson.merch);
        let total = 0;
        data.payload.items.forEach(function (item) {
          const itemJson = itemsArray.find(function (i) {
            return i.id == item.id;
          });
          total = total + itemJson.price * item.quantity;
        });
        var postData = {
          amount: total,
          source: data.payload.stripeTokenId,
          currency: "usd",
          customer: parsedId,
        };
        var stringPayload = querystring.stringify(postData);
        var parsedId = "cus_IRA4A4oY1SEppz";
        const options = {
          protocol: "https:",
          hostname: "api.stripe.com",
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
          method: "POST",
          // body: JSON.stringify(
          //   `{amount:${total},source:${req.body.stripeTokenId},currency:'usd', customer:${parsedId}}`
          // ),
        };

        var custRef = "";
        var srcRef = "";
        const createTransction = async function (callback) {
          await helpers.sendStripeCust(async function (cust) {
            if (cust) {
              console.log(
                "Success: User was alerted to a status change in their check, via sendStripeCust: ",
                cust.id
              );
              mailgun.Mailgun("48ddc5ead16b909c35e722f1fa36af98");
              mailgun.Mailgun.prototype.sendText(
                "aminvpython@gmail.com",
                ["aminvpython@gmail.com"],
                "mailgun test",
                "Does it works!!",
                function (src) {
                  if (src) {
                    console.log(
                      "Success:::: Email was sent: statusCode: statusMessage",
                      src.statusCode,
                      src.statusMessage
                    );
                  } else {
                    console.log("Fail:::: Email was not sent: ", src);
                  }
                }
              );

              await helpers.createSourceStripe(
                data.payload.stripeTokenId,
                cust.id,
                async function (src) {
                  if (src) {
                    console.log(
                      "Success: User was alerted to a status change in their check, createSourceStripe: ",
                      src.id
                    );

                    await helpers.sourceToCustStripe(
                      src.id,
                      cust.id,
                      function (attached) {
                        if (attached) {
                          console.log(
                            "Success: User was alerted to a status change in their check, attached: ",
                            attached
                          );
                          custRef = cust.id;
                          srcRef = src.id;
                        } else {
                          console.log(
                            "waiting mode 7s: Could not send sms alert to user who had a state change in attached",
                            attached
                          );
                        }
                      }
                    );
                  } else {
                    console.log(
                      "waiting mode 7s: Could not send sms alert to user who had a state change in createSourceStripe",
                      src
                    );
                  }
                }
              );
            } else {
              console.log(
                "waiting mode 7s: Could not send sendStripeCust alert to user who had a state change in their check",
                cust
              );
            }
          });
          if (custRef && srcRef) {
            helpers.sendStripe(
              total,
              data.payload.stripeTokenId,
              custRef,
              srcRef,
              function (err) {
                if (!err) {
                  console.log("Success: charged successfully.. ");
                  callMeback(200, {
                    msg: "Charged successfully..",
                  });
                } else {
                  console.log(
                    "Waiting for The provided source to be in a chargeable state takes about 7s..."
                  );
                }
              }
            );
          } else {
            console.log(
              "Waiting for The provided source to be in a chargeable state takes about 7s..."
            );
            let clock = 0;
            (function start(clock) {
              if (clock < 6) {
                setTimeout(function () {
                  clock++;
                  console.log(clock);
                  start(clock);
                }, 1000);
              }
            })(0);
            setTimeout(() => {
              console.log("custRef, srcRef: ", custRef, srcRef);
              helpers.sendStripe(
                total,
                data.payload.stripeTokenId,
                custRef,
                srcRef,
                function (err) {
                  if (!err) {
                    console.log("Success: charged successfully.. ");
                    console.log(
                      "Success: data.payload.items.. ",
                      JSON.stringify(data.payload.items)
                    );
                    var postPayload = {
                      email: data.payload.email,
                      userEmail: data.payload.userEmail,
                      id: data.payload.stripeTokenId,
                      itemsToBuy: data.payload.itemsToBuy,
                      items: data.payload.items,
                    };
                    handlers._purchases.add(postPayload, () => {});
                    callMeback(200, {
                      msg: "Charged successfully..",
                    });
                  } else {
                    console.log("Error: Could not charged", err);
                    // save the purchase items in case of charge failer, to send it back later
                    // handlers._purchases.add(data, () => {});
                  }
                }
              );
            }, 7000);
          }

          callback();
        };

        createTransction(() => {
          console.log("callback has been called");
        });
      }
    }
  );
};

// Tokens
handlers.tokens = function (data, callback) {
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the tokens methods
handlers._tokens = {};

// Tokens - post
// Required data: email, password
// Optional data: none
handlers._tokens.post = function (data, callback) {
  var email =
    typeof data.payload.email == "string" &&
    data.payload.email.trim().length > 7
      ? data.payload.email.trim()
      : false;
  var password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  if (email && password) {
    // Lookup the user who matches that email number
    var hashedemail = helpers.hash(email);

    _data.read("users", email, function (err, userData) {
      if (!err && userData) {
        // Hash the sent password, and compare it to the password stored in the user object
        var hashedPassword = helpers.hash(password);

        if (!userData) {
          // err.code == "EEXIST"

          let tokenId = Math.random().toString(36).substring(2, 32);
          var expires = Date.now() + 1000 * 60 * 60;
          var tokenObject = {
            email: email,
            id: tokenId,
            expires: expires,
          };

          // Store the token
          // callback(200, tokenObject);
          _data.create("tokens", email, tokenObject, function (err) {
            if (!err) {
              callback(200, { id: tokenId, email: email }); //{ token: tokenId });JSON.stringify({ id: tokenId })
            } else {
              //callback(200, tokenObject);
              callback(500, { Error: "Could not create the new token" });
            }
          });
        } else if (hashedPassword == userData.hashedPassword) {
          // If valid, create a new token with a random name. Set an expiration date 1 hour in the future.
          let tokenId = Math.random().toString(36).substring(2, 32);
          var expires = Date.now() + 1000 * 60 * 60;
          var tokenObject = {
            email: email,
            id: tokenId,
            expires: expires,
          };

          // Store the token
          // callback(200, tokenObject);
          _data.create("tokens", email, tokenObject, function (err) {
            if (!err) {
              callback(200, { id: tokenId, email: email }); //{ token: tokenId });JSON.stringify({ id: tokenId })
            } else {
              //callback(200, tokenObject);
              callback(500, { Error: "Could not create the new token" });
            }
          });
        } else {
          callback(400, {
            Error:
              "Password did not match the specified user's stored password",
          });
        }
      } else {
        callback(400, { Error: "Could not find the specified user!." });
      }
    });
  } else {
    callback(400, { Error: "Missing required field(s)." });
  }
};

// Tokens - get
// Required data: id
// Optional data: none
handlers._tokens.get = function (data, callback) {
  // Check that id is valid
  var hashedemail = helpers.hash(data.payload.email);
  // if (!data.queryStringObject.email) {
  //   console.log("no data.payload.email!", data.payload);
  //   var email = data.queryStringObject.email; //.trim(); !!
  // }

  var id =
    typeof data.queryStringObject.id == "string" &&
    data.queryStringObject.id.trim().length > 6
      ? data.queryStringObject.id.trim()
      : false;
  var email = data.queryStringObject.email.trim();
  if (id && email) {
    // Lookup the token
    _data.read("tokens", email, function (err, tokenData) {
      if (!err && tokenData) {
        callback(200, tokenData);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: "Missing required field, or field invalid" });
  }
};

// Tokens - put
// Required data: id, extend
// Optional data: none
handlers._tokens.put = function (data, callback) {
  var id =
    typeof data.payload.id == "string" && data.payload.id.trim().length > 6
      ? data.payload.id.trim()
      : false;
  var extend =
    typeof data.payload.extend == "boolean" && data.payload.extend == true
      ? true
      : false;

  var email = data.payload.email.trim();

  // Check that email number is valid

  // Verify that the given token is valid for the email number
  // Lookup the user
  _data.read("users", email, function (err, data) {
    if (!err && data) {
      if (id && extend) {
        // Lookup the existing token

        _data.read("tokens", email, function (err, tokenData) {
          if (!err && tokenData) {
            // Check to make sure the token isn't already expired
            if (tokenData.expires > Date.now()) {
              // Set the expiration an hour from now
              tokenData.expires = Date.now() + 1000 * 60 * 60;
              // Store the new updates
              _data.update("tokens", email, tokenData, function (err) {
                if (!err) {
                  callback(200);
                } else {
                  callback(500, {
                    Error: "Could not update the token's expiration.",
                  });
                }
              });
            } else {
              callback(400, {
                Error: "The token has already expired, and cannot be extended.",
              });
            }
          } else {
            callback(400, { Error: "Specified user does not exist." });
          }
        });
      } else {
        _data.update("tokens", email, tokenData, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, {
              Error: "Could not update the token's expiration.",
            });
          }
        });
        // callback(400, {
        //   Error: "Missing required field(s) or field(s) are invalid.",
        // });

        callback(200);
      }
    } else {
      callback(400, { Error: "This User doesnt exist" });
    }
  });
};

// Tokens - delete
// Required data: id
// Optional data: none
handlers._tokens.delete = function (data, callback) {
  // Check that id is valid
  var id =
    typeof data.queryStringObject.id == "string" &&
    data.queryStringObject.id.trim().length > 6
      ? data.queryStringObject.id.trim()
      : false;

  if (id) {
    var hashedemail = helpers.hash(data.payload.email);
    if (!data.payload.email) {
      // .trim() !!
      console.log("no data.payload.email!!!");
    }
    var email = data.queryStringObject.email.trim(); // .trim(); !!
    // Lookup the token
    _data.read("tokens", email, function (err, tokenData) {
      if (!err && tokenData) {
        // Delete the token
        _data.delete("tokens", email, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: "Could not delete the specified token" });
          }
        });
      } else {
        callback(200);
        // callback(400, { Error: "Could not find the specified token." });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function (id, email, callback) {
  // Lookup the token
  var hashedemail = helpers.hash(email);
  _data.read("tokens", email, function (err, tokenData) {
    if (!err && tokenData) {
      // Check that the token is for the given user and has not expired
      if (tokenData.id == id && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

// Export the handlers
module.exports = handlers;
