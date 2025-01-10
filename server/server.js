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
const compression = require("compression");
const path = require("path");

const preferencesRoutes = require("./routes/preferences");
const savedIssuesRoutes = require("./routes/savedIssues");
const profileRoutes = require("./routes/profile");
const issuesRoutes = require("./routes/issues");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth");

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(compression());
app.use(cookieParser());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://open-source-ai.onrender.com"
        : "http://localhost:3000",
    credentials: true,
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://apis.google.com",
          "https://cdn.jsdelivr.net",
        ],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.github.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    // Add other default helmet protections
    dnsPrefetchControl: true,
    frameguard: true,
    hidePoweredBy: true,
    hsts: true,
    ieNoOpen: true,
    noSniff: true,
    permittedCrossDomainPolicies: true,
    referrerPolicy: { policy: "no-referrer" },
    xssFilter: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }).on("connected", () => console.log("Session store connected")),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "Strict",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  express.static(path.join(__dirname, "../client/build"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);

// MongoDB Connection
connectDB();

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Routes
app.use("/api/preferences", preferencesRoutes);
app.use("/api/saved-issues", savedIssuesRoutes);
app.use("/api/user", profileRoutes);
app.use("/api/issues", limiter, issuesRoutes);
app.use("/api/auth", limiter, authRoutes);

// OAuth Routes
app.get(
  "/auth/github",
  limiter,
  passport.authenticate("github", { scope: ["user:email"], prompt: "consent" })
);

app.get(
  "/auth/github/callback",
  limiter,
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    const { accessToken } = req.user;
    if (!accessToken) {
      return res.status(500).json({ message: "Access token missing!" });
    }
    req.session.accessToken = accessToken;
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(
      process.env.NODE_ENV === "production"
        ? "https://open-source-ai.onrender.com/dashboard"
        : "http://localhost:3000/dashboard"
    );
  }
);

app.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  req.logout(() => {
    res.status(200).json({ message: "Successfully logged out" });
  });
});

// Error Handler
app.use(errorHandler);

// Fallback Route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// Start Server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Closing HTTP server...");
  console.log(`Environment: ${process.env.NODE_ENV}`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});
