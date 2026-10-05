const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'MedQueue Backend API is operational',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 MedQueue Server running on http://localhost:${PORT}`);
  });
};

startServer();
