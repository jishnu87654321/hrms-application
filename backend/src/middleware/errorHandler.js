const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Default error format as requested: { success, message, data }
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: message,
    data: null
  });
};

module.exports = errorHandler;
