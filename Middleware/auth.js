const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const { User } = require("../Model/db");
const bcrypt = require("bcrypt"); //password hashing
const { emit } = require("nodemon");
const { ObjectId } = require("mongoose").Types;


const logVerify = async (req, res, next) => {
  // Extract email and password from the request body
  const email = req.body.email;
  const enteredPassword = req.body.password;
  // Check if email and password are provided
  if (!email || !enteredPassword) {
    err = "Both email and password are required";
    return res.redirect("/login");
  }

  try {
    // Find the user with the provided email
    const user = await User.findOne({ email: email });
    // Check if the user exists
    if (!user) {
      return res.render("login", { error: "User not found" });
    }
    // Compare entered password with hashed password in the database
    const passwordMatch = await bcrypt.compare(enteredPassword, user.password);
    // Check if passwords match
    if (!passwordMatch) {
      return res.render("login", { error: "Incorrect password" });
    }
    // Store the user's ObjectId in the session
    req.session.userId = new ObjectId(user._id);
    next();

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
};


const signVerify = async (req, res, next) => {
  // Extract user registration data from the request body
  const { username, email, phone, password, confirmPassword } = req.body;
  // Check if all required fields are provided
  if (!username || !email || !phone || !password || !confirmPassword) {
    err = "All fields are required";
    return res.redirect("/signup");
  }
  // Check if the entered passwords match
  if (password !== confirmPassword) {
    return res.render("signup", { error: "Passwords do not match" });
  }
  // Check if the password satisfies the defined regex conditions.
  if (!passwordRegex.test(password)) {
    return res.render("signup", { error: "Invalid password format" });
  }

  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.render("signup", { error: "User already exists" });
    }
    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the provided data
    const data = {
      name: username,
      email: email,
      phone: phone,
      password: hashedPassword,
    };
    const newUser = await User.create(data);
    
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).send("Internal Server Error");
  }
  next();
};

module.exports = { logVerify, signVerify };