import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "./PaymentConfirmPage.css";
import axiosClient from "../../api/axiosClient";

const PaymentConfirmPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const booking = location.state || {};

    const [seconds, setSeconds] = useState(booking.timeLeft || 600);
    const [isCanceling, setIsCanceling] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("pending"); // "pending", "success", "failed"

    // Khóa nút back của trình duyệt
    useEffect(() => {
        const pushState = () => window.history.pushState(null, "", window.location.href);
        pushState();

        const handlePopState = () => {
            if (!isCanceling && paymentStatus !== "success") {
                pushState();
                alert("Vui lòng bấm 'Hủy đặt sân' để hệ thống hủy lịch đang giữ và quay về trang chủ.");
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [isCanceling, paymentStatus]);

    // Đếm ngược thời gian giữ chỗ
    useEffect(() => {
        if (paymentStatus === "success") return;
        const timer = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [paymentStatus]);

    // Polling kiểm tra trạng thái thanh toán từ Backend
    useEffect(() => {
        if (!booking.bookingId || paymentStatus === "success" || paymentStatus === "failed") return;

        const pollTimer = setInterval(async () => {
            try {
                const res = await axiosClient.get(`/bookings/${booking.bookingId}`);
                if (res.data?.success) {
                    const status = res.data.data.status; // 'paid', 'pending', 'cancelled', 'failed'
                    if (status === "paid") {
                        setPaymentStatus("success");
                        clearInterval(pollTimer);
                        
                        // Tự động chuyển hướng về trang chủ sau 5 giây
                        setTimeout(() => {
                            navigate("/dashboard");
                        }, 5000);
                    } else if (status === "cancelled" || status === "failed") {
                        setPaymentStatus("failed");
                        clearInterval(pollTimer);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
            }
        }, 3000); // Polling mỗi 3 giây

        return () => clearInterval(pollTimer);
    }, [booking.bookingId, paymentStatus, navigate]);

    const formatTime = (totalSeconds) => {
        const min = Math.floor(totalSeconds / 60);
        const sec = totalSeconds % 60;
        return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };

    const handleCancelBooking = async () => {
        setIsCanceling(true);
        if (booking.bookingId) {
            try {
                await axiosClient.delete(`/bookings/${booking.bookingId}`);
                console.log(`Đã gọi API DELETE /bookings/${booking.bookingId} thành công.`);
            } catch (error) {
                console.error("Lỗi khi hủy giữ sân:", error);
            }
        } else {
            console.warn("Không tìm thấy booking.bookingId trong state! API hủy sẽ không được gọi.");
        }

        navigate("/dashboard");
    };

    return (
        <MainLayout>
            <div className="payment-page">
                <div className="payment-header">
                    <button
                        onClick={() => {
                            if (paymentStatus === "success") {
                                navigate("/dashboard");
                            } else {
                                alert("Vui lòng bấm 'Hủy đặt sân' để hệ thống hủy lịch đang giữ và quay về trang chủ.");
                            }
                        }}
                        className="btn-back"
                    >
                        ←
                    </button>

                    <h2>Xác nhận thanh toán</h2>
                </div>

                <div className="payment-content">
                    <div className="payment-left">
                        <div className="payment-card">
                            <div className="payment-title">Thông tin thanh toán</div>

                            <div className="qr-box" style={{ minHeight: "250px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                                {paymentStatus === "success" ? (
                                    <div className="success-checkmark" style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: "72px", color: "#4caf50", marginBottom: "10px" }}>✓</div>
                                        <h3 style={{ color: "#2f7d32", margin: "0 0 10px 0" }}>Thanh toán thành công!</h3>
                                        <p style={{ color: "#666", fontSize: "14px", margin: 0, lineHeight: 1.5 }}>
                                            Hệ thống đã ghi nhận thanh toán thành công.<br />
                                            Đang chuyển hướng về trang chủ...
                                        </p>
                                    </div>
                                ) : paymentStatus === "failed" ? (
                                    <div className="failed-cross" style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: "72px", color: "#b91c1c", marginBottom: "10px" }}>✗</div>
                                        <h3 style={{ color: "#b91c1c", margin: "0 0 10px 0" }}>Giao dịch thất bại / Đã huỷ</h3>
                                        <p style={{ color: "#666", fontSize: "14px", margin: 0, lineHeight: 1.5 }}>
                                            Đơn đặt sân này đã bị huỷ hoặc thanh toán thất bại.
                                        </p>
                                    </div>
                                ) : booking.qrUrl ? (
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(booking.qrUrl)}`}
                                        alt="MoMo QR Code"
                                        style={{ width: "250px", height: "250px", objectFit: "contain" }}
                                    />
                                ) : (
                                    <div className="fake-qr">QR</div>
                                )}
                            </div>

                            {paymentStatus === "success" ? (
                                <p className="qr-note" style={{ background: "#e8f5e9", borderLeft: "5px solid #4caf50", color: "#2f7d32" }}>
                                    Cảm ơn bạn đã lựa chọn SportGo! Giao dịch của bạn đã được ghi nhận.
                                </p>
                            ) : paymentStatus === "failed" ? (
                                <p className="qr-note" style={{ background: "#ffebee", borderLeft: "5px solid #ef5350", color: "#c62828" }}>
                                    Đơn đặt đã bị huỷ. Vui lòng quay về trang chủ để đặt lại.
                                </p>
                            ) : (
                                <p className="qr-note">
                                    Bạn vui lòng thanh toán qua QR MoMo để hoàn tất lịch đặt.
                                </p>
                            )}

                            <div className="payment-actions">
                                <button 
                                    className="cancel-payment" 
                                    onClick={handleCancelBooking}
                                    disabled={paymentStatus === "success"}
                                    style={paymentStatus === "success" ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                                >
                                    HỦY ĐẶT SÂN
                                </button>

                                <button 
                                    className="confirm-payment"
                                    onClick={() => navigate("/dashboard")}
                                    style={paymentStatus === "success" ? { background: "#4caf50", color: "white" } : {}}
                                >
                                    {paymentStatus === "success" ? "VỀ TRANG CHỦ" : "XÁC NHẬN ĐẶT SÂN"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="payment-right">
                        <div className="countdown-card">
                            {paymentStatus === "success" ? (
                                <>
                                    <p style={{ fontWeight: "bold", color: "#2f7d32", margin: "0 0 12px 0" }}>Trạng thái đơn hàng</p>
                                    <div className="countdown-time" style={{ background: "#4caf50" }}>ĐÃ THANH TOÁN</div>
                                </>
                            ) : paymentStatus === "failed" ? (
                                <>
                                    <p style={{ fontWeight: "bold", color: "#b91c1c", margin: "0 0 12px 0" }}>Trạng thái đơn hàng</p>
                                    <div className="countdown-time" style={{ background: "#b91c1c" }}>ĐÃ HỦY / LỖI</div>
                                </>
                            ) : (
                                <>
                                    <p>Đơn của bạn còn được giữ chỗ trong</p>
                                    <div className="countdown-time">{formatTime(seconds)}</div>
                                </>
                            )}
                        </div>

                        <div className="detail-card">
                            <div className="detail-title">Chi tiết lịch đặt</div>

                            <div className="detail-row">
                                <span>Tên sân</span>
                                <b>{booking.fieldName || "Sân A"}</b>
                            </div>

                            <div className="detail-row">
                                <span>Địa chỉ sân</span>
                                <b>{booking.address || "Hải Phòng"}</b>
                            </div>

                            <div className="detail-row">
                                <span>Tên khách hàng</span>
                                <b>{booking.customerName || "Nguyễn Thị Hương"}</b>
                            </div>

                            <div className="detail-row">
                                <span>Số điện thoại</span>
                                <b>{booking.customerPhone || "0349141905"}</b>
                            </div>

                            <div className="detail-row">
                                <span>Thời gian đặt</span>
                                <div>
                                    {booking.selectedSlots?.length > 0 ? (
                                        booking.selectedSlots.map((item, index) => {
                                            const fieldName = item.field?.field_name || "Sân";
                                            const time = item.slot?.start_time.slice(0, 5) || "00:00";
                                            const end = item.slot?.end_time.slice(0, 5) || "00:00";
                                            const price = item.slot?.price || 0;

                                            return (
                                                <div key={index}>
                                                    <b>{fieldName}</b>: {time} - {end} | {Number(price).toLocaleString("vi-VN")}đ
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <b>Chưa chọn khung giờ</b>
                                    )}
                                </div>
                            </div>

                            <div className="detail-total">
                                Thành tiền: {Number(booking.totalPrice || 0).toLocaleString("vi-VN")} VND
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default PaymentConfirmPage;