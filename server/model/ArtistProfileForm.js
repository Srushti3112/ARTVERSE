const mongoose = require("mongoose");

const artistProfileSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "Not specified",
    },
    socialMediaUrl: {
      type: String,
      default: "",
    },
    artCategory: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      default: "artist",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ArtistProfile", artistProfileSchema);
