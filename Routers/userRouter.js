const express=require('express')
const router=express.Router()


const {
    userhomeGet,
    profileGet,
    profilePost,
    privacyGet,
    addressGet,
    addressAddPost,
    addressRemove,
    couponGet,
    menSectionGet,
    womenSectionGet,
    jewelrySectionGet,
    perfumeSectionGet,
    electronicSectionGet,
    wishlistGet,
    wishlistToggle,
    wishlistCount,
    addToWishlist,
    removeFromWishist,
    cartGet,
    productDetailsGet,
}=require('../Controller/userController')


router.get('/',userhomeGet)
      .get('/profile',profileGet)
      .post('/profile',profilePost)
      .get('/privacy',privacyGet)
      .get('/address',addressGet)
      .post('/address/add',addressAddPost)
      .post('/address/remove/:addressId',addressRemove)
      .get('/coupon',couponGet)
      .get('/menSection',menSectionGet)
      .get('/womenSection',womenSectionGet)
      .get('/jewelrySection',jewelrySectionGet)
      .get('/perfumeSection',perfumeSectionGet)
      .get('/electronicSection',electronicSectionGet)
      .get('/wishlist',wishlistGet)
      .post('/wishlistToggle/:productId',wishlistToggle)
      .get('/wishlist/count',wishlistCount)
      .post('/addToWishlist/:productId',addToWishlist)
      .post('/removeFromWishlist/:productId',removeFromWishist)
      .get('/cart',cartGet)
      .get('/details/:productId',productDetailsGet)



module.exports=router