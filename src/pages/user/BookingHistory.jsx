import "./BookingHistory.css";
import React, { useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

const bookings = [
    {
        id: 1,
        date: "12/01/2026",
        name: "Đức Thảo",
        sport: "Cầu Lông",
        time: "18:00 - 18:40",
        address: "18 Tam Trinh, Mai Động, Hoàng Mai, Hà Nội",
        price: "100.000 đ",
        status: "Hủy do quá giờ thanh toán",
    },
    {
        id: 2,
        date: "12/01/2026",
        name: "Đức Thảo",
        sport: "Cầu Lông",
        time: "17:20 - 18:00",
        address: "18 Tam Trinh, Mai Động, Hoàng Mai, Hà Nội",
        price: "100.000 đ",
        status: "Đã xác nhận",
    },
];

export default function BookingHistory() {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const navigate = useNavigate();

    return (
        <div className="booking-history-page">
            <Header />
            <div className="history-container">
                <div className="history-header">
                    <h2>Lịch sử đặt sân</h2>
                    <button>Đặt sân mới</button>
                </div>

                <div className="history-filter">
                    <input placeholder="🔍 Tìm kiếm theo tên sân, mã đơn..." />
                    <select>
                        <option>Tất cả trạng thái</option>
                        <option>Đã xác nhận</option>
                        <option>Đã hủy</option>
                    </select>
                    <input type="date" />
                    <select>
                        <option>Mới nhất</option>
                        <option>Cũ nhất</option>
                    </select>
                </div>

                <div className="booking-list">
                    {bookings.map((item) => (
                        <div className="booking-card" key={item.id}>
                            <div className="card-top">
                                <span className="date-badge">Đơn ngày {item.date}</span>

                                <span
                                    className={
                                        item.status === "Đã xác nhận"
                                            ? "status success"
                                            : "status cancel"
                                    }
                                >
                                    {item.status}
                                </span>
                            </div>

                            <h3>{item.name}</h3>

                            <p>
                                <b>{item.sport} 1:</b> {item.time} - Thứ Hai, {item.date}
                            </p>

                            <p className="address">📍 {item.address}</p>

                            <div className="card-footer">
                                <h3>Tổng thanh toán: {item.price}</h3>

                                <div className="actions">
                                    <button
                                        className="detail-btn"
                                        onClick={() => setSelectedBooking(item)}
                                    >
                                        Xem chi tiết
                                    </button>

                                    {item.status === "Đã xác nhận" && (
                                        <button className="review-btn">☆ Đánh giá</button>
                                    )}

                                    <button
                                        className="rebook-btn"
                                        onClick={() => navigate("/booking")}
                                    >
                                        ↻ Đặt lại
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedBooking && (
                <div
                    className="detail-overlay"
                    onClick={() => setSelectedBooking(null)}
                >
                    <div
                        className="detail-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="detail-title">
                            <h2>Chi tiết lịch đặt</h2>
                            <button onClick={() => setSelectedBooking(null)}>×</button>
                        </div>

                        <div className="detail-row">
                            <span>Tên sân</span>
                            <b>Sân A</b>
                        </div>

                        <div className="detail-row">
                            <span>Địa chỉ sân</span>
                            <b>{selectedBooking.address}</b>
                        </div>

                        <div className="detail-row">
                            <span>Tên khách hàng</span>
                            <b>{selectedBooking.name}</b>
                        </div>

                        <div className="detail-row">
                            <span>Số điện thoại</span>
                            <b>0349141905</b>
                        </div>

                        <div className="detail-row">
                            <span>Thời gian đặt</span>
                            <b>
                                Sân 1: {selectedBooking.time} | {selectedBooking.price}
                            </b>
                        </div>

                        <h3 className="detail-total">
                            Thành tiền: {selectedBooking.price}
                        </h3>
                    </div>
                </div>
            )}
        </div>
    );
}