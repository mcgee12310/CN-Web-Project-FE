import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./auth/login/login";
import Signup from "./auth/signup/signup";
import Home from "./user/pages/HomePage/home";
import { useAuth } from "./auth/auth-context";

// Admin imports would go here
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import UserList from "./admin/pages/UserList";
import UserDetail from "./admin/pages/UserDetail";
import BookingList from "./admin/pages/BookingList";
import BookingDetail from "./admin/pages/BookingDetail";

function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />       {/* mặc định /admin */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="bookings" element={<BookingList />} />
          <Route path="bookings/:id" element={<BookingDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
