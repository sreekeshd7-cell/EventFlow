import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // Load logged-in user when app starts
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        setUser(response.data);
      } catch (error) {
        console.error("Failed to load user", error);

        localStorage.removeItem("token");

        setUser(null);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // LOGIN
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", response.data.token);

    setUser(response.data.user);

    return response.data;
  };

  // REGISTER
  const register = async (name, email, password, department) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      department,
    });

    localStorage.setItem("token", response.data.token);

    setUser(response.data.user);

    return response.data;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
