const express = require("express");
const authController = require("./auth.controller");
const passport = require("passport");
const PassportLocal = require("passport-local")

const router = express.Router();
const localStrategy = new PassportLocal(
  { usernameField: "email" },
  authController.localStrategy
);

passport.use(localStrategy);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/me", authController.me);
router.get("/users", authController.getUsers);
router.post("/logout", authController.logout);

module.exports = router;
