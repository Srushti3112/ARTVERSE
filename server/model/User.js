const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["client", "artist"],
      default: "artist",
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artwork",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Registered_user", userSchema);
