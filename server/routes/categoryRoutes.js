const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// Debug log for route registration
console.log("Category routes registered");

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort("name");
    res.json(categories);
  } catch (error) {
    console.error("Category fetch error:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

router.post("/add", async (req, res) => {
  try {
    console.log("Category add request:", req.body);

    if (!req.body.category) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const categoryName = req.body.category.toLowerCase().trim();

    // First try to find existing category
    let category = await Category.findOne({ name: categoryName });

    if (category) {
      return res.json(category);
    }

    // Create new category
    category = new Category({ name: categoryName });
    await category.save();

    console.log("Created new category:", category);
    res.status(201).json(category);
  } catch (error) {
    console.error("Category creation error:", error);
    res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
});

module.exports = router;
