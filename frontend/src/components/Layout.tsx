import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import '../App.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app">
      <motion.div 
        className="app-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <header className="app-header">
          <h1>InterIIT Tech Meet 14.0</h1>
          <div className="header-actions">
            <motion.button 
              className="theme-toggle"
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </motion.button>
            <div className="user-info">
              <span>Welcome, {user?.name}</span>
              <button 
                className="logout-button"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="app-main">
          {children}
        </main>
      </motion.div>
    </div>
  );
};

export default Layout;
