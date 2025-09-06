const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Artwork = require("../model/Artwork");
const isAuthenticated = require("../middlewares/isAuth");
const User = require("../model/User"); // Add this import

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
  isAuthenticated,
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("Received file:", req.file); // Debug log
      console.log("Received body:", req.body); // Debug log

      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // Convert buffer to base64
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      // Upload to Cloudinary with specific options
      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: "artverse_artworks",
        resource_type: "auto",
        allowed_formats: ["jpg", "png", "jpeg", "gif"],
        transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
      });

      console.log("Cloudinary response:", uploadResponse); // Debug log

      // Create new artwork with validated data
      const artwork = new Artwork({
        title: req.body.title,
        description: req.body.description,
        imageUrl: uploadResponse.secure_url,
        cloudinaryId: uploadResponse.public_id,
        category: req.body.category,
        artist: req.user,
      });

      await artwork.save();
      console.log("Artwork saved:", artwork); // Debug log

      res.status(201).json({
        message: "Artwork uploaded successfully",
        artwork,
      });
    } catch (error) {
      console.error("Upload error details:", error); // Detailed error log
      res.status(500).json({
        message: "Error uploading artwork",
        error: error.message,
      });
    }
  }
);

// Add delete route
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    // Verify ownership
    if (artwork.artist.toString() !== req.user) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this artwork" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(artwork.cloudinaryId);

    // Delete from database
    await artwork.deleteOne();

    res.json({ message: "Artwork deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting artwork" });
  }
});

// Get user's artworks
router.get("/my-artworks", isAuthenticated, async (req, res) => {
  try {
    const artworks = await Artwork.find({ artist: req.user }).sort({
      createdAt: -1,
    });
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching artworks" });
  }
});

// Add this new route for featured artworks
router.get("/featured", async (req, res) => {
  try {
    const artworks = await Artwork.aggregate([
      { $sample: { size: 8 } },
      {
        $lookup: {
          from: "registered_users", // Updated: collection name should match your User model
          localField: "artist",
          foreignField: "_id",
          as: "artistDetails",
        },
      },
      {
        $addFields: {
          artistName: { $arrayElemAt: ["$artistDetails.username", 0] },
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          imageUrl: 1,
          category: 1,
          artistName: 1,
          cloudinaryId: 1,
          price: 1,
          createdAt: 1,
        },
      },
    ]);

    res.json(artworks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured artworks" });
  }
});

// Add this new route for explore
router.get("/explore", async (req, res) => {
  try {
    const artworks = await Artwork.aggregate([
      {
        $lookup: {
          from: "registered_users", // Changed from "users" to "registered_users"
          localField: "artist",
          foreignField: "_id",
          as: "artistDetails",
        },
      },
      {
        $unwind: "$artistDetails", // Add unwind to flatten the array
      },
      {
        $project: {
          title: 1,
          description: 1,
          imageUrl: 1,
          category: 1,
          createdAt: 1,
          artist: "$artist", // Include the artist ID
          artistName: "$artistDetails.username", // Directly map username
          price: 1,
          likes: { $ifNull: ["$likes", 0] }, // Ensure likes field is included
        },
      },
    ]).sort({ createdAt: -1 });

    console.log("Fetched artworks:", artworks); // Debug log
    res.json(artworks);
  } catch (error) {
    console.error("Error fetching artworks:", error);
    res.status(500).json({ message: "Error fetching artworks" });
  }
});

// Add wishlist routes
router.post("/wishlist/add", isAuthenticated, async (req, res) => {
  try {
    const { artworkId } = req.body;
    const userId = req.user;

    // Atomically increment likes and return updated document
    const updatedArtwork = await Artwork.findByIdAndUpdate(
      artworkId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!updatedArtwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    // Add to user's wishlist if not already there
    await User.updateOne(
      { _id: userId },
      { $addToSet: { wishlist: artworkId } }
    );

    res.json({ message: "Added to wishlist", artwork: updatedArtwork });
  } catch (error) {
    console.error("Wishlist add error:", error);
    res.status(500).json({ message: "Error adding to wishlist" });
  }
});

router.post("/wishlist/remove", isAuthenticated, async (req, res) => {
  try {
    const { artworkId } = req.body;
    const userId = req.user;

    // Atomically decrement likes and ensure it doesn't go below 0
    const updatedArtwork = await Artwork.findByIdAndUpdate(
      artworkId,
      [
        {
          $set: {
            likes: {
              $max: [{ $subtract: ["$likes", 1] }, 0],
            },
          },
        },
      ],
      { new: true }
    );

    if (!updatedArtwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    // Remove from user's wishlist
    await User.updateOne({ _id: userId }, { $pull: { wishlist: artworkId } });

    res.json({ message: "Removed from wishlist", artwork: updatedArtwork });
  } catch (error) {
    console.error("Wishlist remove error:", error);
    res.status(500).json({ message: "Error removing from wishlist" });
  }
});

// Update get wishlist route to include artwork details
router.get("/wishlist", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user).populate({
      path: "wishlist",
      select: "title description imageUrl category artistName _id",
      model: "Artwork", // Explicitly specify the model
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.wishlist || []);
  } catch (error) {
    console.error("Wishlist fetch error:", error);
    res.status(500).json({ message: "Error fetching wishlist" }); // Fixed syntax error
  }
});

// Add this new route to get artwork by ID
router.get("/:id", async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    res.json(artwork);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update the get artworks by artist route
router.get("/artist/:artistId", async (req, res) => {
  try {
    const { artistId } = req.params;

    // Validate artistId
    if (!artistId || artistId === "undefined") {
      return res.status(400).json({ message: "Valid artist ID is required" });
    }

    // Validate if artistId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(artistId)) {
      return res.status(400).json({ message: "Invalid artist ID format" });
    }

    const artworks = await Artwork.find({ artist: artistId })
      .populate("artist", "username email")
      .sort({ createdAt: -1 });

    console.log(`Found ${artworks.length} artworks for artist ${artistId}`);
    res.json(artworks);
  } catch (error) {
    console.error("Error fetching artist artworks:", error);
    res.status(500).json({
      message: "Error fetching artist artworks",
      error: error.message,
    });
  }
});

module.exports = router;
