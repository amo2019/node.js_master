/*
 * Library for storing and editing data
 *
 */

// Dependencies
var fs = require("fs");
var path = require("path");
var helpers = require("./helpers");

// Container for module (to be exported)
var lib = {};

// Base directory of data folder
lib.baseDir = path.join(__dirname, "/../.data/");

// This function does most of the job: checking and validating email, password, token,...
lib.readDir = function getFilesFromDir(
  dir,
  fileTypes,
  email,
  hashedEmail,
  hashedPassword,
  tokenId = "",
  payLoad = ""
) {
  let fileData = {
    filesNames: [],
    targetFile: "",
    email: { exist: false, email: "", password: false },
    // to check if token exist and has the same email
    token: { exist: false, expired: false, email: false, tokenId: "" },
  };
  var filesNames = [];
  var userEmail = false;
  var filesBody = "";
  var currentFileBody = "";
  var filesToReturn = [];
  // using the same function for checking and validating email, password, token,...
  !tokenId
    ? (hashedPassword = hashedPassword)
    : (hashedPassword = payLoad.email);

  function walkDir(currentPath) {
    var files = fs.readdirSync(currentPath);
    for (var i in files) {
      var curFile = path.join(currentPath, files[i]);
      if (
        fs.statSync(curFile).isFile() &&
        fileTypes.indexOf(path.extname(curFile)) != -1
      ) {
        if (filesBody !== "") {
          filesBody += ", " + fs.readFileSync(curFile).toString();
        } else {
          filesBody += fs.readFileSync(curFile).toString();
        }
        currentFileBody = "";

        var extension = path.extname(curFile);
        filesNames.push(path.basename(curFile, extension));
        if (filesNames.includes(hashedEmail)) {
          userEmail = true;
        }
        filesToReturn.push(curFile.replace(dir, ""));
        fileData.filesNames.push(path.basename(curFile, extension));
        // checking if the password exist in each file body
        var idx = filesBody.indexOf(hashedPassword);
        if (idx >= 0) {
          console.log("hashedPassword:", hashedPassword);

          fileData.targetFile = path.basename(curFile, extension);
          currentFileBody += fs.readFileSync(curFile).toString();
          // .replace(/[{}]/g, "");
          currentFileBody = JSON.parse(currentFileBody);
          // currentFileBody = currentFileBody.replace(/[{}]/g, "");
          // this checks if there is no Token
          if (!tokenId && currentFileBody.email == email) {
            fileData.email.exist = true;
            //let passCheck = currentFileBody._id === hashedPassword;
            fileData.email.email = currentFileBody.email;

            return fileData;
          }

          // if (tokenId) {
          //   let tokenCheck = currentFileBody.includes(hashedPassword);
          //   if (tokenCheck) {
          //     fileData.token.exist = true;
          //   }

          if (currentFileBody._id == tokenId) {
            fileData.token.exist = true;
          }

          if (currentFileBody.email == email) {
            fileData.token.email = true;
          }
          // fileData.token.email = true;
          try {
            fileData.token.tokenId = currentFileBody.exp;

            let currenDate = Math.floor(Date.now() / 1000);
            if (currentFileBody.exp < Math.floor(Date.now() / 1000)) {
              fileData.token.expired = true;
            }
            // fileData.token.expired = currentFileBody
            //   .substring(currentFileBody.indexOf("exp") + 6)
            //   .slice(0, -2);
            // fileData.token.tokenId = currentFileBody.substr(9, 11);

            return fileData;
          } catch (error) {
            console.error(error);
          }
        }
      } else if (fs.statSync(curFile).isDirectory()) {
        walkDir(curFile);
      }
    }
  }
  // console.log("filesBody:", filesBody);
  walkDir(dir);
  return fileData;
};

