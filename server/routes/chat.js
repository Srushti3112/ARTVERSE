const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuth");
const ChatGroup = require("../model/ChatGroup");
const ChatMessage = require("../model/ChatMessage");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const upload = multer({ storage: multer.memoryStorage() });

// Create a new chat group
router.post("/groups", isAuthenticated, async (req, res) => {
  try {
    const { name, category, description } = req.body;
    const group = new ChatGroup({
      name,
      category,
      description,
      createdBy: req.user,
      members: [req.user],
      moderators: [req.user],
    });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all chat groups
router.get("/groups", isAuthenticated, async (req, res) => {
  try {
    const groups = await ChatGroup.find()
      .populate("createdBy", "username")
      .populate("members", "username")
      .sort("-createdAt");
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join a chat group
router.post("/groups/:groupId/join", isAuthenticated, async (req, res) => {
  try {
    const group = await ChatGroup.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (!group.members.includes(req.user)) {
      group.members.push(req.user);
      await group.save();
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages for a group
router.get("/groups/:groupId/messages", isAuthenticated, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ groupId: req.params.groupId })
      .populate("sender", "username")
      .sort("-createdAt")
      .limit(50);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send message with media
router.post(
  "/groups/:groupId/messages",
  isAuthenticated,
  upload.single("media"),
  async (req, res) => {
    try {
      const { content } = req.body;
      let mediaUrl, mediaType;

      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
          folder: "chat_media",
        });
        mediaUrl = uploadResponse.secure_url;
        mediaType = req.file.mimetype.startsWith("image") ? "image" : "video";
      }

      const message = new ChatMessage({
        groupId: req.params.groupId,
        sender: req.user,
        content,
        mediaUrl,
        mediaType,
      });

      await message.save();
      await message.populate("sender", "username");
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
