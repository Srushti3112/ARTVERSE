require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/users");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/database");
const artworkRouter = require("./routes/artwork");
const profileRouter = require("./routes/profile");
const wishlistRoutes = require("./routes/wishlist");

const app = express();
const HOST = "0.0.0.0";
const PORT = process.env.PORT || 10000;

//* Database connection
connectDB();

//* CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        origin === "https://artverse3112.netlify.app" ||
        origin.endsWith("--artverse3112.netlify.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: This origin is not allowed"), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

//* Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* Request logging (optional)
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });

//* Routes
app.use("/api/users", userRouter); // ✅ Users routes mounted under /api/users
app.use("/api/artwork", artworkRouter); // Artwork routes
app.use("/api/users/profile", profileRouter); // Profile routes
app.use("/api/wishlist", wishlistRoutes); // Wishlist routes

app.get("/", (req, res) => {
  res.send(
    "Backend is running 🚀. Use /api/users/register, /api/users/login, or /api/users/profile endpoints."
  );
});

//* Error handling middleware
app.use(errorHandler);

//* Server start
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
