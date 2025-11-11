import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { setTheme } from './redux/themeSlice';
import { setUser } from './redux/userSlice';
import { authAPI } from './utils/api';

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Public Route Component (redirect to dashboard if already logged in)
function PublicRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

function App() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    // Initialize theme
    dispatch(setTheme(theme));
    
    // Check if user is logged in
    const checkAuth = async () => {
      if (isAuthenticated) {
        try {
          const response = await authAPI.getUser();
          dispatch(setUser(response.data.user));
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
    };
    
    checkAuth();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
