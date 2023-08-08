const express = require("express");
const multer = require("multer");
const os = require('os');

const productController = require("./product.controller");

const router = express.Router();
router.get("/products", productController.index);
router.get("/products/:id", productController.getProduct);
router.post(
  "/products",
  multer({ dest: os.tmpdir() }).single("image"),
  productController.store
);
router.put(
  "/products/:id",
  multer({ dest: os.tmpdir() }).single("image"),
  productController.update
);
router.delete("/products/:id", productController.destroy);

module.exports = router;
