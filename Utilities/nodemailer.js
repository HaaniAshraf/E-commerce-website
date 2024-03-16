const nodemailer = require("nodemailer");

// Define a function for sending email verification
const emailverification = (email, otp) => {
  // Create a nodemailer transporter with Gmail service
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  // Define the email options
  const mailOption = {
    from: {
      name: "Verification",
      address: "carlodon372@gmail.com",
    },
    to: email,
    subject: "Reset Password",
    text: `Your OTP is ${otp}`,
  };

  // Define an async function to send the email
  const sendMail = async (transporter, mailOption) => {
    try {
      // Use the transporter to send the email with specified mail options
      await transporter.sendMail(mailOption);
    } 
    catch (error) {
      console.log(Error`occurred while sending email: ${error}`);
    }
  };
  // Call the sendMail function with the transporter and mail options
  sendMail(transporter, mailOption);
};

module.exports = { emailverification };