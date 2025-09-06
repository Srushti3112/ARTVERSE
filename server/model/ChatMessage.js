const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatGroup",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registered_user",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  mediaUrl: {
    type: String,
  },
  mediaType: {
    type: String,
    enum: ["image", "video", null],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
