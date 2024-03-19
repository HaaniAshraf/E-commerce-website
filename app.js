//Libraries
const express=require('express')
const session = require('express-session');
const cache=require('nocache')      //to disable client-side caching.

//Flash
const flash=require('express-flash')

//Routers
const mainRouter=require('./Routers/mainRouter')
const userRouter=require('./Routers/userRouter')
const profileRouter=require('./Routers/profileRouter')
const adminRouter=require('./Routers/adminRouter')
const productRouter=require('./Routers/productRouter')
const bannerRouter=require('./Routers/bannerRouter')
const couponRouter=require('./Routers/couponRouter')
const wishlistRouter=require('./Routers/wishlistRouter')
const cartRouter=require('./Routers/cartRouter')
const orderRouter=require('./Routers/orderRouter')

//Database model
const { startMongoServer } = require('./Model/db');

//Database connection
startMongoServer()

//Express app configuration
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//dotenv library    
require('dotenv').config()
const port = process.env.PORT||3000;
const secret=process.env.secret

//Session configuration
app.use(session({
    secret: 'Damn',
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());

//Caching Middleware and Static Files
app.use(cache())
app.use(express.static('public'));

//Setting View Engine and Routes
app.set('view engine','ejs')
app.set('views',"views" )

app.use('/',mainRouter)
app.use('/',userRouter)
app.use('/',profileRouter)
app.use('/',adminRouter)
app.use('/',productRouter)
app.use('/',bannerRouter)
app.use('/',couponRouter)
app.use('/',wishlistRouter)
app.use('/',cartRouter)
app.use('/',orderRouter)


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });



