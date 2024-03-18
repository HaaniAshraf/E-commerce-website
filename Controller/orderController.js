const { Address,Cart,Order,Review } = require("../Model/db");

require("dotenv").config();
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

module.exports = {

  checkoutGet: async (req, res) => {
    if (req.session.email) {
      try {
        const dynamicTitle = "Checkout";
        // Retrieve the user ID from the session
        const userId = req.session.user.userId;

        // Find the user's cart in the database, populating the product details
        const userCart = await Cart.findOne({ user: userId }).populate(
          "products.product"
        );

        if (userCart) {
          // Find user addresses associated with the user ID
          const userAddresses = await Address.find({ userId });
          res.render("checkout", {
            cart: userCart,
            title: dynamicTitle,
            userAddresses: userAddresses,
          });
        } else {
          res.redirect("/cart");
        }

      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.redirect("/login");
    }
  },


  checkoutPost: async (req, res) => {
    if (req.session.email) {
      try {
        // Retrieve the user ID from the session
        const userId = req.session.user.userId;

        // Check if the provided email matches the session email
        const userEmail = req.body.email;
        if (userEmail !== req.session.email) {
          return res.send(
            "<script>alert('The email you entered does not match the logged-in user.'); window.location.href = '/checkout';</script>" );   
        }

        // Find the user's addresses based on the user ID
        const userAddresses = await Address.findOne({ userId: userId });
        const selectedAddressId = req.body.selectedAddress;
        // Find the selected address from the user's addresses
        const selectedAddress = userAddresses.addresses.find(
          (address) => address._id.toString() === selectedAddressId
        );
        const userDeliveryAddress = {
          houseNumber: selectedAddress.houseNumber,
          locality: selectedAddress.locality,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pinCode: selectedAddress.pinCode,
        };

        // Find the user's cart with populated product details
        const userCart = await Cart.findOne({ user: userId }).populate({
          path: "products.product",
          model: "products",
        });

        if (!userCart || userCart.products.length === 0) {
          return res.render("checkout", { error: "Cart is empty" });
        }

        // Get the current date and set the delivery date
        const orderedDate = Date.now();
        const deliveryDate = new Date(orderedDate);
        deliveryDate.setDate(deliveryDate.getDate() + 2);

        let orderStatus = "Pending";

        const paymentMethod = req.body.paymentMethod;
        // Set an extra charge for Cash On Delivery payment method
        let extraCharge = 0;
        if (paymentMethod === "Cash On Delivery") {
          extraCharge = 30;
        }

        const userOrder = new Order({
          user: userId,
          products: userCart.products.map((cartItem) => ({
            product: cartItem.product._id,
            quantity: cartItem.quantity,
          })),
          totalOrderAmount: userCart.totalOrderAmount + extraCharge,
          deliveryAddress: userDeliveryAddress,
          orderedDate: orderedDate,
          deliveryDate: deliveryDate,
          orderStatus: orderStatus,
          paymentMethod: paymentMethod,
        });

        // Save the order to the database
        await userOrder.save();
        res.redirect(`/orderPlaced?orderId=${userOrder._id}`);
      } catch (error) {
        console.error("Error in checkoutPost:", error);
      }
    }
  },


  razorPayPost: async (req, res) => {
    if (req.session.email) {
      try {
        // Retrieve the user ID from the session
        const userId = req.session.user.userId;
        // Find the user's cart to get the total order amount
        const userCart = await Cart.findOne({ user: userId });
        // Get the total order amount from the user's cart
        const orderAmount = userCart.totalOrderAmount;

        const options = {
          amount: orderAmount * 100,
          currency: "INR",
        };

        // Create a Razorpay order using the specified options
        const razorpayOrder = await razorpay.orders.create(options);

        res.status(200).json({ razorpayOrder });
      } catch (error) {
        console.error("Error rendering razorPay:", error);
        res.status(500).send("Internal server error");
      }
    } else {
      res.redirect("/login");
    }
  },


  orderPost: async (req, res) => {
    if (req.session.email) {
      try {
        // Retrieve the user ID from the session
        const userId = req.session.user.userId;

        // Find the user's cart and populate it with product details
        const userCart = await Cart.findOne({ user: userId }).populate({
          path: "products.product",
          model: "products",
        });

        // Retrieve user addresses
        const userAddresses = await Address.findOne({ userId: userId });
        const selectedAddressId = req.body.selectedAddress;
        // Find the selected delivery address from user addresses
        const selectedAddress = userAddresses.addresses.find(
          (address) => address._id.toString() === selectedAddressId
        );
        const userDeliveryAddress = {
          houseNumber: selectedAddress.houseNumber,
          locality: selectedAddress.locality,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pinCode: selectedAddress.pinCode,
        };

        // Get the current date and set the delivery date
        const orderedDate = Date.now();
        const deliveryDate = new Date(orderedDate);
        deliveryDate.setDate(deliveryDate.getDate() + 2);

        let orderStatus = "Pending";
        const paymentMethod = "UPI Payment";

        // Create a new Order instance with order details
        const userOrder = new Order({
          user: userId,
          products: userCart.products.map((cartItem) => ({
            product: cartItem.product._id,
            quantity: cartItem.quantity,
          })),
          totalOrderAmount: userCart.totalOrderAmount,
          deliveryAddress: userDeliveryAddress,
          orderedDate: orderedDate,
          deliveryDate: deliveryDate,
          orderStatus: orderStatus,
          paymentMethod: paymentMethod,
        });
        await userOrder.save();

        res.status(200).json({ success: true, orderId: userOrder._id });
      } catch (error) {
        console.error("Error in /createOrder:", error);
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.redirect("/login");
    }
  },


  orderPlacedGet: async (req, res) => {
    if(req.session.email){
      try {
        // Retrieve the order ID from the query parameters
        const orderId = req.query.orderId;
        // Retrieve the user ID from the session
        const userId = req.session.user.userId;
        
        // Find the order and populate it with product details
        const populatedOrder = await Order.findById(orderId).populate({
          path: "products.product",
          model: "products",
        });
  
        if (populatedOrder) {
          // Extract the delivery address from the order 
          const deliveryAddress = populatedOrder.deliveryAddress || {};
          // Find the user's cart
          const cart = await Cart.find({ user: userId });
  
          if (cart.length > 0) {
            res.render("orderPlaced", {
              order: populatedOrder,
              deliveryAddress,
              cart,
            });

            // Delete the user's cart after rendering the orderPlaced page
            await Cart.deleteOne({ user: userId });
          }        else {
            res.redirect("/cart");
          }
        } else {
          res.status(404).render("orderPlaced", { error: "Order not found" });
        }

      } catch (error) {
        console.error("Error getting orderPlaced page:", error);
        res.status(500).render("orderPlaced", { error: "Internal Server Error" });
      }
    }else{
      res.redirect('/login')
    } 
  },


  ordersGet: async (req, res) => {
    try {
      if (req.session.email) {
        // Retrieve the user ID from the session
        const userId = req.session.user.userId;
        // Find all orders of the user, sorted by ordered date in descending order
        const userOrders = await Order.find({ user: userId })
          .sort({ orderedDate: -1 })
          .populate({
            path: "products.product",
            model: "products",
          });
        res.render("orders", { userOrders });
      } else {
        res.redirect("/login");
      }

    } catch (error) {
      console.error("Error in ordersGet:", error);
      res.status(500).render("orders", { error: "Internal Server Error" });
    }
  },


  cancelOrderPost: async (req, res) => {
    try {
      // Extract orderId from the request parameters
      const orderId = req.params.orderId;
      // Extract the cancel reason from the request body
      const { reason } = req.body;

      // Update the order
      await Order.findByIdAndUpdate(
        orderId,
        {
          orderStatus: "Cancelled",
          deliveryDate: "",
          cancelReason: reason,
        },
        { new: true }
      );

      res.json({ success: true, message: "Order cancelled successfully.", updatedOrderStatus: "Cancelled"  });
    } catch (error) {
      console.error("Error cancelling order:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },


  reviewGet: async (req, res) => {
    try {
      if (req.session.email) {
        // Extract the productId from the query parameters
        const productId = req.query.productId;
        res.render("review", { productId });
      } else {
        res.redirect("/login");
      }

    } catch (error) {
      console.error("Error fetching review page:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },


  reviewPost: async (req, res) => {
    try {
      if (req.session.email) {
        // Extract data from the request body, including productId, rating, and review
        const { productId, rating, review } = req.body;

        // Check if there is an existing review for the product
        const existingReview = await Review.findOne({ product: productId });
        if (existingReview) {
          existingReview.reviews.push({
            user: req.session.user.userId,
            rating: parseInt(rating),
            review: review,
          });
          // Save the updated existing review
          await existingReview.save();

        } else {
          // If there is no existing review, create a new review
          const newReview = new Review({
            product: productId,
            reviews: [
              {
                user: req.session.user.userId,
                rating: parseInt(rating),
                review: review,
              },
            ],
          });
          // Save the new review
          await newReview.save();
        }
        res.redirect("/orders");
      }

    } catch (error) {
      console.error("Error posting review:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },


  orderListGet: async (req, res) => {
    if(req.session.role == true){
      try {
        // Retrive all orders from database
        const orders = await Order.find({});
        res.render("orderList", { orders });

      } catch (error) {
        console.error("Error fetching orders :", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    } 
  },


  orderDetailsGet: async (req, res) => {
    if(req.session.role == true){
      try {
        // Extract the orderId from the request parameters
        const orderId = req.params.orderId;
        // Find the order by its orderId, populating the products and user fields
        const order = await Order.findById(orderId)
          .populate("products.product")
          .populate("user");
        // Extract user information from the order
        const user = order.user;
        res.render("orderDetails", { order, user });

      } catch (error) {
        console.error("Error fetching order details :", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    }  
  },


  orderStatusPost: async (req, res) => {
    try {
      // Extract orderId from request parameters
      const orderId = req.params.orderId;
      // Extract orderStatus from request body
      const newStatus = req.body.orderStatus;
      // Update the orderStatus
      await Order.findByIdAndUpdate(orderId, { orderStatus: newStatus });
      res.redirect("/orderList");

    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  reviewListGet: async (req, res) => {
    if(req.session.role == true){
      try {
        // Retrieve all the reviews from database
        const productReviews = await Review.find({});
        res.render("reviewList", { productReviews });
        
      } catch (error) {
        console.error("Error fetching reviews list:", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    }  
  },
  
};
