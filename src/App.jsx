import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css';

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/user/Dashboard";
import OwnerRevenue from "./pages/owner/OwnerRevenue";
import OwnerPayment from "./pages/owner/OwnerPayment";

import DashboardOwner from "./pages/owner/DashboardOwner";
import BookingManager from "./pages/owner/BookingManager";
import VenueDetail from "./pages/owner/VenueDetail/VenueDetail";
import BookingDetail from "./pages/owner/BookingDetail";

import BookingPage from "./pages/user/BookingPage";  
import BookingConfirmPage from "./pages/user/BookingConfirmPage";
import PaymentConfirmPage from "./pages/user/PaymentConfirmPage";
import ProfilePage from "./pages/user/ProfilePage";
import BookingHistory from "./pages/user/BookingHistory";
import BookingRefundPage from "./pages/user/BookingRefundPage";
import RegisterPage from "./pages/user/RegisterPage";

// Admin imports
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminVenues from "./pages/admin/Venues";
import AdminPayments from "./pages/admin/Payments";
import AdminBookingDetail from "./pages/admin/BookingDetail";
import RefundPage from "./pages/admin/RefundPage";
import PayoutManagement from "./pages/admin/PayoutManagement";
import PayoutDetail from "./pages/admin/PayoutDetail";
import PayoutHistory from "./pages/admin/PayoutHistory";

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

        <Route path="/owner/booking-detail"  element={<BookingDetail />}/>
        <Route path="/owner/revenue" element={<OwnerRevenue />} />
        <Route path="/owner/payment" element={<OwnerPayment />} />

        {/* route đặt sân */}
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/booking-confirm" element={<BookingConfirmPage />} />
        <Route path="/payment-confirm" element={<PaymentConfirmPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/booking/history" element={<BookingHistory />} />
        <Route path="/booking/refund" element={<BookingRefundPage />} />


        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/venues" element={<AdminVenues />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/payments/:bookingId" element={<AdminBookingDetail />} />
        <Route path="/admin/payments/:bookingId/refund" element={<RefundPage />} />
        <Route path="/admin/payouts" element={<PayoutManagement />} />
        <Route path="/admin/payouts/pending/:ownerId" element={<PayoutDetail />} />
        <Route path="/admin/payouts/confirm/:payoutId" element={<PayoutDetail />} />
        <Route path="/admin/payout-history" element={<PayoutHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;