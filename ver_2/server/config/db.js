var mysql = require("mysql");
const db = mysql.createPool({
  host: "localhost",
  user: "shmoon",
  password: "*Tlqkforacle12345678*",
  database: "gyeongin", //db명
  port: 3300
});
module.exports = db;
