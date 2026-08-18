const express = require('express');
const db = require('../db');
const { auth, ownerOnly } = require('../middleware/auth');
const router = express.Router();

// Get all products
router.get('/', auth, (req, res) => {
  try {
    const products = db.prepare(`
      SELECT * FROM products WHERE is_active = 1 ORDER BY name
    `).all();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
router.get('/:id', auth, (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Create product (owner only)
router.post('/', auth, ownerOnly, (req, res) => {
  try {
    const { name, name_en, description, cost_price, selling_price, stock, category } = req.body;
    if (!name || cost_price == null || selling_price == null) {
      return res.status(400).json({ error: 'Name, cost_price and selling_price required' });
    }

    const result = db.prepare(`
      INSERT INTO products (name, name_en, description, cost_price, selling_price, stock, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, name_en || name, description || null, cost_price, selling_price, stock || 0, category || null);

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/:id', auth, ownerOnly, (req, res) => {
  try {
    const { name, name_en, description, cost_price, selling_price, stock, category, is_active } = req.body;
    db.prepare(`
      UPDATE products SET
        name = COALESCE(?, name),
        name_en = COALESCE(?, name_en),
        description = COALESCE(?, description),
        cost_price = COALESCE(?, cost_price),
        selling_price = COALESCE(?, selling_price),
        stock = COALESCE(?, stock),
        category = COALESCE(?, category),
        is_active = COALESCE(?, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, name_en, description, cost_price, selling_price, stock, category, is_active, req.params.id);

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete (soft)
router.delete('/:id', auth, ownerOnly, (req, res) => {
  db.prepare('UPDATE products SET is_active = 0 WHERE id = ?').run(req.params.id);
  res.json({ message: 'Product deactivated' });
});

module.exports = router;
