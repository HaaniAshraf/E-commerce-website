const { Cart } = require("../Model/db");

module.exports = {

  cartGet: async (req, res) => {
    if (req.session.email) {
      try {
        const dynamicTitle = "Cart";
        const userId = req.session.user.userId;
        const userCart = await Cart.findOne({ user: userId }).populate(
          "products.product"
        );
        const userAddresses = await Address.find({ userId });
        const coupon = await Coupon.find();

        if (!userCart) {
          res.render("cart", { cart: [], title: dynamicTitle, coupon });
          return;
        }

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
        const userId = req.session.user.userId;
        let userCart = await Cart.findOne({ user: userId });
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
        const productId = req.params.productId;
        const userId = req.session.user.userId;

        let userCart = await Cart.findOne({ user: userId });
        if (!userCart) {
          userCart = new Cart({ user: userId, products: [], totalPrice: 0 });
        }

        const existingProduct = userCart.products.find(
          (item) => item.product == productId
        );
        // item: Represents an individual element in the userCart.products array.
        // item.product: Refers to the product field within each item in the array. This field is assumed to store the product ID.

        let product;
        if (existingProduct) {
          product = await Product.findById(productId);
          if (!product) {
            return res.status(404).send("Product not found");
          }

          existingProduct.quantity += 1;
          existingProduct.price = product.price * existingProduct.quantity;
          existingProduct.ogPrice = product.ogPrice * existingProduct.quantity;
        } else {
          product = await Product.findById(productId);
          if (!product) {
            return res.status(404).send("Product not found");
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
        userCart.totalOrderAmount = userCart.totalPrice.toFixed();

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
    try {
      const userId = req.session.user.userId;
      const itemId = req.body.itemId;
      const quantity = req.body.quantity;
      const finalPrice = req.body.finalPrice;
      const finalOgPrice = req.body.finalOgPrice;

      let userCart = await Cart.findOne({ user: userId });
      if (userCart) {
        const cartItem = userCart.products.find(
          (item) => item._id.toString() === itemId
        );
        if (cartItem) {
          cartItem.quantity = quantity;
          cartItem.price = finalPrice;
          cartItem.ogPrice = finalOgPrice;

          userCart.totalPrice = userCart.products.reduce(
            (total, item) => total + item.price,
            0
          );
          userCart.totalOgPrice = userCart.products.reduce(
            (total, item) => total + item.ogPrice,
            0
          );
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
  },


  removeFromCart: async (req, res) => {
    try {
      const userId = req.session.user.userId;
      const productId = req.params.productId;
      const userCart = await Cart.findOne({ user: userId });

      if (userCart) {
        const productToRemove = userCart.products.find(
          (product) => product._id.toString() === productId
        );

        if (productToRemove) {
          userCart.products = userCart.products.filter(
            (product) => product._id.toString() !== productId
          );
          userCart.totalPrice = 0;
          userCart.totalOgPrice = 0;

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
            const condition = coupon.conditions;
            const totalAmount = userCart.totalOrderAmount;

            function checkCondition(condition, originalPrice) {
              // Extract numeric values from the condition
              const amounts = condition.match(/\d+/g); // amounts is an array with the 2 numbers is condition.

              if (amounts && amounts.length === 2) {
                const minPurchaseAmount = parseFloat(amounts[0]); // takes the first amount of amounts array
                const maxPurchaseAmount = parseFloat(amounts[1]); // takes the second amount of amounts array

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

            if (checkCondition(condition, totalAmount)) {
              userCart.totalOrderAmount = (
                totalAmount -
                totalAmount * (discountPercentage / 100)
              ).toFixed();
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
            res
              .status(500)
              .json({
                success: false,
                message: "Invalid coupon discount percentage",
              });
          }
        } else {
          res.status(404).json({ success: false, message: "Cart not found" });
        }
      } else {
        res
          .status(404)
          .json({ success: false, message: "Invalid coupon code" });
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },


  applyGift: async (req, res) => {
    try {
      const userId = req.session.user.userId;
      const userCart = await Cart.findOne({ user: userId });

      if (userCart) {
        if (!userCart.giftWrapApplied) {
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
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
  
};
