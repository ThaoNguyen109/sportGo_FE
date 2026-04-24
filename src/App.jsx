import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css';

import LoginPage from "./pages/user/LoginPage";
import Dashboard from "./pages/user/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* vào / sẽ tự nhảy sang login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;