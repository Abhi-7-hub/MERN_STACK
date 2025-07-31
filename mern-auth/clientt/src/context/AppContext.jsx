import { createContext, useState } from "react";

// ✅ Create the actual context
export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // better than false

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedIn,
    userData,
    setUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
