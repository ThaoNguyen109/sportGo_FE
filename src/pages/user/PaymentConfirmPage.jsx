import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "./PaymentConfirmPage.css";

const PaymentConfirmPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const booking = location.state || {};

    const [seconds, setSeconds] = useState(600);

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
    const getEndTime = (startTime) => {
        const [hour, minute] = startTime.split(":").map(Number);
        const date = new Date();
        date.setHours(hour, minute + 30, 0, 0);

        return date.toTimeString().slice(0, 5);
    };

    return (
        <MainLayout>
            <div className="payment-page">
                <div className="payment-header">
                    <button
                        onClick={() => navigate(-1)}
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
                                <div className="fake-qr">
                                    QR
                                </div>
                            </div>

                            <p className="qr-note">
                                Bạn vui lòng thanh toán qua QR MoMo để hoàn tất lịch đặt.
                            </p>

                            <div className="payment-actions">
                                <button className="cancel-payment" onClick={() => navigate("/booking-confirm")}>
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
                                        booking.selectedSlots.map((slot, index) => {
                                            const [court, startTime] = slot.split("-");

                                            return (
                                                <div key={index}>
                                                    <b>{court}</b>: {startTime} - {getEndTime(startTime)} | 50.000đ
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <b>Sân 1: 22:00 - 22:30 | 50.000đ</b>
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