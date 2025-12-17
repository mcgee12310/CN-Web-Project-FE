import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
    setLoading(false);
  }, []);

  const login = (payload) => {
    setUser(payload);
    localStorage.setItem("user", JSON.stringify(payload));
    navigate("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
