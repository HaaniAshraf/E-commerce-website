const { Coupon } = require("../Model/db");

module.exports = {

  couponGet: async (req, res) => {
    const dynamicTitle = "Coupons";
    try {
      const coupons = await Coupon.find();
      res.render("coupon", { coupons, title: dynamicTitle });
    } catch (error) {
      console.error("Error fetching coupons:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  addCouponGet: async (req, res) => {
    try {
      const coupons = await Coupon.find();
      res.render("addCoupon", { coupons });
    } catch (error) {
      console.error("Error fetching coupons:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  addCouponPost: async (req, res) => {
    try {
      const { couponCode, discount, conditions, expiry } = req.body;
      const newCoupon = new Coupon({
        couponCode: couponCode.toUpperCase(),
        discount,
        conditions,
        expiry,
      });
      await newCoupon.save();
      res.redirect("/addCoupon");
    } catch (error) {
      console.error("Error adding coupon:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  updateCouponGet: async (req, res) => {
    const couponId = req.params.couponId;
    try {
      const coupon = await Coupon.findById(couponId);
      if (!coupon) {
        return res.status(404).send("Coupon not found");
      }
      res.render("updateCoupon", { coupon });
    } catch (error) {
      console.error("Error fetching coupon for update:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  updateCouponPost: async (req, res) => {
    const couponId = req.params.couponId;
    const { couponCode, discount, conditions, expiry } = req.body;
    try {
      const coupon = await Coupon.findByIdAndUpdate(couponId, {
        couponCode: couponCode.toUpperCase(),
        discount,
        conditions,
        expiry,
      });
      if (!coupon) {
        return res.status(404).send("Coupon not found");
      }
      await coupon.save();
      res.redirect("/addCoupon");
    } catch (error) {
      console.error("Error updating coupon:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  deleteCoupon: async (req, res) => {
    try {
      const couponId = req.params.couponId;
      await Coupon.deleteOne({ _id: couponId });
      res.redirect("/addCoupon");
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  },
  
};
