const mongoose = require("mongoose");
const {
  dbHost,
  dbName,
  dbPass,
  dbPort,
  dbUser,
} = require("./config");

mongoose.connect(
  `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`
);
const db = mongoose.connection;
module.exports = db;