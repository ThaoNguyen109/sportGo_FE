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

    // Khóa nút back của trình duyệt
    useEffect(() => {
        const pushState = () => window.history.pushState(null, "", window.location.href);
        pushState();

        const handlePopState = () => {
            if (!isCanceling) {
                pushState();
                alert("Vui lòng bấm 'Hủy đặt sân' để hệ thống hủy lịch đang giữ và quay về trang chủ.");
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [isCanceling]);

    useEffect(() => {
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
    }, []);

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
                        onClick={() => alert("Vui lòng bấm 'Hủy đặt sân' để hệ thống hủy lịch đang giữ và quay về trang chủ.")}
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

                            <div className="qr-box">
                                {booking.qrUrl ? (
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(booking.qrUrl)}`}
                                        alt="MoMo QR Code"
                                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                    />
                                ) : (
                                    <div className="fake-qr">QR</div>
                                )}
                            </div>

                            <p className="qr-note">
                                Bạn vui lòng thanh toán qua QR MoMo để hoàn tất lịch đặt.
                            </p>

                            <div className="payment-actions">
                                <button className="cancel-payment" onClick={handleCancelBooking}>
                                    HỦY ĐẶT SÂN
                                </button>

                                <button className="confirm-payment">
                                    XÁC NHẬN ĐẶT SÂN
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="payment-right">
                        <div className="countdown-card">
                            <p>Đơn của bạn còn được giữ chỗ trong</p>
                            <div className="countdown-time">{formatTime(seconds)}</div>
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