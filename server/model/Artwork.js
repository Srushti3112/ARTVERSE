const mongoose = require("mongoose");

const artworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: "", // Add default empty string for optional description
  },
  imageUrl: {
    type: String,
    required: true,
  },
  cloudinaryId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "painting",
      "sculpture",
      "candle",
      "photography",
      "resin",
      "hand-made jewellery",
      "sketching",
      "digital art",
      "crafts",
      "others",
    ],
  },
  price: {
    type: Number,
    default: null,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registered_user",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Artwork", artworkSchema);
