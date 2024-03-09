const { Wishlist } = require("../Model/db");

module.exports = {

  wishlistGet: async (req, res) => {
    if (req.session.email) {
      try {
        const dynamicTitle = "Wishlist";
        const userId = req.session.user.userId;

        const wishlist = await Wishlist.findOne({ user: userId }).populate(
          "products"
        );
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
        const productId = req.params.productId;
        const userId = req.session.user.userId;
        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
          wishlist = new Wishlist({ user: userId, products: [] });
        }

        const { isRedColor } = req.body;
        const shouldRemove = isRedColor === "true";
        if (shouldRemove) {
          wishlist.products.pull(productId);
        } else {
          wishlist.products.push(productId);
        }

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
        const userId = req.session.user.userId;
        const userWishlist = await Wishlist.findOne({ user: userId });
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
        const productId = req.params.productId;
        const userId = req.session.user.userId;

        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
          wishlist = new Wishlist({ user: userId, products: [] });
        }

        if (wishlist.products.includes(productId)) {
          return res.redirect("/wishlist");
        } else {
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
        const productId = req.params.productId;
        const userId = req.session.user.userId;

        const wishlist = await Wishlist.findOne({ user: userId });
        if (wishlist) {
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
