const mongoose = require("mongoose");

require("dotenv").config();
const mongoUrl = process.env.mongoUrl;

//Database Connection
const startMongoServer = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Database connected");
  } catch (err) {
    console.log("Not connected" + err);
  }
};


//User Schema(users collection)
const signupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  otpVerified: {
    type: Boolean,
    default: false,
    required: true,
  },
  status: {
    type: String,
    default: "active",
  },
});


//Profile Schema(profiles collection)
const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "users",
  },
  dob: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  alternateMobile: {
    type: Number,
    required: true,
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
    ref: "users",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  addresses: [
    {
      houseNumber: {
        type: String,
        required: true,
      },
      locality: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pinCode: {
        type: Number,
        required: true,
      },
    },
  ],
});


//Product Schema(products collection)
const productSchema = new mongoose.Schema({
  imageUrls: [
    {
      type: String,
      required: true,
    },
  ],
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
    required: true,
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
    required: true,
  },
});


//Banner Schema(banners collection)
const bannerSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
});


//Coupon Schema(coupons collection)
const couponSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    required: true,
  },
  discount: {
    type: String,
    required: true,
  },
  conditions: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
});


//Wishlist Schema(wishlists collection)
const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
  ],
});


//Cart Schema(carts collection)
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
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
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  totalOgPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  discount: {
    type: Number,
    required: true,
    default: 0,
  },
  totalOrderAmount: {
    type: Number,
    default: true,
  },
});


// Order Schema(orders collection)
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  totalOrderAmount: {
    type: Number,
    default: true,
  },
  deliveryAddress: {
    houseNumber: {
      type: String,
    },
    locality: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pinCode: {
      type: Number,
    },
  },
  orderedDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,
  },
  orderStatus: {
    type: String,
    default: "Pending",
  },
  cancelReason: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
});


// Review Schema(reviews collection)
const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      review: {
        type: String,
      },
      rating: {
        type: Number,
      },
      postedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});


module.exports = {
  User: mongoose.model("users", signupSchema),
  Profile: mongoose.model("profiles", profileSchema),
  Address: mongoose.model("addresses", addressSchema),
  Product: mongoose.model("products", productSchema),
  Banner: mongoose.model("banners", bannerSchema),
  Coupon: mongoose.model("coupons", couponSchema),
  Wishlist: mongoose.model("wishlists", wishlistSchema),
  Cart: mongoose.model("carts", cartSchema),
  Order: mongoose.model("orders", orderSchema),
  Review: mongoose.model("reviews", reviewSchema),
  startMongoServer,
};
