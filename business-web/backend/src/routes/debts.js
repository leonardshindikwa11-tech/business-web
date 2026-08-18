const express = require('express');
const db = require('../db');
const { auth, ownerOnly } = require('../middleware/auth');
const router = express.Router();

// Get all debts (owner) or own debts (customer)
router.get('/', auth, (req, res) => {
  try {
    let debts;
    if (req.user.role === 'owner' || req.user.role === 'cashier') {
      debts = db.prepare(`
        SELECT d.*, u.name as customer_name, u.phone as customer_phone
        FROM debts d
        JOIN users u ON u.id = d.customer_id
        ORDER BY d.created_at DESC
      `).all();
    } else {
      debts = db.prepare(`
        SELECT * FROM debts WHERE customer_id = ? ORDER BY created_at DESC
      `).all(req.user.id);
    }
    res.json(debts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch debts' });
  }
});

// Pay debt (partial or full)
router.post('/:id/pay', auth, (req, res) => {
  const { amount, payment_method = 'cash', notes } = req.body;
  const debtId = req.params.id;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid amount required' });
  }

  const payDebt = db.transaction(() => {
    const debt = db.prepare('SELECT * FROM debts WHERE id = ?').get(debtId);
    if (!debt) throw new Error('Debt not found');

    // Customer can only pay their own debt
    if (req.user.role === 'customer' && debt.customer_id !== req.user.id) {
      throw new Error('Access denied');
    }

    if (debt.status === 'paid') throw new Error('Debt already fully paid');

    const payAmount = Math.min(amount, debt.remaining_amount);
    const newRemaining = debt.remaining_amount - payAmount;
    const newStatus = newRemaining <= 0 ? 'paid' : 'partial';

    // Record payment
    db.prepare(`
      INSERT INTO debt_payments (debt_id, amount, payment_method, notes, paid_by)
      VALUES (?, ?, ?, ?, ?)
    `).run(debtId, payAmount, payment_method, notes || null, req.user.id);

    // Update debt
    db.prepare(`
      UPDATE debts SET remaining_amount = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(newRemaining, newStatus, debtId);

    // Record general payment
    db.prepare(`
      INSERT INTO payments (reference, user_id, amount, payment_type, method, description)
      VALUES (?, ?, ?, 'debt', ?, ?)
    `).run(`DEBT-${debtId}-${Date.now()}`, req.user.id, payAmount, payment_method, `Payment for debt #${debtId}`);

    return db.prepare('SELECT * FROM debts WHERE id = ?').get(debtId);
  });

  try {
    const updated = payDebt();
    res.json({ message: 'Payment successful', debt: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create debt manually
router.post('/', auth, ownerOnly, (req, res) => {
  try {
    const { customer_id, amount, description, due_date } = req.body;
    if (!customer_id || !amount) {
      return res.status(400).json({ error: 'customer_id and amount required' });
    }

    const result = db.prepare(`
      INSERT INTO debts (customer_id, original_amount, remaining_amount, description, due_date, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `).run(customer_id, amount, amount, description || null, due_date || null);

    const debt = db.prepare('SELECT * FROM debts WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(debt);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create debt' });
  }
});

module.exports = router;
