import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./auth/login/login";
import Signup from "./auth/signup/signup";
import Home from "./user/pages/HomePage/home";
import { useAuth } from "./auth/auth-context";

function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
