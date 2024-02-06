const mongoose=require('mongoose')
const { ObjectId } = require('mongoose').Types;
const { User,Profile,Address,Product,Banner,Coupon,Wishlist,Cart } = require('../Model/db');


module.exports={

  userhomeGet: async (req, res) => {
    try {
        const banners = await Banner.find();
        const homeProducts = await Product.find({ category: 'home' });
        let userWishlist = null;
        if (req.session.email) {
            try {
                const userId = req.session.user.userId;
                userWishlist = await Wishlist.findOne({ user: userId });
            } catch (error) {
                console.error('Error fetching userWishlist:', error);
                res.status(500).send('Internal Server Error');
                return; 
            }
        }
        res.render('userHome', { banners, products: homeProducts, userWishlist });
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
            res.render('profile', { user });
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
        res.render('menSection', { products: menProducts });
    } catch (error) {
        console.error('Error fetching mencategory products:', error);
        res.status(500).send('Internal Server Error');
     }  
     },


    womenSectionGet:async(req,res)=>{
      try {
        const womenProducts = await Product.find({ category: 'womens' });
        res.render('womenSection', { products: womenProducts });
    } catch (error) {
        console.error('Error fetching womencategory products:', error);
        res.status(500).send('Internal Server Error');
     }  
    },


    jewelrySectionGet:async(req,res)=>{
      try {
        const jewelryProducts = await Product.find({ category: 'jewelry' });
        res.render('jewelrySection', { products: jewelryProducts });
    } catch (error) {
        console.error('Error fetching jewelrycategory products:', error);
        res.status(500).send('Internal Server Error');
     }  
     },


    perfumeSectionGet:async(req,res)=>{
      try {
        const perfumeProducts = await Product.find({ category: 'perfume' });
        res.render('perfumeSection', { products: perfumeProducts });
    } catch (error) {
        console.error('Error fetching perfumecategory products:', error);
        res.status(500).send('Internal Server Error');
     }  
    },


    electronicSectionGet:async(req,res)=>{
      try {
        const electronicProducts = await Product.find({ category: 'electronics' });
        res.render('electronicSection', { products: electronicProducts });
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
                  res.render('wishlist', { wishlistProducts: [], title: dynamicTitle });
                  return;
              }
              res.render('wishlist', { wishlistProducts: wishlist.products, title: dynamicTitle });
          } catch (error) {
              console.error('Error fetching wishlist:', error);
              res.status(500).json({ error: 'Internal Server Error' });
          }
      } else {
          res.redirect('/login');
      }
  },
  


      addToWishlist: async (req, res) => {
        if(req.session.email){
          try {
            const productId = req.params.productId;
            const userId = req.session.user.userId;
            let wishlist = await Wishlist.findOne({ user: userId });
            if (!wishlist) {
                wishlist = new Wishlist({ user: userId, products: [] });
            }
            if (!wishlist.products.includes(productId) && mongoose.isValidObjectId(productId)) {
                wishlist.products.push(productId);
                await wishlist.save();
                res.redirect('/')
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        }else{
          res.redirect('/login')
        }       
    },
    

    removeFromWishlist: async (req, res) => {
      try {
          const productId = req.params.productId;
          const userId = req.session.user.userId;
          const source = req.body.source;
  
          console.log('Removing product with ID:', productId);
          console.log('User ID:', userId);
          console.log('Source:', source);
  
          let wishlist = await Wishlist.findOne({ user: userId });
  
          console.log('Wishlist:', wishlist);
  
          if (wishlist) {
            await Wishlist.findOneAndUpdate(
              { user: userId },
              { $pull: { products: productId } },
              { new: true } 
           );
           wishlist = await Wishlist.findOne({ user: userId });
             console.log('Wishlist after removal:', wishlist);
             if (source === 'userhome') {
              res.redirect('/'); 
          } else if (source === 'wishlist') {
              res.redirect('/wishlist'); 
          } else {
              res.redirect('/'); 
          }  
          return;
          } else {
              res.status(404).json({ error: 'Wishlist not found' });
          }
      } catch (error) {
          console.error('Error removing from wishlist:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  },
  

     cartGet : async (req, res) => {
      try {
        const userId = req.session.user.userId;
        const cartItems = await Cart.find({ userId })
          .populate('productId')
          .exec();   
        if (cartItems.length === 0) {
          return res.render('cart', { cart: null });
        }
          const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
          const cart = {
          items: cartItems,
          totalPrice: totalPrice.toFixed(2), 
        };   
        res.render('cart', { cart });
      } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send('Internal Server Error');
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