const express = require("express");
const router = express.Router();
const ArtistProfile = require("../model/ArtistProfileForm");
const multer = require("multer");
const upload = multer();

// Shared handler that accepts either frontend or previous keys and maps to the schema
const handleArtistProfile = async (req, res) => {
  try {
    const {
      username,
      fullName,
      email,
      bio,
      location,
      portfolioUrl,
      socialMedia,
      socialMediaUrl,
      artCategory,
    } = req.body;

    const finalUsername = username || fullName;
    const finalSocial = portfolioUrl || socialMedia || socialMediaUrl || "";

    // Validate required fields
    if (!finalUsername || !email || !artCategory) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    // Create a new artist profile using the schema field names
    const newProfile = new ArtistProfile({
      username: finalUsername,
      email,
      bio: bio || "",
      location: location || "Not specified",
      socialMediaUrl: finalSocial,
      artCategory,
      userType: "artist",
    });

    await newProfile.save();

    res.status(201).json({ message: "Profile submitted successfully!" });
  } catch (error) {
    console.error("Error submitting the profile:", error);
    res.status(500).json({ message: "Error submitting the profile" });
  }
};

// NOTE: Do not include an '/api' prefix here if you mount this router with app.use('/api', ...).
// If mounted with app.use('/api', router), these routes will resolve to:
//   POST /api/artist-profile
//   POST /api/users/ArtistProfileForm
router.post("/artist-profile", upload.none(), handleArtistProfile);
router.post("/users/ArtistProfileForm", upload.none(), handleArtistProfile);

module.exports = router;
