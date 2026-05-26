import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css';

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/user/Dashboard";

import DashboardOwner from "./pages/owner/DashboardOwner";
import BookingManager from "./pages/owner/BookingManager";
import VenueDetail from "./pages/owner/VenueDetail/VenueDetail";




import BookingPage from "./pages/user/BookingPage";  
import BookingConfirmPage from "./pages/user/BookingConfirmPage";
import PaymentConfirmPage from "./pages/user/PaymentConfirmPage";
import ProfilePage from "./pages/user/ProfilePage";
import BookingHistory from "./pages/user/BookingHistory";
import RegisterPage from "./pages/user/RegisterPage";

// Admin imports
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminSports from "./pages/admin/Sports";
import AdminVenues from "./pages/admin/Venues";
import AdminPayments from "./pages/admin/Payments";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/owner" element={<DashboardOwner />} />
        <Route path="/owner/bookings" element={<BookingManager />} />
        <Route path="/owner/venues/:id" element={<VenueDetail />} />
        {/* route đặt sân */}
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/booking-confirm" element={<BookingConfirmPage />} />
        <Route path="/payment-confirm" element={<PaymentConfirmPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/booking/history" element={<BookingHistory />} />
        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/sports" element={<AdminSports />} />
        <Route path="/admin/venues" element={<AdminVenues />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;