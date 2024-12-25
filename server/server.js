const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
const passport = require("./config/passport");
const logger = require("./config/logger");
const jwt = require("jsonwebtoken");

const preferencesRoutes = require("./routes/preferences");
const savedIssuesRoutes = require("./routes/savedIssues");
const profileRoutes = require("./routes/profile");
const issuesRoutes = require("./routes/issues");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth");

// Load environment variables

// Initialize app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(helmet()); // Security headers
app.use(morgan("dev")); // Log HTTP requests
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true, // Allow cookies to be sent
  })
);

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === "production",
    },
  })
);
app.use(errorHandler);
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false, // Adjust CSP as needed
  })
);
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
connectDB();

// Routes
app.use("/api/preferences", preferencesRoutes);
app.use("/api/saved-issues", savedIssuesRoutes);
app.use("/api", profileRoutes);
app.use("/api/issues", issuesRoutes);
app.use("/api/auth", authRoutes);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// OAuth Routes
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"], prompt: "consent" })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    // Access token is available in req.user.accessToken
    const { accessToken } = req.user;

    if (!accessToken) {
      return res.status(500).json({ message: "Access token missing!" });
    }

    // Save the accessToken in the session
    req.session.accessToken = accessToken;

    // Generate JWT token for secure frontend usage
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send the JWT token as HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });

    res.redirect("http://localhost:3000/dashboard");
  }
);

// Logout Route
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Successfully logged out" });
  });
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
