const { User,Product,Wishlist,Order } = require("../Model/db");

module.exports = {

  adminhomeGet: async (req, res) => {
    if (req.session.role === true) {
      try {
        // Retrieve the role from the session
        const role = req.session.role;
        // Find the user with the specified role
        const admin = await User.findOne({ role: role });
        // Aggregate total sales from orders with 'Delivered' status
        const totalSalesResult = await Order.aggregate([
          {
            $match: {
              orderStatus: "Delivered",    // It filters orders where the orderStatus is "Delivered".
            },
          },
          {
            $group: {              
              _id: null,  // It groups all the matched documents into a single group (_id: null)
              totalSales: { $sum: "$totalOrderAmount" },   // Summing up the totalOrderAmount field for all documents in the group.
            },
          },
        ]);
         // Extract total sales value or default to 0 if no result
        const totalSales = totalSalesResult.length > 0 ? totalSalesResult[0].totalSales : 0;
        // Count total users with a role false and otpVerified true.
        const totalUsers = await User.countDocuments({ role:false,otpVerified:true });
        // Count total products
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
    if(req.session.role === true){
      try {

        const monthlySales = await Order.aggregate([
          {
            $match: {
              orderStatus: "Delivered",   //Filters documents where the orderStatus field is equal to "Delivered".
            },
          },
          {
            $group: {
              _id: { $month: "$orderedDate" },  //Groups the documents by the month of the orderedDate.
              totalSales: { $sum: "$totalOrderAmount" },  //Calculates the total sales for each month using $sum on the totalOrderAmount field.
            },
          },
          {
            $project: {
              _id: 0,
              month: "$_id",  //Reshapes the output by renaming the _id field to month and keeping the totalSales field.
              totalSales: 1,
            },
          },
        ]);
  
        res.json(monthlySales);
      } catch (error) {
        console.error("Error fetching monthly sales:", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    }
  },


  popularProduct: async (req, res) => {
    if(req.session.role === true){
      try {

        const mostPopularProduct = await Wishlist.aggregate([
          { $unwind: "$products" }, // Unwind the products array
          { $group: { _id: "$products", count: { $sum: 1 } } }, //  Groups by product ID & Count occurrences of each product
          { $sort: { count: -1 } }, // Sort in descending order based on count
          { $limit: 1 }, // Limit to the first result (most popular)
        ]);
  
        if (mostPopularProduct.length === 0) {
          return res.json({ message: "No popular product found" });
        }
        // Take the first element of the array (mostPopularProduct[0]) to get information about the most popular product.
        const mostPopularItem = mostPopularProduct[0];
        // productId is then extracted from the _id field of mostPopularItem
        const productId = mostPopularItem._id;
        // Count of occurrences of the most popular product in wishlists
        const productCountInWishlist = mostPopularItem.count;
        //  Retrieve detailed information about the most popular product using its ID.
        const productInfo = await Product.findById(productId);
  
        res.json({ productInfo, count: productCountInWishlist });
      } catch (error) {
        console.error("Error fetching most popular product:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }else{
      res.redirect('/login')
    }
  },


  mostOrderedProduct: async (req, res) => {
    if(req.session.role === true){
      try {

        const mostOrderedProduct = await Order.aggregate([
          { $unwind: "$products" },   // Deconstruct the products array, creating a separate document for each element in the array. 
          {
            $group: {
              _id: "$products.product",   //  Groups the documents by the unique product ID (_id: "$products.product") 
              totalOrders: { $sum: "$products.quantity" },   // Calculates the total quantity ordered for each product
            },
          },
          { $sort: { totalOrders: -1 } },   // The results are sorted in descending order
          { $limit: 1 },    // Limits the output to only the first document
        ]);
  
        if (mostOrderedProduct.length > 0) {
          // Extracts the product ID 
          const mostOrderedProductId = mostOrderedProduct[0]._id;
          // Find details of the product using productId
          const mostOrderedProductDetails = await Product.findById( mostOrderedProductId );
          res.json({
            productInfo: mostOrderedProductDetails,
            totalOrders: mostOrderedProduct[0].totalOrders,
          });
        }
      } catch (error) {
        console.error("Error fetching most ordered product:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }else{
      res.redirect('/login')
    }
  },


  mostActiveUser: async (req, res) => {
    if(req.session.role === true){
      try {

        const mostActiveUser = await Order.aggregate([
          { $group: { _id: "$user", totalOrders: { $sum: 1 } } },   // Groups orders by user ID and calculates the total number of orders for each user.
          { $sort: { totalOrders: -1 } },
          { $limit: 1 },  // The results are sorted in descending order based on the total orders and limited to one result (most active user).
        ]);
  
        if (mostActiveUser.length === 0) {
          return res.json({ message: "No active user found" });
        }
        // Retrieves the user Id
        const userId = mostActiveUser[0]._id;
        // Retrieves the count of orders
        const totalOrders = mostActiveUser[0].totalOrders;
        // Gets info of user using userId
        const user = await User.findById(userId);
  
        res.json({ userInfo: user, totalOrders });
      } catch (error) {
        console.error("Error fetching most active user:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }else{
      res.redirect('/login')
    }
  },


  userSignups: async (req, res) => {
    if(req.session.role === true){
      try {

        const monthlySignups = await User.aggregate([
          {
            $group: {
              _id: { $month: "$createdAt" },  // Groups user documents based on the month of their createdAt field.
              totalSignups: { $sum: 1 },  // Total no.of signups of the month is calculated.
            },
          },
          { $sort: { _id: 1 } },  // Sort the results in ascending order of months.
        ]);
  
        res.json({ monthlySignups });
      } catch (error) {
        console.error("Error fetching monthly signups:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }else{
      res.redirect('/login')
    }  
  },


  productDataGet: async (req, res) => {
    if(req.session.role === true){
      try {

        // Retrieve all products
        const products = await Product.find({});
        // Used to extract category names
        const categories = [];
        // Iterates over the retrieved products and extracts unique category names.
        for (const product of products) {
          // Checks if the category is not already in the categories array before adding it. 
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
    }else{
      res.redirect('/login')
    }   
  },


  recentUpdates: async (req, res) => {
    if(req.session.role === true){
      try {
        
        // The ObjectId contains a timestamp representing the creation time of the ObjectId. 
        // Retrives the latest signed User from the sorted docs.
        const latestSignup = await User.findOne().sort({ _id: -1 }).limit(1);
        // Retrives the latest added Product from the sorted docs.
        const latestProduct = await Product.findOne().sort({ _id: -1 }).limit(1);
        // Count orders with orderStatus Pending
        const pendingOrders = await Order.find({
          orderStatus: "Pending",
        }).countDocuments();
  
        res.json({ latestSignup, pendingOrders, latestProduct });
      } catch (error) {
        console.error("Error fetching recent data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }else{
      res.redirect('/login')
    } 
  },
  
};
