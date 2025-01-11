const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  const isProduction = process.env.NODE_ENV === "production";
  res.json({
    message: isProduction ? "An unexpected error occurred" : err.message,
    stack: isProduction ? null : err.stack,
  });
};

module.exports = errorHandler;
