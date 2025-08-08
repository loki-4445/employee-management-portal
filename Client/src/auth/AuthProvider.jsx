// src/auth/AuthProvider.jsx
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
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!res.ok) throw new Error('Bad credentials');
    const body = await res.json();
    console.log('Login response:', body);
    
    // Store credentials for Basic Auth
    localStorage.setItem('auth-username', username);
    localStorage.setItem('auth-password', password);
    setToken('authenticated');
    return body;
  }

  async function register(data) {
    const res = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg);
    }
  }

  function logout() {
    setToken(null);
    localStorage.removeItem('auth-username');
    localStorage.removeItem('auth-password');
    navigate('/login');
  }

  const value = { token, login, logout, register, isAuth: Boolean(token) };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ✅ EXPORT the useAuth hook - this was missing!
export const useAuth = () => useContext(AuthContext);
