import {
  FaChartPie,
  FaUsers,
  FaFutbol,
  FaMapMarkerAlt,
  FaMoneyBillWave
} from "react-icons/fa";

import { Link } from "react-router-dom";

function AdminSidebar() {

  return (
    <div className="admin-sidebar">

      <h2 className="logo-text">

        <span className="logo-blue">
          Sport
        </span>

        <span className="logo-green">
          Booking
        </span>

      </h2>

      <div className="sidebar-menu">

        <Link
          to="/"
          className="sidebar-link"
        >
          <FaChartPie />
          Bảng điều khiển
        </Link>

        <Link
          to="/admin/users"
          className="sidebar-link"
        >
          <FaUsers />
          Quản lý người dùng
        </Link>

        <Link
          to="/admin/sports"
          className="sidebar-link"
        >
          <FaFutbol />
          Quản lý loại thể thao
        </Link>

        <Link
          to="/admin/venues"
          className="sidebar-link"
        >
          <FaMapMarkerAlt />
          Quản lý địa điểm
        </Link>

        <Link
          to="/admin/payments"
          className="sidebar-link"
        >
          <FaMoneyBillWave />
          Quản lý thanh toán
        </Link>

      </div>

    </div>
  );
}

export default AdminSidebar;