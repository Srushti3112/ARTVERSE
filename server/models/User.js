const mongoose = require("mongoose");

const validArtCategories = [
  "painting",
  "sculpture",
  "candle",
  "photography",
  "resin",
  "hand-made jewellery",
  "sketching",
  "digital art",
  "crafts",
];

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  bio: {
    type: String,
    default: "No bio provided",
  },
  location: {
    type: String,
    default: "Not specified",
  },
  artCategory: {
    type: String,
    required: true,
    enum: validArtCategories,
    trim: true,
    lowercase: true,
  },
  socialMedia: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    required: true,
  },
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
