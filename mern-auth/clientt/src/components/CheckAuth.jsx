import { useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const CheckAuth = () => {
  const { setUserData } = useContext(AppContext);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

        const { data } = await axios.get(
          `${BASE_URL}/api/auth/is-auth`, // ✅ fixed endpoint
          { withCredentials: true }
        );

        console.log('✅ Auth Response:', data);

        if (data.success && data.user) {
          setUserData(data.user); // ✅ fixed
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error('❌ Auth Check Error:', error.message || error);
        setUserData(null);
      }
    };

    checkAuth();
  }, [setUserData]);

  return null;
};

export default CheckAuth;
