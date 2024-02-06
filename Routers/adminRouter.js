const express=require('express')
const router=express.Router()
const upload = require('../Middleware/multermiddleware')


const {
    adminhomeGet,
    userlistGet,
    removeUser,
    productlistGet,
    addProductGet,
    addProductPost,
    updateProductGet,
    updateProductPost,
    deleteProduct,
    addBannerGet,
    addBannerPost,
    updateBannerGet,
    updateBannerPost,
    deleteBanner,
    addCouponGet,
    addCouponPost,
    updateCouponGet,
    updateCouponPost,
    deleteCoupon

}=require('../Controller/adminController')


router.get('/adminHome',adminhomeGet)
      .get('/userlist',userlistGet)
      .post('/removeUser/:userId',removeUser)
      .get('/productlist',productlistGet)
      .get('/addProduct',addProductGet)
      .post('/addProduct',upload.array('productimg', 5),addProductPost)
      .get('/updateProduct/:productId',updateProductGet)
      .post('/updateProduct/:productId',upload.array('productimg', 5),updateProductPost)
      .post('/deleteproduct/:productId',deleteProduct)
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


module.exports=router