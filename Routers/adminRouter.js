const express=require('express')
const router=express.Router()
const upload = require('../Middleware/multermiddleware')


const {
    adminhomeGet,
    userlistGet,
    removeUser,
    addBannerGet,
    addBannerPost,
    updateBannerGet,
    updateBannerPost,
    deleteBanner,
    addCouponGet,
    addCouponPost,
    updateCouponGet,
    updateCouponPost,
    deleteCoupon,
    orderListGet,
    orderDetailsGet,
    orderStatusPost,
    userDetailsGet,

}=require('../Controller/adminController')


router.get('/adminHome',adminhomeGet)
      .get('/userlist',userlistGet)
      .get('/userDetails/:userId',userDetailsGet)
      .post('/removeUser/:userId',removeUser)  
      .get('/addBanner',addBannerGet)
      .post('/addBanner',upload.single('image'),addBannerPost)
      .get('/updateBanner/:bannerId',updateBannerGet)
      .post('/updateBanner/:bannerId',updateBannerPost)
      .post('/deleteBanner/:bannerId',deleteBanner).get('/addBanner',addBannerGet)
      .get('/addCoupon',addCouponGet)
      .post('/addCoupon',addCouponPost)
      .get('/updateCoupon/:couponId',updateCouponGet)
      .post('/updateCoupon/:couponId',updateCouponPost)
      .post('/deleteCoupon/:couponId',deleteCoupon)
      .get('/orderList',orderListGet)
      .get('/orderDetails/:orderId',orderDetailsGet)
      .post('/updateOrderStatus/:orderId',orderStatusPost)


module.exports=router