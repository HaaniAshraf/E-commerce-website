const mongoose=require('mongoose')
const { ObjectId } = require('mongoose').Types;
const { User,Profile,Address,Product,Banner,Coupon,Wishlist,Cart } = require('../Model/db');


module.exports={

  userhomeGet: async (req, res) => {
    try {
        const banners = await Banner.find();
        const homeProducts = await Product.find({ category: 'home' });
        let userWishlist = null;
        let wishlistCount = 0;
        if (req.session.email) {
            try {
                const userId = req.session.user.userId;
                userWishlist = await Wishlist.findOne({ user: userId });
                if (userWishlist) {
                    wishlistCount = userWishlist.products.length;
                }
            } catch (error) {
                console.error('Error fetching userWishlist:', error);
                res.status(500).send('Internal Server Error');
                return;
            }
        }
        res.render('userHome', { banners, products: homeProducts, userWishlist, wishlistCount });
      } catch (error) {
        console.error('Error fetching homeProducts:', error);
        res.status(500).send('Internal Server Error');
      }
    },


    profileGet:async(req,res)=>{
      if (!req.session.email) {
        return res.redirect('/login');
      }
      try {     
        const dynamicTitle = 'Profile';
        const userId = req.session.user.userId;
        const userProfile = await Profile.findOne({ userId });
        if (userProfile) {
          return res.render('profile', { user: userProfile,title:dynamicTitle });
        }
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).send('User not found');
        }
            res.render('profile', { user ,title:dynamicTitle});
      } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).send('Internal Server Error');
      }
    },


    profilePost:async(req,res)=>{
      try {
        const userId = req.session.user.userId; 
        const { name, email, phone, dob, gender, alternateMobile } = req.body;
            await Profile.findOneAndUpdate(
          { userId },
          { name, email, phone, dob, gender, alternateMobile },
          { upsert: true, new: true }
        );
        res.send('<script>alert("Your Profile is Updated"); window.location="/profile";</script>')
      } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).send('Internal Server Error');
      }
    },


    privacyGet:async(req,res)=>{
      const dynamicTitle = 'Privacy';
      res.render('privacy',{title:dynamicTitle})
    },


    addressGet:async(req,res)=>{
      try {
        const dynamicTitle = 'Address';
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/login');
        }
        const username = user.name;
        const userAddresses = await Address.find({ userId: req.session.userId });
        res.render('address', { username, userAddresses, title:dynamicTitle});
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).send('Internal Server Error');
    }
    },


    addressAddPost:async(req,res)=>{
      const { houseNumber, locality, city, state, pinCode } = req.body;
    try {
        const user = await User.findById(req.session.userId);
        const username = user.name;
        const newAddress = new Address({
            userId: req.session.userId,
            username: username,
            houseNumber: houseNumber,
            locality: locality,
            city: city,
            state: state,
            pinCode: pinCode,
        });
        await newAddress.save();
        res.redirect('/address');
    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).send('Internal Server Error');
    }
    },


    addressRemove:async(req,res)=>{
      const addressId = req.params.addressId;
      try {
        const removedAddress = await Address.findByIdAndDelete(addressId);
    
        if (!removedAddress) {
          return res.status(404).send('Address not found');
        }
            res.redirect('/address');
      } catch (error) {
        console.error('Error removing address:', error);
        res.status(500).send('Internal Server Error');
      }
    },


    couponGet:async(req,res)=>{
      const dynamicTitle = 'Coupons';
      try {
        const coupons = await Coupon.find();
            res.render('coupon', { coupons,title:dynamicTitle });
      } catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).send('Internal Server Error');
      }    
    },


    menSectionGet:async(req,res)=>{
      try {
        const menProducts = await Product.find({ category: 'mens' });
        let userWishlist = null;
        let wishlistCount = 0;
        if (req.session.email) {
          try {
              const userId = req.session.user.userId;
              userWishlist = await Wishlist.findOne({ user: userId });
              if (userWishlist) {
                  wishlistCount = userWishlist.products.length;
              }
          } catch (error) {
              console.error('Error fetching userWishlist:', error);
              res.status(500).send('Internal Server Error');
              return;
          }
      }
        res.render('menSection', { products: menProducts, userWishlist, wishlistCount });
    } catch (error) {
        console.error('Error fetching mencategory products:', error);
        res.status(500).send('Internal Server Error');
     }  
     },


    womenSectionGet:async(req,res)=>{
      try {
        const womenProducts = await Product.find({ category: 'womens' });
        let userWishlist = null;
        let wishlistCount = 0;
        if (req.session.email) {
          try {
              const userId = req.session.user.userId;
              userWishlist = await Wishlist.findOne({ user: userId });
              if (userWishlist) {
                  wishlistCount = userWishlist.products.length;
              }
          } catch (error) {
              console.error('Error fetching userWishlist:', error);
              res.status(500).send('Internal Server Error');
              return;
          }
        }
        res.render('womenSection', { products: womenProducts, userWishlist, wishlistCount });
        } catch (error) {
        console.error('Error fetching womencategory products:', error);
        res.status(500).send('Internal Server Error');
     }  
    },


    jewelrySectionGet:async(req,res)=>{
      try {
        const jewelryProducts = await Product.find({ category: 'jewelry' });
        let userWishlist = null;
        let wishlistCount = 0;
        if (req.session.email) {
          try {
              const userId = req.session.user.userId;
              userWishlist = await Wishlist.findOne({ user: userId });
              if (userWishlist) {
                  wishlistCount = userWishlist.products.length;
              }
          } catch (error) {
              console.error('Error fetching userWishlist:', error);
              res.status(500).send('Internal Server Error');
              return;
          }
        }
        res.render('jewelrySection', { products: jewelryProducts, userWishlist, wishlistCount });
    } catch (error) {
        console.error('Error fetching jewelrycategory products:', error);
        res.status(500).send('Internal Server Error');
     }  
     },


    perfumeSectionGet:async(req,res)=>{
      try {
        const perfumeProducts = await Product.find({ category: 'perfume' });
        let userWishlist = null;
        let wishlistCount = 0;
        if (req.session.email) {
          try {
              const userId = req.session.user.userId;
              userWishlist = await Wishlist.findOne({ user: userId });
              if (userWishlist) {
                  wishlistCount = userWishlist.products.length;
              }
          } catch (error) {
              console.error('Error fetching userWishlist:', error);
              res.status(500).send('Internal Server Error');
              return;
          }
        }
        res.render('perfumeSection', { products: perfumeProducts, userWishlist, wishlistCount });
    } catch (error) {
        console.error('Error fetching perfumecategory products:', error);
        res.status(500).send('Internal Server Error');
     }  
    },


    electronicSectionGet:async(req,res)=>{
      try {
        const electronicProducts = await Product.find({ category: 'electronics' });
        let userWishlist = null;
        let wishlistCount = 0;
        if (req.session.email) {
          try {
              const userId = req.session.user.userId;
              userWishlist = await Wishlist.findOne({ user: userId });
              if (userWishlist) {
                  wishlistCount = userWishlist.products.length;
              }
          } catch (error) {
              console.error('Error fetching userWishlist:', error);
              res.status(500).send('Internal Server Error');
              return;
          }
        }
        res.render('electronicSection', { products: electronicProducts, userWishlist, wishlistCount });
    } catch (error) {
        console.error('Error fetching electroniccategory products:', error);
        res.status(500).send('Internal Server Error');
     }  
     },


     wishlistGet: async (req, res) => {
      if (req.session.email) {
          try {
              const dynamicTitle = 'Wishlist';
              const userId = req.session.user.userId;
              const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
              if (!wishlist) {
                  res.render('wishlist', { wishlistProducts: [], title: dynamicTitle,wishlistCount });
                  return;
              }
              let wishlistCount = 0;
              if (wishlist) {
                  wishlistCount = wishlist.products.length;
              }      
              res.render('wishlist', { wishlistProducts: wishlist.products, title: dynamicTitle ,wishlistCount});
          } catch (error) {
              console.error('Error fetching wishlist:', error);
              res.status(500).json({ error: 'Internal Server Error' });
          }
        } else {
          res.redirect('/login');
        }
      },
  

  wishlistToggle: async (req, res) => {
    if (req.session.email) {
        try {
            const productId = req.params.productId;
            const userId = req.session.user.userId;
            let wishlist = await Wishlist.findOne({ user: userId });
            if (!wishlist) {
                wishlist = new Wishlist({ user: userId, products: [] });
            }
            const { isRedColor } = req.body;
            const shouldRemove = isRedColor === 'true';
            if (shouldRemove) {
                wishlist.products.pull(productId);
            } else {
                wishlist.products.push(productId);
            }
            await wishlist.save();
            res.status(200).json({ success: true }); // Respond with JSON
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(401).json({ error: 'User not authenticated' }); // Respond with JSON
    }
    },


     wishlistCount: async (req, res) => {
      if(req.session.email){
        try {
          const userId = req.session.user.userId;
          const userWishlist = await Wishlist.findOne({ user: userId });
          const wishlistCount = userWishlist ? userWishlist.products.length : 0;
          res.json({ wishlistCount });
      } catch (error) {
          console.error('Error fetching wishlist count:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
      }else{
        res.redirect('/login'); 
        }     
     },


     addToWishlist:async(req,res)=>{
      if(req.session.email){
        try{
          const productId=req.params.productId;
          const userId=req.session.user.userId;
          const wishlist = await Wishlist.findOne({ user: userId });
          if (wishlist.products.includes(productId)) {
            return res.redirect('/wishlist');
          }
          else{
            wishlist.products.push(productId);
            await wishlist.save();
            res.redirect('/wishlist');
        }
      }catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
     }else{
      res.redirect('/login')
     }
    },


     removeFromWishist:async(req,res)=>{
      if (req.session.email) {
        try {
            const productId = req.params.productId;
            const userId = req.session.user.userId;
            const wishlist = await Wishlist.findOne({ user: userId });
            if (wishlist) {
                wishlist.products.pull(productId);
                await wishlist.save();
                res.redirect('/wishlist'); 
            } else {
                res.status(404).send('Wishlist not found');
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            res.status(500).send('Internal Server Error');
        }
     }
    },


     cartGet : async (req, res) => {
      if(req.session.email){
        try {
          const dynamicTitle = 'Cart';
          const userId = req.session.user.userId;
          const cartItems = await Cart.find({ userId })
            .populate('productId')
            .exec();   
          if (cartItems.length === 0) {
            return res.render('cart', { cart: null ,title: dynamicTitle});
          }
            const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
            const cart = {
            items: cartItems,
            totalPrice: totalPrice.toFixed(2), 
          };   
          res.render('cart', { cart,title: dynamicTitle });
        } catch (error) {
          console.error('Error fetching cart:', error);
          res.status(500).send('Internal Server Error');
        }
      }else{
        res.redirect('/login')
      }     
    },


    productDetailsGet:async(req,res)=>{
      const dynamicTitle = 'Product Details';
      const productId = req.params.productId;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.render('productDetails', { product,title:dynamicTitle });
    } catch (error) {
        console.error('Error fetching product details:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
    },

        
}