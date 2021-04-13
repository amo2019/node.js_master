var util = require("util");
var debug = util.debuglog("server");
const assert = require("assert");
const { dataP, data2, data3 } = require("./data");
let data = new dataP();
let testsCompleted = 0;

test = {};
test.deletePizzaTest = function () {
  data.add("Test item for delete");
  assert.equal(data.DB_Data.length, 1, "1 item should exist");
  data.deleteAll();
  assert.equal(data.DB_Data.length, 0, "No items should exist");
  testsCompleted++;
};

test.addPizzaTest = function () {
  data.deleteAll();
  data.add("Item added");
  assert.notEqual(data.total, 0, "1 item should exist");
  testsCompleted++;
};

test.doAsyncTest = function (cb = () => {}) {
  let result = data.mockAsync((value) => {
    testsCompleted++;

    cb();
  });
  assert.ok(result, "Callback function should passed true");
};

test.throwsErrorTest = function () {
  assert.throws(data.add, /requires/);
  testsCompleted++;
};

test.objectEquality = function () {
  assert.notDeepEqual(data2, data3, "these two objects should NOT be the same");
};

module.exports = test;
