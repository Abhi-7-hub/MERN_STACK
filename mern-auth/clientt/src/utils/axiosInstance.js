// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://mern-stack-i5g2.onrender.com', // backend base URL
  withCredentials: true, // ✅ important for cookies
});

export default axiosInstance;
