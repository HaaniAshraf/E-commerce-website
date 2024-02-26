const mongoose=require('mongoose')
const { ObjectId } = require('mongoose').Types;
const { User,Profile,Address,Product,Banner,Coupon,Wishlist,Cart,Order } = require('../Model/db');


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
    
          let userCart = await Cart.findOne({ user: userId })  
          if (!userCart) {
            userCart = new Cart({ user: userId, products: [], totalPrice: 0});
          }
    
          const existingProduct = userCart.products.find((item) => item.product == productId);
          // item: Represents an individual element in the userCart.products array.
          // item.product: Refers to the product field within each item in the array. This field is assumed to store the product ID.
          
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
              ogPrice: product.ogPrice,
              discount: product.discount,
            });
          } 
    
          userCart.totalPrice = userCart.products.reduce((total, item) => {
            return total + item.price;
          }, 0);         
          userCart.totalOgPrice = userCart.products.reduce((total, item) => {
            return total + item.ogPrice;
          }, 0);         
          userCart.discount = userCart.totalOgPrice - userCart.totalPrice;
          userCart.totalOrderAmount = userCart.totalPrice.toFixed()
    
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

          if(userCart){
            const userAddresses = await Address.find({ userId });
            res.render('checkout', { cart: userCart, title: dynamicTitle, userAddresses: userAddresses });
          }else{
            res.redirect('/cart')
          }  

        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }

      } else {
        res.redirect('/login');
      }
    },




    checkoutPost:async(req,res)=>{
      if(req.session.email){

        try{
          const userId = req.session.user.userId;

          const userEmail = req.body.email;
          if (userEmail !== req.session.email) {
            return res.redirect('/checkout');
          }

          const userAddresses=await Address.findOne({userId:userId})
          const selectedAddressId = req.body.selectedAddress;
          const selectedAddress = userAddresses.addresses.find(address => address._id.toString() === selectedAddressId);
          const userDeliveryAddress = {
            houseNumber: selectedAddress.houseNumber,
            locality: selectedAddress.locality,
            city: selectedAddress.city,
            state: selectedAddress.state,
            pinCode: selectedAddress.pinCode,
          };

          const userCart = await Cart.findOne({ user: userId }).populate({
            path: 'products.product',
            model: 'products'
          })  

        if (!userCart || userCart.products.length === 0) {
          return res.render('checkout', { error: 'Cart is empty' });
        }

        const orderedDate = Date.now()
        const deliveryDate = new Date(orderedDate);
        deliveryDate.setDate(deliveryDate.getDate() + 2);

        let orderStatus = 'Pending'

        const paymentMethod = req.body.paymentMethod;
        let extraCharge = 0;
        if (paymentMethod === 'Cash On Delivery') {
          extraCharge = 30;
        }

        const userOrder = new Order({
          user: userId,
          products: userCart.products.map(cartItem => ({
              product: cartItem.product._id,
              quantity: cartItem.quantity,
          })),
          totalOrderAmount: userCart.totalOrderAmount + extraCharge, 
          deliveryAddress: userDeliveryAddress,
          orderedDate: orderedDate,
          deliveryDate: deliveryDate,
          orderStatus: orderStatus,
          paymentMethod: paymentMethod
      });

      await userOrder.save();
      res.redirect(`/orderPlaced?orderId=${userOrder._id}`);

        }catch(error){
          console.error('Error in checkoutPost:', error);
        }
      }
    },
  



    orderPlacedGet: async (req, res) => {
      try {
        const orderId = req.query.orderId;
        const userId = req.session.user.userId

        const populatedOrder = await Order.findById(orderId).populate({
          path: 'products.product',
          model: 'products'
        });
        const deliveryAddress = populatedOrder.deliveryAddress;
        const cart = await Cart.find({ user:userId })

        if(cart.length>0){
          res.render('orderPlaced', { order: populatedOrder, deliveryAddress, cart });
          await Cart.deleteOne({ user: userId });
        }else{
          res.redirect('/cart')
        }       
    
      } catch (error) {
        console.error('Error getting orderPlaced page:', error);
        res.status(500).render('orderPlaced', { error: 'Internal Server Error' });
      }
    },




    ordersGet: async (req, res) => {
      try {
        if (req.session.email) {
          const userId = req.session.user.userId;        
          const userOrders = await Order.find({ user: userId }).sort({ orderedDate: -1 })
          .populate({
            path: 'products.product',
            model: 'products', 
        });
          res.render('orders', { userOrders });
        } else {
          res.redirect('/login');
        }
        
      } catch (error) {
        console.error('Error in ordersGet:', error);
        res.status(500).render('orders', { error: 'Internal Server Error' });
      }
    },

    



    cancelOrderPost:async(req,res)=>{
      try {
        const orderId = req.params.orderId;
        const { reason } = req.body;
        
        await Order.findByIdAndUpdate(orderId, { 
          orderStatus: 'Cancelled',
          deliveryDate: '',
          cancelReason: reason,
         },
         { new:true }
         );   

        res.json({ success: true, message: 'Order cancelled successfully.' });

      } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
    },
    
    

        
}