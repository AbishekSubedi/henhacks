const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? ['https://yourdomain.com'] // Replace with your production domain
      : ['http://localhost:5174', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
