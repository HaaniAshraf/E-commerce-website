const express = require("express");
const router = express.Router();

const {
  cartGet,
  cartCount,
  addToCart,
  updateCart,
  removeFromCart,
  validateCoupon,
  applyGift,
} = require("../Controller/cartController");

router
  .get("/cart", cartGet)
  .get("/cart/count", cartCount)
  .post("/addToCart/:productId", addToCart)
  .post("/updateCartItem", updateCart)
  .post("/removeFromCart/:productId", removeFromCart)
  .post("/applyCoupon", validateCoupon)
  .post("/applyGift", applyGift);

module.exports = router;
