const express=require('express')
const router=express.Router()


const {
    couponGet,
    addCouponGet,
    addCouponPost,
    updateCouponGet,
    updateCouponPost,
    deleteCoupon,

}=require('../Controller/couponController')


router.get('/coupon',couponGet)
      .get('/addCoupon',addCouponGet)
      .post('/addCoupon',addCouponPost)
      .get('/updateCoupon/:couponId',updateCouponGet)
      .post('/updateCoupon/:couponId',updateCouponPost)
      .post('/deleteCoupon/:couponId',deleteCoupon)

module.exports=router