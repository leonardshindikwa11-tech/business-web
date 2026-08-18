require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize DB
require('./db');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
const debtRoutes = require('./routes/debts');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/debts', debtRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Business Web API is running', time: new Date().toISOString() });
});

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'Business Web API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      sales: '/api/sales',
      debts: '/api/debts'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${path.join(__dirname, '../../database/business.db')}`);
});
