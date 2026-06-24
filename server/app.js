const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const scheduleRoutes = require('./routes/scheduleRoutes');

const app = express();

app.use(morgan('dev')); // Request logging

// Security Middlewares
app.use(helmet());
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // INCREASED: 500 requests per IP per 15 mins (safe for admin panel)
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://sovindcare.vercel.app'],
  credentials: true
}));
app.options('*', cors()); // Enable preflight requests for all routes
app.use(express.json({ limit: '5mb' })); // INCREASED: Limit body size to 5mb to allow large text or future images

app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/schedule', scheduleRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Resource not found or invalid ID';
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Invalid or expired token';
  }

  res.status(status).json({
    success: false,
    message
  });
});

module.exports = app;
