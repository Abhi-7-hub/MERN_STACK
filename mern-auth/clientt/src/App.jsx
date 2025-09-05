import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import GeminiHome from "./pages/GeminiHome";
import Feed from "./pages/Feed";
import UserProfile from "./pages/UserProfile";
import AdminPosts from "./pages/AdminPosts";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckAuth from "./components/CheckAuth";
import { AppContext } from "./context/AppContext";

// Protected Route Component for authenticated users
const ProtectedRoute = ({ children }) => {
  const { isLoggedin, authChecked } = useContext(AppContext);
  
  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return isLoggedin ? children : <Navigate to="/" replace />;
};

// Admin Protected Route Component
const AdminProtectedRoute = ({ children }) => {
  const { isLoggedin, userData, authChecked } = useContext(AppContext);
  
  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isLoggedin) {
    return <Navigate to="/admin-login" replace />;
  }
  
  return userData && userData.role === "admin" ? children : <Navigate to="/" replace />;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isLoggedin, authChecked } = useContext(AppContext);
  
  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return !isLoggedin ? children : <Navigate to="/feed" replace />;
};

const App = () => {
  const location = useLocation();
  const { userData, authChecked } = useContext(AppContext);

  // Pages where Navbar should not be shown
  const noNavbarRoutes = ["/login", "/admin-login", "/email-verify", "/reset-password"];

  // Show loading while auth is being checked
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="font-outfit">
      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* Global Auth Checker */}
      <CheckAuth />

      {/* Show Navbar only on routes that need it */}
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}

      {/* Page Content */}
      <div className={!noNavbarRoutes.includes(location.pathname) ? "pt-20" : ""}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route path="/email-verify" element={<EmailVerify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route 
            path="/admin-login" 
            element={
              <PublicRoute>
                <AdminLogin />
              </PublicRoute>
            } 
          />

          {/* Protected user routes */}
          <Route 
            path="/feed" 
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/:id" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/gemini-search" 
            element={
              <ProtectedRoute>
                <GeminiHome />
              </ProtectedRoute>
            } 
          />

          {/* Admin protected routes */}
          <Route 
            path="/admin/posts" 
            element={
              <AdminProtectedRoute>
                <AdminPosts />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;