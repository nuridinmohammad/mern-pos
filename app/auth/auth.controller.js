const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");

const UserModel = require("../user/user.model");
const config_env = require("../../configs/config");
const getToken = require("../../utils");

const authController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await UserModel.find().select("fullname token");
      res.status(200).json(users);
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(400).json({ errorNumber: 1, message: error.message });
      }
      next(error);
    }
  },
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
  localStrategy: async (email, password, done) => {
    try {
      const user = await UserModel.findOne({ email }).select(
        "-__v -createAt -updateAt -cart_items -token"
      );
      if (!user) return done();
      if (bcrypt.compareSync(password, user.password)) {
        const { password, ...userWithoutPassword } = user.toJSON();
        return done(null, userWithoutPassword);
      }
    } catch (error) {
      done(error, null);
    }
    done();
  },
  login: async (req, res, next) => {
    passport.authenticate("local", async function (error, user) {
      if (error) return next(error);
      if (!user) {
        return res.status(401).json({
          errorNumber: 1,
          message: "Email or Password incorrect",
        });
      }

      const signed = jsonwebtoken.sign(user, config_env.secretkey, {
        expiresIn: "1d",
      });
      const signIn = await UserModel.findByIdAndUpdate(user._id, {
        $push: { token: signed },
      });
      res.status(200).json({
        message: "Login Success!",
        user,
        token: signed,
      });
      return signIn;
    })(req, res, next);
  },
  me: async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        errorNumber: 1,
        message: "Anda sedang tidak login atau token expired",
      });
    }
    res.status(200).json({ response: "Sedang Login", data: req.user });
  },
  logout: async (req, res, next) => {
    const token = getToken(req);
    const user = await UserModel.findOneAndUpdate(
      { token: { $in: [token] } },
      { $pull: { token: token } },
      { useFindAndModify: false }
    );
    if (!token || !user) {
      return res
        .status(401)
        .json({ errorNumber: 1, message: "No user Found!" });
    }
    return res.status(200).json({ errorNumber: 0, message: "Logout Berhasil" });
  },
};

module.exports = authController;
