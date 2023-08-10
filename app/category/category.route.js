const { Router } = require("express");
const categoryController = require("./category.controller");

const router = Router();

router.get("/category", categoryController.index);
router.get("/category/:id", categoryController.getCategory);
router.post("/category", categoryController.store);
router.put("/category/:id", categoryController.update);
router.delete("/category/:id", categoryController.destroy);

module.exports = router;
