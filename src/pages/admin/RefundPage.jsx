import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../Layouts/AdminLayout";
import axiosClient from "../../api/axiosClient";
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaUniversity, FaUser, FaCalendarAlt } from "react-icons/fa";

function RefundPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [refundData, setRefundData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 1. Lấy thông tin chi tiết hoàn tiền từ API refund-detail khi vào trang
  useEffect(() => {
    const fetchRefundDetail = async () => {
      try {
        setPageLoading(true);
        setError("");
        const res = await axiosClient.get(`/admin/bookings/${bookingId}/refund-detail`);
        if (res.data && res.data.data) {
          setRefundData(res.data.data);
        } else {
          setError("Không tìm thấy thông tin hoàn tiền.");
        }
      } catch (err) {
        console.error("Fetch refund detail error:", err);
        
        // --- CẢI TIẾN TẠI ĐÂY: Kiểm tra linh hoạt cả object error lẫn chuỗi lỗi từ Interceptor ---
        const errorMsg = err?.response?.data?.message || err?.message || String(err);
        const statusCode = err?.response?.status;

        if (
          statusCode === 404 || 
          errorMsg.includes("404") || 
          errorMsg.toLowerCase().includes("not found") ||
          errorMsg.includes("Lỗi server") // Đánh chặn nếu Interceptor đổi thành chữ này
        ) {
          setError("Khách hàng chưa nhập thông tin hoàn tiền.");
        } else {
          setError(errorMsg || "Đã có lỗi xảy ra khi tải thông tin.");
        }
        // ----------------------------------------------------------------------------------

      } finally {
        setPageLoading(false);
      }
    };

    if (bookingId) {
      fetchRefundDetail();
    }
  }, [bookingId]);

  // 2. Hàm xử lý xác nhận hoàn tiền
  const handleRefund = async () => {
    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const res = await axiosClient.post(`/admin/bookings/${bookingId}/refund`);

      if (res.data) {
        setMessage(res.data?.message || "Xác nhận hoàn tiền thành công!");
        setRefundData((prev) => ({
          ...prev,
          status: "success",
          booking: { ...prev.booking, status: "refunded" }
        }));
      }
    } catch (err) {
      console.error("Refund submit error:", err);
      setError(err?.response?.data?.message || err?.message || "Đã có lỗi khi thực hiện xử lý hoàn tiền.");
    } finally {
      setActionLoading(false);
    }
  };

  // Hàm helper format tiền tệ Việt Nam
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);
  };

  // Hàm helper format thời gian ISO sang ngày đọc được
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  if (pageLoading) {
    return (
      <AdminLayout>
        <div className="container-fluid py-4 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2 text-muted">Đang tải thông tin hoàn tiền...</p>
        </div>
      </AdminLayout>
    );
  }

  const booking = refundData?.booking;
  const user = refundData?.user;

  return (
    <AdminLayout>
      <div className="container-fluid py-4">
        <button className="btn btn-outline-secondary rounded-pill mb-4" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-2" /> Quay lại
        </button>

        {error && <div className="alert alert-danger mb-4 shadow-sm">{error}</div>}
        {message && (
          <div className="alert alert-success d-flex align-items-center gap-2 mb-4 shadow-sm">
            <FaCheckCircle className="flex-shrink-0" /> {message}
          </div>
        )}

        {refundData && (
          <div className="row g-4">
            {/* Cột trái: Thông tin hoàn tiền & Xác nhận */}
            <div className="col-12 col-lg-7">
              <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
                <div className="d-flex align-items-center gap-2 mb-3 text-danger">
                  <FaExclamationTriangle size={20} />
                  <h3 className="fw-bold mb-0">Xác nhận hoàn tiền</h3>
                </div>

                <p className="text-muted mb-4">
                  Bạn đang xử lý yêu cầu hoàn tiền cho booking <strong>#{bookingId}</strong>.
                </p>

                {/* Khối thông tin ngân hàng của khách */}
                <div className="border rounded-3 p-3 bg-light mb-4">
                  <div className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary">
                    <FaUniversity /> Thông tin nhận tiền từ khách hàng
                  </div>
                  <div className="row g-2 text-secondary">
                    <div className="col-sm-4 text-dark fw-medium">Ngân hàng:</div>
                    <div className="col-sm-8">{refundData.bank_name || "N/A"}</div>
                    
                    <div className="col-sm-4 text-dark fw-medium">Số tài khoản:</div>
                    <div className="col-sm-8 fw-bold text-dark">{refundData.bank_account_number || "N/A"}</div>
                    
                    <div className="col-sm-4 text-dark fw-medium">Tên chủ tài khoản:</div>
                    <div className="col-sm-8 text-uppercase">{refundData.bank_account_name || "N/A"}</div>
                    
                    <div className="col-sm-4 text-dark fw-medium">Số tiền yêu cầu:</div>
                    <div className="col-sm-8 text-danger fw-bold fs-5">{formatCurrency(refundData.refund_amount)}</div>

                    <div className="col-sm-4 text-dark fw-medium">Lý do huỷ:</div>
                    <div className="col-sm-8 italic">"{refundData.reason || "Không có lý do"}"</div>
                    
                    <div className="col-sm-4 text-dark fw-medium">Trạng thái yêu cầu:</div>
                    <div className="col-sm-8">
                      <span className={`badge ${refundData.status === "pending" ? "bg-warning text-dark" : "bg-success"}`}>
                        {refundData.status === "pending" ? "Đang chờ xử lý" : "Đã xử lý"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Button hành động */}
                {booking?.status === "refunded" ? (
                  <div className="alert alert-secondary text-center fw-medium border-0 mb-0">
                    Booking này đã được cập nhật trạng thái thành <span className="text-success fw-bold">REFUNDED</span>.
                  </div>
                ) : (
                  <button 
                    className="btn btn-danger rounded-pill px-5 py-2 fw-semibold" 
                    onClick={handleRefund} 
                    disabled={actionLoading || refundData.status !== "pending"}
                  >
                    {actionLoading ? "Đang xử lý hoàn tiền..." : "Xác nhận đã hoàn tiền"}
                  </button>
                )}
              </div>
            </div>

            {/* Cột phải: Thông tin khách hàng & Chi tiết sân đã đặt */}
            <div className="col-12 col-lg-5">
              {/* Thông tin khách hàng */}
              <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
                <div className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark border-bottom pb-2">
                  <FaUser /> Thông tin khách hàng
                </div>
                {user ? (
                  <div className="text-muted">
                    <div className="mb-1"><strong>Họ tên:</strong> {user.name}</div>
                    <div className="mb-1"><strong>Email:</strong> {user.email}</div>
                    <div><strong>Số điện thoại:</strong> {user.phone || "N/A"}</div>
                  </div>
                ) : (
                  <p className="text-muted mb-0">Không có dữ liệu người dùng.</p>
                )}
              </div>

              {/* Chi tiết lịch đặt sân */}
              <div className="card shadow-sm border-0 rounded-4 p-4">
                <div className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark border-bottom pb-2">
                  <FaCalendarAlt /> Chi tiết đặt sân
                </div>
                
                {booking && booking.details && booking.details.length > 0 ? (
                  booking.details.map((detail, index) => (
                    <div key={detail.id} className={`${index > 0 ? "border-top pt-3 mt-3" : ""}`}>
                      <h6 className="fw-bold text-primary mb-1">
                        {detail.field?.court?.name || "Cơ sở sân"} - {detail.field?.name || "Sân"}
                      </h6>
                      <small className="text-muted d-block mb-1">
                        Địa chỉ: {detail.field?.court?.address || "N/A"}
                      </small>
                      <div className="text-secondary small">
                        <div><strong>Ngày đá:</strong> {formatDate(detail.booking_date)}</div>
                        <div><strong>Khung giờ:</strong> {detail.start_time?.substring(0, 5)} - {detail.end_time?.substring(0, 5)}</div>
                        <div><strong>Giá tiền sân:</strong> {formatCurrency(detail.price)}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted mb-0">Không có chi tiết lịch đặt.</p>
                )}

                <div className="border-top mt-3 pt-3 text-end">
                  <span className="text-muted small">Tổng cộng:</span>
                  <div className="fw-bold fs-5 text-dark">{formatCurrency(booking?.total_price)}</div>
                  <small className="text-muted">Phương thức thanh toán: <span className="text-uppercase fw-medium">{booking?.payment_method}</span></small>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default RefundPage;