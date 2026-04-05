const express = require("express");
const productController = require("../controllers/product.controller.js");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, productController.addProduct);
router.get("/", authMiddleware, productController.getProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);

module.exports = router