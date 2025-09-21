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
const HOST = "0.0.0.0";

//* Database connection call
connectDB();

// CORS configuration
const allowedOrigins = [
  "https://artverse3112.netlify.app",
  "https://68cfb189fc8aab0008932dd0--artverse3112.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: This origin is not allowed"), false);
      }
    },
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
app.get("/", (req, res) => {
  res.send(
    "Backend is running 🚀. Use /register, /login, or /profile endpoints."
  );
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 10000;

// Improved server startup with error handling
const server = app
  .listen(PORT, HOST, () => {
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
