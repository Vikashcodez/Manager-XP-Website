import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import './src/config/env.js';
import { initializeDatabase } from './src/config/database.js';
import authRoutes from './src/routes/auth.Routes.js';
import subscriptionPlanRouter from './src/routes/subscriptionPlan.Routes.js';
import cafeRouter from './src/routes/cafe.Routes.js';
import subscriptionsRouter from './src/routes/subscriptions.Routes.js';
import pcsRouter from './src/routes/pcs.Routes.js';
import softwareMasterRouter from './src/routes/softwareMaster.Routes.js';
import pcSoftwareRouter from './src/routes/pcSoftware.Routes.js';
import customerRouter from './src/routes/customer.Routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subscription-plans',subscriptionPlanRouter);
app.use('/api/cafes', cafeRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/pcs', pcsRouter);
app.use('/api/software-master', softwareMasterRouter);
app.use('/api/pc-software', pcSoftwareRouter);
app.use('/api/customers', customerRouter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
const startServer = async () => {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();