const serviceSID="VA8012a02709508a14ff3d218ca1551f98"
const accountSID="AC21860c8e1af91a58babe5e8d041c8819"
const authToken="e7cb6710d30101baa75cd7e8b718a2b8"
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