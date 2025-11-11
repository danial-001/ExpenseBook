# Backend API - Expense Tracker

Flask-based RESTful API for the Expense Tracker application.

## 🏗️ Architecture

```
backend/
├── app.py                  # Main Flask application & entry point
├── config.py               # Configuration management
├── models.py               # SQLAlchemy database models
├── requirements.txt        # Python dependencies
│
├── routes/
│   ├── auth_routes.py      # Authentication & user management
│   ├── expense_routes.py   # Expense CRUD operations
│   ├── income_routes.py    # Income CRUD operations
│   └── analytics_routes.py # Analytics & reporting
│
├── utils/
│   └── jwt_helper.py       # JWT token utilities
│
└── database/
    └── init_db.py          # Database initialization script
```

## 🗃️ Database Schema

### Users Table
- `id`: Primary key
- `email`: Unique email (indexed)
- `password_hash`: Bcrypt hashed password
- `name`: User's full name
- `created_at`: Registration timestamp

### Expenses Table
- `id`: Primary key
- `user_id`: Foreign key to users (indexed)
- `amount`: Decimal amount
- `category`: Enum (Food, Rent, Travel, Misc., Others)
- `description`: Optional text
- `date`: Transaction date (indexed)
- `created_at`: Entry timestamp

### Incomes Table
- `id`: Primary key
- `user_id`: Foreign key to users (indexed)
- `amount`: Decimal amount
- `source`: Income source description
- `date`: Transaction date (indexed)
- `created_at`: Entry timestamp

## 🔧 Setup

### 1. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/expense_tracker
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
FLASK_ENV=development
```

### 4. Initialize Database
```bash
python database/init_db.py
```

### 5. Run Server
```bash
python app.py
```

Server will run on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Authentication

**Register**
```
POST /api/register
Body: { name, email, password }
Returns: { token, user }
```

**Login**
```
POST /api/login
Body: { email, password }
Returns: { token, user }
```

**Get Current User**
```
GET /api/user
Headers: Authorization: Bearer <token>
Returns: { user }
```

**Logout**
```
POST /api/logout
Headers: Authorization: Bearer <token>
```

### Expenses

**List Expenses**
```
GET /api/expenses?category=Food&start_date=2024-01-01&end_date=2024-12-31
Headers: Authorization: Bearer <token>
```

**Create Expense**
```
POST /api/expenses
Headers: Authorization: Bearer <token>
Body: { amount, category, description, date }
```

**Update Expense**
```
PUT /api/expenses/:id
Headers: Authorization: Bearer <token>
Body: { amount, category, description, date }
```

**Delete Expense**
```
DELETE /api/expenses/:id
Headers: Authorization: Bearer <token>
```

### Income (Similar structure to Expenses)

### Analytics

**Dashboard Summary**
```
GET /api/analytics/dashboard
Returns: Current month & all-time totals
```

**Category Breakdown**
```
GET /api/analytics/category-breakdown
Returns: Expense distribution by category
```

**Monthly Trend**
```
GET /api/analytics/monthly-trend
Returns: Last 6 months income vs expenses
```

**Smart Insights**
```
GET /api/analytics/insights
Returns: Automated financial insights
```

## 🔒 Security

- **Password Hashing**: Werkzeug's `generate_password_hash`
- **JWT Authentication**: 30-day token expiration
- **CORS**: Configured for frontend origin
- **SQL Injection**: Prevented via SQLAlchemy ORM
- **Data Isolation**: User-specific queries with foreign keys

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test registration
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

## 🚀 Deployment

### Environment Variables
Set these in production:
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Long random string
- `JWT_SECRET_KEY`: Long random string
- `FLASK_ENV`: production

### Heroku
```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### Railway/Render
1. Connect GitHub repository
2. Add PostgreSQL database
3. Set environment variables
4. Deploy

## 📝 Dependencies

- **Flask 3.0**: Web framework
- **Flask-SQLAlchemy**: ORM
- **Flask-CORS**: CORS handling
- **PyJWT**: JWT tokens
- **Werkzeug**: Password hashing
- **psycopg2-binary**: PostgreSQL adapter
- **python-dotenv**: Environment variables

## 🐛 Common Issues

**Database Connection**
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

**Import Errors**
- Activate virtual environment
- Reinstall requirements

**CORS Errors**
- Check Flask-CORS configuration
- Verify frontend origin

## 📚 Code Structure

### Models (`models.py`)
- SQLAlchemy models with relationships
- Password hashing methods
- JSON serialization methods

### Routes
- Modular blueprint-based routing
- JWT authentication decorators
- Error handling

### Utils
- Token generation/validation
- Authentication decorator

## 🔄 Database Migrations

For production, consider using Flask-Migrate:
```bash
pip install Flask-Migrate
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

---

Built with Flask 🐍
