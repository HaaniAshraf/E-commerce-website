const express = require("express");
const router = express.Router();

const {
  wishlistGet,
  wishlistToggle,
  wishlistCount,
  addToWishlist,
  removeFromWishist,
} = require("../Controller/wishlistController");

router
  .get("/wishlist", wishlistGet)
  .post("/wishlistToggle/:productId", wishlistToggle)
  .get("/wishlist/count", wishlistCount)
  .post("/addToWishlist/:productId", addToWishlist)
  .post("/removeFromWishlist/:productId", removeFromWishist);

module.exports = router;
