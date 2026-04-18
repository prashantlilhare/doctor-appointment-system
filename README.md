# SovindCare 🏥

A clean, minimal healthcare appointment booking web app.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

---

### 1. Install dependencies

```bash
# Root (backend)
npm install

# Client (frontend)
cd client && npm install
```

---

### 2. Configure environment

Edit `.env` in the root:

```
MONGO_URI=mongodb://localhost:27017/sovindcare
JWT_SECRET=sovindcare_secret_key_2024
PORT=5000
ADMIN_EMAIL=admin@sovindcare.com
ADMIN_PASSWORD=admin123
```

---

### 3. Run the backend

```bash
# From root
node server/server.js
```

Server starts on **http://localhost:5000**
Admin account is auto-seeded on first run.

---

### 4. Run the frontend

```bash
# From /client
cd client
npx vite --port 5173
```

Frontend starts on **http://localhost:5173**

---

## 🔐 Admin Login

- **Email:** admin@sovindcare.com  
- **Password:** admin123

Click the floating **"🔐 Admin Login"** button (bottom-right of any page).

After login, choose:
- **As Patient** → browse/book appointments normally
- **As Doctor** → go to the Admin Dashboard

---

## 📁 Project Structure

```
sovindcare/
├── client/
│   ├── src/
│   │   ├── api/          # API helper functions
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Home, Track, AdminDashboard
│   │   ├── App.jsx       # Router + Auth context
│   │   └── main.jsx      # Entry point
│   └── index.html
│
├── server/
│   ├── config/           # DB connection + JWT middleware
│   ├── controllers/      # Business logic
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routers
│   ├── app.js            # Express setup
│   └── server.js         # Entry + admin seeder
│
├── .env
└── package.json
```

---

## 🌐 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/appointments/create | No | Book appointment |
| GET | /api/appointments/track/:phone | No | Track by phone |
| GET | /api/appointments/all | Admin | Get all appointments |
| PATCH | /api/appointments/update/:id | Admin | Update status |
| POST | /api/auth/login | No | Admin login |
| POST | /api/feedback/create | No | Submit feedback |
| GET | /api/feedback/all | No | Get approved feedback |
| GET | /api/feedback/admin/all | Admin | Get all feedback |
| PATCH | /api/feedback/approve/:id | Admin | Approve feedback |

---

## ✨ Features

- **Patients:** Book appointments (name, phone, symptoms, date, condition, address, location)
- **Tracking:** Look up all appointments by phone number
- **Admin Dashboard:** View all appointments, accept/reject/complete them (FIFO order)
- **Feedback:** Submit and approve testimonials
- **Floating Buttons:** Urgent Call (📞) and Admin Login (🔐)
- **Duplicate Prevention:** No same phone + same date bookings
- **Past Date Guard:** Can't book in the past
