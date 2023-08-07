const allowed_origins = ["http://localhost:5173"];
const cors_option = {
  origin: (origin, callback) => {
    if (allowed_origins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Origins not allowed!"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
module.exports = cors_option;
