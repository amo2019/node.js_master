var util = require("util");
var debug = util.debuglog("server");
class dataP {
  constructor() {
    this.DB_Data = [];
  }

  add(item) {
    if (!item) throw new Error("add function requires an item");
    this.DB_Data.push(item);
  }

  deleteAll() {
    this.DB_Data = [];
  }

  get total() {
    return this.DB_Data.length;
  }

  mockAsync(cb = () => {}) {
    // console.log("call inside mockAsync func");
    let value = true;
    try {
      if (value) {
        setTimeout(cb, 0, value);
        return true;
      } else return false;
    } catch (e) {
      debug(e);
      return false;
    }
  }
}

var data2 = { name: "pizza1", price: "5" };
var data3 = { name: "pizza2", price: "5" };

module.exports = { dataP, data2, data3 };
