import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(()  => {
    const storedToken = localStorage.getItem('token');
    if(storedToken){
      setToken(storedToken);
    }
  }, []);

  async function login(email, password) {
    const response = await api.post('/auth/login', { email, password });

    const { token } = response.data;
    
    setToken(token);
    localStorage.setItem('token', token);
  }

  async function register(username, email, password) {
    await api.post('/auth/register', { username, email, password });

    await login(email, password);
  }

  function logout() {
    setToken(null);

    localStorage.removeItem('token');
  }

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Convenience hook so components can do `const { user, login } = useAuth()`
// instead of importing useContext + AuthContext everywhere.
export function useAuth() {
  return useContext(AuthContext);
}
