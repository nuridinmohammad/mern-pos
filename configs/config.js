const path = require("path");

const config_env = {
  rootPath: path.resolve(__dirname, ".."),
  secretkey: process.env.SECRET_KEY,
  serviceName: process.env.SERVICE_NAME,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
};

module.exports = config_env;
