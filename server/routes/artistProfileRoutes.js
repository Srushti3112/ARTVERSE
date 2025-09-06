const express = require("express");
const router = express.Router();
const ArtistProfile = require("../model/ArtistProfileForm");
const multer = require("multer");
const upload = multer();

// POST route to handle artist profile submission
router.post("/api/artist-profile", upload.none(), async (req, res) => {
  try {
    const { fullName, email, portfolioUrl, artCategory } = req.body;

    // Validate required fields
    if (!fullName || !email || !artCategory) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    // Create a new artist profile
    const newProfile = new ArtistProfile({
      fullName,
      email,
      socialMediaUrl: portfolioUrl,
      artCategory,
    });

    // Save the profile to the database
    await newProfile.save();

    res.status(201).json({ message: "Profile submitted successfully!" });
  } catch (error) {
    console.error("Error submitting the profile:", error);
    res.status(500).json({ message: "Error submitting the profile" });
  }
});

module.exports = router;
