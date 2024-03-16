const { Wishlist } = require("../Model/db");

module.exports = {

  wishlistGet: async (req, res) => {
    if (req.session.email) {
      try {
        const dynamicTitle = "Wishlist";
        // Extract user information from the session
        const userId = req.session.user.userId;

        // Fetch user's wishlist from the database, populating the "products" field
        const wishlist = await Wishlist.findOne({ user: userId }).populate( "products" );
        // Initialize wishlistCount
        let wishlistCount = 0;
        if (!wishlist) {
          res.render("wishlist", {
            wishlistProducts: [],
            title: dynamicTitle,
            wishlistCount,
          });
          return;
        }

        if (wishlist) {
          wishlistCount = wishlist.products.length;
        }
        res.render("wishlist", {
          wishlistProducts: wishlist.products,
          title: dynamicTitle,
          wishlistCount,
        });

      } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      res.redirect("/login");
    }
  },


  wishlistToggle: async (req, res) => {
    if (req.session.email) {
      try {
        // Extract productId from the request parameter
        const productId = req.params.productId;
        // Extract userId from the session
        const userId = req.session.user.userId;
        // Fetch user's wishlist from the database
        let wishlist = await Wishlist.findOne({ user: userId });
        // If the wishlist doesn't exist, create a new one
        if (!wishlist) {
          wishlist = new Wishlist({ user: userId, products: [] });
        }

        // Extract the "isRedColor" parameter from the request body
        const { isRedColor } = req.body;
        // Determine whether to add or remove the product from the wishlist
        const shouldRemove = isRedColor === "true";
        if (shouldRemove) {
          wishlist.products.pull(productId);
        } else {
          wishlist.products.push(productId);
        }

        // Save the updated wishlist to the database
        await wishlist.save();
        res.status(200).json({ success: true });

      } catch (error) {
        console.error("Error toggling wishlist:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      res.status(401).json({ error: "User not authenticated" });
    }
  },


  wishlistCount: async (req, res) => {
    if (req.session.email) {
      try {
        // Extract the user ID from the session
        const userId = req.session.user.userId;
        // Fetch the user's wishlist from the database
        const userWishlist = await Wishlist.findOne({ user: userId });
        // Calculate the wishlist count based on the number of products in the wishlist
        const wishlistCount = userWishlist ? userWishlist.products.length : 0;

        res.json({ wishlistCount });
      } catch (error) {
        console.error("Error fetching wishlist count:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      res.redirect("/login");
    }
  },


  addToWishlist: async (req, res) => {
    if (req.session.email) {
      try {
        // Extract productId from the request parameter
        const productId = req.params.productId;
        // Extract userId from session
        const userId = req.session.user.userId;

        // Find or create a wishlist for the user
        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
          wishlist = new Wishlist({ user: userId, products: [] });
        }

        // Check if the product is already in the wishlist
        if (wishlist.products.includes(productId)) {
          return res.redirect("/wishlist");
        } else {
          // If not in the wishlist, add the product and save 
          wishlist.products.push(productId);
          await wishlist.save();
          res.redirect("/wishlist");
        }

      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.redirect("/login");
    }
  },


  removeFromWishist: async (req, res) => {
    if (req.session.email) {
      try {
        // Extract productId from the request parameter
        const productId = req.params.productId;
        // Extract userId from session
        const userId = req.session.user.userId;

        // Find the user's wishlist
        const wishlist = await Wishlist.findOne({ user: userId });
        if (wishlist) {
          // Remove the specified product from the wishlist
          wishlist.products.pull(productId);
          await wishlist.save();
          res.redirect("/wishlist");
        } else {
          res.status(404).send("Wishlist not found");
        }
        
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        res.status(500).send("Internal Server Error");
      }
    }
  }
  
};