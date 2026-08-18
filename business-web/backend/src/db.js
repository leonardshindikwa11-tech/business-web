const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../../database/business.db');
const schemaPath = path.join(__dirname, '../../database/schema.sql');

// Ensure database folder exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema if needed
function initSchema() {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);
  console.log('✅ Database schema initialized');
}

// Seed sample data
function seedData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) return;

  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync('password123', 10);

  // Owner
  db.prepare(`
    INSERT INTO users (name, email, phone, password, role, language)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('Juma Mwenye Biashara', 'owner@biashara.com', '0712345678', hash, 'owner', 'sw');

  // Sample customer
  db.prepare(`
    INSERT INTO users (name, email, phone, password, role, language)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('Amina Mteja', 'amina@email.com', '0755123456', hash, 'customer', 'sw');

  // Sample products
  const products = [
    ['Sukari 1kg', 'Sugar 1kg', 2200, 2800, 50, 'Chakula'],
    ['Mchele 1kg', 'Rice 1kg', 1800, 2300, 80, 'Chakula'],
    ['Mafuta 1L', 'Cooking Oil 1L', 3500, 4200, 30, 'Chakula'],
    ['Sabuuni', 'Soap', 800, 1200, 100, 'Usafi'],
    ['Majani ya Chai', 'Tea Leaves', 1500, 2000, 40, 'Vinywaji'],
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (name, name_en, cost_price, selling_price, stock, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  products.forEach(p => insertProduct.run(...p));

  console.log('✅ Sample data seeded (owner@biashara.com / password123)');
}

initSchema();
seedData();

module.exports = db;
