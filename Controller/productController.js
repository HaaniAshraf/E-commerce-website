const { Product,Banner,Wishlist,Cart,Review } = require("../Model/db");

module.exports = {

  productlistGet: async (req, res) => {
    if(req.session.role == true){
      try {
        // Extract the page and limit parameters from the request query, with default values if not provided
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // Calculate the number of documents to skip based on the page and limit
        const skip = (page - 1) * limit;
        
        // Count the total number of products in the database
        const productsCount = await Product.countDocuments();
        // Calculate the total number of pages based on the total number of products and the limit
        const totalPages = Math.ceil(productsCount / limit);
        
        // Fetch a list of products, skipping documents based on the calculated skip value and limiting to the specified number
        const products = await Product.find().skip(skip).limit(limit);
  
        res.render("productlist", {
          products,
          currentPage: page,
          itemsPerPage: limit,
          totalPages,
        });

      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    }
  },


  productDetailsGet: async (req, res) => {
      try {
        const dynamicTitle = "Product Details";
        // Extract the productId from the request parameters
        const productId = req.params.productId;
        // Fetch the product details based on the productId
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ success: false, error: "Product not found" });
        }
        
        // Fetch product reviews for the specified productId, populating user details for each review.
        const productReview = await Review.findOne({
          product: productId,
        }).populate("reviews.user");

        res.render("productDetails", {
          product,
          title: dynamicTitle,
          productReview,
        });

      } catch (error) {
        console.error("Error fetching product details:", error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
      } 
  },


  addProductGet: async (req, res) => {
    if(req.session.role == true){
      res.render("addProduct");
    }else{
      res.redirect('/login')
    }
  },


  addProductPost: async (req, res) => {
    if(req.session.role == true){
      try {
        // Extract product details from the request body
        const { name, category, description, rating, price, ogPrice } = req.body;
        // Map uploaded files to their respective URLs
        const images = req.files.map((file) => "/images/uploads/" + file.filename);
        // Define valid product categories
        const validCategories = [
          "home",
          "mens",
          "womens",
          "jewelry",
          "perfume",
          "electronics",
        ];
        if (!validCategories.includes(category)) {
          return res.status(400).send("Invalid category");
        }

        // Create a new product instance with the extracted details
        const newProduct = new Product({
          imageUrls: images,
          name,
          category,
          description,
          rating,
          price,
          ogPrice,
        });
        // Save the new product to the database
        await newProduct.save();
        res.redirect("/productlist");

      } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    } 
  },


  updateProductGet: async (req, res) => {
    if(req.session.role == true){
      // Extract the productId from the request paramaters
      const productId = req.params.productId;
      try {

        // Retrive the product using productId
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).send("Product not found");
        }
        res.render("updateProduct", { product });

      } catch (error) {
        console.error("Error fetching product for update:", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    } 
  },


  updateProductPost: async (req, res) => {
    if(req.session.role == true){     
      try {
        // Extract product details and product ID from the request parameters and body
        const productId = req.params.productId;
        const { name, category, description, rating, price, ogPrice } = req.body;
        // Find the existing product in the database based on the product ID
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ success: false, error: "Product not found" });
        }

        let images;
        if (req.files && req.files.length > 0) {
          // Map uploaded files to their respective URLs
          images = req.files.map((file) => "/images/uploads/" + file.filename);
        } else {
          // Use the existing images if no new images were uploaded
          images = product.imageUrls[0] || [];
        }

        // Update the existing product with the new details
        const updatedProduct = await Product.findByIdAndUpdate(
          productId,
          {
            $set: {
              imageUrls: images,
              name,
              category,
              description,
              rating,
              price,
              ogPrice,
            },
          },
          { new: true }
        );

        if (!updatedProduct) {
          return res.status(404).json({ success: false, error: "Product not found" });
        }
        res.redirect("/productlist");

      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
      }
    }else{
      res.redirect('/login')
    } 
  },


  deleteProduct: async (req, res) => {
    if(req.session.role == true){
      try {

        // Extract the productId from request parameters
        const productId = req.params.productId;
        // Delete the product of the extracted productId
        await Product.deleteOne({ _id: productId });
        res.redirect("/productlist");

      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }else{
      res.redirect('/login')
    }
  },


  searchGet: async (req, res) => {
    try {
      // Extract the search term from the query parameters
      const searchTerm = req.query.searchWord;
      const userId = req.session.user ? req.session.user.userId : null;

      if (searchTerm) {
        // Create a regular expression for case-insensitive search using the search term
        const regex = new RegExp(escapeRegex(searchTerm), "gi");
        // Find products whose names match the search term
        const foundProducts = await Product.find({ name: regex });

        // Function to escape special characters in the search term for regex
        function escapeRegex(text) {
          return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        }

        // Get the user's wishlist and cart for display on the search page
        const userWishlist = await Wishlist.findOne({ user: userId });
        const userCart = await Cart.findOne({ user: userId });

        res.render("searchPage", {
          products: foundProducts,
          searchTerm,
          userWishlist,
          userCart,
        });
      } else {
        res.render("searchPage", { products: [], searchTerm: "" });
      }

    } catch (error) {
      console.error("Error during search get:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  filterProductsGet: async (req, res) => {
    try {
      // Extract filter parameters from the query string
      const { minPrice, maxPrice, price, rating, category, sort } = req.query;

      // Retrieve banners for display on the userHome page
      const banners = await Banner.find();
      // Initialize variables for user wishlist and cart information
      let userWishlist = null;
      let wishlistCount = 0;
      let userCart = null;
      let cartCount = 0;

      if (req.session.email) {
        try {
          // Get user ID from the session
          const userId = req.session.user.userId;
          // Retrieve user's wishlist and count the number of items in the wishlist
          userWishlist = await Wishlist.findOne({ user: userId });
          if (userWishlist) {
            wishlistCount = userWishlist.products.length;
          }
          // Retrieve user's cart and count the number of items in the cart
          userCart = await Cart.findOne({ user: userId });
          if (userCart) {
            cartCount = userCart.products.length;
          }
        } catch (error) {
          res.status(500).send("Internal Server Error");
          return;
        }
      }

      const filterQuery = {};

      // Apply price range filters based on user selection
      if (price === "Between 10k and 50k") {
        filterQuery.price = { $gte: 10000, $lte: 50000 };
      } else if (price === "Above 50k") {
        filterQuery.price = { $gt: 50000 };
      } else if (minPrice && maxPrice) {
        // Apply custom price range filters if provided
        const parsedMinPrice = parseInt(minPrice);
        const parsedMaxPrice = parseInt(maxPrice);

        if (minPrice !== "2500" || maxPrice !== "7500") {
          if (!isNaN(parsedMinPrice) && !isNaN(parsedMaxPrice)) {
            filterQuery.price = { $gte: parsedMinPrice, $lte: parsedMaxPrice };
          } else {
            console.error("Invalid price range input");
          }
        }
      }

      // Apply rating filters based on user selection
      if (rating) {
        if (rating === "5") {
          filterQuery.rating = 5;
        } else if (rating === "above 3") {
          filterQuery.rating = { $gt: 3 };
        } else if (rating === "below 3") {
          filterQuery.rating = { $lt: 3 };
        } else {
          console.error("Invalid rating value");
        }
      }

      // Apply category filter based on user selection
      if (category) {
        filterQuery.category = category;
      }

      // Apply sorting based on user selection
      const sortOption = {};
      if (sort === "AscendingPrice") {
        sortOption.price = 1;
      } else if (sort === "DescendingPrice") {
        sortOption.price = -1;
      } else if (sort === "AscendingRating") {
        sortOption.rating = 1;
      } else if (sort === "DescendingRating") {
        sortOption.rating = -1;
      }
      // Find products based on the filter criteria and apply sorting
      const filteredProduct = await Product.find(filterQuery).sort(sortOption);

      res.render("userHome", {
        banners,
        products: filteredProduct,
        userWishlist,
        wishlistCount,
        userCart,
        cartCount,
      });
    } catch (error) {
      console.error("Error during filter get:", error);
      res.status(500).send("Internal Server Error");
    }
  },
  
};
