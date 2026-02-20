import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminLogin } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('jalwa_admin_user');
    setUser(null);
  }, []);

  // Check auth on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('jalwa_admin_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // Basic validation: user must have a token and the role must be admin
        if (parsed && parsed.token && parsed.role === 'admin') {
          setUser(parsed);
        } else {
          // If role is missing or not admin, clear it
          logout();
        }
      } catch (err) {
        logout();
      }
    }
    setInitialLoading(false);

    // Listen for global logout events from api.js
    const handleLogout = () => logout();
    window.addEventListener('jalwa:logout', handleLogout);
    return () => window.removeEventListener('jalwa:logout', handleLogout);
  }, [logout]);

  const login = async (phone, password) => {
    try {
      const res = await adminLogin(phone, password);
      if (res.success && res.token) {
        const userData = res.data;
        
        // STRICTOR ROLE CHECK: Reject non-admin users
        if (userData.role !== 'admin') {
          throw new Error('Not an admin account');
        }

        const authData = {
          ...userData,
          token: res.token,
        };
        
        localStorage.setItem('jalwa_admin_user', JSON.stringify(authData));
        setUser(authData);
        return { success: true };
      }
      return { success: false, message: 'Invalid phone or password' };
    } catch (err) {
      console.error('Login failed:', err.message);
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, initialLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
