const { Address, Product, Coupon, Cart } = require("../Model/db");

module.exports = {

  cartGet: async (req, res) => {
    if (req.session.email) {
      try {
        const dynamicTitle = "Cart";
        // Retrieve user ID from the user session
        const userId = req.session.user.userId;
        // Fetch the user's cart, populating details of each product
        const userCart = await Cart.findOne({ user: userId }).populate( "products.product" );
        // Retrieve addresses associated with the user
        const userAddresses = await Address.find({ userId });
        // Fetch coupon information
        const coupon = await Coupon.find();

        if (!userCart) {
          res.render("cart", { cart: [], title: dynamicTitle, coupon });
          return;
        }

         // Calculate delivery date (set to two days from the ordered date)
        const orderedDate = Date.now();
        const deliveryDate = new Date(orderedDate);
        deliveryDate.setDate(deliveryDate.getDate() + 2);

        res.render("cart", {
          cart: userCart,
          userAddresses: userAddresses,
          title: dynamicTitle,
          coupon,
          deliveryDate,
        });

      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.redirect("/login");
    }
  },


  cartCount: async (req, res) => {
    if (req.session.email) {
      try {
        // Retrieve the user ID from the user session
        const userId = req.session.user.userId;
        // Find the user's cart based on the user ID
        let userCart = await Cart.findOne({ user: userId });
        // Calculate the cart count, if the user has a cart, use the length of products array, otherwise set to 0
        const cartCount = userCart ? userCart.products.length : 0;

        res.json({
          success: true,
          cartCount: cartCount,
        });

      } catch (error) {
        console.error("Error fetching cart count:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      res.redirect("/login");
    }
  },


  addToCart: async (req, res) => {
    if (req.session.email) {
      try {
        // Retrieve the product ID from the request parameters.
        const productId = req.params.productId;
        // Retrieve the user ID from the session
        const userId = req.session.user.userId;

        // Find the user's cart based on the user ID
        let userCart = await Cart.findOne({ user: userId });
        if (!userCart) {
          userCart = new Cart({ user: userId, products: [], totalPrice: 0 });
        }

        // Check if the product already exists in the user's cart
        const existingProduct = userCart.products.find((item) => item.product == productId );
        // item: Represents an individual element in the userCart.products array.
        // item.product: Refers to the product field within each item in the array. This field is assumed to store the product ID.

        let product;
        if (existingProduct) {
          product = await Product.findById(productId);
          if (!product) {
            return res.status(404).send("Product not found");
          }
          // If the product already exists in the cart, update its quantity and prices
          existingProduct.quantity += 1;
          existingProduct.price = product.price * existingProduct.quantity;
          existingProduct.ogPrice = product.ogPrice * existingProduct.quantity;
        } else {    
          product = await Product.findById(productId);
          if (!product) {
            return res.status(404).send("Product not found");
          }

          // If the product is not in the cart, add it.
          userCart.products.push({
            product: productId,
            quantity: 1,
            price: product.price,
            ogPrice: product.ogPrice,
            discount: product.discount,
          });
        }
        // Calculate and update the total price, original price, discount, and total order amount in the cart
        userCart.totalPrice = userCart.products.reduce((total, item) => {
          return total + item.price;
        }, 0);
        userCart.totalOgPrice = userCart.products.reduce((total, item) => {
          return total + item.ogPrice;
        }, 0);
        userCart.discount = userCart.totalOgPrice - userCart.totalPrice;
        userCart.totalOrderAmount = userCart.totalPrice.toFixed();

        // Save the updated cart to the database
        await userCart.save();

        res.redirect("/cart");
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.redirect("/login");
    }
  },


  updateCart: async (req, res) => {
    if(req.session.email){
      try {
        // Retrieve user ID, item ID, quantity, final prices, etc. from the request body
        const userId = req.session.user.userId;
        const itemId = req.body.itemId;
        const quantity = req.body.quantity;
        const finalPrice = req.body.finalPrice;
        const finalOgPrice = req.body.finalOgPrice;
  
        // Find the user's cart based on the user ID
        let userCart = await Cart.findOne({ user: userId });
        if (userCart) {
          // Find the cart item with the specified item ID
          const cartItem = userCart.products.find( (item) => item._id.toString() === itemId );
          if (cartItem) {
            // Update quantity and prices of the cart item
            cartItem.quantity = quantity;
            cartItem.price = finalPrice;
            cartItem.ogPrice = finalOgPrice;
  
            // Recalculate and update total price, original price, discount, and total order amount in the cart
            userCart.totalPrice = userCart.products.reduce((total, item) => total + item.price,0 );
            userCart.totalOgPrice = userCart.products.reduce((total, item) => total + item.ogPrice,0 );
            userCart.discount = userCart.totalOgPrice - userCart.totalPrice;
            userCart.totalOrderAmount = userCart.totalPrice.toFixed();
  
            await userCart.save();
            res.json({
              success: true,
              totalPrice: userCart.totalPrice,
              totalOgPrice: userCart.totalOgPrice,
              discount: userCart.discount,
              totalOrderAmount: userCart.totalOrderAmount,
            });
          } else {
            res.status(404).send("Item not found in the cart");
          }
  
        } else {
          res.status(404).send("Cart not found");
        }
      } catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    }  
  },


  removeFromCart: async (req, res) => {
    if(req.session.email){
      try {
        // Retrieve user ID from the session
        const userId = req.session.user.userId;
        // Retrieve product ID from the request parameters
        const productId = req.params.productId;
        // Find the user's cart based on the user ID
        const userCart = await Cart.findOne({ user: userId });
  
        if (userCart) {
           // Find the product to remove from the cart based on the product ID
          const productToRemove = userCart.products.find(
            (product) => product._id.toString() === productId
          );
  
          if (productToRemove) {
            // Remove the product from the cart's products array
            userCart.products = userCart.products.filter(
              (product) => product._id.toString() !== productId
            );
            // Reset total prices in the cart
            userCart.totalPrice = 0;
            userCart.totalOgPrice = 0;
  
            // Recalculate and update total price, original price, discount, and total order amount in the cart
            userCart.totalPrice = userCart.products.reduce((total, item) => {
              const productPrice = item.price;
              return total + productPrice;
            }, 0);
            userCart.totalOgPrice = userCart.products.reduce((total, item) => {
              const productOgPrice = item.ogPrice;
              return total + productOgPrice;
            }, 0);
            userCart.discount = userCart.totalOgPrice - userCart.totalPrice;
            userCart.totalOrderAmount = userCart.totalPrice;
  
            await userCart.save();
            res.json({ success: true });
          } else {
            res.status(404).send("Product not found in the cart");
          }
          
        } else {
          res.status(404).send("Cart not found");
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    }
  },


  validateCoupon: async (req, res) => {
    if(req.session.email){
      try {
        // Retrieve user ID from the session
        const userId = req.session.user.userId;
        // Retrieve the entered coupon code from body
        const enteredCouponCode = req.body.couponCode.toUpperCase();
        // Find the coupon in the database based on the entered coupon code
        const coupon = await Coupon.findOne({ couponCode: enteredCouponCode });
  
        if (coupon) {
          // Check if the coupon is expired
          if (coupon.expiry < new Date()) {
            return res.status(400).json({ success: false, message: "Coupon is expired" });
          }
          
          // Find the user's cart based on the user ID
          const userCart = await Cart.findOne({ user: userId });
  
          if (userCart) {
            // Parse the discount percentage from the coupon
            const discountPercentage = parseFloat(coupon.discount);
  
            if (!isNaN(discountPercentage)) {
              // Extract condition and total amount from the coupon and user's cart
              const condition = coupon.conditions;
              const totalAmount = userCart.totalOrderAmount;
  
              // Function to check if the condition is met
              function checkCondition(condition, originalPrice) {
                // Extract numeric values from the condition
                const amounts = condition.match(/\d+/g); // amounts is an array with the 2 numbers is condition.
  
                if (amounts && amounts.length === 2) {
                  const minPurchaseAmount = parseFloat(amounts[0]); // takes the first amount of amounts array
                  const maxPurchaseAmount = parseFloat(amounts[1]); // takes the second amount of amounts array
  
                  // Check if the extracted values are valid numbers
                  if (!isNaN(minPurchaseAmount) && !isNaN(maxPurchaseAmount)) {
                    return (
                      originalPrice >= minPurchaseAmount &&
                      originalPrice <= maxPurchaseAmount
                    );
                  } else {
                    console.log("Invalid numeric values in condition");
                    return false;
                  }
                } else {
                  console.log("Invalid condition format");
                  return false;
                }
              }
  
              // Check if the condition is met
              if (checkCondition(condition, totalAmount)) {
                // Apply the coupon discount to the user's cart total order amount
                userCart.totalOrderAmount = ( totalAmount - totalAmount * (discountPercentage / 100)).toFixed();
                await userCart.save();
  
                res.json({
                  success: true,
                  discount: discountPercentage,
                  condition: condition,
                  totalOrderAmount: userCart.totalOrderAmount,
                });
              } else {
                res.json({
                  success: false,
                  message: "Coupon condition not met",
                  condition: condition,
                });
              }
  
            } else {
              res.status(500).json({
                  success: false,
                  message: "Invalid coupon discount percentage",
                });
            }
          } else {
            res.status(404).json({ success: false, message: "Cart not found" });
          }
  
        } else {
          res.status(404).json({ success: false, message: "Invalid coupon code" });
        }
      } catch (error) {
        console.error("Error validating coupon:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }
    }else{
      res.redirect('/login')
    }
  },


  applyGift: async (req, res) => {
    if(req.session.email){
      try {
        // Retrieve user ID from the session
        const userId = req.session.user.userId;
        // Find the user's cart based on the user ID
        const userCart = await Cart.findOne({ user: userId });
  
        if (userCart) {
          // Check if gift wrap is not already applied
          if (!userCart.giftWrapApplied) {
            // Increase the total order amount by $20 and mark gift wrap as applied
            userCart.totalOrderAmount += 20;
            userCart.giftWrapApplied = true;
  
            await userCart.save();
  
            return res.json({
              success: true,
              totalOrderAmount: userCart.totalOrderAmount,
              message: "Gift wrap applied successfully.",
            });
          } else {
            return res.jso({
              success: false,
              message: "Gift wrap already applied.",
            });
          }
  
        } else {
          res.status(500).json({ success: false, message: "Cart not found" });
        }
      } catch (error) {
        console.error("Error applying gift card:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }
    }else{
      res.redirect('/login')
    }
  },
  
};
