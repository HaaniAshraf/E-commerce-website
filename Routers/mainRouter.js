const express=require('express')
const router=express.Router()

const {
    headerGet,
    proHeadGet,
    loginGet,
    loginPost,
    logoutPost,
    signupGet,
    signupPost,
    otpGet,
    otpPost,
    resendPost,
}=require('../Controller/mainController')

const {logVerify, signVerify}=require('../Middleware/auth')


router.get('/mainHeader',headerGet)
      .get('/profileHeader',proHeadGet)
      .get('/login',loginGet)
      .post('/login',logVerify,loginPost)
      .post('/logout',logoutPost)
      .get('/signup',signupGet)
      .post('/signup',signVerify,signupPost)
      .get('/otp',otpGet)
      .post('/otp',otpPost)
      .post('/resendOtp',resendPost)


module.exports=router