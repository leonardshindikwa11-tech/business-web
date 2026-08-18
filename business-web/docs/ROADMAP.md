# 🗺️ ROADMAP – Business Manager Website

**Muda uliokadiriwa:** 8–12 wiki (kulingana na idadi ya watengenezaji)

---

## Phase 1: Foundation (Wiki 1–2) ✅

### Malengo
- [x] Setup project structure (Frontend + Backend + Database)
- [x] Database schema (Users, Products, Sales, Debts, Payments)
- [x] Authentication (Register / Login) na JWT
- [x] Language system (Kiswahili + English)
- [x] Basic UI na rangi (Green, Sea Blue, Red)

### Deliverables
- Login & Register pages
- Protected routes
- Language switcher
- Database inafanya kazi

---

## Phase 2: Core Business Features (Wiki 3–5)

### 2.1 Products Management
- [ ] CRUD ya Bidhaa (Create, Read, Update, Delete)
- [ ] Stock tracking
- [ ] Cost price + Selling price
- [ ] Category ya bidhaa

### 2.2 Sales (Mauzo)
- [ ] Rekodi mauzo (single + multiple items)
- [ ] Daily Sales Dashboard
- [ ] Sales history (filter by date)
- [ ] Receipt generation (PDF)

### 2.3 Profit Analysis
- [ ] Faida kwa kila bidhaa (Profit per product)
- [ ] Daily / Weekly / Monthly profit
- [ ] Top selling products
- [ ] Charts (bar + line) – Chart.js au Recharts

### 2.4 Debts (Madeni)
- [ ] Rekodi deni la mteja
- [ ] Angalia orodha ya madeni
- [ ] Lipa deni (partial au full)
- [ ] History ya malipo ya deni

---

## Phase 3: Payments & Customer Portal (Wiki 6–7)

### 3.1 Payments
- [ ] Simulated payment (cash, mobile money)
- [ ] Integration ready for M-Pesa / Tigo Pesa / Airtel Money
- [ ] Payment history
- [ ] Invoice generation

### 3.2 Customer Side
- [ ] Customer dashboard (angalia madeni yake)
- [ ] Customer anaweza kulipa deni yake
- [ ] View order / purchase history

---

## Phase 4: Advanced Features (Wiki 8–10)

- [ ] Reports (PDF + Excel export)
- [ ] Multi-user roles (Owner, Cashier, Admin)
- [ ] Notifications (low stock, unpaid debts)
- [ ] Search & advanced filters
- [ ] Dark mode (optional)
- [ ] Mobile responsive perfection
- [ ] Offline mode (PWA) – basic

---

## Phase 5: Polish & Deploy (Wiki 11–12)

- [ ] Security hardening (rate limiting, validation)
- [ ] Performance optimization
- [ ] Testing (unit + e2e)
- [ ] Documentation
- [ ] Deploy:
  - Frontend → Vercel / Netlify
  - Backend → Railway / Render / DigitalOcean
  - Database → SQLite (au switch to PostgreSQL)

---

## 📊 Priority Matrix

| Feature                    | Priority | Phase |
|---------------------------|----------|-------|
| Login + Register          | High     | 1     |
| Daily Sales               | High     | 2     |
| Profit per Product        | High     | 2     |
| Debts + Payment           | High     | 2–3   |
| Language Switcher         | High     | 1     |
| Charts & Reports          | Medium   | 4     |
| M-Pesa Integration        | Medium   | 3–5   |
| Multi-user Roles          | Low      | 4     |
| PWA / Offline             | Low      | 4     |

---

## 🎨 Design Guidelines

- **Primary:** Green `#16A34A` (success, profit, growth)
- **Secondary:** Sea Blue `#0077B6` (trust, professionalism)
- **Danger / Alert:** Red `#DC2626` (debts, losses, delete)
- **Typography:** Inter / System fonts
- **Icons:** Lucide React au Heroicons
- **Layout:** Sidebar (desktop) + Bottom nav (mobile)

---

## 📝 Notes

- Kila phase inaweza kugawanywa kati ya Frontend na Backend developers.
- Tumia Git branches: `feature/sales`, `feature/debts`, n.k.
- Kila feature iwe na API documentation (Swagger optional).
- Hakikisha validation zote ziko (backend + frontend).

---

**Imeandaliwa:** Agosti 2026  
**Status:** Phase 1 Complete (Starter Code Ready)
