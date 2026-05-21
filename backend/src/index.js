require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Route imports
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const sellerRoutes = require('./routes/seller.routes');
const adminRoutes = require('./routes/admin.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// ---- Middleware ----
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ---- Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'VARAH API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ---- Error Handler ----
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: true,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: true, message: `Route ${req.method} ${req.path} not found` });
});

// ---- Start Server ----
app.listen(PORT, () => {
  console.log(`\n🔱 VARAH API Server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
