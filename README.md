# 🚀 OpsPulse — Unified Business Health Dashboard

A full-stack real-time business intelligence dashboard for SMBs. Built with React, Node.js, MongoDB, and Socket.io.

---

## 📋 Prerequisites

### 1. Install Node.js
- Download from https://nodejs.org/ (v18 or higher recommended)
- Verify: `node --version` and `npm --version`

### 2. Install MongoDB

**Option A — Local MongoDB (Recommended for development):**
- Mac: `brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb/brew/mongodb-community`
- Windows: Download from https://www.mongodb.com/try/download/community
- Linux (Ubuntu): `sudo apt-get install -y mongodb`
- Verify: `mongosh` should open a shell

**Option B — MongoDB Atlas (Cloud, free tier):**
1. Create account at https://cloud.mongodb.com
2. Create a free M0 cluster
3. Get your connection string: `mongodb+srv://<user>:<pass>@cluster.mongodb.net/opspulse`
4. Update `backend/.env`: set `MONGODB_URI=your_atlas_connection_string`

---

## ⚡ Quick Start

### Step 1: Clone/Extract the project
```bash
cd opspulse
```

### Step 2: Install all dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Go back to root
cd ..
```

### Step 3: Configure environment
The `backend/.env` file is already configured for local MongoDB:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/opspulse
JWT_SECRET=opspulse_super_secret_jwt_key_2024
```
Only change `MONGODB_URI` if using Atlas.

### Step 4: Seed the database
```bash
cd backend
node config/seed.js
```
Expected output:
```
✅ Users created
✅ Inventory created
✅ Orders created
✅ Tickets created
🚀 Database seeded successfully!
```

### Step 5: Start the backend server
```bash
# From the backend directory:
npm run dev

# OR with plain node:
npm start
```
You should see:
```
✅ MongoDB Connected: localhost
🚀 OpsPulse Server running on port 5000
📡 Socket.io enabled
```

### Step 6: Start the frontend (in a new terminal)
```bash
cd frontend
npm run dev
```
You should see:
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:3000/
```

### Step 7: Open in browser
Navigate to: **http://localhost:3000**

---

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Business Owner | owner@opspulse.com | password123 |
| Operations Manager | ops@opspulse.com | password123 |

---

## 📁 Project Structure

```
opspulse/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seed.js            # Database seeder
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── salesController.js
│   │   ├── inventoryController.js
│   │   ├── ticketsController.js
│   │   ├── alertsController.js
│   │   ├── stressController.js
│   │   └── historyController.js
│   ├── cronJobs/
│   │   └── businessSimulator.js  # Real-time simulation + cron
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Order.js
│   │   ├── Inventory.js
│   │   ├── Ticket.js
│   │   ├── Alert.js
│   │   └── History.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── api.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx   # JWT auth state
    │   ├── layouts/
    │   │   └── DashboardLayout.jsx
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── OwnerDashboard.jsx
    │   │   ├── OpsDashboard.jsx
    │   │   └── HistoricalInsights.jsx
    │   ├── components/
    │   │   ├── KPICard.jsx
    │   │   ├── StressScore.jsx
    │   │   ├── AlertPanel.jsx
    │   │   ├── LiveFeed.jsx
    │   │   └── WarRoom.jsx
    │   ├── services/
    │   │   ├── api.js            # Axios API calls
    │   │   └── socket.js         # Socket.io client
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | None | Login |
| GET | /api/auth/me | JWT | Current user |
| GET | /api/sales | JWT | Sales data |
| GET | /api/orders | JWT | Order list |
| GET | /api/inventory | JWT | Inventory |
| GET | /api/tickets | JWT | Support tickets |
| GET | /api/alerts | JWT | Active alerts |
| PATCH | /api/alerts/:id/acknowledge | JWT | Dismiss alert |
| GET | /api/stress-score | JWT | Business health score |
| GET | /api/history | JWT (Owner) | Historical data |

---

## ⚙️ Features

- **Real-time updates** via Socket.io (new orders, tickets, alerts every ~8-25 seconds)
- **Business Stress Score** (0-100) based on tickets + inventory + sales
- **War Room Mode** activates automatically when stress hits critical
- **Alert system**: Crisis, Opportunity, Anomaly types
- **Role-based dashboards**: Owner (overview + history) vs Ops Manager (operations)
- **Historical snapshots** saved automatically every 30 minutes via node-cron
- **JWT authentication** with bcrypt password hashing

---

## 🛠️ Troubleshooting

**MongoDB connection failed:**
- Make sure MongoDB is running: `brew services list | grep mongodb` (Mac)
- Windows: Check Services panel for MongoDB

**Port already in use:**
- Backend: Change PORT in .env
- Frontend: Change port in vite.config.js

**Dependencies fail:**
- Delete `node_modules` and `package-lock.json`, then `npm install` again

**No data showing:**
- Make sure you ran `node config/seed.js`
- Check backend console for errors
