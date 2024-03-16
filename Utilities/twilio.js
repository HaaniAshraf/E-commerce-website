require("dotenv").config();

// Retrieve Twilio credentials from environment variables
const serviceSID = process.env.serviceSID;
const accountSID = process.env.accountSID;
const authToken = process.env.authToken;
const client = require("twilio")(accountSID, authToken);

const { User } = require("../Model/db");

// Function to send a phone OTP 
const sendPhoneOtp = async (phone) => {
  await client.verify.v2.services(serviceSID).verifications.create({
    to: `+91${phone}`,
    channel: "sms",
    body: "Signup to SHOPON using this code",
  });
};

// Function to verify the OTP
const verifyPhoneOtp = async (phone, otp) => {
  try {
    // Create a verification check with the provided phone number and OTP
    const verificationCheck = await client.verify.v2
      .services(serviceSID)
      .verificationChecks.create({
        to: `+91${phone}`,
        code: otp,
      });

    if (verificationCheck.status === "approved") {
      // If the verification check is approved, update the user's OTP verification status
      const updatedUser = await User.findOneAndUpdate(
        { phone: phone },
        { $set: { otpVerified: true } },
        { new: true }
      );

    } else {
      console.log("OTP verification failed.");
    }
  } catch (error) {
    console.error("Error during OTP verification:", error);
  }
};


// Function to resend a phone OTP
const resendPhoneOtp = async (phone) => {
  await client.verify.v2.services(serviceSID).verifications.create({
    to: `+91${phone}`,
    channel: "sms",
    body: "Signup to SHOPON using this code",
  });
};

module.exports = { sendPhoneOtp, verifyPhoneOtp, resendPhoneOtp };
