import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../Layouts/AdminLayout";
import axiosClient from "../../api/axiosClient";

import {
  FaSearch,
  FaSpinner,
  FaUserCircle,
  FaEye,
  FaSyncAlt,
  FaHistory,
} from "react-icons/fa";

function PayoutManagement() {
  const navigate = useNavigate();

  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPendingOwners = async () => {
    try {
      setLoading(true);

      const res = await axiosClient.get(
        "/admin/payouts/pending-owners"
      );

      setOwners(res.data.owners || []);
    } catch (error) {
      console.error("Fetch payout owners error:", error);
      setOwners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOwners();
  }, []);

  const filteredOwners = owners.filter((owner) => {
    const keyword = searchTerm.toLowerCase();

    return (
      owner.owner_name?.toLowerCase().includes(keyword) ||
      owner.email?.toLowerCase().includes(keyword) ||
      owner.phone?.includes(searchTerm)
    );
  });

  const totalRevenue = filteredOwners.reduce(
    (sum, item) => sum + Number(item.gross_amount || 0),
    0
  );

  const totalCommission = filteredOwners.reduce(
    (sum, item) => sum + Number(item.commission_amount || 0),
    0
  );

  const totalReceive = filteredOwners.reduce(
    (sum, item) => sum + Number(item.net_amount || 0),
    0
  );

  const formatMoney = (amount) => {
    return (
      new Intl.NumberFormat("vi-VN").format(
        Number(amount || 0)
      ) + " đ"
    );
  };

  const handleViewBookings = (ownerId) => {
    if (!ownerId) {
      alert("Không thể mở chi tiết payout vì thiếu ownerId.");
      return;
    }

    navigate(`/admin/payouts/pending/${ownerId}`);
  };

  return (
    <AdminLayout>
      <div className="container-fluid py-4">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h2 className="fw-bold mb-1">
              Quản lý Payout
            </h2>

            <p className="text-muted mb-0">
              Quản lý thanh toán doanh thu cho chủ sân
            </p>
          </div>

          <div className="d-flex gap-2">

            <button
              onClick={() =>
                navigate("/admin/payout-history")
              }
              className="btn btn-outline-success d-flex align-items-center gap-2"
            >
              <FaHistory />
              Lịch sử payout
            </button>

            <button
              onClick={fetchPendingOwners}
              className="btn btn-outline-primary d-flex align-items-center gap-2"
            >
              <FaSyncAlt />
              Làm mới
            </button>

          </div>

        </div>

        {/* Statistics */}
        <div className="row g-3 mb-4">

          <div className="col-md-4">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body">
                <small className="text-muted">
                  Tổng doanh thu
                </small>

                <h4 className="fw-bold text-primary mt-2 mb-0">
                  {formatMoney(totalRevenue)}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body">
                <small className="text-muted">
                  Tổng phí hệ thống
                </small>

                <h4 className="fw-bold text-danger mt-2 mb-0">
                  {formatMoney(totalCommission)}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body">
                <small className="text-muted">
                  Tổng tiền cần thanh toán
                </small>

                <h4 className="fw-bold text-success mt-2 mb-0">
                  {formatMoney(totalReceive)}
                </h4>
              </div>
            </div>
          </div>

        </div>

        {/* Search */}
        <div className="card shadow-sm border-0 p-3 mb-4 rounded-4">

          <div className="row g-3 align-items-center">

            <div className="col-md-8">

              <div className="input-group">

                <span className="input-group-text bg-light border-0">
                  <FaSearch />
                </span>

                <input
                  type="text"
                  className="form-control bg-light border-0"
                  placeholder="Tìm theo tên owner, email hoặc số điện thoại..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                />

              </div>

            </div>

            <div className="col-md-4 text-md-end">

              <span className="badge bg-primary px-3 py-2 rounded-pill">
                {filteredOwners.length} Owner chờ payout
              </span>

            </div>

          </div>

        </div>

        {/* Table */}
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">

          {loading ? (
            <div className="text-center py-5">
              <FaSpinner className="fs-2 text-primary mb-3 animate-spin" />

              <p className="text-muted mb-0">
                Đang tải dữ liệu payout...
              </p>
            </div>
          ) : (
            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">

                  <tr>
                    <th className="px-4">
                      Chủ sân
                    </th>

                    <th>Email</th>

                    <th>Số điện thoại</th>

                    <th className="text-center">
                      Booking chờ
                    </th>

                    <th>Doanh thu</th>

                    <th>Phí hệ thống</th>

                    <th>Thực nhận</th>

                    <th className="text-end px-4">
                      Hành động
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {filteredOwners.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-5 text-muted"
                      >
                        Không có owner nào đang chờ payout
                      </td>
                    </tr>
                  ) : (
                    filteredOwners.map((owner) => (
                      <tr key={owner.owner_id}>

                        <td className="px-4">

                          <div className="d-flex align-items-center gap-3">

                            <FaUserCircle className="fs-1 text-secondary" />

                            <div>
                              <h6 className="mb-0 fw-bold">
                                {owner.owner_name}
                              </h6>

                              <small className="text-muted">
                                ID #{owner.owner_id}
                              </small>
                            </div>

                          </div>

                        </td>

                        <td>
                          {owner.email || "-"}
                        </td>

                        <td>
                          {owner.phone || "-"}
                        </td>

                        <td className="text-center">

                          <span className="badge bg-warning text-dark px-3 py-2">
                            {owner.pending_bookings} booking
                          </span>

                        </td>

                        <td>
                          {formatMoney(owner.gross_amount)}
                        </td>

                        <td className="text-danger fw-semibold">
                          {formatMoney(owner.commission_amount)}
                        </td>

                        <td className="text-success fw-bold">
                          {formatMoney(owner.net_amount)}
                        </td>

                        <td className="text-end px-4">

                          <button
                            onClick={() =>
                              handleViewBookings(
                                owner.owner_id
                              )
                            }
                            className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2"
                          >
                            <FaEye />
                            Xem chi tiết
                          </button>

                        </td>

                      </tr>
                    ))
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </AdminLayout>
  );
}

export default PayoutManagement;