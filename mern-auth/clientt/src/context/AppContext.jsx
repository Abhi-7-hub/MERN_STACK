import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
  axios.defaults.withCredentials = true;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [authChecked, setAuthChecked] = useState(false); // NEW: Track auth check status

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, { 
        withCredentials: true 
      });
      if (data.success) {
        setUserData(data.user);
        setIsLoggedin(true);
      } else {
        setUserData(null);
        setIsLoggedin(false);
      }
    } catch (error) {
      console.error("Failed to get user data:", error);
      setUserData(null);
      setIsLoggedin(false);
    }
  };

  const getAuthsState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, { 
        withCredentials: true 
      });
      
      if (data.success && data.user) {
        setUserData(data.user);
        setIsLoggedin(true);
      } else {
        setUserData(null);
        setIsLoggedin(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUserData(null);
      setIsLoggedin(false);
    } finally {
      setAuthChecked(true); // Mark auth check as complete
    }
  };

  useEffect(() => {
    getAuthsState();
  }, []);

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData,
        authChecked // NEW: Export authChecked state
      }}
    >
      {children}
    </AppContext.Provider>
  );
};