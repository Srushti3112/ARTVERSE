const express = require("express");
const mongoose = require("mongoose"); // Add mongoose import
const UserProfile = require("../model/UserProfile");
const User = require("../model/User");
const Artwork = require("../model/Artwork"); // Add this import
const isAuthenticated = require("../middlewares/isAuth");
const router = express.Router();

// Add route for current user's profile
router.get("/current", isAuthenticated, async (req, res) => {
  try {
    console.log("Fetching current user profile, userId:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // First try to find the profile
    const profile = await UserProfile.findOne({ userId: req.user });
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If no profile exists, return user data
    if (!profile) {
      return res.json({
        userId: user._id,
        username: user.username,
        email: user.email,
        bio: "",
        artCategory: user.role || "Artist",
        location: "",
      });
    }

    res.json({
      ...profile.toObject(),
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Error fetching current profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get profile by user ID route
router.get("/:userId", isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Raw userId received:", userId);

    // Handle both string and ObjectId inputs
    const targetUserId = userId === "undefined" ? req.user : userId;
    console.log("Processed targetUserId:", targetUserId);

    if (!targetUserId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({
        message: "Invalid user ID format",
        receivedId: targetUserId,
      });
    }

    // Find all data in parallel
    const [profile, user, artworks] = await Promise.all([
      UserProfile.findOne({ userId: targetUserId }),
      User.findById(targetUserId),
      Artwork.find({ artist: targetUserId })
        .sort({ createdAt: -1 })
        .populate("artist", "username email"),
    ]);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        searchedId: targetUserId,
      });
    }

    // Combine data
    const responseData = {
      userId: user._id,
      username: user.username,
      email: user.email,
      fullName: profile?.fullName || user.username,
      bio: profile?.bio || "",
      artCategory: profile?.artCategory || user.role || "Artist",
      location: profile?.location || "",
      artworks: artworks || [],
    };

    console.log(
      `Found ${artworks?.length || 0} artworks for user ${targetUserId}`
    );
    res.json(responseData);
  } catch (error) {
    console.error("Error in profile route:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
});

// Create or update profile
router.post("/submit-profile", isAuthenticated, async (req, res) => {
  try {
    const {
      userId,
      fullName,
      email,
      bio,
      artCategory,
      location,
      portfolioUrl,
    } = req.body;

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      {
        userId,
        fullName,
        email,
        bio,
        artCategory,
        location,
        portfolioUrl,
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
