const express = require("express");
const authController = require('./auth.controller');

const router = express.Router();
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/me", authController.me);
router.post("/logout", authController.logout);

module.exports = router