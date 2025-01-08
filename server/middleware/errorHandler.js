const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    res.status(err.status || 500).json({
      message: "Something went wrong. Please try again later.",
    });
  } else {
    console.error(err.stack); // Debugging in development
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
      stack: err.stack,
    });
  }
};

module.exports = errorHandler;
