import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./auth/login/login";
import Signup from "./auth/signup/signup";
import OTP from "./auth/otp/otp";
import ResendOtp from "./auth/otp/resendOtp";
import Home from "./user/pages/HomePage/home";
import ExploreRoom from "./user/pages/ExplorePage/exploreRoom";
import RoomDetail from "./user/pages/RoomDetailPage/roomDetail";
import BookingPage from "./user/pages/BookingPage/booking";
import { useAuth } from "./auth/auth-context";

// Admin imports would go here
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

// User imports would go here
import UserProfile from "./user/pages/UserProfile/UserProfile";
import AccountSettings from "./user/component/accountSetting/AccountSettings";
import UserBookings from "./user/component/bookingList/BookingList";
import MyReviews from "./user/component/myReviews/MyReviews";
import ChangePassword from "./user/component/changePassword/ChangePassword";

function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="*" element={<>404 - Page not found</>} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/resend-otp" element={<ResendOtp />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} /> {/* mặc định /admin */}
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
      </Route>

      {/* User Routes */}
      <Route path="/profile" element={<UserProfile />}>
        <Route index element={<AccountSettings />} />
        <Route path="setting" element={<AccountSettings />} />
        <Route path="bookings" element={<UserBookings />} />
        <Route path="reviews" element={<MyReviews />} />
        <Route path="password" element={<ChangePassword />} />
      </Route>

      <Route path="/otp" element={<OTP />} />
      <Route path="/rooms" element={<ExploreRoom />} />
      <Route path="/room/:id" element={<RoomDetail />} />
      <Route path="/booking" element={<BookingPage />} />
    </Routes>
  );
}

export default App;
