const { Banner } = require("../Model/db");

module.exports = {
  
  addBannerGet: async (req, res) => {
    try {
      const banners = await Banner.find();
      res.render("addBanner", { banners });
    } catch (error) {
      console.error("Error fetching banners:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  addBannerPost: async (req, res) => {
    try {
      const { imageUrl, content } = req.body;
      const newBanner = new Banner({ imageUrl, content });
      await newBanner.save();
      res.redirect("/addBanner");
    } catch (error) {
      console.error("Error adding banner:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  updateBannerGet: async (req, res) => {
    const bannerId = req.params.bannerId;
    try {
      const banner = await Banner.findById(bannerId);
      if (!banner) {
        return res.status(404).send("Banner not found");
      }
      res.render("updateBanner", { banner });
    } catch (error) {
      console.error("Error fetching banner for update:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  updateBannerPost: async (req, res) => {
    const bannerId = req.params.bannerId;
    const { imageUrl, content, newImageUrl } = req.body;
    try {
      const banner = await Banner.findById(bannerId);
      if (!banner) {
        return res.status(404).send("Banner not found");
      }
      banner.imageUrl = newImageUrl || imageUrl;
      banner.content = content;
      await banner.save();
      res.redirect(
        `/addBanner?updatedImageUrl=${banner.imageUrl}&updatedContent=${banner.content}`
      );
    } catch (error) {
      console.error("Error updating banner:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  deleteBanner: async (req, res) => {
    try {
      const bannerId = req.params.bannerId;
      await Banner.deleteOne({ _id: bannerId });
      res.redirect("/addBanner");
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  },

};
