const User = require("../model/User");
const Category = require("../models/Category");

exports.createArtistProfile = async (req, res) => {
  try {
    console.log("Creating artist profile:", req.body);

    const { username, email, bio, location, artCategory, socialMedia, role } =
      req.body;

    if (!email || !username || !artCategory) {
      return res.status(400).json({
        message: "Email, username, and art category are required",
      });
    }

    const categoryName = artCategory.toLowerCase().trim();

    // Create or update user profile
    const userProfile = await User.findOneAndUpdate(
      { email },
      {
        username,
        email,
        bio: bio || "No bio provided",
        location: location || "Not specified",
        artCategory: categoryName,
        socialMedia: socialMedia || "",
        role,
        isProfileComplete: true,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(201).json({
      message: "Artist profile created successfully",
      profile: userProfile,
    });
  } catch (error) {
    console.error("Profile creation error:", error);
    res.status(500).json({
      message: "Error creating artist profile",
      error: error.message,
    });
  }
};
