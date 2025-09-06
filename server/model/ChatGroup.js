const mongoose = require("mongoose");

const chatGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "painting",
      "sculpture",
      "digital-art",
      "photography",
      "resin",
      "crafts",
      "sketching",
      "others",
    ],
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registered_user",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registered_user",
    },
  ],
  moderators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registered_user",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ChatGroup", chatGroupSchema);
