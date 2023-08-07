const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URI);
const db = mongoose.connection;
module.exports = db;
