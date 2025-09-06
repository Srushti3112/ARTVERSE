const express = require("express");
const userCtrl = require("../controllers/user");
const isAuthenticated = require("../middlewares/isAuth");
const multer = require("multer");
const upload = multer();
const ArtistProfile = require("../model/ArtistProfileForm");
const User = require("../model/User"); // Add this import

const router = express.Router();

// Middleware to log request body
const logRequest = (req, res, next) => {
  // console.log("Request body:", req.body);
  next();
};

//!Register
router.post("/api/users/register", logRequest, userCtrl.register);

//!Login
router.post("/api/users/login", logRequest, userCtrl.login);

//!Profile
router.get("/api/users/profile", isAuthenticated, async (req, res) => {
  try {
    const { email } = req.query;
    const profile = await ArtistProfile.findOne({ email });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

//!ArtistProfileForm
router.post(
  "/api/users/ArtistProfileForm",
  logRequest,
  upload.none(), // Ensure no file upload is expected
  async (req, res) => {
    try {
      const { username, bio, location, socialMedia, email, artCategory, role } =
        req.body;

      // Debug log
      console.log("Attempting to create profile with data:", req.body);

      // Validate required fields
      if (!username || !email || !artCategory) {
        return res.status(400).json({
          message: "Please fill all required fields",
          missing: [
            !username && "username",
            !email && "email",
            !artCategory && "artCategory",
          ].filter(Boolean),
        });
      }

      // Check for existing profile
      const existingProfile = await ArtistProfile.findOne({ email });
      if (existingProfile) {
        return res.status(400).json({
          message: "Profile already exists for this email",
        });
      }

      // Find existing user
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({
          message: "User not found. Please complete registration first",
        });
      }

      // Create new profile with explicit defaults
      const newProfile = new ArtistProfile({
        username,
        bio: bio || "",
        location: location || "Not specified",
        socialMediaUrl: socialMedia || "",
        email,
        artCategory,
        userType: role || "artist",
      });

      // Debug log before save
      console.log("Attempting to save profile:", newProfile);

      const savedProfile = await newProfile.save();

      // Debug log after save
      console.log("Profile saved successfully:", savedProfile);

      res.status(201).json({
        message: "Profile created successfully",
        profile: savedProfile,
      });
    } catch (error) {
      console.error("Profile creation error:", error);
      res.status(500).json({
        message: "Error creating profile",
        error: error.message,
        details: error.toString(),
      });
    }
  }
);

module.exports = router;
