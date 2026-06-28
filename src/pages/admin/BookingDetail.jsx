import { useEffect, useMemo, useState } from "react"; 
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../Layouts/AdminLayout";
import axiosClient from "../../api/axiosClient";
import { FaArrowLeft, FaCalendarAlt, FaMoneyBillWave, FaUser, FaMapMarkerAlt, FaClock } from "react-icons/fa";

function BookingDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.booking) {
      setBooking(location.state.booking);
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/admin/bookings/${bookingId}`);
        // FIX: API trả về { message: ..., data: {...} } nên cần lấy đúng res.data.data
        setBooking(res.data?.data || null);
      } catch (err) {
        console.error("Error fetching booking detail:", err);
        setError("Không thể tải thông tin booking lúc này.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, location.state]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val || 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateOnly = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const statusLabel = useMemo(() => {
    switch (booking?.status) {
      case "paid":
        return { text: "Đã thanh toán", className: "bg-success-subtle text-success" };
      case "completed":
        return { text: "Hoàn thành", className: "bg-primary-subtle text-primary" };
      case "pending":
        return { text: "Chờ thanh toán", className: "bg-warning-subtle text-warning" };
      case "cancelled":
      case "cancel":
      case "canceled":
        return { text: "Đã hủy", className: "bg-danger-subtle text-danger" };
      case "refunded":
        return { text: "Đã hoàn tiền", className: "bg-secondary-subtle text-secondary" };
      default:
        return { text: booking?.status || "Không rõ", className: "bg-light text-dark" };
    }
  }, [booking?.status]);

  // Lấy thông tin cụm sân lớn từ detail đầu tiên
  const courtInfo = booking?.details?.[0]?.field?.court;

  return (
    <AdminLayout>
      <div className="container-fluid py-4">
        <button className="btn btn-outline-secondary rounded-pill mb-4" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-2" /> Quay lại
        </button>

        {loading ? (
          <div className="card shadow-sm border-0 rounded-4 p-4">Đang tải thông tin booking...</div>
        ) : error ? (
          <div className="card shadow-sm border-0 rounded-4 p-4 text-danger">{error}</div>
        ) : !booking ? (
          <div className="card shadow-sm border-0 rounded-4 p-4">Không tìm thấy booking.</div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
                  <div>
                    <p className="text-muted mb-1">Chi tiết booking</p>
                    <h3 className="fw-bold mb-1">#{booking.id}</h3>
                    <div className={`badge px-3 py-2 rounded-pill fw-bold ${statusLabel.className}`}>
                      {statusLabel.text}
                    </div>
                  </div>
                  {(["cancelled", "cancel", "canceled"].includes(booking?.status) || booking?.cancel_reason) && (
                    <button
                      className="btn btn-danger rounded-pill px-4"
                      onClick={() => navigate(`/admin/payments/${booking.id}/refund`, { state: { booking } })}
                    >
                      Tiến hành refund
                    </button>
                  )}
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="border rounded-3 p-3 h-100">
                      <div className="text-muted small mb-2 d-flex align-items-center gap-2">
                        <FaUser /> Khách hàng
                      </div>
                      <div className="fw-bold">{booking.user?.name || "N/A"}</div>
                      <div className="text-muted small">{booking.user?.email || ""}</div>
                      {booking.user?.phone && <div className="text-muted small">SĐT: {booking.user.phone}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded-3 p-3 h-100">
                      <div className="text-muted small mb-2 d-flex align-items-center gap-2">
                        <FaMapMarkerAlt /> Cụm Sân
                      </div>
                      <div className="fw-bold">{courtInfo?.name || "Không rõ sân"}</div>
                      <div className="text-muted small">Địa chỉ: {courtInfo?.address || "Chưa cập nhật"}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded-3 p-3 h-100">
                      <div className="text-muted small mb-2 d-flex align-items-center gap-2">
                        <FaMoneyBillWave /> Tổng tiền
                      </div>
                      <div className="fw-bold fs-4 text-success">{formatCurrency(booking.total_price)}</div>
                      <div className="text-muted small">Phương thức: <span className="text-uppercase fw-semibold">{booking.payment_method || "Chưa rõ"}</span></div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded-3 p-3 h-100">
                      <div className="text-muted small mb-2 d-flex align-items-center gap-2">
                        <FaCalendarAlt /> Thời gian giao dịch
                      </div>
                      <div className="fw-bold text-dark small">Tạo lúc: {formatDate(booking.created_at)}</div>
                      <div className="text-muted small">Cập nhật: {formatDate(booking.updated_at)}</div>
                    </div>
                  </div>
                </div>

                {/* Danh sách các khung giờ được đặt */}
                <h5 className="fw-bold mb-3 mt-4 d-flex align-items-center gap-2">
                  <FaClock className="text-primary" /> Danh sách sân & khung giờ đặt
                </h5>
                <div className="table-responsive border rounded-3">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Tên sân con</th>
                        <th>Ngày đá</th>
                        <th>Khung giờ</th>
                        <th className="text-end">Giá tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {booking.details?.map((detail) => (
                        <tr key={detail.id}>
                          <td className="fw-semibold text-primary">{detail.field?.name || "N/A"}</td>
                          <td>{formatDateOnly(detail.booking_date)}</td>
                          <td>
                            <span className="badge bg-light text-dark border px-2 py-1.5 font-monospace">
                              {detail.start_time?.substring(0, 5)} - {detail.end_time?.substring(0, 5)}
                            </span>
                          </td>
                          <td className="text-end fw-semibold">{formatCurrency(detail.price)}</td>
                        </tr>
                      ))}
                      {(!booking.details || booking.details.length === 0) && (
                        <tr>
                          <td colSpan="4" className="text-center py-3 text-muted">Không có thông tin chi tiết khung giờ.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm border-0 rounded-4 p-4">
                <h5 className="fw-bold mb-3">Thông tin bổ sung</h5>
                <ul className="list-unstyled mb-0">
                  <li className="mb-3">
                    <div className="text-muted small">Mã hệ thống (ID)</div>
                    <div className="fw-semibold">{booking.id}</div>
                  </li>
                  <li className="mb-3">
                    <div className="text-muted small">User ID</div>
                    <div className="fw-semibold">{booking.user_id}</div>
                  </li>
                  <li className="mb-3">
                    <div className="text-muted small">Chủ sân (Owner ID)</div>
                    <div className="fw-semibold">{courtInfo?.owner_id || "-"}</div>
                  </li>
                  <li className="mb-3">
                    <div className="text-muted small">Số lượng khung giờ</div>
                    <div className="badge bg-primary rounded-pill">{booking.details?.length || 0} slots</div>
                  </li>
                  {booking.cancel_reason && (
                    <li className="mb-3 p-2 bg-danger-subtle rounded text-danger">
                      <div className="small fw-bold">Lý do hủy:</div>
                      <div className="small">{booking.cancel_reason}</div>
                      <div className="text-muted micro-text mt-1">Hủy bởi: {booking.cancelled_by || "Hệ thống"}</div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default BookingDetail;