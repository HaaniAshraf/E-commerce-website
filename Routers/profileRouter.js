const express=require('express')
const router=express.Router()


const {
    profileGet,
    profilePost,
    privacyGet,
    addressGet,
    addressAddPost,
    addressRemove,
}=require('../Controller/profileController')


router.get('/profile',profileGet)
      .post('/profile',profilePost)
      .get('/privacy',privacyGet)
      .get('/address',addressGet)
      .post('/address/add',addressAddPost)
      .post('/address/remove/:addressId',addressRemove)

module.exports=router