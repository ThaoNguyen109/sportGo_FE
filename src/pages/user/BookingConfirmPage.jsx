import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import "./BookingConfirmPage.css";
import { useState } from "react";

const BookingConfirmPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [note, setNote] = useState("");

    const booking = location.state || {
        fieldName: "Sân A",
        address: "Hải Phòng",
        phone: "0984229224",
        date: "05/02/2026",
        selectedSlots: [],
        totalHours: 0,
        totalPrice: 0,
    };

    return (
        <MainLayout>
            <div className="confirm-page">
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
                                booking.selectedSlots.map((slot, index) => {
                                    // slot dạng: "Sân 2-22:30"
                                    const [fieldPart, time] = slot.split("-");
                                    const field = fieldPart.replace("Sân ", "");

                                    // 👉 tính giờ kết thúc (+30 phút)
                                    const [h, m] = time.split(":").map(Number);
                                    const endDate = new Date(0, 0, 0, h, m + 30);
                                    const end = endDate.toTimeString().slice(0, 5);

                                    return (
                                        <div key={index} className="time-item">
                                            <div>
                                                <b>Sân {field}</b>: {time} - {end}
                                            </div>
                                            <div style={{ color: "#2f7d32", fontWeight: "bold" }}>
                                                50.000đ
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
                        <button className="cancel-btn" onClick={() => navigate("/booking")}>
                            HỦY GIỮ SÂN
                        </button>

                        <button
                            className="confirm-btn"
                            onClick={() =>
                                navigate("/payment-confirm", {
                                    state: {
                                        ...booking,
                                        customerName,
                                        customerPhone,
                                        note,
                                    },
                                })
                            }
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