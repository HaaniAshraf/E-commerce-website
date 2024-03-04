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
    forgotPasswordGet,
    forgotPasswordPost,
    passwordOtpGet,
    passwordOtpPost,
    newPasswordGet,
    newPasswordPost,

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
      .get('/inputEmail',forgotPasswordGet)
      .post('/inputEmail',forgotPasswordPost)
      .get('/passwordOtp',passwordOtpGet)
      .post('/passwordOtp',passwordOtpPost)
      .get('/newPassword',newPasswordGet)
      .post('/newPassword',newPasswordPost)


module.exports=router