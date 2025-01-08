const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    githubId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, match: /.+\@.+\..+/ },
    avatarUrl: { type: String },
    profileUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    contributions: [
      {
        title: String,
        repo: String,
        url: String,
        status: String,
        date: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
