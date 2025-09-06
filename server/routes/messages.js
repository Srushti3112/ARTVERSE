const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuth");
const DirectMessage = require("../model/DirectMessage");

// Get conversation between two users
router.get("/:receiverId", isAuthenticated, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const messages = await DirectMessage.find({
      $or: [
        { sender: req.user, receiver: req.params.receiverId },
        { sender: req.params.receiverId, receiver: req.user },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "username")
      .populate("receiver", "username");

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// Send a new message
router.post("/:receiverId", isAuthenticated, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!req.body.content) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const message = new DirectMessage({
      sender: req.user._id || req.user, // Handle both object and string ID
      receiver: req.params.receiverId,
      content: req.body.content,
    });

    await message.save();

    // Populate sender and receiver details
    const populatedMessage = await message
      .populate([
        { path: "sender", select: "username _id" },
        { path: "receiver", select: "username _id" },
      ])
      .execPopulate();

    // Emit to both sender and receiver
    const io = req.app.get("io");
    io.to(req.user._id || req.user).emit(
      "new-direct-message",
      populatedMessage
    );
    io.to(req.params.receiverId).emit("new-direct-message", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res
      .status(500)
      .json({ message: "Error sending message", error: error.message });
  }
});

module.exports = router;
