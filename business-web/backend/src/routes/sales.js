const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { auth, ownerOnly } = require('../middleware/auth');
const router = express.Router();

// Get daily sales summary
router.get('/daily', auth, ownerOnly, (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];

    const summary = db.prepare(`
      SELECT 
        COUNT(*) as total_sales,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(SUM(profit), 0) as total_profit,
        COALESCE(SUM(total_cost), 0) as total_cost
      FROM sales
      WHERE DATE(created_at) = DATE(?) AND status = 'completed'
    `).get(date);

    const items = db.prepare(`
      SELECT 
        p.name, p.name_en,
        SUM(si.quantity) as quantity_sold,
        SUM(si.subtotal) as revenue,
        SUM(si.profit) as profit
      FROM sale_items si
      JOIN sales s ON s.id = si.sale_id
      JOIN products p ON p.id = si.product_id
      WHERE DATE(s.created_at) = DATE(?) AND s.status = 'completed'
      GROUP BY p.id
      ORDER BY profit DESC
    `).all(date);

    res.json({ date, summary, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch daily sales' });
  }
});

// Profit per product (all time or filtered)
router.get('/profit-by-product', auth, ownerOnly, (req, res) => {
  try {
    const { from, to } = req.query;
    let query = `
      SELECT 
        p.id, p.name, p.name_en, p.cost_price, p.selling_price,
        COALESCE(SUM(si.quantity), 0) as total_sold,
        COALESCE(SUM(si.subtotal), 0) as total_revenue,
        COALESCE(SUM(si.profit), 0) as total_profit
      FROM products p
      LEFT JOIN sale_items si ON si.product_id = p.id
      LEFT JOIN sales s ON s.id = si.sale_id AND s.status = 'completed'
    `;
    const params = [];

    if (from && to) {
      query += ` AND DATE(s.created_at) BETWEEN DATE(?) AND DATE(?)`;
      params.push(from, to);
    }

    query += ` WHERE p.is_active = 1 GROUP BY p.id ORDER BY total_profit DESC`;

    const products = db.prepare(query).all(...params);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profit data' });
  }
});

// Create a sale
router.post('/', auth, ownerOnly, (req, res) => {
  const { items, customer_id, payment_method = 'cash', notes } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items required' });
  }

  const createSale = db.transaction(() => {
    let totalAmount = 0;
    let totalCost = 0;
    let totalProfit = 0;

    // Validate stock & calculate
    for (const item of items) {
      const product = db.prepare('SELECT * FROM products WHERE id = ? AND is_active = 1').get(item.product_id);
      if (!product) throw new Error(`Product ${item.product_id} not found`);
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);

      const subtotal = product.selling_price * item.quantity;
      const cost = product.cost_price * item.quantity;
      const profit = subtotal - cost;

      totalAmount += subtotal;
      totalCost += cost;
      totalProfit += profit;
    }

    const saleNumber = 'SALE-' + uuidv4().slice(0, 8).toUpperCase();

    const saleResult = db.prepare(`
      INSERT INTO sales (sale_number, user_id, customer_id, total_amount, total_cost, profit, payment_method, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(saleNumber, req.user.id, customer_id || null, totalAmount, totalCost, totalProfit, payment_method, notes || null);

    const saleId = saleResult.lastInsertRowid;

    // Insert items & reduce stock
    const insertItem = db.prepare(`
      INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, cost_price, subtotal, profit)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

    for (const item of items) {
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.product_id);
      const subtotal = product.selling_price * item.quantity;
      const cost = product.cost_price * item.quantity;
      const profit = subtotal - cost;

      insertItem.run(saleId, item.product_id, item.quantity, product.selling_price, product.cost_price, subtotal, profit);
      updateStock.run(item.quantity, item.product_id);
    }

    // If payment is debt, create debt record
    if (payment_method === 'debt' && customer_id) {
      db.prepare(`
        INSERT INTO debts (customer_id, sale_id, original_amount, remaining_amount, description, status)
        VALUES (?, ?, ?, ?, ?, 'pending')
      `).run(customer_id, saleId, totalAmount, totalAmount, `Deni kutoka mauzo ${saleNumber}`);
    }

    return db.prepare('SELECT * FROM sales WHERE id = ?').get(saleId);
  });

  try {
    const sale = createSale();
    res.status(201).json(sale);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all sales (with optional filters)
router.get('/', auth, ownerOnly, (req, res) => {
  try {
    const sales = db.prepare(`
      SELECT s.*, u.name as recorded_by, c.name as customer_name
      FROM sales s
      LEFT JOIN users u ON u.id = s.user_id
      LEFT JOIN users c ON c.id = s.customer_id
      ORDER BY s.created_at DESC
      LIMIT 100
    `).all();
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

module.exports = router;
