const express = require("express");
const router = express.Router();
const Wishlist = require("../model/Wishlist");
const isAuthenticated = require("../middlewares/isAuth");

// Get user's wishlist
router.get("/", isAuthenticated, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user }).populate(
      "artworks"
    );

    if (!wishlist) {
      wishlist = { artworks: [] };
    }

    res.json(wishlist.artworks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching wishlist", error: error.message });
  }
});

// Add to wishlist
router.post("/add", isAuthenticated, async (req, res) => {
  try {
    const { artworkId } = req.body;

    let wishlist = await Wishlist.findOne({ userId: req.user });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId: req.user,
        artworks: [artworkId],
      });
    } else {
      if (!wishlist.artworks.includes(artworkId)) {
        wishlist.artworks.push(artworkId);
      }
    }

    await wishlist.save();
    res.json({ message: "Added to wishlist", wishlist });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding to wishlist", error: error.message });
  }
});

// Remove from wishlist
router.post("/remove", isAuthenticated, async (req, res) => {
  try {
    const { artworkId } = req.body;

    const wishlist = await Wishlist.findOne({ userId: req.user });
    if (wishlist) {
      wishlist.artworks = wishlist.artworks.filter(
        (id) => id.toString() !== artworkId
      );
      await wishlist.save();
    }

    res.json({ message: "Removed from wishlist", wishlist });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing from wishlist", error: error.message });
  }
});

module.exports = router;
