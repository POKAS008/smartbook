import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('smartbook_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const login = (userData, token) => {
    localStorage.setItem('smartbook_token', token);
    localStorage.setItem('smartbook_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('smartbook_token');
    localStorage.removeItem('smartbook_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);