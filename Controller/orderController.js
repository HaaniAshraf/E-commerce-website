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
        const userId = req.session.user.userId;
        const userCart = await Cart.findOne({ user: userId }).populate(
          "products.product"
        );

        if (userCart) {
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
        const userId = req.session.user.userId;

        const userEmail = req.body.email;
        if (userEmail !== req.session.email) {
          return res.redirect("/checkout");
        }

        const userAddresses = await Address.findOne({ userId: userId });
        const selectedAddressId = req.body.selectedAddress;
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

        const userCart = await Cart.findOne({ user: userId }).populate({
          path: "products.product",
          model: "products",
        });

        if (!userCart || userCart.products.length === 0) {
          return res.render("checkout", { error: "Cart is empty" });
        }

        const orderedDate = Date.now();
        const deliveryDate = new Date(orderedDate);
        deliveryDate.setDate(deliveryDate.getDate() + 2);

        let orderStatus = "Pending";

        const paymentMethod = req.body.paymentMethod;
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
        const userId = req.session.user.userId;
        const userCart = await Cart.findOne({ user: userId });
        const orderAmount = userCart.totalOrderAmount;

        const options = {
          amount: orderAmount * 100,
          currency: "INR",
        };

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
        const userId = req.session.user.userId;
        const userCart = await Cart.findOne({ user: userId }).populate({
          path: "products.product",
          model: "products",
        });

        const userAddresses = await Address.findOne({ userId: userId });
        const selectedAddressId = req.body.selectedAddress;
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

        const orderedDate = Date.now();
        const deliveryDate = new Date(orderedDate);
        deliveryDate.setDate(deliveryDate.getDate() + 2);

        let orderStatus = "Pending";
        const paymentMethod = req.body.paymentMethod;

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
    try {
      const orderId = req.query.orderId;
      const userId = req.session.user.userId;

      const populatedOrder = await Order.findById(orderId).populate({
        path: "products.product",
        model: "products",
      });

      if (populatedOrder) {
        const deliveryAddress = populatedOrder.deliveryAddress || {};
        const cart = await Cart.find({ user: userId });

        if (cart.length > 0) {
          res.render("orderPlaced", {
            order: populatedOrder,
            deliveryAddress,
            cart,
          });
          await Cart.deleteOne({ user: userId });
        } else {
          res.redirect("/cart");
        }
      } else {
        res.status(404).render("orderPlaced", { error: "Order not found" });
      }
    } catch (error) {
      console.error("Error getting orderPlaced page:", error);
      res.status(500).render("orderPlaced", { error: "Internal Server Error" });
    }
  },


  ordersGet: async (req, res) => {
    try {
      if (req.session.email) {
        const userId = req.session.user.userId;
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
      const orderId = req.params.orderId;
      const { reason } = req.body;

      await Order.findByIdAndUpdate(
        orderId,
        {
          orderStatus: "Cancelled",
          deliveryDate: "",
          cancelReason: reason,
        },
        { new: true }
      );

      res.json({ success: true, message: "Order cancelled successfully." });
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
        const productId = req.query.productId;

        res.render("review", { productId });
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      console.error("Error fetching review page:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },


  reviewPost: async (req, res) => {
    try {
      if (req.session.email) {
        const { productId, rating, review } = req.body;

        const existingReview = await Review.findOne({ product: productId });
        if (existingReview) {
          existingReview.reviews.push({
            user: req.session.user.userId,
            rating: parseInt(rating),
            review: review,
          });
          await existingReview.save();
        } else {
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
          await newReview.save();
        }
        res.redirect("/orders");
      }
    } catch (error) {
      console.error("Error posting review:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },


  orderListGet: async (req, res) => {
    try {
      const orders = await Order.find({});
      res.render("orderList", { orders });
    } catch (error) {
      console.error("Error fetching orders :", error);
      res.status(500).send("Internal Server Error");
    }
  },


  orderDetailsGet: async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const order = await Order.findById(orderId)
        .populate("products.product")
        .populate("user");
      const user = order.user;
      res.render("orderDetails", { order, user });
    } catch (error) {
      console.error("Error fetching order details :", error);
      res.status(500).send("Internal Server Error");
    }
  },


  orderStatusPost: async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const newStatus = req.body.orderStatus;

      await Order.findByIdAndUpdate(orderId, { orderStatus: newStatus });
      res.redirect("/orderList");
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  reviewListGet: async (req, res) => {
    try {
      const productReviews = await Review.find({});
      res.render("reviewList", { productReviews });
    } catch (error) {
      console.error("Error fetching reviews list:", error);
      res.status(500).send("Internal Server Error");
    }
  },
  
};
