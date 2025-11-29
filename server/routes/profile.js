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
        socialMediaUrl: "",
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

// Test route to verify routing is working
router.get("/artists/test", async (req, res) => {
  res.json({ message: "Artists route is working!", timestamp: new Date() });
});

// Get all artists - MUST be before /:userId route to avoid route conflicts
router.get("/artists/all", async (req, res) => {
  try {
    console.log("Artists route hit! Query:", req.query);
    const { search } = req.query;

    // Find all users with role "artist"
    let userQuery = { role: "artist" };

    // If search query is provided, search by username, email, or artCategory in User model
    if (search) {
      userQuery.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { artCategory: { $regex: search, $options: "i" } },
      ];
    }

    const artists = await User.find(userQuery)
      .select(
        "username email artCategory avatarUrl role createdAt bio location"
      )
      .sort({ createdAt: -1 });

    // Get profiles for each artist to get additional info
    let artistsWithProfiles = await Promise.all(
      artists.map(async (artist) => {
        const profile = await UserProfile.findOne({ userId: artist._id });
        const artworkCount = await Artwork.countDocuments({
          artist: artist._id,
        });

        return {
          _id: artist._id,
          userId: artist._id,
          username: artist.username,
          email: artist.email,
          fullName: profile?.fullName || artist.username,
          bio: profile?.bio || artist.bio || "",
          artCategory: profile?.artCategory || artist.artCategory || "",
          location: profile?.location || artist.location || "",
          avatarUrl: artist.avatarUrl || profile?.avatarUrl || null,
          socialMediaUrl: profile?.socialMediaUrl || "",
          artworkCount: artworkCount,
          createdAt: artist.createdAt,
        };
      })
    );

    // If search query is provided, also filter by profile fields (fullName, location, bio)
    if (search) {
      const searchLower = search.toLowerCase();
      artistsWithProfiles = artistsWithProfiles.filter((artist) => {
        return (
          artist.fullName?.toLowerCase().includes(searchLower) ||
          artist.location?.toLowerCase().includes(searchLower) ||
          artist.bio?.toLowerCase().includes(searchLower) ||
          artist.artCategory?.toLowerCase().includes(searchLower)
        );
      });
    }

    res.json(artistsWithProfiles);
  } catch (error) {
    console.error("Error fetching artists:", error);
    res.status(500).json({ error: "Server error", details: error.message });
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
      socialMediaUrl: profile?.socialMediaUrl || "",
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
      socialMediaUrl,
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
        socialMediaUrl,
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
