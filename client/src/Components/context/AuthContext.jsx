import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create a context for authentication
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if there's a token in localStorage and validate it
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/auth/validate-session",
            { withCredentials: true }
          );
          if (response.status === 200) {
            setIsAuthenticated(true);
            setUser(response.data.user);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Session validation error:", error);
          setIsAuthenticated(false);
        }
      }
    };

    checkAuthStatus();
  }, []);

  const login = (token, userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("token", token); // Store the token
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token"); // Remove the token
    localStorage.removeItem("user"); // Remove the user
    axios.post(
      "http://localhost:8000/api/auth/logout",
      {},
      { withCredentials: true }
    );
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
