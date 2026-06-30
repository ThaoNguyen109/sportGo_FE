import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Sports from "../pages/admin/Sports";
import Venues from "../pages/admin/Venues";
import Payments from "../pages/admin/Payments";
import PayoutManagement from "../pages/admin/PayoutManagement";

function AppRoutes() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/admin"
          element={<Dashboard />}
        />

        <Route
          path="/admin/users"
          element={<Users />}
        />

        <Route
          path="/admin/sports"
          element={<Sports />}
        />

        <Route
          path="/admin/venues"
          element={<Venues />}
        />

        <Route
          path="/admin/payments"
          element={<Payments />}
        />
        <Route
          path="/admin/payouts"
          element={<PayoutManagement />}
        />
        <Route
          path="/admin/payouts/pending/:ownerId"
          element={<PayoutDetail />}
        />
        <Route
          path="/admin/payout-history"
          element={<PayoutDetail />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;