const jwt = require("jsonwebtoken");
const UserModel = require("../user/user.model");

const authController = {
  signup: async (req, res, next) => {
    const payload = req.body;
    try {
      const user = await UserModel(payload);
      await user.save();
      return res.status(201).json(user);
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(400).json({
          errorNumber: 1,
          message: error.message,
          fields: error.errors,
        });
      }
      next(error);
    }
  },
  login: async (req, res, next) => {},
  me: async (req, res, next) => {},
  logout: async (req, res, next) => {},
};

module.exports = authController;
