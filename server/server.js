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

//* Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://artverse-4.onrender.com",
  "https://artverse-client.netlify.app",
  "https://artverse3112.netlify.app",
  "https://68cfb189fc8aab0008932dd0--artverse3112.netlify.app",
];

//* CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server requests
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

//* Explicitly handle OPTIONS preflight requests
app.options(
  "*",
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
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
app.use("/api/users", userRouter); // Users routes: /register, /login, /profile
app.use("/api/artwork", artworkRouter); // Artwork routes
app.use("/api/users/profile", profileRouter); // Profile routes (if separate)
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
