const winston = require('winston');

// Create a logger
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ...(process.env.NODE_ENV !== 'production'
      ? [new winston.transports.Console({ format: winston.format.simple() })]
      : []),
  ],
});

const errorHandler = (err, _req, res, _next) => {
  // Log error
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    code: err.code,
  });

  // Firebase Admin errors
  if (err.code && err.code.startsWith('auth/')) {
    return res.status(401).json({
      error: 'Authentication error',
      message: err.message,
      code: err.code,
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      message: err.message,
      details: err.errors,
    });
  }

  // Database errors
  if (err.code && err.code.startsWith('database/')) {
    return res.status(500).json({
      error: 'Database error',
      message: 'An error occurred while accessing the database',
      code: err.code,
    });
  }

  // Gemini API errors
  if (err.name === 'GeminiError') {
    return res.status(500).json({
      error: 'AI Service error',
      message: 'An error occurred while generating insights',
      details: err.message,
    });
  }

  // Default error
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
  });
};

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler,
};
