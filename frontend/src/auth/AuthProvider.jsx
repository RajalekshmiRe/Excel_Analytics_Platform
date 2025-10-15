import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("ea_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("ea_token") || null);

  // Save user + token to localStorage whenever they change
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("ea_user", JSON.stringify(user));
      localStorage.setItem("ea_token", token);
    } else {
      localStorage.removeItem("ea_user");
      localStorage.removeItem("ea_token");
    }
  }, [user, token]);

  // LOGIN → Call backend
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // const { token, ...userData } = res.data; // backend sends { _id, name, email, role, token }
      // setUser(userData);
      // setToken(token);
const { user: userData, token } = res.data;
setUser(userData);
setToken(token);
      return userData;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ea_user");
    localStorage.removeItem("ea_token");
  };

  // Context value
  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user,
      role: user?.role,
      login,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
