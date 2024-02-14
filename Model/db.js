const mongoose=require('mongoose')
const mongoUrl="mongodb://localhost:27017/eCommerce"

//Database Connection
const startMongoServer=async()=>{
    try{
        await mongoose.connect(mongoUrl)
        console.log("Database connected");
    }catch(err){
        console.log("Not connected"+ err);
    }
}


//User Schema(users collection)
const signupSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:Boolean,
        default:false
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    otpVerified:{
      type:Boolean,
      default:false,
      required:true
    }
})


//Profile Schema(profiles collection)
const profileSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Types.ObjectId,  
    },
    dob:{
        type:String,
        required:true
    },
      gender:{
        type:String,
        required:true
      },
      alternateMobile:{
        type:Number,
        required:true
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
  });

  

//Address Schema(addresses collection)
const addressSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
  },
  username: {
      type: String,
      required: true
  },
  addresses: [{
      houseNumber: {
          type: String,
          required: true
      },
      locality: {
          type: String,
          required: true
      },
      city: {
          type: String,
          required: true
      },
      state: {
          type: String,
          required: true
      },
      pinCode: {
          type: Number,
          required: true
      }
  }]
});

//Product Schema(products collection)
const productSchema = new mongoose.Schema({
    imageUrls: [{
      type: String,
      required: true,
    }],
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required:true
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    ogPrice: {
      type: Number,
      required:true
    },
  });


//Banner Schema(banners collection)
const bannerSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  content:{
    type:String
  }
});


//Coupon Schema(coupons collection)
const couponSchema=new mongoose.Schema({
  couponCode:{
    type:String,
    required:true,
  },
  discount:{
    type:String,
    required:true,
    },
  conditions:{
    type:String,
    required:true
  },
  expiry:{
    type:String,
    required:true,
  }
});


//Wishlist Schema(wishlists collection)
const wishlistSchema=new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
  }],
});


//Cart Schema(carts collection)
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    ogPrice: {
      type: Number,
      required: true,
    },
  }],
  totalPrice: {
    type: Number,
    required: true,
  },
  totalOgPrice: {
    type: Number,
    required: true,
  },
  discount:{
    type:Number,
    required:true,
  },
});
  

module.exports = {
    User: mongoose.model('users', signupSchema),
    Profile:mongoose.model('profiles',profileSchema),
    Address:mongoose.model('addresses',addressSchema),
    Product:mongoose.model('products',productSchema),
    Banner:mongoose.model('banners',bannerSchema),
    Coupon:mongoose.model('coupons',couponSchema),
    Wishlist:mongoose.model('wishlists',wishlistSchema),
    Cart:mongoose.model('carts',cartSchema),
    startMongoServer
};
