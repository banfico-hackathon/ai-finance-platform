// AuthContext.jsx — Minimal React Auth Context Provider
import { createContext, useContext, useState } from "react";
import { getAuth, login as apiLogin, clearAuth } from "./auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuthData] = useState(() => getAuth());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiLogin(credentials);
      setAuthData(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || "Authentication failed.");
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    clearAuth();
    setAuthData(null);
    setError(null);
  };

  const value = {
    user: auth?.user || null,
    accessToken: auth?.accessToken || null,
    isAuthenticated: Boolean(auth?.accessToken),
    loading,
    error,
    login,
    logout,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
