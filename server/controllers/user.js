const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const ArtistProfile = require("../model/ArtistProfileForm");

const userCtrl = {
  //!Register
  register: asyncHandler(async (req, res) => {
    try {
      const { username, email, password, role } = req.body;

      //! Validations
      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ message: "Please fill all required fields" });
      }

      // Validate role
      if (!role || !["client", "artist"].includes(role)) {
        return res.status(400).json({ message: "Invalid or missing role" });
      }

      //! Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }

      //! Hash the user password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //! Create the user
      const userCreated = await User.create({
        username,
        password: hashedPassword,
        email,
        role, // Use the validated role
      });

      //! Send the response
      res.status(201).json({
        status: "success",
        message: "Registration successful",
        data: {
          username: userCreated.username,
          email: userCreated.email,
          id: userCreated._id,
          role: userCreated.role, // Include role in the response
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        status: "error",
        message: error.message || "Registration failed. Please try again.",
      });
    }
  }),
  //!Login
  login: asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Login attempt for email:", email);

      // Validate input
      if (!email || !password) {
        console.log("Missing email or password");
        return res.status(400).json({
          status: "error",
          message: "Email and password are required",
        });
      }

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        console.log("User not found for email:", email);
        return res.status(401).json({
          status: "error",
          message: "Invalid email or password",
        });
      }
      console.log("User found:", user.email);

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match result:", isMatch);

      if (!isMatch) {
        console.log("Password does not match for user:", email);
        return res.status(401).json({
          status: "error",
          message: "Invalid email or password",
        });
      }

      // Generate JWT token with proper secret
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );

      // Send success response with data property
      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          token,
          id: user._id,
          email: user.email,
          username: user.username,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        status: "error",
        message: "Login failed. Please try again.",
      });
    }
  }),
  //!Profile
  profile: asyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.user).select("-password");
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }
      res.status(200).json({
        status: "success",
        data: { user },
      });
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to fetch profile",
      });
    }
  }),

  //!Artist Profile Form
  ArtistProfileForm: asyncHandler(async (req, res) => {
    try {
      const { fullName, email, portfolioUrl, artCategory } = req.body;

      // Validate required fields
      if (!fullName || !email || !artCategory) {
        return res
          .status(400)
          .json({ message: "Please fill all required fields" });
      }

      // Create a new artist profile
      const newProfile = new ArtistProfile({
        fullName,
        email,
        socialMediaUrl: portfolioUrl,
        artCategory,
      });

      // Save the profile to the database
      await newProfile.save();

      res.status(201).json({ message: "Profile submitted successfully!" });
    } catch (error) {
      console.error("Error submitting the profile:", error);
      res.status(500).json({ message: "Error submitting the profile" });
    }
  }),
};
module.exports = userCtrl;
