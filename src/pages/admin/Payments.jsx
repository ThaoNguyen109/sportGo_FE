import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../Layouts/AdminLayout";
import axiosClient from "../../api/axiosClient";
// Thay thế FaRefresh bằng FaSyncAlt ở dòng dưới đây
import { FaSearch, FaSpinner, FaCalendarAlt, FaUser, FaFutbol, FaIdCard, FaSyncAlt } from "react-icons/fa";


function Payments() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });


  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter) params.append("status", statusFilter);
      if (paymentFilter) params.append("payment_method", paymentFilter);
      if (dateFilter) params.append("date", dateFilter);
      if (page) params.append("page", page);


      const res = await axiosClient.get(`/admin/bookings?${params.toString()}`);
      const bookingData = res.data.data || {};
      const bookingList = bookingData.data || [];
      setBookings(bookingList);
      setPagination({
        current_page: bookingData.current_page || 1,
        last_page: bookingData.last_page || 1,
        total: bookingData.total || bookingList.length,
      });
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
      setPagination({ current_page: 1, last_page: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, paymentFilter, dateFilter, page]);


  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(searchTerm.trim());
  };


  const formatCurrency = (val) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };


  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };


  const handleCardClick = (booking) => {
    navigate(`/admin/payments/${booking.id}`, { state: { booking } });
  };


  return (
    <AdminLayout>
      <style>{`
        .hover-shadow-effect {
          transition: all 0.25s ease-in-out;
          cursor: pointer;
          border: 1px solid transparent !important;
        }
        .hover-shadow-effect:hover {
          transform: translateY(-3px);
          box-shadow: 0 .5rem 1.5rem rgba(0,0,0,.08) !important;
          border-color: #dee2e6 !important;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-custom {
          animation: spin 1s linear infinite;
        }
      `}</style>


      <div className="container-fluid py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-md-center mb-4 flex-column flex-md-row gap-3">
          <div>
            <h2 className="fw-bold text-gray-800 mb-1">Quản lý Đặt Sân & Giao Dịch</h2>
            <p className="text-muted mb-0">Hệ thống tổng hợp danh sách kết hợp bộ lọc trạng thái thông minh.</p>
          </div>
          {/* Đã cập nhật icon ở đây từ FaRefresh -> FaSyncAlt */}
          <button onClick={fetchBookings} className="btn btn-outline-primary rounded-pill px-4 d-flex align-items-center gap-2 align-self-start align-self-md-auto">
            <FaSyncAlt size={14} /> Làm mới
          </button>
        </div>


        {/* Filters */}
        <div className="card shadow-sm border-0 p-4 mb-4 bg-white rounded-4">
          <form onSubmit={handleSearchSubmit} className="row g-3 align-items-end">
            <div className="col-lg-4 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Tìm kiếm khách hoặc mã</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0 py-2"
                  placeholder="Tên khách hàng, mã đặt sân..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>


            <div className="col-lg-2 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Trạng thái đơn</label>
              <select
                className="form-select bg-light border-0 py-2"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="paid">Đã thanh toán</option>
                <option value="cancelled">Đã hủy</option>
                <option value="refunded">Đã hoàn tiền</option>
                <option value="pending">Chờ thanh toán</option>
                <option value="completed">Hoàn thành</option>
              </select>
            </div>


            <div className="col-lg-2 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Thanh toán</label>
              <select
                className="form-select bg-light border-0 py-2"
                value={paymentFilter}
                onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}
              >
                <option value="">Tất cả phương thức</option>
                <option value="cash">Tiền mặt</option>
                <option value="momo">Momo</option>
                <option value="vnpay">VNPAY</option>
                <option value="bank_transfer">Chuyển khoản</option>
              </select>
            </div>


            <div className="col-lg-2 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Ngày đặt</label>
              <input
                type="date"
                className="form-control bg-light border-0 py-2"
                value={dateFilter}
                onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
              />
            </div>


            <div className="col-lg-2 col-12 text-md-end">
              <button type="submit" className="btn btn-primary w-100 py-2 rounded-3 fw-medium">
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>


        {/* Counter Badge */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-secondary small fw-medium">Hiển thị kết quả tra cứu:</span>
          <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold">
            Tổng số: {pagination.total} đơn đặt
          </span>
        </div>


        {/* Transactions List */}
        {loading ? (
          <div className="d-flex flex-column justify-content-center align-items-center py-5 bg-white rounded-4 shadow-sm">
            <FaSpinner className="animate-spin-custom text-primary fs-2 mb-3" />
            <p className="text-muted mb-0">Đang đồng bộ danh sách đơn...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="card shadow-sm border-0 bg-white rounded-4 p-5 text-center text-muted">
            Không tìm thấy dữ liệu giao dịch nào trùng khớp.
          </div>
        ) : (
          <div>
            <div className="row g-3">
              {bookings.map((booking) => {
                const courtDetail = booking.details?.[0]?.field?.court;
                const fieldName = booking.details?.[0]?.field?.name;
                const ownerId = courtDetail?.owner_id;
               
                return (
                  <div key={booking.id} className="col-12">
                    <div
                      className="card shadow-sm border-0 bg-white rounded-4 p-4 hover-shadow-effect"
                      onClick={() => handleCardClick(booking)}
                      title="Bấm vào đây để xem chi tiết thông tin booking này"
                    >
                      <div className="row g-3 align-items-center">
                       
                        <div className="col-md-3">
                          <span className="text-secondary small d-block mb-1">MÃ ĐƠN HÀNG</span>
                          <h5 className="fw-bold text-primary mb-1">#{booking.booking_code || booking.id}</h5>
                          <span className="text-muted small d-flex align-items-center gap-1">
                            <FaCalendarAlt size={12} /> {formatDate(booking.created_at)}
                          </span>
                        </div>


                        <div className="col-md-2">
                          <span className="text-secondary small d-block mb-1"><FaUser className="me-1" size={11}/> KHÁCH HÀNG</span>
                          <div className="fw-bold text-dark text-truncate">{booking.user?.name || "N/A"}</div>
                          <span className="text-muted small text-truncate d-block">{booking.user?.email || ""}</span>
                        </div>


                        <div className="col-md-2">
                          <span className="text-secondary small d-block mb-1"><FaFutbol className="me-1" size={11}/> SÂN</span>
                          <div className="fw-semibold text-dark text-truncate">{courtDetail?.name || "Không rõ sân"}</div>
                          <span className="text-muted small">{fieldName || "Sân con"}</span>
                        </div>


                        <div className="col-md-1">
                          <span className="text-secondary small d-block mb-1"><FaIdCard className="me-1" size={11}/> OWNER ID</span>
                          <div className="fw-semibold text-dark">#{ownerId || "-"}</div>
                        </div>


                        <div className="col-6 col-md-2 text-md-start">
                          <span className="text-secondary small d-block mb-1">TỔNG TIỀN</span>
                          <h5 className="fw-bold text-success mb-0">{formatCurrency(booking.total_price)}</h5>
                          <span className="text-muted text-uppercase" style={{ fontSize: '11px' }}>{booking.payment_method || "Tiền mặt"}</span>
                        </div>


                        <div className="col-md-2 text-md-end d-flex flex-row flex-md-column justify-content-between align-items-center align-items-md-end gap-2">
                          <div>
                            {booking.status === "paid" && (
                              <span className="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-bold">Thành công</span>
                            )}
                            {booking.status === "completed" && (
                              <span className="badge bg-primary-subtle text-primary px-3 py-1.5 rounded-pill fw-bold">Hoàn thành</span>
                            )}
                            {booking.status === "pending" && (
                              <span className="badge bg-warning-subtle text-warning px-3 py-1.5 rounded-pill fw-bold">Chờ T/T</span>
                            )}
                            {booking.status === "cancelled" && (
                              <span className="badge bg-danger-subtle text-danger px-3 py-1.5 rounded-pill fw-bold">Đã hủy</span>
                            )}
                            {booking.status === "refunded" && (
                              <span className="badge bg-secondary-subtle text-secondary px-3 py-1.5 rounded-pill fw-bold">Đã hoàn tiền</span>
                            )}
                          </div>


                          {(["cancelled", "cancel", "canceled"].includes(booking?.status) || booking?.cancel_reason) && (
                            <button
                              type="button"
                              className="btn btn-sm btn-danger rounded-pill px-3 mt-md-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/payments/${booking.id}/refund`, { state: { booking } });
                              }}
                            >
                              Hoàn tiền
                            </button>
                          )}


                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>


            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-4 bg-white p-3 rounded-4 shadow-sm">
              <div className="text-muted small">
                Trang <strong>{pagination.current_page}</strong> trên tổng <strong>{pagination.last_page}</strong> danh mục
              </div>
              <div className="btn-group shadow-sm rounded-pill overflow-hidden">
                <button
                  type="button"
                  className="btn btn-light btn-sm px-3 py-2 fw-medium border-end"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                >
                  Trước
                </button>
                <button
                  type="button"
                  className="btn btn-light btn-sm px-3 py-2 fw-medium"
                  onClick={() => setPage((prev) => Math.min(pagination.last_page, prev + 1))}
                  disabled={page >= pagination.last_page}
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


export default Payments;

