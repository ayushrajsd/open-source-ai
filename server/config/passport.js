const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
      prompt: "consent",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, username, profileUrl, photos, _json } = profile;
        const email = _json.email || profile.emails?.[0]?.value || null;

        // Check if user exists in the database
        let user = await User.findOne({ githubId: id });

        if (!user) {
          // Create a new user if not found
          user = new User({
            githubId: id,
            username,
            email,
            avatarUrl: photos[0]?.value,
            profileUrl,
          });
          await user.save();
        }

        // Attach accessToken to the user object for the session
        user.accessToken = accessToken;

        return done(null, { ...user.toObject(), accessToken });
      } catch (error) {
        console.error("Error in GitHub OAuth:", error.message);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
