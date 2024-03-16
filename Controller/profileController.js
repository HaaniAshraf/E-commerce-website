const { User, Profile, Address } = require("../Model/db");

module.exports = {

  profileGet: async (req, res) => {
    if(req.session.email){
      try {
        const dynamicTitle = "Profile";
        // Get the user ID from the session
        const userId = req.session.user.userId;
        // Attempt to find the user profile based on the user ID
        const userProfile = await Profile.findOne({ userId });
  
        if (userProfile) {
          return res.render("profile", {
            user: userProfile,
            title: dynamicTitle,
          });
        }
  
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).send("User not found");
        }
        res.render("profile", { user, title: dynamicTitle });
      } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    } 
  },


  profilePost: async (req, res) => {
    try {
      // Get the user ID from the session
      const userId = req.session.user.userId;
      // Extract information from the request body
      const { name, email, phone, dob, gender, alternateMobile } = req.body;

      // Use findOneAndUpdate to update the user profile or create a new one if it doesn't exist
      const updatedProfile = await Profile.findOneAndUpdate(
        { userId },
        { name, email, phone, dob, gender, alternateMobile },
        { upsert: true, new: true }   // 'upsert' option creates the profile if it doesn't exist, 'new' returns the updated profile
      );

      if (!updatedProfile) {
        console.error("Profile not found or not updated.");
        return res.status(404).send("Profile not found or not updated.");
      }

      res.json({
        message: "Profile updated successfully",
        redirectUrl: "/profile",
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  privacyGet: async (req, res) => {
    if(req.session.email){
      const dynamicTitle = "Privacy";
      res.render("privacy", { title: dynamicTitle });
    }else{
      res.redirect('/login')
    }  
  },


  addressGet: async (req, res) => {
    if(req.session.email){
      try {
        const dynamicTitle = "Address";
        // Retrive user using userId
        const user = await User.findById(req.session.userId);
        if (!user) {
          return res.redirect("/login");
        }
        
        // Retrive name and addresses of user
        const username = user.name;
        const userAddresses = await Address.find({ userId: req.session.userId });
        res.render("address", { username, userAddresses, title: dynamicTitle });

      } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).send("Internal Server Error");
      }
    }else{
      res.redirect('/login')
    }
  },
   


  addressAddPost: async (req, res) => {
    try {
      // Extract address details from the request body
      const { houseNumber, locality, city, state, pinCode } = req.body;
      // Find the user based on the user ID stored in the session
      const user = await User.findById(req.session.userId);
      // Find the user's existing address
      let address = await Address.findOne({ userId: user._id });

      if (!address) {
        // If the address does not exist, create a new one with default values
        let newAddress = new Address({
          userId: user._id,
          username: user.name,
          addresses: [],
        });
        // Save the new address
        await newAddress.save();
        address = newAddress;
      }

      // Create a new address object with the provided details
      const newAddress = {
        houseNumber: houseNumber,
        locality: locality,
        city: city,
        state: state,
        pinCode: pinCode,
      };
      // Add the new address to the user's address list
      address.addresses.push(newAddress);
      // Save the updated address
      await address.save();
      res.redirect("/address");

    } catch (error) {
      console.error("Error adding address:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  addressRemove: async (req, res) => {
    try {
      // Extract the address ID from the request parameters
      const addressId = req.params.addressId;
      // Extract the userID from the session
      const userId = req.session.user.userId
      // Find and delete the address using the address ID
      const removedAddress = await Address.updateOne(
        // Filter: Find the document where the userId matches
        { userId } ,
        // Remove the address with the specified _id from the addresses array
        { $pull: { addresses:{ _id:addressId }}});
      if (!removedAddress) {
        return res.status(404).send("Address not found");
      }
      res.redirect("/address");
      
    } catch (error) {
      console.error("Error removing address:", error);
      res.status(500).send("Internal Server Error");
    }
  },

};