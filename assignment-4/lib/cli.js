/*
 * CLI-related tasks
 *
 */

// Dependencies
var readline = require("readline");
var util = require("util");
var debug = util.debuglog("cli");
var events = require("events");
class _events extends events {}
var e = new _events();
var os = require("os");
var v8 = require("v8");
var _data = require("./data");
var _logs = require("./logs");
var helpers = require("./helpers");
var childProcess = require("child_process");

// Instantiate the cli module object
var cli = {};

// Input handlers
e.on("man", function (str) {
  cli.responders.help();
});

e.on("help", function (str) {
  cli.responders.help();
});

e.on("exit", function (str) {
  cli.responders.exit();
});

e.on("stats", function (str) {
  cli.responders.stats();
});

e.on("list users", function (str) {
  cli.responders.limitListUsers();
});

e.on("menu items", function (str) {
  cli.responders.menuItems();
});

e.on("more user info", function (str) {
  cli.responders.moreUserInfo(str);
});

e.on("recent orders", function (str) {
  cli.responders.limitListOrders(str);
});

e.on("more order info", function (str) {
  cli.responders.moreOrderInfo(str);
});

// Responders object
cli.responders = {};

// Help / Man
cli.responders.help = function () {
  // Codify the commands and their explanations
  var commands = {
    exit: "Kill the CLI (and the rest of the application)",
    man: "Show this help page",
    help: 'Alias of the "man" command',
    stats:
      "Get statistics on the underlying operating system and resource utilization",
    "Menu Items": "View all the current menu items",
    "List users": "View all the users who have signed up in the last 24 hours",
    "More user info --{email}":
      "Lookup the details of a specific user by email address",
    "Recent orders":
      "View all the recent orders in the system (orders placed in the last 24 hours)",
    "More order info --{OrderId}": "Show details of a specified order",
  };

  // Show a header for the help page that is as wide as the screen
  cli.horizontalLine();
  cli.centered("CLI HELP");
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Show each command, followed by its explanation, in white and yellow respectively
  for (var key in commands) {
    if (commands.hasOwnProperty(key)) {
      var value = commands[key];
      var line = "      \x1b[33m " + key + "      \x1b[0m";
      var padding = 60 - line.length;
      for (i = 0; i < padding; i++) {
        line += " ";
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }
  cli.verticalSpace(1);

  // End with another horizontal line
  cli.horizontalLine();
};

// Create a vertical space
cli.verticalSpace = function (lines) {
  lines = typeof lines == "number" && lines > 0 ? lines : 1;
  for (i = 0; i < lines; i++) {
    console.log("");
  }
};

// Create a horizontal line across the screen
cli.horizontalLine = function () {
  // Get the available screen size
  var width = process.stdout.columns;

  // Put in enough dashes to go across the screen
  var line = "";
  for (i = 0; i < width; i++) {
    line += "-";
  }
  console.log(line);
};

// Create centered text on the screen
cli.centered = function (str) {
  str = typeof str == "string" && str.trim().length > 0 ? str.trim() : "";

  // Get the available screen size
  var width = process.stdout.columns;

  // Calculate the left padding there should be
  var leftPadding = Math.floor((width - str.length) / 2);

  // Put in left padded spaces before the string itself
  var line = "";
  for (i = 0; i < leftPadding; i++) {
    line += " ";
  }
  line += str;
  console.log(line);
};

// Exit
cli.responders.exit = function () {
  process.exit(0);
};

// Stats
cli.responders.stats = function () {
  // Compile an object of stats
  var stats = {
    "Load Average": os.loadavg().join(" "),
    "CPU Count": os.cpus().length,
    "Free Memory": os.freemem(),
    "Current Malloced Memory": v8.getHeapStatistics().malloced_memory,
    "Peak Malloced Memory": v8.getHeapStatistics().peak_malloced_memory,
    "Allocated Heap Used (%)": Math.round(
      (v8.getHeapStatistics().used_heap_size /
        v8.getHeapStatistics().total_heap_size) *
        100
    ),
    "Available Heap Allocated (%)": Math.round(
      (v8.getHeapStatistics().total_heap_size /
        v8.getHeapStatistics().heap_size_limit) *
        100
    ),
    Uptime: os.uptime() + " Seconds",
  };

  // Create a header for the stats
  cli.horizontalLine();
  cli.centered("SYSTEM STATISTICS");
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Log out each stat
  for (var key in stats) {
    if (stats.hasOwnProperty(key)) {
      var value = stats[key];
      var line = "      \x1b[33m " + key + "      \x1b[0m";
      var padding = 60 - line.length;
      for (i = 0; i < padding; i++) {
        line += " ";
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }

  // Create a footer for the stats
  cli.verticalSpace();
  cli.horizontalLine();
};

// List Users
cli.responders.listUsers = function () {
  _data.list("users", function (err, userIds) {
    //console.log("users:", userIds);
    if (!err && userIds && userIds.length > 0) {
      cli.verticalSpace();
      userIds.forEach(function (userId) {
        _data.read(
          "users",
          userId,
          function (err, userData) {
            //console.log("userId, userData:", userId, userData);
            if (!err && userData) {
              var line =
                "Name: " +
                userData.firstName +
                " " +
                userData.lastName +
                " Email: " +
                userData.email;

              console.log(line);
              cli.verticalSpace();
            }
          },
          1
        );
      });
    }
  });
};

// List Users
cli.responders.limitListUsers = function () {
  _data.list("tokens", function (err, tokenIds) {
    //console.log("users:", userIds);
    if (!err && tokenIds && tokenIds.length > 0) {
      tokenIds.forEach(function (tokenId) {
        _data.read(
          "tokens",
          tokenId,
          function (err, userData) {
            if (!err && userData) {
              let now = Date.now() + 1000 * 60 * 60;
              let createdAt = userData.expires;
              var oneDay = 24 * 60 * 60 * 1000;

              if (now - createdAt < oneDay) {
                let str = "--" + tokenId;

                _data.read(
                  "users",
                  tokenId,
                  function (err, userData) {
                    //console.log("user:", userData);
                    if (!err && userData) {
                      // Remove the hashed password
                      delete userData.hashedPassword;

                      // Print their JSON object with text highlighting
                      cli.verticalSpace();

                      console.dir(userData, { colors: true });
                      cli.verticalSpace();
                    }
                  },
                  1
                );
              }

              //cli.verticalSpace();
            }
          },
          1
        );
      });
    }
  });
};

// More user info
cli.responders.moreUserInfo = function (str) {
  // Get ID from string
  var arr = str.split("--");
  var userId =
    typeof arr[1] == "string" && arr[1].trim().length > 0
      ? arr[1].trim()
      : false;

  if (userId) {
    // Lookup the user
    _data.read("users", userId, function (err, userData) {
      //console.log("user:", userData);
      if (!err && userData) {
        // Remove the hashed password
        delete userData.hashedPassword;

        // Print their JSON object with text highlighting
        cli.verticalSpace();

        console.dir(userData, { colors: true });
        cli.verticalSpace();
      }
    });
  }
};

// Menu Items info
cli.responders.menuItems = function (str) {
  // Lookup the user
  _data.read(
    "data",
    "items",
    function (err, userData) {
      if (!err && userData) {
        // Print their JSON object with text highlighting
        cli.verticalSpace();

        console.dir(userData, { colors: true });
        cli.verticalSpace();
      }
    },
    1
  );
};

// List Users
cli.responders.limitListUsers = function () {
  _data.list("tokens", function (err, tokenIds) {
    //console.log("users:", userIds);
    if (!err && tokenIds && tokenIds.length > 0) {
      tokenIds.forEach(function (tokenId) {
        _data.read(
          "tokens",
          tokenId,
          function (err, userData) {
            if (!err && userData) {
              let now = Date.now() + 1000 * 60 * 60;
              let createdAt = userData.expires;
              var oneDay = 24 * 60 * 60 * 1000;

              if (now - createdAt < oneDay) {
                _data.read(
                  "users",
                  tokenId,
                  function (err, userData) {
                    //console.log("user:", userData);
                    if (!err && userData) {
                      // Remove the hashed password
                      delete userData.hashedPassword;
                      delete userData.tosAgreement;
                      delete userData.address;
                      // Print their JSON object with text highlighting
                      cli.verticalSpace();

                      console.dir(userData, { colors: true });
                      cli.verticalSpace();
                    }
                  },
                  1
                );
              }

              //cli.verticalSpace();
            }
          },
          1
        );
      });
    }
  });
};

// list Orders (Purchases)
cli.responders.limitListOrders = function () {
  _data.list("purchases", function (err, purchasesIds) {
    //console.log("users:", userIds);
    if (!err && purchasesIds && purchasesIds.length > 0) {
      purchasesIds.forEach(function (purchasesId) {
        _data.read(
          "purchases",
          purchasesId,
          function (err, userData) {
            if (!err && userData) {
              let now = Date.now() + 1000 * 60 * 60;
              let createdAt = userData.purchaseDate;
              var oneDay = 24 * 60 * 60 * 1000;

              if (now - createdAt < oneDay) {
                _data.read(
                  "purchases",
                  purchasesId,
                  function (err, userData) {
                    //console.log("user:", userData);
                    if (!err && userData) {
                      userData.orderId = purchasesId;
                      // Remove the hashed password
                      delete userData.hashedPassword;
                      delete userData.itemsToBuy;
                      // Print their JSON object with text highlighting
                      cli.verticalSpace();

                      console.dir(userData, { colors: true });
                      cli.verticalSpace();
                    }
                  },
                  1
                );
              }

              //cli.verticalSpace();
            }
          },
          1
        );
      });
    }
  });
};

// More Order (Purchases) info
cli.responders.moreOrderInfo = function (str) {
  // Get ID from string
  var arr = str.split("--");
  var purchaseId =
    typeof arr[1] == "string" && arr[1].trim().length > 0
      ? arr[1].trim()
      : false;

  if (purchaseId) {
    // Lookup the user
    _data.read(
      "purchases",
      purchaseId,
      function (err, userData) {
        if (!err && userData) {
          //userData.purchaseId = userData.hashedPassword;
          // Remove the hashed password
          //delete userData.hashedPassword;

          // Print their JSON object with text highlighting
          cli.verticalSpace();

          console.dir(userData, { colors: true });
          cli.verticalSpace();
        }
      },
      1
    );
  }
};

// Input processor
cli.processInput = function (str) {
  str = typeof str == "string" && str.trim().length > 0 ? str.trim() : false;
  // Only process the input if the user actually wrote something, otherwise ignore it
  if (str) {
    // Codify the unique strings that identify the different unique questions allowed be the asked
    var uniqueInputs = [
      "man",
      "help",
      "exit",
      "stats",
      "menu items",
      "list users",
      "more user info",
      "recent orders",
      "more order info",
    ];

    // Go through the possible inputs, emit event when a match is found
    var matchFound = false;
    var counter = 0;
    uniqueInputs.some(function (input) {
      if (str.toLowerCase().indexOf(input) > -1) {
        matchFound = true;
        // Emit event matching the unique input, and include the full string given
        e.emit(input, str);
        return true;
      }
    });

    // If no match is found, tell the user to try again
    if (!matchFound) {
      console.log("Sorry, try again");
    }
  }
};

// Init script
cli.init = function () {
  // Send to console, in dark blue
  console.log("\x1b[34m%s\x1b[0m", "The CLI is running");

  // Start the interface
  var _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "",
  });

  // Create an initial prompt
  _interface.prompt();

  // Handle each line of input separately
  _interface.on("line", function (str) {
    // Send to the input processor
    cli.processInput(str);

    // Re-initialize the prompt afterwards
    _interface.prompt();
  });

  // If the user stops the CLI, kill the associated process
  _interface.on("close", function () {
    process.exit(0);
  });
};

// Export the module
module.exports = cli;
