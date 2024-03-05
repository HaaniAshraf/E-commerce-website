
require('dotenv').config()

const serviceSID=process.env.serviceSID
const accountSID=process.env.accountSID
const authToken=process.env.authToken
const client=require('twilio')(accountSID,authToken)

const { User } = require('../Model/db');


const sendPhoneOtp=async(phone)=>{
    await client.verify.v2
    .services(serviceSID)
    .verifications.create({
      to: `+91${phone}`,
      channel:"sms",
      body: 'Signup to SHOPON using this code',
    })
    }


const verifyPhoneOtp=async(phone,otp)=>{
    const verificationCheck = await client.verify.v2
    .services(serviceSID)
    .verificationChecks.create({
        to:  `+91${phone}`,
        code: otp,
    });    
    if (verificationCheck.status === 'approved') {
        const user = await User.findOneAndUpdate(
          { phone: phone },
          { $set: { otpVerified: true } },
          { new: true }
      );
}
}


const resendPhoneOtp=async(phone)=>{
    await client.verify.v2
    .services(serviceSID)
    .verifications.create({
        to: `+91${phone}`,
        channel: "sms",
        body: 'Signup to SHOPON using this code', 
    });
}


module.exports={sendPhoneOtp,verifyPhoneOtp,resendPhoneOtp}