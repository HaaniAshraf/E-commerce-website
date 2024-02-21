const mongoose=require('mongoose')
const { User } = require('../Model/db');
const { ObjectId } = require('mongoose').Types;

const {sendPhoneOtp,verifyPhoneOtp,resendPhoneOtp}=require('../Utilities/twilio')

const serviceSID="VA8012a02709508a14ff3d218ca1551f98"
const accountSID="AC21860c8e1af91a58babe5e8d041c8819"
const authToken="e7cb6710d30101baa75cd7e8b718a2b8"
const client=require('twilio')(accountSID,authToken)

let err = ""; 

module.exports={

    headerGet:async(req, res) => {
        try{
            res.render('mainHeader');                 
        }catch(error){
          console.error('Error fetching products:', error);
          res.status(500).send('Internal Server Error');
        }
        },


        proHeadGet:async(req, res) => {
          try{
              res.render('profileHeader');                 
          }catch(error){
            console.error('Error fetching products:', error);
            res.status(500).send('Internal Server Error');
          }
          },


        loginGet:(req, res) => {
            if (req.session.email) {
              res.redirect("/");
            } else {
              res.render("login", { error: err });
            }     
            err = "";
          },      
        

          loginPost:async (req, res) => {
            const email = req.body.email;
            const user = await User.findOne({ email: email });
            if (!user.otpVerified) {
              return res.render('login', { error: 'User not verified.Please Signup and verify' });
          }
            if (user.role) {
              req.session.role = user.role
              res.redirect('/adminHome');
          } else {
            req.session.email = user.email;
            req.session.user={userId:user._id}
              res.redirect('/');
          }
      },


      logoutPost: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            res.json({ success: true, message: 'Logout successful' });
        });
    },
    
    
      signupGet: (req, res) => {
        if(req.session.email){
          res.redirect('/')
        }
        else{
          res.render('signup', { error: err });
        }
        err=""
      },
      

      signupPost:async(req,res) => {   
        const defaultRole = 'user';   
        req.session.role = defaultRole; 
        req.session.phone=req.body.phone
        sendPhoneOtp(req.body.phone)
        .then((resp)=>{
          res.redirect('/otp');
        })
      },


      otpGet:async(req,res)=>{
        res.render('otp',{errors:err})
      },


      otpPost: async (req, res) => {
        const { otp } = req.body;
        const phone=req.session.phone
        try {   
            if(verifyPhoneOtp(phone,otp)){
              res.redirect('/');
            }else {
              res.render('otp', { errors: 'Invalid OTP' });
          }
        } catch (error) {
            console.error('Error during OTP verification:', error);
            res.status(500).send('Internal Server Error');
        }
    },


    resendPost:async(req,res)=>{
      const phone = req.session.phone;
      try {
        resendPhoneOtp(phone)
        res.render('otp',{errors:err});
    } catch (err) {
        console.error(err);
        res.json({ message: 'Error' });
    }
    },
    

}