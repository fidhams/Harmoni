// Add this to your controllers folder (e.g., userController.js)

const Donor = require("../models/donor");
const Donee = require("../models/donee");

const getUserDetails = async (req, res) => {
  const { userType, userId } = req.params;
  
  try {
    let user;
    
    if (userType === 'donor') {
      user = await Donor.findById(userId);
    } else if (userType === 'donee') {
      user = await Donee.findById(userId);
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Return only necessary information
    res.status(200).json({
      id: user._id,
      name: user.name,
      type: userType
      // Add other fields you might need, but be careful with sensitive data
    });
    
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Error fetching user details", error });
  }
};

module.exports = {
  getUserDetails
};