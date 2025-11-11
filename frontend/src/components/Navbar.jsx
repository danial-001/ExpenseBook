import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { LogOut, Moon, Sun, User, Wallet, Menu, X } from 'lucide-react';
import { logout } from '../redux/userSlice';
import { toggleTheme } from '../redux/themeSlice';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const themeMode = useSelector((state) => state.theme.mode);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const toggleMobileMenu = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 dark:bg-dark-bg/85 border-b border-light-accent/20 dark:border-dark-accent/20 shadow-soft"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center 
                          bg-gradient-to-br from-dark-accent to-light-surface shadow-glow-light dark:shadow-glow-dark">
              <Wallet className="w-5 h-5 md:w-6 md:h-6 text-dark-bg" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-light-accent to-dark-accent 
                           bg-clip-text text-transparent">
                ExpenseBook
              </h1>
              <p className="text-[0.65rem] sm:text-xs text-light-text/60 dark:text-dark-text/60">
                Smart Finance Management
              </p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              type="button"
              className="sm:hidden p-2 rounded-xl glass-card"
              onClick={toggleMobileMenu}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            {/* User Badge */}
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden md:flex items-center gap-2 px-4 py-2 glass-card"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-dark-accent to-light-surface 
                              flex items-center justify-center">
                  <User className="w-4 h-4 text-dark-bg" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-light-text dark:text-dark-text leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs text-light-text/60 dark:text-dark-text/60">
                    {user.email}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleThemeToggle}
              className="p-2 md:p-3 rounded-xl glass-card hover:shadow-glow-light dark:hover:shadow-glow-dark"
            >
              {themeMode === 'dark' ? (
                <Sun className="w-5 h-5 text-dark-accent" />
              ) : (
                <Moon className="w-5 h-5 text-light-accent" />
              )}
            </motion.button>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-3 rounded-xl 
                       bg-semantic-danger/90 hover:bg-semantic-danger text-white font-semibold
                       shadow-soft hover:shadow-soft-lg transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline text-sm">Logout</span>
            </motion.button>
          </div>
        </div>
        {mobileOpen && (
          <div className="sm:hidden mt-3 pb-4 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-2xl flex items-center justify-center bg-gradient-to-br from-dark-accent to-light-surface">
                  <Wallet className="w-4 h-4 text-dark-bg" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">ExpenseBook</p>
                  <p className="text-[0.65rem] text-[rgba(67,86,99,0.7)] dark:text-[rgba(255,248,212,0.7)]">
                    Smart Finance Management
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="p-2 rounded-xl border border-[rgba(67,86,99,0.15)] bg-white/90 dark:bg-[rgba(49,54,71,0.85)] dark:border-[rgba(163,176,135,0.28)]"
                onClick={toggleMobileMenu}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-[rgba(67,86,99,0.15)] bg-white/80 dark:bg-[rgba(49,54,71,0.85)] dark:border-[rgba(163,176,135,0.28)]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-dark-accent to-light-surface flex items-center justify-center">
                  <User className="w-4 h-4 text-dark-bg" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                  <p className="text-xs text-[rgba(67,86,99,0.7)] dark:text-[rgba(255,248,212,0.7)] truncate">{user.email}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleThemeToggle}
              className="flex items-center justify-between px-4 py-3 rounded-2xl border border-[rgba(67,86,99,0.15)] bg-white/90 dark:bg-[rgba(49,54,71,0.85)] dark:border-[rgba(163,176,135,0.28)] text-sm font-semibold"
            >
              <span>Toggle Theme</span>
              {themeMode === 'dark' ? <Sun className="w-5 h-5 text-dark-accent" /> : <Moon className="w-5 h-5 text-light-accent" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-semantic-danger text-white font-semibold shadow-soft"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;
