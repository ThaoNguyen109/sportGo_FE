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


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/owner" element={<DashboardOwner />} />

        <Route path="/owner/bookings" element={<BookingManager />} />
        <Route path="/owner/venues/:id" element={<VenueDetail />} />



        {/* route đặt sân */}
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/booking-confirm" element={<BookingConfirmPage />} />
        <Route path="/payment-confirm" element={<PaymentConfirmPage />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;