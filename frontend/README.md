# Frontend - Expense Tracker

Modern React application built with Vite, Tailwind CSS, and Redux Toolkit.

## 🎨 Tech Stack

- **React 18**: UI library
- **Vite**: Build tool & dev server
- **Redux Toolkit**: State management
- **React Router v6**: Routing
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animations
- **Recharts**: Data visualization
- **Axios**: HTTP client
- **Lucide React**: Icon library
- **date-fns**: Date formatting

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Top navigation bar
│   ├── StatCard.jsx    # Dashboard stat cards
│   ├── ExpenseForm.jsx # Expense entry form
│   ├── IncomeForm.jsx  # Income entry form
│   ├── ExpenseTable.jsx # Transaction table
│   └── ChartCard.jsx   # Chart wrapper
│
├── pages/              # Route pages
│   ├── Home.jsx       # Landing page
│   ├── Login.jsx      # Login page
│   ├── Register.jsx   # Registration page
│   └── Dashboard.jsx  # Main dashboard
│
├── redux/             # State management
│   ├── store.js       # Redux store config
│   ├── userSlice.js   # User state
│   ├── expenseSlice.js # Expenses state
│   ├── incomeSlice.js  # Income state
│   └── themeSlice.js   # Theme state
│
├── utils/
│   └── api.js         # API client & endpoints
│
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Run Development Server
```bash
npm run dev
```

Opens at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🎨 Design System

### Colors

- Brand Primary: `#0F172A`
- Brand Surface: `#1E293B`
- Brand Accent: `#2563EB`
- Accent Muted: `#38BDF8`
- Neutral Light: `#F8FAFC`
- Neutral Muted: `#E2E8F0`
- Semantic Success: `#16A34A`
- Semantic Warning: `#F59E0B`
- Semantic Danger: `#DC2626`

### Typography
- **Headings**: Bold, various sizes
- **Body**: Regular weight
- **Buttons**: Semibold

### Components
- **Cards**: Rounded corners (2xl), shadow-lg
- **Buttons**: Rounded-2xl, hover effects
- **Inputs**: Rounded-xl, focus states
- **Modals**: Centered overlay, backdrop blur

## 🧩 Component Library

### StatCard
Displays key metrics with icon and gradient background.

```jsx
<StatCard
  icon={<TrendingUp />}
  title="Total Income"
  value={5000}
  subtitle="This month"
  color="green"
/>
```

### ChartCard
Wrapper for Recharts components.

```jsx
<ChartCard
  title="Monthly Trend"
  data={trendData}
  type="line"
/>
```

### ExpenseForm / IncomeForm
Modal forms for creating/editing transactions.

```jsx
<ExpenseForm
  expense={selectedExpense}
  onClose={() => setShow(false)}
/>
```

### ExpenseTable
Displays transactions with edit/delete actions.

```jsx
<ExpenseTable type="expense" />
```

## 🔐 Authentication Flow

1. User logs in/registers
2. JWT token stored in localStorage
3. Token sent in Authorization header
4. Protected routes check authentication
5. Auto-redirect on token expiry

## 🎭 State Management

### Redux Slices

**userSlice**
- User data
- Authentication status
- Login/logout actions

**expenseSlice**
- Expenses array
- CRUD operations
- Loading states

**incomeSlice**
- Income array
- CRUD operations
- Loading states

**themeSlice**
- Dark/light mode
- Persists to localStorage

### Usage Example
```jsx
import { useSelector, useDispatch } from 'react-redux';
import { addExpense } from '../redux/expenseSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const expenses = useSelector(state => state.expenses.expenses);
  
  const handleAdd = (expense) => {
    dispatch(addExpense(expense));
  };
}
```

## 🌐 API Integration

### API Client (`utils/api.js`)

Axios instance with:
- Base URL configuration
- Auto token attachment
- Error interceptors
- Response handling

### API Modules
```javascript
import { authAPI, expenseAPI, incomeAPI, analyticsAPI } from './utils/api';

// Authentication
await authAPI.login({ email, password });
await authAPI.register({ name, email, password });

// Expenses
await expenseAPI.getAll();
await expenseAPI.create(data);
await expenseAPI.update(id, data);
await expenseAPI.delete(id);

// Analytics
await analyticsAPI.getDashboard();
await analyticsAPI.getCategoryBreakdown();
```

## 🎬 Animations

### Framer Motion
Used for:
- Page transitions
- Component mount/unmount
- Hover effects
- Loading states

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

## 📱 Responsive Design

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

### Mobile-First
All layouts start with mobile and scale up.

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* Responsive grid */}
</div>
```

## 🎨 Dark Mode

### Implementation
- Redux state for current theme
- localStorage persistence
- Tailwind `dark:` classes
- Auto system preference detection

### Usage
```jsx
// Toggle theme
import { toggleTheme } from './redux/themeSlice';
dispatch(toggleTheme());

// Use in components
<div className="bg-white dark:bg-dark-primary">
  Content
</div>
```

## 🚀 Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Deploy dist/ folder
```

### Environment Variables
Set in deployment platform:
- `VITE_API_URL`: Production API URL

## 🧪 Testing

```bash
# Future: Add testing setup
npm test
```

## 📦 Build Optimization

### Vite Features
- Fast HMR
- Code splitting
- Tree shaking
- Asset optimization
- CSS minification

### Bundle Analysis
```bash
npm run build
# Check dist/ folder size
```

## 🐛 Common Issues

**API Calls Failing**
- Check backend is running
- Verify VITE_API_URL in .env
- Check browser console for CORS

**Dark Mode Not Persisting**
- Clear localStorage
- Check Redux DevTools

**Charts Not Rendering**
- Verify data format
- Check browser console
- Ensure Recharts is installed

## 📚 Dependencies

### Core
- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^6.20.0

### State & Data
- @reduxjs/toolkit: ^2.0.1
- react-redux: ^9.0.4
- axios: ^1.6.2

### UI & Styling
- tailwindcss: ^3.3.6
- framer-motion: ^10.16.16
- lucide-react: ^0.294.0
- recharts: ^2.10.3
- date-fns: ^3.0.6

### Dev Tools
- @vitejs/plugin-react: ^4.2.1
- vite: ^5.0.8

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Recharts](https://recharts.org)

---

Built with React ⚛️ and ❤️
