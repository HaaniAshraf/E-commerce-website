const { User, Profile, Address, Product, Banner, Wishlist, Cart, Order } = require("../Model/db");

module.exports = {

  userhomeGet: async (req, res) => {
    try {
      // Fetch banners and home products
      const banners = await Banner.find();
      const homeProducts = await Product.find({ category: "home" });
      // Initialize variables for user wishlist and cart
      let userWishlist = null;
      let wishlistCount = 0;
      let userCart = null;
      let cartCount = 0;

      if (req.session.email) {
        try {
          // If logged in, fetch user's wishlist and cart
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
          res.status(500).send("Internal Server Error");
          return;
        }
      }

      res.render("userHome", {
        banners,
        products: homeProducts,
        userWishlist,
        wishlistCount,
        userCart,
        cartCount,
      });

    } catch (error) {
      console.error("Error fetching homeProducts:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  menSectionGet: async (req, res) => {
    try {
      // Fetch men's section products
      const menProducts = await Product.find({ category: "mens" });
      // Initialize variables for user wishlist and cart
      let userWishlist = null;
      let wishlistCount = 0;
      let userCart = null;
      let cartCount = 0;

      if (req.session.email) {
        try {
          // If logged in, fetch user's wishlist and cart
          const userId = req.session.user.userId;
          userWishlist = await Wishlist.findOne({ user: userId });
          userCart = await Cart.findOne({ user: userId });
          // Update wishlist and cart count
          if (userWishlist) {
            wishlistCount = userWishlist.products.length;
          }
          if (userCart) {
            wishlistCount = userCart.products.length;
          }
        } catch (error) {
          res.status(500).send("Internal Server Error");
          return;
        }
      }

      res.render("menSection", {
        products: menProducts,
        userWishlist,
        wishlistCount,
        userCart,
        cartCount,
      });

    } catch (error) {
      console.error("Error fetching mencategory products:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  womenSectionGet: async (req, res) => {
    try {
      // Fetch women's section products
      const womenProducts = await Product.find({ category: "womens" });
      // Initialize variables for user wishlist and cart
      let userWishlist = null;
      let wishlistCount = 0;
      let userCart = null;
      let cartCount = 0;

      if (req.session.email) {
        try {
          // If logged in, fetch user's wishlist and cart
          const userId = req.session.user.userId;
          userWishlist = await Wishlist.findOne({ user: userId });
          userCart = await Cart.findOne({ user: userId });
          // Update wishlist and cart count
          if (userWishlist) {
            wishlistCount = userWishlist.products.length;
          }
          if (userCart) {
            cartCount = userCart.products.length;
          }
        } catch (error) {
          res.status(500).send("Internal Server Error");
          return;
        }
      }

      res.render("womenSection", {
        products: womenProducts,
        userWishlist,
        wishlistCount,
        userCart,
        cartCount,
      });

    } catch (error) {
      console.error("Error fetching womencategory products:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  jewelrySectionGet: async (req, res) => {
    try {
      // Fetch jewelry section products
      const jewelryProducts = await Product.find({ category: "jewelry" });
      // Initialize variables for user wishlist and cart
      let userWishlist = null;
      let wishlistCount = 0;
      let userCart = null;
      let cartCount = 0;

      if (req.session.email) {
        try {
          // If logged in, fetch user's wishlist and cart
          const userId = req.session.user.userId;
          userWishlist = await Wishlist.findOne({ user: userId });
          userCart = await Cart.findOne({ user: userId });
          // Update wishlist and cart count
          if (userWishlist) {
            wishlistCount = userWishlist.products.length;
          }
          if (userCart) {
            cartCount = userCart.products.length;
          }
        } catch (error) {
          res.status(500).send("Internal Server Error");
          return;
        }
      }

      res.render("jewelrySection", {
        products: jewelryProducts,
        userWishlist,
        wishlistCount,
        userCart,
        cartCount,
      });

    } catch (error) {
      console.error("Error fetching jewelrycategory products:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  perfumeSectionGet: async (req, res) => {
    try {
      // Fetch perfume section products
      const perfumeProducts = await Product.find({ category: "perfume" });
      // Initialize variables for user wishlist and cart
      let userWishlist = null;
      let wishlistCount = 0;
      let userCart = null;
      let cartCount = 0;

      if (req.session.email) {
        try {
          // If logged in, fetch user's wishlist and cart
          const userId = req.session.user.userId;
          userWishlist = await Wishlist.findOne({ user: userId });
          userCart = await Cart.findOne({ user: userId });
          // Update wishlist and cart count
          if (userWishlist) {
            wishlistCount = userWishlist.products.length;
          }
          if (userCart) {
            cartCount = userCart.products.length;
          }
        } catch (error) {
          res.status(500).send("Internal Server Error");
          return;
        }
      }

      res.render("perfumeSection", {
        products: perfumeProducts,
        userWishlist,
        wishlistCount,
        userCart,
        cartCount,
      });

    } catch (error) {
      console.error("Error fetching perfumecategory products:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  electronicSectionGet: async (req, res) => {
    try {
      // Fetch electronics section products
      const electronicProducts = await Product.find({ category: "electronics" });
      // Initialize variables for user wishlist and cart
      let userWishlist = null;
      let wishlistCount = 0;
      let userCart = null;
      let cartCount = 0;

      if (req.session.email) {
        try {
          // If logged in, fetch user's wishlist and cart
          const userId = req.session.user.userId;
          userWishlist = await Wishlist.findOne({ user: userId });
          userCart = await Cart.findOne({ user: userId });
          // Update wishlist and cart count
          if (userWishlist) {
            wishlistCount = userWishlist.products.length;
          }
          if (userCart) {
            cartCount = userCart.products.length;
          }
        } catch (error) {
          res.status(500).send("Internal Server Error");
          return;
        }
      }

      res.render("electronicSection", {
        products: electronicProducts,
        userWishlist,
        wishlistCount,
        userCart,
        cartCount,
      });

    } catch (error) {
      console.error("Error fetching electroniccategory products:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  userlistGet: async (req, res) => {
    try {
      // Fetch regular users (users with role set to false) excluding the password field
      const regularUsers = await User.find({ role: false },{ password:0 });
      res.render("userlist", { regularUsers });

    } catch (error) {
      console.error("Error fetching user list:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  
  userDetailsGet: async (req, res) => {
    try {
      // Extract the userId parameter from the request parameters
      const userId = req.params.userId;
      // Fetch user details from different collections.
      const user = await User.findById(userId);
      const profile = await Profile.findOne({ userId: userId });
      const address = await Address.findOne({ userId: userId });
      const wishlist = await Wishlist.findOne({ user: userId }).populate( "products" );
      const cart = await Cart.findOne({ user: userId }).populate({ path: "products.product" });
      const order = await Order.find({ user: userId }).populate({ path: "products.product" });

      res.render("userDetails", {
        user,
        profile,
        address,
        wishlist,
        cart,
        order,
      });

    } catch (error) {
      console.log(error);
    }
  },


  blockUser: async (req, res) => {
    try {
      // Extract userId from request parameters
      const userId = req.params.userId;
      // Find the user using userId
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }

      // Update status of user as "blocked" and save in database
      user.status = "blocked";
      await user.save();
      res.status(200).json({ success: true, message: "User blocked successfully" });

    } catch (error) {
      console.error("Error blocking user:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  unblockUser: async (req, res) => {
    try {
      // Extract userId from request parameters
      const userId = req.params.userId;
      // Find the user using userId
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }

      // Update status of user as "active" and save in database
      user.status = "active";
      await user.save();
      res.status(200).json({ success: true, message: "User unblocked successfully" });

    } catch (error) {
      console.error("Error unblocking user:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  removeUser: async (req, res) => {
    try {
      // Extract userId from request parameters
      const userId = req.params.userId;
      // Delete the user using userId
      const user = await User.deleteOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
      res.redirect("/userlist");

    } catch (error) {
      console.error("Error removing user:", error);
      res.redirect("/userlist");
    }
  },
  
};
