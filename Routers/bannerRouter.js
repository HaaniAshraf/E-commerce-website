const express = require("express");
const router = express.Router();
const upload = require("../Middleware/multermiddleware");

const {
  addBannerGet,
  addBannerPost,
  updateBannerGet,
  updateBannerPost,
  deleteBanner,
} = require("../Controller/bannerController");

router
  .get("/addBanner", addBannerGet)
  .post("/addBanner", upload.single("image"), addBannerPost)
  .get("/updateBanner/:bannerId", updateBannerGet)
  .post("/updateBanner/:bannerId", updateBannerPost)
  .post("/deleteBanner/:bannerId", deleteBanner)
  .get("/addBanner", addBannerGet);

module.exports = router;
