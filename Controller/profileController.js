const { User, Profile, Address } = require("../Model/db");

module.exports = {

  profileGet: async (req, res) => {
    if (!req.session.email) {
      return res.redirect("/login");
    }
    try {
      const dynamicTitle = "Profile";
      const userId = req.session.user.userId;
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
  },


  profilePost: async (req, res) => {
    try {
      const userId = req.session.user.userId;
      const { name, email, phone, dob, gender, alternateMobile } = req.body;
      const updatedProfile = await Profile.findOneAndUpdate(
        { userId },
        { name, email, phone, dob, gender, alternateMobile },
        { upsert: true, new: true }
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
    const dynamicTitle = "Privacy";
    res.render("privacy", { title: dynamicTitle });
  },


  addressGet: async (req, res) => {
    try {
      const dynamicTitle = "Address";
      const user = await User.findById(req.session.userId);
      if (!user) {
        return res.redirect("/login");
      }

      const username = user.name;
      const userAddresses = await Address.find({ userId: req.session.userId });
      res.render("address", { username, userAddresses, title: dynamicTitle });
    } catch (error) {
      console.error("Error fetching addresses:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  addressAddPost: async (req, res) => {
    const { houseNumber, locality, city, state, pinCode } = req.body;
    try {
      const user = await User.findById(req.session.userId);
      let address = await Address.findOne({ userId: user._id });

      if (!address) {
        let newAddress = new Address({
          userId: user._id,
          username: user.name,
          addresses: [],
        });
        await newAddress.save();
        address = newAddress;
      }

      const newAddress = {
        houseNumber: houseNumber,
        locality: locality,
        city: city,
        state: state,
        pinCode: pinCode,
      };
      address.addresses.push(newAddress);
      await address.save();
      res.redirect("/address");
    } catch (error) {
      console.error("Error adding address:", error);
      res.status(500).send("Internal Server Error");
    }
  },


  addressRemove: async (req, res) => {
    const addressId = req.params.addressId;
    try {
      const removedAddress = await Address.findByIdAndDelete(addressId);

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