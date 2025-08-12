// src/auth/AuthProvider.jsx - CORRECTED FOR PRODUCTION
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    // Check if we have stored credentials
    const username = localStorage.getItem('auth-username');
    const password = localStorage.getItem('auth-password');
    return username && password ? 'authenticated' : null;
  });
  const navigate = useNavigate();

  /* keep localStorage in sync */
  useEffect(() => {
    if (!token) {
      localStorage.removeItem('auth-username');
      localStorage.removeItem('auth-password');
      localStorage.removeItem('jwt'); // Clean up old JWT
    }
  }, [token]);

  /* -------------- API helpers -------------- */
  async function login(username, password) {
    try {
      const res = await fetch('https://employee-management-api-nql8.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Login failed');
      }
      
      const body = await res.json();
      console.log('✅ Login response:', body);
      
      // Store credentials for Basic Auth
      localStorage.setItem('auth-username', username);
      localStorage.setItem('auth-password', password);
      setToken('authenticated');
      return body;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  async function register(data) {
    try {
      // ✅ FIXED: Use deployed backend URL (not localhost)
      const res = await fetch('https://employee-management-api-nql8.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Registration failed');
      }
      
      console.log('✅ User registered successfully');
      return await res.json(); // Return response data if needed
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  }

  function logout() {
    setToken(null);
    localStorage.removeItem('auth-username');
    localStorage.removeItem('auth-password');
    localStorage.removeItem('jwt'); // Clean up any old JWT tokens
    console.log('🚪 User logged out');
    navigate('/login');
  }

  const value = { token, login, logout, register, isAuth: Boolean(token) };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ✅ EXPORT the useAuth hook
export const useAuth = () => useContext(AuthContext);
