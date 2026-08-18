# 🏢 Business Manager Website – Roadmap & Project

**Jina la Mradi:** Business Web (Mfanya Biashara Dashboard)  
**Lugha:** Kiswahili + English  
**Rangi Kuu:** Green (#16A34A), Sea Blue (#0077B6), Red (#DC2626)

---

## 🎯 Malengo ya Website

Website hii inampa **mfanya biashara** uwezo wa:

1. Kuona **mauzo ya siku** (Daily Sales)
2. Kuona **faida kwa kila bidhaa** (Profit per Product)
3. Kupokea **malipo** na **kulipa madeni** kupitia web
4. **Usajili** wa wateja kabla ya kuingia
5. Kubadilisha lugha (Kiswahili / English)
6. Frontend + Backend + Database kamili

---

## 🗂️ Muundo wa Folder (Project Structure)

```
business-web/
├── frontend/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/         # Language Context
│   │   ├── i18n/             # Translations (SW + EN)
│   │   └── ...
│   └── ...
├── backend/                  # Node.js + Express
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── ...
├── database/                 # SQLite + schema
│   └── schema.sql
├── docs/
│   └── ROADMAP.md            # Roadmap kamili
└── README.md
```

---

## 🛠️ Tech Stack

| Layer       | Technology              | Sababu                          |
|-------------|-------------------------|---------------------------------|
| Frontend    | React + Vite + Tailwind | Haraka, rangi rahisi, modern   |
| Backend     | Node.js + Express       | Rahisi, API yenye nguvu        |
| Database    | SQLite (better-sqlite3) | Hakuna setup nyingi, portable  |
| Auth        | JWT + bcrypt            | Usalama wa login               |
| i18n        | React Context           | Kiswahili + English            |
| Payments    | Simulated (M-Pesa ready)| Ready for integration          |

---

## 🚀 Jinsi ya Kuendesha (How to Run)

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
Server itaanza kwenye: `http://localhost:5000`

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Fungua: `http://localhost:5173`

### 3. Database
Database inaundwa otomatiki mara ya kwanza unapoendesha backend.

---

## 📋 Features Zilizopo (MVP)

- [x] Usajili & Login (Customer + Owner)
- [x] Dashboard: Mauzo ya siku
- [x] Faida kwa kila bidhaa
- [x] Orodha ya bidhaa + stock
- [x] Rekodi mauzo
- [x] Madeni (Debts) – angalia & lipa
- [x] Language Switcher (SW / EN)
- [x] Responsive design + rangi za green / sea blue / red

---

## 📅 Roadmap (Tazama `docs/ROADMAP.md`)

---

## 🎨 Rangi za Design

- **Primary Green:** `#16A34A`
- **Sea Blue:** `#0077B6`
- **Accent Red:** `#DC2626`
- **Background:** Light gray / white
- **Text:** Dark slate

---

## 📞 Support

Mradi huu ni starter template. Unaweza kuendeleza kulingana na roadmap.
