const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const { User } = require("../Model/db");
const bcrypt = require('bcrypt');   //password hashing
const { emit } = require("nodemon");
const { ObjectId } = require('mongoose').Types;


const logVerify=async(req,res,next)=>{
    const email = req.body.email;
    const enteredPassword = req.body.password;   
    if (!email || !enteredPassword) {
        err = "Both email and password are required";
        return res.redirect("/login");
      }
     try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.render("login", { error: "User not found" });
        }
        const passwordMatch = await bcrypt.compare(enteredPassword, user.password);
        if (!passwordMatch) {
            return res.render("login", { error: "Incorrect password" });
        }
        req.session.userId=new ObjectId(user._id)
        next()
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
}


const signVerify=async(req,res,next)=>{
    const { username, email, phone, password, confirmPassword } = req.body;
    if (!username || !email || !phone || !password || !confirmPassword) {
        err= 'All fields are required' 
        return res.redirect('/signup');
      } 
    if (password !== confirmPassword) {
        return res.render("signup", { error: "Passwords do not match" });
      }
    if (!passwordRegex.test(password)) {
        return res.render("signup", { error: "Invalid password format" });
    }
try{
    const existingUser=await User.findOne({email:email})
    if(existingUser){
        return res.render("signup",{error:"User already exists"})
    }   
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = {
      name: username,
      email: email,
      phone: phone,
      password: hashedPassword,
  };
  const newUser = await User.create(data);
  console.log(newUser);
}catch(error){
    console.error("Error during user registration:", error);
    res.status(500).send("Internal Server Error");
}
next()
}



module.exports={logVerify,signVerify}