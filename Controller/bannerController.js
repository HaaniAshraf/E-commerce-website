const { Banner } = require("../Model/db");

module.exports = {
  
  addBannerGet: async (req, res) => {
    if(req.session.role === true){
      try {
        // Fetching Banners from Database
        const banners = await Banner.find();
        res.render("addBanner", { banners });
  
      } catch (error) {
        console.error("Error fetching banners:", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    }
  },


  addBannerPost: async (req, res) => {
    if(req.session.role === true){
      try {
        // Extracting imageUrl and content from the request body
        const { imageUrl, content } = req.body;
        // Creating a new instance of the Banner model with the extracted data
        const newBanner = new Banner({ imageUrl, content });
        // Saving the new banner to the database
        await newBanner.save();
  
        res.redirect("/addBanner");
      } catch (error) {
        console.error("Error adding banner:", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    }
  },


  updateBannerGet: async (req, res) => {
    if(req.session.role === true){
      try {
        // Extracting the bannerId from the request parameters
        const bannerId = req.params.bannerId;
        // Finding the banner in the database by its ID
        const banner = await Banner.findById(bannerId);
        if (!banner) {
          return res.status(404).send("Banner not found");
        }
  
        res.render("updateBanner", { banner });
      } catch (error) {
        console.error("Error fetching banner for update:", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    }
  },


  updateBannerPost: async (req, res) => {
    if(req.session.role === true){
      // Extracting bannerId from request parameters
      const bannerId = req.params.bannerId;
      // Extracting data from the request body
      const { imageUrl, content, newImageUrl } = req.body;
      try {
        // Finding the banner in the database by its ID
        const banner = await Banner.findById(bannerId);
        if (!banner) {
          return res.status(404).send("Banner not found");
        }
        
        // Updating banner properties with new data
        banner.imageUrl = newImageUrl || imageUrl;
        banner.content = content;
        await banner.save();

        res.redirect( `/addBanner?updatedImageUrl=${banner.imageUrl}&updatedContent=${banner.content}` );
      } catch (error) {
        console.error("Error updating banner:", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    }
   
  },


  deleteBanner: async (req, res) => {
    if(req.session.role === true){
      try {
        // Extracting bannerId from request parameters
        const bannerId = req.params.bannerId;
        // Deleting the banner from the database based on its ID
        await Banner.deleteOne({ _id: bannerId });
        
        res.redirect("/addBanner");
      } catch (error) {
        console.error("Error deleting banner:", error);
      }
    }else{
      res.redirect('/login')
    }
  },

};
