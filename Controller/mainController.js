const { User } = require("../Model/db");
const { ObjectId } = require("mongoose").Types;
const bcrypt = require("bcrypt");

const { sendPhoneOtp,verifyPhoneOtp,resendPhoneOtp } = require("../Utilities/twilio");
const { emailverification } = require("../Utilities/nodemailer");
const otp = Math.floor(Math.random() * 9000) + 1000;

const serviceSID = "VA8012a02709508a14ff3d218ca1551f98";
const accountSID = "AC21860c8e1af91a58babe5e8d041c8819";
const authToken = "e7cb6710d30101baa75cd7e8b718a2b8";
const client = require("twilio")(accountSID, authToken);

let err = "";

module.exports = {

  headerGet: async (req, res) => {
    try {
      res.render("mainHeader");
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  proHeadGet: async (req, res) => {
    try {
      res.render("profileHeader");
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  loginGet: (req, res) => {
    if (req.session.email) {
      res.redirect("/");
    } else {
      res.render("login", { error: err });
    }
    err = "";
  },


  loginPost: async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user.otpVerified) {
      return res.render("login", {
        error: "User not verified.Please Signup and verify",
      });
    }
    if (user.status === "blocked") {
      return res.render("login", { error: "User is blocked." });
    }

    if (user.role) {
      req.session.role = user.role;
      res.redirect("/adminHome");
    } else {
      req.session.email = user.email;
      req.session.user = { userId: user._id };
      res.redirect("/");
    }
  },


  logoutPost: (req, res) => {
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
    const defaultRole = "user";
    req.session.role = defaultRole;
    req.session.phone = req.body.phone;
    sendPhoneOtp(req.body.phone).then((resp) => {
      res.redirect("/otp");
    });
  },


  otpGet: async (req, res) => {
    res.render("otp", { errors: err });
  },


  otpPost: async (req, res) => {
    const { otp } = req.body;
    const phone = req.session.phone;

    try {
      if (verifyPhoneOtp(phone, otp)) {
        res.redirect("/");
      } else {
        res.render("otp", { errors: "Invalid OTP" });
      }

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
    const phone = req.session.phone;
    try {
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
      const email = req.body.email;
      emailverification(email, otp);

      const user = await User.findOne({ email: email });
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
      const inputOtp = req.body.inputOtp;

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
      const userId = req.session.userId;
      const { password, confirmPassword } = req.body;

      if (!password || !confirmPassword) {
        return res.render("newPassword", {
          error: "Both password fields are required",
        });
      }
      if (password !== confirmPassword) {
        return res.render("newPassword", { error: "Passwords do not match" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(userId, { password: hashedPassword });

      res.render("newPassword", { success: "Password updated successfully" });

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
