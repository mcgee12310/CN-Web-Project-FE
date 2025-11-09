import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./auth/login/login";
import Signup from "./auth/signup/signup";
import OTP from "./auth/otp/otp";
import Home from "./user/pages/HomePage/home";
import ExploreRoom from "./user/pages/ExplorePage/exploreRoom";
import RoomDetail from "./user/pages/RoomDetailPage/roomDetail";
import { useAuth } from "./auth/auth-context";

// Admin imports would go here
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import UserList from "./admin/pages/UserList";
import UserDetail from "./admin/pages/UserDetail";

function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<>404 - Page not found</>} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />       {/* mặc định /admin */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/:id" element={<UserDetail />} />
        </Route>
        <Route path="/otp" element={<OTP />} />
        <Route path="/rooms" element={<ExploreRoom />} />
        <Route path="/room/:id" element={<RoomDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
