const prod = {
    url: {
        API_BASE: "https://pizza-store-web-app.herokuapp.com",
        API_PURCHASES: "https://pizza-store-web-app.herokuapp.com/api/purchases",
        API_STORES: "https://pizza-store-web-app.herokuapp.com/api/stores",
        API_LOGIN: "https://pizza-store-web-app.herokuapp.com",
     
    }
 };
 
 const dev = {
    url: {
        API_BASE: "http://localhost:3000",
        API_PURCHASES: "http://localhost:3000/favorites",
        API_STORES: "http://localhost:3000/api/stores",
        API_LOGIN: "http://localhost:4444",
     
    }
 };
process.env.USER === "am"? process.env.NODE_ENV = "development" : process.env.NODE_ENV = "production";
const constants = process.env.NODE_ENV === "development" ? dev : prod;
//console.log("process.env.NODE_ENV-constants:", constants);
 module.exports = constants;

 
