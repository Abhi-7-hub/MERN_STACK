import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

// ✅ Create the actual context
export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials=true;


  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null); // better than false
  const getAuthsState=async()=>{
    try {
        const {data}=await axios.get(backendUrl+ '/api/auth/is-auth')
        if(data.success){
            setIsLoggedin(true)
            getUserData()
        }
    } catch (error) {
        toast.error(error.message)
        
    }
  }

  const getUserData=async()=>{
    try {
        const {data}=await axios.get(backendUrl+ '/api/user/data')
        data.success?setUserData(data.userData):toast.error(data.message)  
    } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong")

    }
  }

  useEffect(()=>{
    getAuthsState()
  },[])

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
