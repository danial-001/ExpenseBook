# 💰 Expense Tracker - Full Stack Web Application

A modern, feature-rich expense tracking application built with React and Flask. Track your income, manage expenses, visualize spending patterns, and get smart insights about your financial health.

![Tech Stack](https://img.shields.io/badge/React-18.2.0-blue)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3.6-38B2AC)

## ✨ Features

### 🔐 User Management
- **Secure Authentication**: JWT-based authentication with password hashing
- **Persistent Sessions**: Stay logged in until manual logout
- **User Isolation**: Each user's data is completely private and isolated

### 💸 Expense & Income Tracking
- **Easy Entry**: Quick and intuitive forms for adding expenses and income
- **Categories**: Organize expenses by Food, Rent, Travel, Misc., and Others
- **Edit & Delete**: Full CRUD operations on all transactions
- **Date Tracking**: Track when each transaction occurred
- **Manual Savings Buckets**: Move funds between remaining balance and savings through dedicated deposit/withdraw actions

### 📊 Analytics & Insights
- **Dashboard Overview**: See total income, expenses, and savings at a glance
- **Visual Charts**: 
  - Monthly income vs expense trends (Line chart)
  - Category-wise expense breakdown (Pie chart)
- **Smart Insights**: Automated analysis of spending patterns
- **Historical Data**: Track your financial journey over time
- **Manual Savings Tracking**: Monitor savings deposits, withdrawals, and remaining balance in real-time

### 🎨 User Experience
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Beautiful UI**: Modern card-based layout with smooth animations
- **Framer Motion**: Delightful transitions and micro-interactions

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router v6

### Backend
- **Framework**: Flask 3.0
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT (PyJWT)
- **Password Hashing**: Werkzeug
- **CORS**: Flask-CORS

## 📁 Project Structure

```
ExpenseTracker/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── config.py              # Configuration settings
│   ├── models.py              # Database models
│   ├── requirements.txt       # Python dependencies
│   ├── routes/
│   │   ├── auth_routes.py     # Authentication endpoints
│   │   ├── expense_routes.py  # Expense CRUD endpoints
│   │   ├── income_routes.py   # Income CRUD endpoints
│   │   └── analytics_routes.py # Analytics endpoints
│   ├── utils/
│   │   └── jwt_helper.py      # JWT utilities
│   └── database/
│       └── init_db.py         # Database initialization
│
└── frontend/
    ├── src/
    │   ├── components/        # Reusable components
    │   │   ├── Navbar.jsx
    │   │   ├── ExpenseForm.jsx
    │   │   ├── IncomeForm.jsx
    │   │   ├── SavingsForm.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── ExpenseTable.jsx
    │   │   ├── SavingsTable.jsx
    │   │   └── ChartCard.jsx
    │   ├── pages/            # Page components
    │   ├── redux/            # Redux store and slices
    │   ├── utils/            # Utility functions
    │   ├── App.jsx           # Main app component
    │   └── main.jsx          # Entry point
    ├── package.json
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up PostgreSQL database**
```bash
# Create a new PostgreSQL database
createdb expense_tracker

# Or using psql
psql -U postgres
CREATE DATABASE expense_tracker;
\q
```

5. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/expense_tracker
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET_KEY=your-jwt-secret-key-change-in-production
FLASK_ENV=development
```

6. **Initialize database**
```bash
python database/init_db.py
```

> **Note:** Existing deployments should run the latest migrations (or `db.create_all()`) to create the new `savings_transactions` table used for manual savings tracking.

7. **Run the Flask server**
```bash
python app.py
```

Backend will be running at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Run the development server**
```bash
npm run dev
```

Frontend will be running at `http://localhost:3000`

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Get Current User
```http
GET /api/user
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/logout
Authorization: Bearer <token>
```

### Expense Endpoints

#### Get All Expenses
```http
GET /api/expenses
Authorization: Bearer <token>

Query Parameters:
- category: Filter by category
- start_date: Filter from date (ISO format)
- end_date: Filter to date (ISO format)
```

#### Create Expense
```http
POST /api/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 50.00,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2024-01-15T12:00:00Z"
}
```

#### Update Expense
```http
PUT /api/expenses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 55.00,
  "category": "Food",
  "description": "Updated description"
}
```

#### Delete Expense
```http
DELETE /api/expenses/:id
Authorization: Bearer <token>
```

### Income Endpoints

#### Get All Incomes
```http
GET /api/incomes
Authorization: Bearer <token>
```

#### Create Income
```http
POST /api/incomes
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 3000.00,
  "source": "Monthly Salary",
  "date": "2024-01-01T00:00:00Z"
}
```

#### Update Income
```http
PUT /api/incomes/:id
Authorization: Bearer <token>
```

#### Delete Income
```http
DELETE /api/incomes/:id
Authorization: Bearer <token>
```

### Analytics Endpoints

#### Get Dashboard Analytics
```http
GET /api/analytics/dashboard
Authorization: Bearer <token>
```

#### Get Category Breakdown
```http
GET /api/analytics/category-breakdown
Authorization: Bearer <token>
```

#### Get Monthly Trend
```http
GET /api/analytics/monthly-trend
Authorization: Bearer <token>
```

#### Get Insights
```http
GET /api/analytics/insights
Authorization: Bearer <token>
```

### Savings Endpoints

#### Get Savings Summary & Transactions
```http
GET /api/savings
Authorization: Bearer <token>
```

#### Create Savings Transaction
```http
POST /api/savings
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 45000,
  "action": "deposit", // or "withdraw"
  "description": "Reserved for emergency fund",
  "date": "2024-01-25T00:00:00Z"
}
```

## 🎨 Color Scheme

### Dark Mode
- Primary Background: `#313647`
- Secondary Background: `#435663`
- Accent: `#A3B087`

### Light Mode
- Primary Background: `#FFF8D4`
- Accent: `#A3B087`

## 🔒 Security Features

- **Password Hashing**: Werkzeug security for bcrypt hashing
- **JWT Tokens**: Secure token-based authentication
- **CORS Protection**: Configured for specific origins
- **SQL Injection Prevention**: SQLAlchemy ORM with parameterized queries
- **User Data Isolation**: Foreign key constraints ensure data privacy

## 🚀 Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Use PostgreSQL add-on
3. Deploy using Git or CLI

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ by a passionate developer

## 🙏 Acknowledgments

- React team for the amazing framework
- Flask team for the elegant backend framework
- Tailwind CSS for the utility-first CSS framework
- Recharts for beautiful chart components
- Framer Motion for smooth animations

---

**Happy Tracking! 💰📊**
