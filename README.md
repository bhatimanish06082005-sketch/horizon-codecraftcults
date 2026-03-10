# 🚀 OpsPulse — Unified Business Health Dashboard

> A real-time business operations dashboard for SMBs — monitor revenue, inventory, support tickets, stress score, and live external data all in one place.

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| 🖥️ Frontend | https://opspulse-frontend-app.onrender.com |
| ⚙️ Backend API | https://opspulse-backend-0xh4.onrender.com |

### Demo Accounts
| Role | Email | Password |
|---|---|---|
| Owner | owner@opspulse.com | password123 |
| Ops Manager | ops@opspulse.com | password123 |

---

## ✨ Features

- 📊 **Owner Dashboard** — Revenue KPIs, 7-day trend chart, stress score, alerts
- 🛠️ **Ops Dashboard** — Live orders, inventory bar chart, tickets table
- 🔴 **War Room Mode** — Full-screen crisis mode with alerts and recommended actions
- 📈 **Historical Insights** — Trend charts for revenue, stress, inventory, tickets
- 🔌 **Live Integrations** — NewsAPI, OpenWeather, Alpha Vantage with dynamic KPI cards
- ⚡ **Real-time Updates** — Socket.io powered live feed every 8 seconds
- 🧠 **Business Stress Score** — 0-100 score based on tickets, inventory risk, sales gap
- 🔐 **JWT Auth** — Role-based access (owner vs ops_manager)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite + Tailwind CSS + Recharts |
| Backend | Node.js + Express.js + Socket.io |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Deployment | Render (Frontend + Backend) + MongoDB Atlas |

---

## 📁 Project Structure

```
opspulse/
├── backend/
│   ├── config/          # DB connection & seed
│   ├── controllers/     # Business logic
│   ├── cronJobs/        # Business simulator
│   ├── middleware/      # JWT auth
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   └── server.js        # Entry point
└── frontend/
    └── src/
        ├── components/  # KPICard, StressScore, AlertPanel, WarRoom
        ├── context/     # AuthContext
        ├── layouts/     # DashboardLayout
        ├── pages/       # All pages
        └── services/    # API & Socket
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local)
- Git

### 1. Clone the repo
```bash
git clone https://github.com/bhatimanish06082005-sketch/horizon-codecraftcults.git
cd horizon-codecraftcults
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/opspulse
JWT_SECRET=opspulse_super_secret_jwt_key_2024
NODE_ENV=development
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```

### 4. Seed the Database
```bash
cd ../backend
node config/seed.js
```

### 5. Run the App

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open 👉 http://localhost:3000

---

## 🔌 Integrations Setup

Go to **Dashboard → Integrations** and add optional API keys:

| Integration | Get Free Key | What it shows |
|---|---|---|
| 📰 NewsAPI | https://newsapi.org/register | Live business headlines |
| 🌤️ OpenWeather | https://openweathermap.org/api | Temperature, humidity, wind |
| 💹 Alpha Vantage | https://www.alphavantage.co/support/#api-key | Stock prices, market trend |

---

## 🔄 How to Make Changes & Deploy

### Step 1 — Make your changes in VS Code

Edit any file in the project locally.

### Step 2 — Save and push to GitHub

```bash
git add .
git commit -m "describe your change here"
git push origin main
```

### Step 3 — Render auto-deploys!

Render detects the push and automatically redeploys both frontend and backend within 2-3 minutes. No manual action needed! ✅

### Example commits:
```bash
git commit -m "Add new KPI card to owner dashboard"
git commit -m "Fix bug in stress score calculation"
git commit -m "Update landing page hero text"
git commit -m "Add new route to backend API"
```

---

## 🌱 Seeding the Database

To reset and reseed the database:

**Local:**
```bash
cd backend
node config/seed.js
```

**Production (Atlas):**
```powershell
cd backend
$env:MONGODB_URI="your-atlas-connection-string"
node config/seed.js
```

---

## 👥 Roles

| Role | Access |
|---|---|
| `owner` | Owner Dashboard, Historical Insights, Integrations, War Room |
| `ops_manager` | Ops Dashboard, War Room |

---

## 📄 License

MIT License — feel free to use and modify!

---

Built with ❤️ by code craft cults