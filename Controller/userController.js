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
        let userCart = null;
        let cartCount=0

        if (req.session.email) {
            try {
                const userId = req.session.user.userId;
                userWishlist = await Wishlist.findOne({ user: userId });
                if (userWishlist) {
                    wishlistCount = userWishlist.products.length;
                }
                userCart = await Cart.findOne({ user: userId });
                if (userCart) {
                  cartCount = userCart.products.length;
              }

            } catch (error) {
                res.status(500).send('Internal Server Error');
                return;
            }
        }
        res.render('userHome', { banners, products: homeProducts, userWishlist, wishlistCount,userCart,cartCount });

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




    profilePost: async (req, res) => {
      try {
        const userId = req.session.user.userId;
        const { name, email, phone, dob, gender, alternateMobile } = req.body;
        const updatedProfile = await Profile.findOneAndUpdate(
          { userId },
          { name, email, phone, dob, gender, alternateMobile },
          { upsert: true, new: true }
        );

        if (!updatedProfile) {
          console.error('Profile not found or not updated.');
          return res.status(404).send('Profile not found or not updated.');
        }    
        res.json({ message: 'Profile updated successfully', redirectUrl: '/profile' });

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
        let address=await Address.findOne({userId:user._id})

        if (!address) {
          let newAddress = new Address({
            userId: user._id,
            username:user.name,
            addresses: []
          });
          await newAddress.save();   
          address = newAddress;
        }   

        const newAddress = {
          houseNumber: houseNumber,
          locality: locality,
          city: city,
          state: state,
          pinCode: pinCode,
        };
        address.addresses.push(newAddress);
        await address.save();
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
        let userCart = null;
        let cartCount = 0;

        if (req.session.email) {
          try {
              const userId = req.session.user.userId;
              userWishlist = await Wishlist.findOne({ user: userId });
              userCart = await Cart.findOne({ user: userId });
              if (userWishlist) {
                  wishlistCount = userWishlist.products.length;
              }
              if (userCart) {
                  wishlistCount = userCart.products.length;
              }

          } catch (error) {
              res.status(500).send('Internal Server Error');
              return;
          }
      }
        res.render('menSection', { products: menProducts, userWishlist, wishlistCount, userCart, cartCount });

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
        let userCart = null;
        let cartCount = 0;

        if (req.session.email) {
          try {
              const userId = req.session.user.userId;
              userWishlist = await Wishlist.findOne({ user: userId });
              userCart = await Cart.findOne({ user: userId });

              if (userWishlist) {
                  wishlistCount = userWishlist.products.length;
              }
              if (userCart) {
                cartCount = userCart.products.length;
            }
          } catch (error) {
              res.status(500).send('Internal Server Error');
              return;
          }
        }
        res.render('womenSection', { products: womenProducts, userWishlist, wishlistCount, userCart, cartCount });

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
        let userCart = null;
        let cartCount = 0;

        if (req.session.email) {
          try {
              const userId = req.session.user.userId;
              userWishlist = await Wishlist.findOne({ user: userId });
              userCart = await Cart.findOne({ user: userId });

              if (userWishlist) {
                  wishlistCount = userWishlist.products.length;
              }
              if (userCart) {
                cartCount = userCart.products.length;
            }
          } catch (error) {
              res.status(500).send('Internal Server Error');
              return;
          }
        }
        res.render('jewelrySection', { products: jewelryProducts, userWishlist, wishlistCount, userCart, cartCount });

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
        let userCart = null;
        let cartCount = 0;

        if (req.session.email) {
          try {
              const userId = req.session.user.userId;
              userWishlist = await Wishlist.findOne({ user: userId });
              userCart = await Cart.findOne({ user: userId });

              if (userWishlist) {
                  wishlistCount = userWishlist.products.length;
              }
              if (userCart) {
                cartCount = userCart.products.length;
            }
          } catch (error) {
              res.status(500).send('Internal Server Error');
              return;
          }
        }
        res.render('perfumeSection', { products: perfumeProducts, userWishlist, wishlistCount, userCart, cartCount });

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
        let userCart = null;
        let cartCount = 0;

        if (req.session.email) {
          try {
              const userId = req.session.user.userId;
              userWishlist = await Wishlist.findOne({ user: userId });
              userCart = await Cart.findOne({ user: userId });

              if (userWishlist) {
                  wishlistCount = userWishlist.products.length;
              }
              if (userCart) {
                cartCount = userCart.products.length;
            }
          } catch (error) {
              res.status(500).send('Internal Server Error');
              return;
          }
        }
        res.render('electronicSection', { products: electronicProducts, userWishlist, wishlistCount, userCart, cartCount });

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
              let wishlistCount = 0;
              if (!wishlist) {
                res.render('wishlist', { wishlistProducts: [], title: dynamicTitle,wishlistCount });
                return;
            }
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
            res.status(200).json({ success: true }); 
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(401).json({ error: 'User not authenticated' }); 
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
          let wishlist = await Wishlist.findOne({ user: userId });
          if (!wishlist) {
            wishlist = new Wishlist({ user: userId, products: [] });
        }
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




    cartGet: async (req, res) => {
      if (req.session.email) {
        try {
          const dynamicTitle = 'Cart';
          const userId = req.session.user.userId;
          const userCart = await Cart.findOne({ user: userId }).populate('products.product');   
          const userAddresses = await Address.find({ userId });
          const coupon = await Coupon.find()

          if (!userCart) {
            res.render('cart', { cart: [], title: dynamicTitle, coupon });
            return;
          }
          res.render('cart', { cart: userCart, userAddresses: userAddresses, title: dynamicTitle, coupon });
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
      } else {
        res.redirect('/login');
      }
    },




    cartCount: async (req, res) => {
      if(req.session.email){
        try {
          const userId = req.session.user.userId;
          let userCart = await Cart.findOne({ user: userId });    
          const cartCount = userCart ? userCart.products.length : 0;
          res.json({ 
            success: true,
            cartCount: cartCount
          });
      } catch (error) {
          console.error('Error fetching cart count:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
      }else{
        res.redirect('/login'); 
        }     
     },
    
    


    addToCart: async (req, res) => {
      if (req.session.email) {
        try {
          const productId = req.params.productId;
          const userId = req.session.user.userId;
          let userCart = await Cart.findOne({ user: userId });    
          if (!userCart) {
            userCart = new Cart({ user: userId, products: [], totalPrice: 0 });
          }   

          const existingProduct = userCart.products.find((item) => item.product.equals(productId));
          let product;   
          if (existingProduct) {
            product = await Product.findById(productId);   
            if (!product) {
              return res.status(404).send('Product not found');
            }   

            existingProduct.quantity += 1;
            existingProduct.price = product.price * existingProduct.quantity;
            existingProduct.ogPrice = product.ogPrice * existingProduct.quantity;

          } else {
            product = await Product.findById(productId);   
            if (!product) {
              return res.status(404).send('Product not found');
            }   

            userCart.products.push({
              product: productId,
              quantity: 1,
              price: product.price, 
              ogPrice:product.ogPrice,
              discount:product.discount
            });
          } 

          userCart.totalPrice = userCart.products.reduce((total, item) => {
            return total + item.price;
          }, 0);         
          userCart.totalOgPrice = userCart.products.reduce((total, item) => {
            return total + item.ogPrice;
          }, 0);         
          userCart.discount=userCart.totalOgPrice-userCart.totalPrice
          userCart.totalOrderAmount=userCart.totalPrice.toFixed()

          await userCart.save();
          res.redirect('/cart');
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
      } else {
        res.redirect('/login');
      }
    },




    updateCart: async (req, res) => {
      try {
          const userId = req.session.user.userId;
          const itemId = req.body.itemId;
          const quantity = req.body.quantity;
          const finalPrice = req.body.finalPrice;
          const finalOgPrice = req.body.finalOgPrice;
  
          let userCart = await Cart.findOne({ user: userId });
          if (userCart) {
              const cartItem = userCart.products.find(item => item._id.toString() === itemId);
              if (cartItem) {
                  cartItem.quantity = quantity;
                  cartItem.price = finalPrice;
                  cartItem.ogPrice = finalOgPrice;
  
                  userCart.totalPrice = userCart.products.reduce((total, item) => total + item.price, 0);
                  userCart.totalOgPrice = userCart.products.reduce((total, item) => total + item.ogPrice, 0);
                  userCart.discount = userCart.totalOgPrice - userCart.totalPrice;
                  userCart.totalOrderAmount=userCart.totalPrice.toFixed()
  
                  await userCart.save();
                  res.json({
                      success: true,
                      totalPrice: userCart.totalPrice,
                      totalOgPrice: userCart.totalOgPrice,
                      discount: userCart.discount,
                      totalOrderAmount: userCart.totalOrderAmount,
                  });
              } else {
                  res.status(404).send('Item not found in the cart');
              }
          } else {
              res.status(404).send('Cart not found');
          }
  
      } catch (error) {
          console.error('Error updating cart item:', error);
          res.status(500).send('Internal Server Error');
      }
    },
  



    removeFromCart: async (req, res) => {
      try {
          const userId = req.session.user.userId;
          const productId = req.params.productId;
          const userCart = await Cart.findOne({ user: userId });
    
          if (userCart) {
            const productToRemove = userCart.products.find(product => product._id.toString() === productId);

            if (productToRemove) {
              userCart.products = userCart.products.filter(product => product._id.toString() !== productId);          
              userCart.totalPrice = 0;
              userCart.totalOgPrice = 0;          

              userCart.totalPrice = userCart.products.reduce((total, item) => {
                  const productPrice = item.price;
                  return total + productPrice; 
              }, 0);         
              userCart.totalOgPrice = userCart.products.reduce((total, item) => {
                  const productOgPrice = item.ogPrice;
                  return total + productOgPrice ;
              }, 0);     
              userCart.discount = userCart.totalOgPrice - userCart.totalPrice;
              userCart.totalOrderAmount=userCart.totalPrice

              await userCart.save();
              res.json({ success: true });

          } else {
              res.status(404).send('Product not found in the cart');
          }         
          } else {
              res.status(404).send('Cart not found');
          }
      } catch (error) {
          console.error('Error removing from cart:', error);
          res.status(500).send('Internal Server Error');
      }
  },




  validateCoupon: async (req, res) => {
    try {
        const userId = req.session.user.userId;
        const enteredCouponCode = req.body.couponCode.toUpperCase();
        const coupon = await Coupon.findOne({ couponCode: enteredCouponCode });

        if (coupon) {
            const userCart = await Cart.findOne({ user: userId });

            if (userCart) {
                const discountPercentage = parseFloat(coupon.discount);
                
                if (!isNaN(discountPercentage)) {
                    userCart.totalOrderAmount = (userCart.totalPrice - (userCart.totalPrice * (discountPercentage / 100))) . toFixed() ;
                    await userCart.save();

                    res.json({
                        success: true,
                        discount: discountPercentage,
                        condition: coupon.conditions,
                        totalOrderAmount: userCart.totalOrderAmount,
                    });
                } else {
                    res.status(500).json({ success: false, message: 'Invalid coupon discount percentage' });
                }
            } else {
                res.status(404).json({ success: false, message: 'Cart not found' });
            }
        } else {
            res.status(404).json({ success: false, message: 'Invalid coupon code' });
        }
    } catch (error) {
        console.error('Error validating coupon:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
},




  applyGift:async(req,res)=>{
    try{
      const userId = req.session.user.userId;
      const userCart = await Cart.findOne({user:userId});

      if(userCart){

        if(!userCart.giftWrapApplied){
          userCart.totalOrderAmount += 20;
          userCart.giftWrapApplied = true;

          await userCart.save();

          return res.json({
          success: true,
          totalOrderAmount: userCart.totalOrderAmount,
          message: 'Gift wrap applied successfully.'
        });

        }else{
          return res.jso({
            success: false,
            message: 'Gift wrap already applied.'
          })
        }

      }else{
        res.status(500).json({ success: false, message: 'Cart not found'})
      }

    }catch(error){
      console.error('Error applying gift card:',error);
      res.status(500).json({ success: false, message: 'Internal Server Error'})
    }
  },





    checkoutGet:async(req,res)=>{
      if (req.session.email) {
        try {
          const dynamicTitle = 'Checkout';
          const userId = req.session.user.userId;
          const userCart = await Cart.findOne({ user: userId }).populate('products.product');   
          res.render('checkout', { cart: userCart, title: dynamicTitle });
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
      } else {
        res.redirect('/login');
      }
    }
    

        
}