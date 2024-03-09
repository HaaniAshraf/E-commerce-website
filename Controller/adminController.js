const { User,Product,Wishlist,Order } = require("../Model/db");

module.exports = {

  adminhomeGet: async (req, res) => {
    if (req.session.role === true) {
      try {
        const role = req.session.role;
        const admin = await User.findOne({ role: role });

        const totalSalesResult = await Order.aggregate([
          {
            $match: {
              orderStatus: "Delivered",
            },
          },
          {
            $group: {
              _id: null,
              totalSales: { $sum: "$totalOrderAmount" },
            },
          },
        ]);
        const totalSales =
          totalSalesResult.length > 0 ? totalSalesResult[0].totalSales : 0;

        const totalUsers = await User.countDocuments({ role: { $ne: "true" } });
        const totalProducts = await Product.countDocuments({});

        res.render("adminHome", {
          admin,
          totalSales,
          totalUsers,
          totalProducts,
        });
      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.redirect("/login");
    }
  },


  monthlySales: async (req, res) => {
    try {
      const monthlySales = await Order.aggregate([
        {
          $match: {
            orderStatus: "Delivered",
          },
        },
        {
          $group: {
            _id: { $month: "$orderedDate" },
            totalSales: { $sum: "$totalOrderAmount" },
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id",
            totalSales: 1,
          },
        },
      ]);

      res.json(monthlySales);
    } catch (error) {
      console.error("Error fetching monthly sales:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  popularProduct: async (req, res) => {
    try {
      const mostPopularProduct = await Wishlist.aggregate([
        { $unwind: "$products" }, // Unwind the products array
        { $group: { _id: "$products", count: { $sum: 1 } } }, // Count occurrences of each product
        { $sort: { count: -1 } }, // Sort in descending order based on count
        { $limit: 1 }, // Limit to the first result (most popular)
      ]);

      if (mostPopularProduct.length === 0) {
        return res.json({ message: "No popular product found" });
      }
      const mostPopularItem = mostPopularProduct[0];
      const productId = mostPopularItem._id;
      const productCountInWishlist = mostPopularItem.count;

      const productInfo = await Product.findById(productId);
      res.json({ productInfo, count: productCountInWishlist });
    } catch (error) {
      console.error("Error fetching most popular product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },


  mostOrderedProduct: async (req, res) => {
    try {
      const mostOrderedProduct = await Order.aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.product",
            totalOrders: { $sum: "$products.quantity" },
          },
        },
        { $sort: { totalOrders: -1 } },
        { $limit: 1 },
      ]);

      if (mostOrderedProduct.length > 0) {
        const mostOrderedProductId = mostOrderedProduct[0]._id;
        const mostOrderedProductDetails = await Product.findById(
          mostOrderedProductId
        );
        res.json({
          productInfo: mostOrderedProductDetails,
          totalOrders: mostOrderedProduct[0].totalOrders,
        });
      }
    } catch (error) {
      console.error("Error fetching most ordered product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },


  mostActiveUser: async (req, res) => {
    try {
      const mostActiveUser = await Order.aggregate([
        { $group: { _id: "$user", totalOrders: { $sum: 1 } } },
        { $sort: { totalOrders: -1 } },
        { $limit: 1 },
      ]);

      if (mostActiveUser.length === 0) {
        return res.json({ message: "No active user found" });
      }

      const userId = mostActiveUser[0]._id;
      const totalOrders = mostActiveUser[0].totalOrders;
      const user = await User.findById(userId);
      res.json({ userInfo: user, totalOrders });
    } catch (error) {
      console.error("Error fetching most active user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },


  userSignups: async (req, res) => {
    try {
      const monthlySignups = await User.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            totalSignups: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      res.json({ monthlySignups });
    } catch (error) {
      console.error("Error fetching monthly signups:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },


  productDataGet: async (req, res) => {
    try {
      const products = await Product.find({});

      // Used to extract category names
      const categories = [];
      for (const product of products) {
        if (!categories.includes(product.category)) {
          categories.push(product.category);
        }
      }
      // Use map and filter to calculate category counts
      const counts = categories.map(
        (category) =>
          products.filter((product) => product.category === category).length
      );

      res.json({
        categories: categories,
        counts: counts,
      });
    } catch (error) {
      console.error("Error fetching product data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },


  recentUpdates: async (req, res) => {
    try {
      const latestSignup = await User.findOne().sort({ _id: -1 }).limit(1);
      const latestProduct = await Product.findOne().sort({ _id: -1 }).limit(1);
      const pendingOrders = await Order.find({
        orderStatus: "Pending",
      }).countDocuments();
      res.json({ latestSignup, pendingOrders, latestProduct });
    } catch (error) {
      console.error("Error fetching recent data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  
};
