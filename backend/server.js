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
import walletRouter from './src/routes/wallet.Routes.js';
import sessionRouter from './src/routes/session.Routes.js';
import sessionMasterRouter from './src/routes/sessionMaster.Routes.js';
import gamingPriceRouter from './src/routes/gamingPrice.Routes.js';
import settingsRouter from './src/routes/settings.Routes.js';
import billingRouter from './src/routes/billing.Routes.js';
import packagesRouter from './src/routes/packages.Routes.js';
import membershipsRouter from './src/routes/memberships.Routes.js';
import productsRouter from './src/routes/products.Routes.js';
import ordersRouter from './src/routes/orders.Routes.js';
import staffRouter from './src/routes/staff.Routes.js';
import floorZonesRouter from './src/routes/floorZones.Routes.js';
import telemetryRouter from './src/routes/telemetry.Routes.js';
import auditRouter from './src/routes/audit.Routes.js';
import reportsRouter from './src/routes/reports.Routes.js';
import stationPowerRouter from './src/routes/stationPower.Routes.js';
import discountsRouter from './src/routes/discounts.Routes.js';
import aiRouter from './src/modules/ai/ai.routes.js';
import paymentsRouter, { webhookRouter as paymentsWebhookRouter } from './src/routes/payments.Routes.js';
import platformRouter from './src/routes/platform.Routes.js';
import licensesRouter from './src/routes/licenses.Routes.js';
import updatesRouter from './src/routes/updates.Routes.js';
import refundsRouter from './src/routes/refunds.Routes.js';
import portalRouter from './src/routes/portal.Routes.js';
import adminRouter from './src/routes/admin.Routes.js';
import entitlementsRouter from './src/routes/entitlements.Routes.js';
import installationsRouter from './src/routes/installations.Routes.js';
import locationsRouter from './src/routes/locations.Routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

/*
 * Payment webhooks are mounted ahead of express.json() on purpose. Providers
 * sign the raw request bytes, and a JSON parser consumes the stream before the
 * handler can hash it — leaving no way to tell a genuine payment from a forged
 * one. This one route needs the body untouched; everything below it does not.
 */
app.use('/api/payments', paymentsWebhookRouter);

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
app.use('/api/wallet', walletRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/session-master', sessionMasterRouter);
app.use('/api/gaming-prices', gamingPriceRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/bills', billingRouter);
app.use('/api/packages', packagesRouter);
app.use('/api/memberships', membershipsRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/staff', staffRouter);
app.use('/api/floor-zones', floorZonesRouter);
app.use('/api/telemetry', telemetryRouter);
app.use('/api/audit', auditRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/stations', stationPowerRouter);
app.use('/api/discounts', discountsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/platform', platformRouter);
app.use('/api/licenses', licensesRouter);
app.use('/api/updates', updatesRouter);
app.use('/api/refunds', refundsRouter);
app.use('/api/portal', portalRouter);
app.use('/api/admin', adminRouter);
app.use('/api/entitlements', entitlementsRouter);
app.use('/api/installations', installationsRouter);
app.use('/api/locations', locationsRouter);

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