// Write data to a file
lib.create2 = function (dir, file, data, callback) {
  // Open the file for writing
  var hashedfile = helpers.hash(file);
  fs.open(
    lib.baseDir + dir + "/" + hashedfile + ".json",
    "wx",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        // Convert data to string
        var stringData = JSON.stringify(data);

        // Write to file and close it
        fs.writeFile(fileDescriptor, stringData, function (err) {
          if (!err) {
            fs.close(fileDescriptor, function (err) {
              if (!err) {
                callback(false);
              } else {
                callback("Error closing new file");
              }
            });
          } else {
            callback("Error writing to new file");
          }
        });
      } else {
        callback("Could not create new file, it may already exist");
      }
    }
  );
};

// Write data to a file
lib.create = function (dir, file, data, callback) {
  // Open the file for writing
  // var tokenResult = lib.readDir(
  //   lib.baseDir + "tokens",
  //   [".json"],
  //   email,
  //   hashedemail,
  //   hashedPassword
  // );
  if (data.method !== "get") {
    var stringData = JSON.stringify(data);
    var hashedfile = helpers.hash(file);
    fs.writeFileSync(
      lib.baseDir + dir + "/" + hashedfile + ".json",
      stringData
    );

    fs.open(
      lib.baseDir + dir + "/" + hashedfile + ".json",
      "wx",
      function (err, fileDescriptor) {
        if (!err && fileDescriptor) {
          // Convert data to string
          var stringData = JSON.stringify(data);

          // Write to file and close it
          fs.writeFile(fileDescriptor, stringData, function (err) {
            if (!err) {
              fs.close(fileDescriptor, function (err) {
                if (!err) {
                  console.log("tokenId created");
                  callback(false);
                } else {
                  callback("Error closing new file");
                }
              });
            } else {
              callback("Error writing to new file");
            }
          });
        } else {
          if (err.code == "EEXIST") {
            console.log("err.code:", err.code);
            callback(false);
          }

          // callback("Could not create new file, it may already exist");
        }
      }
    );
  }
};

// Read data from a file
lib.read = function (dir, file, callback) {
  var hashedfile = helpers.hash(file);

  fs.readFile(
    lib.baseDir + dir + "/" + hashedfile + ".json",
    "utf8",
    function (err, data) {
      if (!err && data) {
        var parsedData = helpers.parseJsonToObject(data);
        callback(false, parsedData);
      } else {
        callback(err, data);
      }
    }
  );
};

// Update data in a file
lib.update = function (dir, file, data, callback) {
  // Open the file for writing
  var hashedfile = helpers.hash(file);
  fs.open(
    lib.baseDir + dir + "/" + hashedfile + ".json",
    "r+",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        // Convert data to string
        var stringData = JSON.stringify(data);

        // Truncate the file
        fs.ftruncate(fileDescriptor, function (err) {
          if (!err) {
            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData, function (err) {
              if (!err) {
                fs.close(fileDescriptor, function (err) {
                  if (!err) {
                    callback(false);
                  } else {
                    callback("Error closing existing file");
                  }
                });
              } else {
                callback("Error writing to existing file");
              }
            });
          } else {
            callback("Error truncating file");
          }
        });
      } else {
        callback("Could not open file for updating, it may not exist yet");
      }
    }
  );
};

// Delete a file
lib.delete = function (dir, file, callback) {
  var hashedfile = helpers.hash(file);
  // Unlink the file from the filesystem
  fs.unlink(lib.baseDir + dir + "/" + hashedfile + ".json", function (err) {
    callback(err);
  });
};

// List all the items in a directory
lib.list = function (dir, callback) {
  fs.readdir(lib.baseDir + dir + "/", function (err, data) {
    if (!err && data && data.length > 0) {
      var trimmedFileNames = [];
      data.forEach(function (fileName) {
        trimmedFileNames.push(fileName.replace(".json", ""));
      });
      callback(false, trimmedFileNames);
    } else {
      callback(err, data);
    }
  });
};

// Export the module
module.exports = lib;
