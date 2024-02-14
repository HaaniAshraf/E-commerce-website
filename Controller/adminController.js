const mongoose=require('mongoose')
const { ObjectId } = require('mongoose').Types;
const { User,Profile,Address,Product,Banner,Coupon } = require('../Model/db');


module.exports={

  adminhomeGet:async(req, res) => {
    try{
      res.render('adminHome')
    }catch(error){
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
    }
    },


    userlistGet:async(req,res)=>{
      try {
        const regularUsers = await User.find({ role: false });
                res.render('userlist', { regularUsers });
      } catch (error) {
        console.error('Error fetching user list:', error);
        res.status(500).send('Internal Server Error');
      }
    },


    removeUser:async(req,res)=>{
      const userId = req.params.userId;
       try {
      const user = await User.deleteOne({ _id: userId });
      if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.redirect('/userlist')
      } catch (error) {
      console.error('Error removing user:', error);
      res.redirect('/userlist')
      }
    },
   

      addBannerGet:async(req,res)=>{
        try {
          const banners = await Banner.find();
              res.render('addBanner', { banners });
        } catch (error) {
          console.error('Error fetching banners:', error);
          res.status(500).send('Internal Server Error');
        }
      },


      addBannerPost:async(req,res)=>{
        try {
          const { imageUrl,content } = req.body;
          const newBanner = new Banner({ imageUrl,content });
          await newBanner.save();
          res.redirect('/addBanner');
        } catch (error) {
          console.error('Error adding banner:', error);
          res.status(500).send('Internal Server Error');
        }
      },


      updateBannerGet:async(req,res)=>{
        const bannerId = req.params.bannerId;
        try {
        const banner = await Banner.findById(bannerId);   
        if (!banner) {
        return res.status(404).send('Banner not found');
       }
        res.render('updateBanner', { banner });
        } catch (error) {
        console.error('Error fetching banner for update:', error);
        res.status(500).send('Internal Server Error');
      }
      },


      updateBannerPost:async(req,res)=>{
        const bannerId = req.params.bannerId;
        const { imageUrl, content, newImageUrl } = req.body;      
        try {
          const banner = await Banner.findById(bannerId);   
          if (!banner) {
            return res.status(404).send('Banner not found');
          }      
          banner.imageUrl = newImageUrl || imageUrl; 
          banner.content = content;
                await banner.save();
                res.redirect(`/addBanner?updatedImageUrl=${banner.imageUrl}&updatedContent=${banner.content}`);
              } catch (error) {
          console.error('Error updating banner:', error);
          res.status(500).send('Internal Server Error');
        }
      },


      deleteBanner:async(req,res)=>{
        try {
          const bannerId = req.params.bannerId;
         await Banner.deleteOne({ _id: bannerId });     
          res.redirect('/addBanner')
        } catch (error) {
             console.error('Error deleting banner:', error);
        }
        },     
        
        
        addCouponGet:async(req,res)=>{
          try {
            const coupons = await Coupon.find();
                res.render('addCoupon', { coupons });
          } catch (error) {
            console.error('Error fetching coupons:', error);
            res.status(500).send('Internal Server Error');
          }
        },
  
  
        addCouponPost:async(req,res)=>{
          try {
            const { couponCode, discount, conditions, expiry } = req.body;
            const newCoupon = new Coupon({ couponCode, discount, conditions, expiry});
            await newCoupon.save();
            res.redirect('/addCoupon');
          } catch (error) {
            console.error('Error adding coupon:', error);
            res.status(500).send('Internal Server Error');
          }
        },


        updateCouponGet:async(req,res)=>{
          const couponId = req.params.couponId;
          try {
          const coupon = await Coupon.findById(couponId);   
          if (!coupon) {
          return res.status(404).send('Coupon not found');
         }
          res.render('updateCoupon', { coupon });
          } catch (error) {
          console.error('Error fetching coupon for update:', error);
          res.status(500).send('Internal Server Error');
        }
        },


        updateCouponPost:async(req,res)=>{
          const couponId = req.params.couponId;
          const { couponCode, discount, conditions, expiry } = req.body;      
          try {
            const coupon = await Coupon.findByIdAndUpdate(couponId,{couponCode, discount, conditions, expiry });   
            if (!coupon) {
              return res.status(404).send('Coupon not found');
            }      
                  await coupon.save();
                  res.redirect('/addCoupon');
                } catch (error) {
            console.error('Error updating coupon:', error);
            res.status(500).send('Internal Server Error');
          }
        },


        deleteCoupon:async(req,res)=>{
          try {
            const couponId = req.params.couponId;
           await Coupon.deleteOne({ _id: couponId });     
            res.redirect('/addCoupon')
          } catch (error) {
               console.error('Error deleting coupon:', error);
          }
        }



}