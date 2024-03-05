const mongoose=require('mongoose')
const { ObjectId } = require('mongoose').Types;
const { User,Profile,Address,Product,Banner,Coupon,Wishlist,Cart,Order, Review } = require('../Model/db');


module.exports={

  adminhomeGet:async(req, res) => {
    if( req.session.role=== true){

      try{
        const role = req.session.role
        const admin = await User.findOne({ role:role })

        res.render('adminHome',{ admin })
  
      }catch(error){
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
      }
      
    }else{
      res.redirect('/login')
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



    userDetailsGet:async(req,res)=>{
      try{
        const userId = req.params.userId

        const user = await User.findById(userId)
        const profile = await Profile.findOne({ userId:userId })
        const address = await Address.findOne({ userId:userId })
        const wishlist = await Wishlist.findOne({ user:userId }).populate('products')
        const cart = await Cart.findOne({ user:userId }).populate({path:'products.product'})
        const order = await Order.find({ user:userId }).populate({path:'products.product'})

        res.render('userDetails',{ user,profile,address,wishlist,cart,order })

      }catch(error){
        console.log(error)
      }
    },



    blockUser:async(req,res)=>{
      const userId = req.params.userId;

      try{
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        user.status = 'blocked';
        await user.save();
        res.status(200).json({ success: true, message: 'User blocked successfully' });

      } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).send('Internal Server Error');
      }
    },



    unblockUser:async(req,res)=>{
      const userId = req.params.userId

      try{
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        user.status = 'active';
        await user.save();
        res.status(200).json({ success: true, message: 'User unblocked successfully' });

      }catch (error) {
        console.error('Error unblocking user:', error);
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
  

  
        addCouponPost: async (req, res) => {
          try {

              const { couponCode, discount, conditions, expiry } = req.body;
              const newCoupon = new Coupon({ couponCode: couponCode.toUpperCase(), discount, conditions, expiry });
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

            const coupon = await Coupon.findByIdAndUpdate(couponId,{couponCode: couponCode.toUpperCase(), discount, conditions, expiry });   
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

        },



        orderListGet:async(req,res)=>{
          try{

            const orders = await Order.find({})
            res.render('orderList',{orders});

          }catch(error){
            console.error('Error fetching orders :', error);
            res.status(500).send('Internal Server Error');
          }       

        },



        orderDetailsGet:async(req,res)=>{
          try{

            const orderId = req.params.orderId;
            const order = await Order.findById( orderId ).populate('products.product').populate('user')
            const user = order.user;
            res.render('orderDetails',{ order,user })

          }catch(error){
            console.error('Error fetching order details :',error);
            res.status(500).send('Internal Server Error')
          }

        },



        orderStatusPost:async(req,res)=>{
          try {

            const orderId = req.params.orderId;
            const newStatus = req.body.orderStatus;
            
            await Order.findByIdAndUpdate(orderId, { orderStatus: newStatus });  
            res.redirect('/orderList');

        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).send('Internal Server Error');
        }

        },



        reviewListGet:async(req,res)=>{
          try{

            const productReviews = await Review.find({})
            res.render('reviewList',{productReviews})

          }catch(error){
            console.error('Error fetching reviews list:', error);
            res.status(500).send('Internal Server Error');
          }

        },


}