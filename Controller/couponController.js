const { Coupon } = require("../Model/db");

module.exports = {

  couponGet: async (req, res) => {
    if(req.session.email){
      const dynamicTitle = "Coupons";
      try {
        // Fetch all coupons from the database
        const coupons = await Coupon.find();
        res.render("coupon", { coupons, title: dynamicTitle });
      } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    }   
  },


  addCouponGet: async (req, res) => {
    if(req.session.role == true){
      try {
        // Fetch all coupons from the database
        const coupons = await Coupon.find();
        res.render("addCoupon", { coupons });
      } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    }   
  },


  addCouponPost: async (req, res) => {
    if(req.session.role == true){
      try {
        // Extract coupon details from the request body
        const { couponCode, discount, conditions, expiry } = req.body;
        // Create a new Coupon object with the provided details
        const newCoupon = new Coupon({
          couponCode: couponCode.toUpperCase(),
          discount,
          conditions,
          expiry,
        });
        // Save the new coupon to the database
        await newCoupon.save();
  
        res.redirect("/addCoupon");
      } catch (error) {
        console.error("Error adding coupon:", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    }   
  },


  updateCouponGet: async (req, res) => {
    if(req.session.role == true){
      // Extract the couponId from the request parameters
      const couponId = req.params.couponId;
      try {
        // Find the coupon in the database by its ID
        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
          return res.status(404).send("Coupon not found");
        }
        res.render("updateCoupon", { coupon });

      } catch (error) {
        console.error("Error fetching coupon for update:", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    } 
  },


  updateCouponPost: async (req, res) => {
    if(req.session.role == true){
      try {
        // Extract the couponId from the request parameters
        const couponId = req.params.couponId;
        // Extract updated coupon details from the request body
        const { couponCode, discount, conditions, expiry } = req.body;

        // Find and update the coupon in the database by its ID
        const coupon = await Coupon.findByIdAndUpdate(couponId, {
          couponCode: couponCode.toUpperCase(),
          discount,
          conditions,
          expiry,
        });
        if (!coupon) {
          return res.status(404).send("Coupon not found");
        }
        // Save the updated coupon to the database
        await coupon.save();
  
        res.redirect("/addCoupon");
      } catch (error) {
        console.error("Error updating coupon:", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    }
  },


  deleteCoupon: async (req, res) => {
    if(req.session.role == true){
      try {
        // Extract the couponId from the request parameters
        const couponId = req.params.couponId;
        // Delete the coupon from the database using its ID
        await Coupon.deleteOne({ _id: couponId });
        
        res.redirect("/addCoupon");
      } catch (error) {
        console.error("Error deleting coupon:", error);
      }
    }else{
      res.redirect('/login')
    } 
  },
  
};
