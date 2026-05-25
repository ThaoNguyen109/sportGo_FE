import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "./BookingConfirmPage.css";
import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

const BookingConfirmPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [note, setNote] = useState("");
    
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [isCanceling, setIsCanceling] = useState(false);

    const booking = location.state || {
        bookingId: null,
        fieldName: "Sân A",
        address: "Hải Phòng",
        phone: "0984229224",
        date: "05/02/2026",
        selectedSlots: [],
        totalHours: 0,
        totalPrice: 0,
    };

    // Khởi tạo countdown
    useEffect(() => {
        alert("Vui lòng thanh toán đơn hàng trong 10 phút.");
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    alert("Đã hết thời gian giữ sân, vui lòng đặt lại.");
                    if (!isCanceling) handleCancelBooking();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isCanceling]);

    // Khóa nút back của trình duyệt
    useEffect(() => {
        const pushState = () => window.history.pushState(null, "", window.location.href);
        pushState();
        
        const handlePopState = () => {
            if (!isCanceling) {
                pushState();
                alert("Vui lòng bấm 'Hủy giữ sân' để hệ thống hủy lịch đang giữ và chọn lại từ đầu.");
            }
        };
        
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [isCanceling]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const handleCancelBooking = async () => {
        setIsCanceling(true);
        console.log("Thực hiện hủy giữ sân cho bookingId:", booking.bookingId);
        if (booking.bookingId) {
            try {
                await axiosClient.delete(`/bookings/${booking.bookingId}`);
                console.log(`Đã gọi API DELETE /bookings/${booking.bookingId} thành công.`);
            } catch (error) {
                console.error("Lỗi khi gọi API hủy giữ sân:", error);
            }
        } else {
            console.warn("Không tìm thấy booking.bookingId trong state! API hủy sẽ không được gọi.");
        }
        
        // Delay một chút để đảm bảo network request kịp gửi đi trước khi chuyển trang
        setTimeout(() => {
            navigate(-2);
        }, 300);
    };

    const handleConfirmAndPay = async () => {
        if (!booking.bookingId) {
            return alert("Không tìm thấy mã đơn hàng. Vui lòng thử lại.");
        }
        try {
            console.log("Đang gọi MoMo create với booking_id:", booking.bookingId);
            const res = await axiosClient.post("/payments/momo/create", {
                booking_id: Number(booking.bookingId)
            });
            console.log("MoMo API Response:", res.data);
            if (res.data?.success) {
                navigate("/payment-confirm", {
                    state: {
                        ...booking,
                        customerName,
                        customerPhone,
                        note,
                        qrUrl: res.data.data.pay_url,
                        timeLeft: timeLeft
                    },
                });
            } else {
                alert(res.data?.message || "Lỗi tạo thanh toán MoMo.");
            }
        } catch (error) {
            console.error("Lỗi khi thanh toán MoMo:", error);
            const errorData = error.response?.data;
            console.error("Chi tiết lỗi backend:", errorData);
            
            if (errorData) {
                const errorMsg = errorData.message || errorData.error || JSON.stringify(errorData);
                alert(`Lỗi từ server: ${errorMsg}`);
            } else {
                alert("Lỗi kết nối khi thanh toán MoMo.");
            }
        }
    };

    return (
        <MainLayout>
            <div className="confirm-page">
                <div className="countdown-banner" style={{ textAlign: 'center', padding: '10px', background: '#ffebee', color: '#c62828', fontWeight: 'bold', borderRadius: '8px', marginBottom: '15px' }}>
                    ⏳ Thời gian còn lại để hoàn tất: {formatTime(timeLeft)}
                </div>
                <div className="confirm-card">
                    <div className="section">
                        <div className="section-title">Thông tin sân</div>
                        <p><b>Tên sân:</b> {booking.fieldName}</p>
                        <p><b>Địa chỉ:</b> {booking.address}</p>
                        <p><b>SĐT:</b> {booking.phone}</p>
                    </div>

                    <div className="section">
                        <div className="section-title">Thông tin lịch đặt</div>
                        <p><b>Ngày:</b> {booking.date}</p>

                        <p><b>Thời gian đặt:</b></p>

                        <div className="time-list">
                            {booking.selectedSlots.length > 0 ? (
                                booking.selectedSlots.map((item, index) => {
                                    // item là object: { key, field, slot }
                                    const fieldName = item.field?.field_name || "Sân";
                                    const time = item.slot?.start_time.slice(0, 5) || "00:00";
                                    const end = item.slot?.end_time.slice(0, 5) || "00:00";
                                    const price = item.slot?.price || 0;

                                    return (
                                        <div key={index} className="time-item">
                                            <div>
                                                <b>{fieldName}</b>: {time} - {end}
                                            </div>
                                            <div style={{ color: "#2f7d32", fontWeight: "bold" }}>
                                                {Number(price).toLocaleString("vi-VN")}đ
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p>Chưa chọn khung giờ</p>
                            )}
                        </div>

                        <p><b>Tổng giờ:</b> {booking.totalHours} giờ</p>
                        <p><b>Tổng tiền:</b> {booking.totalPrice.toLocaleString("vi-VN")} VND</p>
                    </div>

                    <div className="section">
                        <div className="section-title">Thông tin khách hàng</div>

                        <label>Tên của bạn</label>
                        <input
                            placeholder="Nhập tên của bạn"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />

                        <label>Số điện thoại</label>
                        <input
                            placeholder="Nhập số điện thoại"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                        />

                        <label>Ghi chú cho chủ sân</label>
                        <textarea
                            placeholder="Nhập ghi chú"
                            rows="4"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="confirm-actions">
                        <button className="cancel-btn" onClick={handleCancelBooking}>
                            HỦY GIỮ SÂN
                        </button>

                        <button
                            className="confirm-btn"
                            onClick={handleConfirmAndPay}
                        >
                            XÁC NHẬN & THANH TOÁN
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default BookingConfirmPage;