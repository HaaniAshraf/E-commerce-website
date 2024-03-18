const { User,Wishlist,Cart } = require("../Model/db");
const { ObjectId } = require("mongoose").Types;
const bcrypt = require("bcrypt");

const { sendPhoneOtp,verifyPhoneOtp,resendPhoneOtp } = require("../Utilities/twilio");
const { emailverification } = require("../Utilities/nodemailer");
const otp = Math.floor(Math.random() * 9000) + 1000;

require("dotenv").config();
const serviceSID = process.env.serviceSID;
const accountSID = process.env.accountSID;
const authToken = process.env.authToken;
const client = require("twilio")(accountSID, authToken);

let err = "";

module.exports = {

  loginGet: (req, res) => {
    if (req.session.email) {
      res.redirect("/");
    } else {
      res.render("login", { error: err });
    }
    err = "";
  },


  loginPost: async (req, res) => {
    // Extract the email from the request body
    const email = req.body.email;
     // Search for a user with the specified email
    const user = await User.findOne({ email: email });
    // Check if the user has not verified their OTP
    if (!user.otpVerified) {
      return res.render("login", {
        error: "User not verified.Please Signup and verify",
      });
    }
    // Check if the user is blocked, render the login page.
    if (user.status === "blocked") {
      return res.render("login", { error: "User is blocked." });
    }

    // If the user is found and not blocked, check the user's role
    if (user.role) {
      // If there is a role, set the session role and redirect to the admin home page
      req.session.role = user.role;
      res.redirect("/adminHome");
    } else {
      // If the user does not have a role, set the session email and user information
      req.session.email = user.email;
      req.session.user = { userId: user._id };
      res.redirect("/");
    }
  },


  logoutPost: (req, res) => {
    // Destroy the user's session, effectively logging them out
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
      res.json({ success: true, message: "Logout successful" });
    });
  },


  signupGet: (req, res) => {
    if (req.session.email) {
      res.redirect("/");
    } else {
      res.render("signup", { error: err });
    }
    err = "";
  },


  signupPost: async (req, res) => {
    // Set the default user role to "user"
    const defaultRole = "user";
    // Store the default user role in the session
    req.session.role = defaultRole;
    // Store the user's phone number from the request body in the session
    req.session.phone = req.body.phone;
    // Call the sendPhoneOtp function to send an OTP to the provided phone number
    sendPhoneOtp(req.body.phone).then((resp) => {
      res.redirect("/otp");
    });
  },


  otpGet: async (req, res) => {
    if(req.session.email){
      res.redirect('/')
    }else{
      res.render("otp", { errors: err });
    }
  },


  otpPost: async (req, res) => {
    // Destructure the OTP from the request body
    const { otp } = req.body;
    // Retrieve the stored phone number from the session
    const phone = req.session.phone;

    try {
      // Check if the provided OTP is valid for the given phone number
      if (verifyPhoneOtp(phone, otp)) {
        res.redirect("/");
      } else {
        res.render("otp", { errors: "Invalid OTP" });
      }

      // Destroy the session after OTP verification
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }
      });
    } catch (error) {
      console.error("Error during OTP verification:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  resendPost: async (req, res) => {
    // Retrieve the phone number stored in the session
    const phone = req.session.phone;
    try {
      // Call the resendPhoneOtp function to resend the OTP to the user's phone
      resendPhoneOtp(phone);
      res.render("otp", { errors: err });
    } catch (err) {
      console.error(err);
      res.json({ message: "Error" });
    }
  },


  forgotPasswordGet: async (req, res) => {
      try {
        res.render("forgotPassword", { errors: err });
      } catch (error) {
        console.error("Error fetching input email:", error);
        res.status(500).send("Internal Server Error");
      }
  },


  forgotPasswordPost: async (req, res) => {
    try {
      // Retrieve the email from the request body
      const email = req.body.email;
      // Call the emailverification function to initiate the email verification process and generate an OTP
      emailverification(email, otp);

      // Find the user with the given email in the database
      const user = await User.findOne({ email: email });
      // Store the user's ObjectId in the session for further reference
      req.session.userId = new ObjectId(user._id);

      res.render("passwordOtp", { errors: err });
    } catch (error) {
      console.error("Error during input email:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  passwordOtpGet: async (req, res) => {
    try {
      res.render("passwordOtp", { errors: err });
    } catch (error) {
      console.error("Error during forgot password:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  passwordOtpPost: async (req, res) => {
    try {
      // Retrieve the input OTP from the request body
      const inputOtp = req.body.inputOtp;

      // Compare the input OTP with the stored OTP
      if (inputOtp == otp) {
        res.render("newPassword", { errors: err });
      } else {
        res.render("passwordOtp", { errors: "OTP does not match." });
      }
    } catch (error) {
      console.error("Error during forgot password:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  newPasswordGet: async (req, res) => {
    try {
      res.render("newPassword");
    } catch (error) {
      console.error("Error during new password:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  newPasswordPost: async (req, res) => {
    try {
      // Retrieve the user ID from the session
      const userId = req.session.userId;
      // Retrieve the password and confirmPassword from the request body
      const { password, confirmPassword } = req.body;

      if (!password || !confirmPassword) {
        return res.render("newPassword", {
          error: "Both password fields are required",
        });
      }
      if (password !== confirmPassword) {
        return res.render("newPassword", { error: "Passwords do not match" });
      }

      // Hash the new password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
      // Update the user's password in the database
      await User.findByIdAndUpdate(userId, { password: hashedPassword });

      res.render("newPassword", { success: "Password updated successfully" });

      // Destroy the session after successful password update
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }
      });
      
    } catch (error) {
      console.error("Error during new password:", error);
      res.status(500).send("Internal Server Error");
    }
  },
  
};
