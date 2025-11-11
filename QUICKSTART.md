# 🚀 Quick Start Guide

Get your Expense Tracker up and running in 5 minutes!

## Prerequisites Check

Make sure you have:
- ✅ Python 3.10+ (`python --version`)
- ✅ Node.js 18+ (`node --version`)
- ✅ PostgreSQL 12+ (`psql --version`)
- ✅ pip (`pip --version`)
- ✅ npm (`npm --version`)

## Step 1: Database Setup (2 minutes)

```bash
# Start PostgreSQL (if not already running)
# macOS with Homebrew:
brew services start postgresql

# Create database
createdb expense_tracker

# Or using psql:
psql -U postgres -c "CREATE DATABASE expense_tracker;"
```

## Step 2: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
python database/init_db.py

# Start backend server
python app.py
```

Backend running at: `http://localhost:5000` ✅

## Step 3: Frontend Setup (1 minute)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start frontend server
npm run dev
```

Frontend running at: `http://localhost:3000` ✅

## Step 4: Open & Test

1. Open browser: `http://localhost:3000`
2. Click "Get Started Free"
3. Register a new account
4. Start tracking your expenses! 🎉

## Default Configuration

### Backend (Flask)
- **URL**: http://localhost:5000
- **Database**: PostgreSQL on default port (5432)
- **JWT Token Expiry**: 30 days

### Frontend (React)
- **URL**: http://localhost:3000
- **API Proxy**: Automatically proxies `/api` to backend

## Troubleshooting

### Backend Issues

**Database Connection Error**
```bash
# Check PostgreSQL is running
brew services list  # macOS
# or
sudo systemctl status postgresql  # Linux

# Verify database exists
psql -U postgres -l | grep expense_tracker
```

**Port 5000 already in use**
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

### Frontend Issues

**Port 3000 already in use**
```bash
# Vite will automatically suggest next available port
# Or manually set in vite.config.js
```

**API Connection Failed**
- Ensure backend is running
- Check `.env` file has correct `VITE_API_URL`
- Check browser console for CORS errors

## Testing the Application

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Test API Health
```bash
curl http://localhost:5000/api/health
```

## Next Steps

1. ✅ Create your account
2. ✅ Add your first income entry
3. ✅ Log some expenses
4. ✅ Check out the analytics dashboard
5. ✅ Toggle between light/dark mode
6. ✅ Explore insights and charts

## Production Deployment

See main [README.md](./README.md) for deployment instructions to:
- Heroku / Railway / Render (Backend)
- Vercel / Netlify (Frontend)

---

**Need Help?** Check the main README.md or open an issue on GitHub.

Happy Tracking! 💰
