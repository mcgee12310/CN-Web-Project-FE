import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Login from "./auth/login/login";
import Signup from "./auth/signup/signup";
import OTP from "./auth/otp/otp";
import ResendOtp from "./auth/otp/resendOtp";
import Loading from "./user/component/loading/Loading";
import { useAuth } from "./auth/auth-context";

const Home = lazy(() => import("./user/pages/HomePage/home"));
const ExploreRoom = lazy(() => import("./user/pages/ExplorePage/exploreRoom"));
const RoomDetail = lazy(() => import("./user/pages/RoomDetailPage/roomDetail"));
const BookingPage = lazy(() => import("./user/pages/BookingPage/booking"));
const Booking1Page = lazy(() => import("./user/pages/BookingPage/booking1"));
const VNPayCallback = lazy(() =>
  import("./user/pages/CallbackPage/callbackPage")
);

import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/DashboardPage/Dashboard";
import UserList from "./admin/pages/UserListPage/UserList";
import UserDetail from "./admin/pages/UserDetailPage/UserDetail";
import BookingList from "./admin/pages/BookingListPage/BookingList";
import BookingDetail from "./admin/pages/BookingDetailPage/BookingDetail";
import RoomTypes from "./admin/pages/RoomTypesPage/roomTypes";
import RoomTypeDetail from "./admin/pages/RoomTypesDetailPage/roomTypeDetail";
import RoomList from "./admin/pages/RoomListPage/RoomList";
import AdminRoomDetail from "./admin/pages/RoomDetailPage/RoomDetailPage";
import Reviews from "./admin/pages/ReviewsPage/Reviews";
import TierManagement from "./admin/pages/TierManagementPage/TierManagement";
import AdminChats from "./admin/pages/ChatPage/AdminChatPage";

// User imports would go here
import UserProfile from "./user/pages/UserProfile/UserProfile";
import AccountSettings from "./user/component/accountSetting/AccountSettings";
import UserBookings from "./user/component/bookingList/BookingList";
import MyReviews from "./user/component/myReviews/MyReviews";
import ChangePassword from "./user/component/changePassword/ChangePassword";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for auth to load before redirecting
  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
};

export const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Wait for auth to load before redirecting
  if (loading) return null;

  if (user) return <Navigate to="/" replace />;
  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for auth to load before redirecting
  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const { user } = useAuth();
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<ExploreRoom />} />
        <Route path="/room/:id" element={<RoomDetail />} />

        {/* Guest-only */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />
        <Route
          path="/otp"
          element={
            <GuestRoute>
              <OTP />
            </GuestRoute>
          }
        />

        {/* Protected user routes */}
        <Route
          path="/booking/payment"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/payment/:id"
          element={
            <ProtectedRoute>
              <Booking1Page />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/vnpay/callback"
          element={<VNPayCallback />}
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        >
          <Route index element={<AccountSettings />} />
          <Route path="setting" element={<AccountSettings />} />
          <Route path="bookings" element={<UserBookings />} />
          <Route path="reviews" element={<MyReviews />} />
          <Route path="password" element={<ChangePassword />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="bookings" element={<BookingList />} />
          <Route path="bookings/:id" element={<BookingDetail />} />
          <Route path="room-types" element={<RoomTypes />} />
          <Route path="room-types/:id" element={<RoomTypeDetail />} />
          <Route path="rooms" element={<RoomList />} />
          <Route path="rooms/:id" element={<AdminRoomDetail />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="tiers" element={<TierManagement />} />
          <Route path="chats" element={<AdminChats />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<>404 - Page not found</>} />
      </Routes>
    </Suspense>
  );
}

export default App;
