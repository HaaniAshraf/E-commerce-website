const nodemailer = require('nodemailer');
const { User } = require('../Model/db');


const emailverification=(email,otp)=>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER,
          pass: process.env.APP_PASSWORD,
        },
      });

      const mailOption = {
        from: {
          name: "Verification",
          address: "carlodon372@gmail.com",
        },
        to: email,
        subject: "Reset Password",
        text: `Your OTP is ${otp}`,
      };

      const sendMail = async (transporter, mailOption) => {
        try {
          await transporter.sendMail(mailOption);
          // console.log("Mail has been sent successfully");
        } catch (error) {
          console.log(Error`occurred while sending email: ${error}`);
        }
      };
      sendMail(transporter, mailOption)
    }


module.exports={emailverification}