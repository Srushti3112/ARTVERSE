require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes/users");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/database");
const artworkRouter = require("./routes/artwork");
const profileRouter = require("./routes/profile");
const wishlistRoutes = require("./routes/wishlist");
const app = express();

//* Database connection call
connectDB();

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Request logging middleware
app.use((req, res, next) => {
  // console.log(`${req.method} ${req.url}`); // Log each request
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - remove the "/" prefix since routes already include full path
app.use(router);
app.use("/api/artwork", artworkRouter); // Add this line to register artwork routes
app.use("/api/users/profile", profileRouter); // Add this line to register profile routes
app.use("/api/wishlist", wishlistRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Improved server startup with error handling
const server = app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Please try a different port or kill the process using this port.`
      );
    } else {
      console.error("Error starting server:", err);
    }
    process.exit(1);
  });
