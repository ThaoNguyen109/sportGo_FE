import "./BookingHistory.css";
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function BookingHistory() {
    const [bookingList, setBookingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const navigate = useNavigate();

    // Bộ lọc nội bộ
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");

    // Tải lịch sử đặt sân từ Backend
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axiosClient.get("/bookings");
                if (res.data?.success) {
                    setBookingList(res.data.data);
                }
            } catch (error) {
                console.error("Lỗi khi tải lịch sử đặt sân:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Bản đồ việt hoá trạng thái
    const getStatusTextAndClass = (status) => {
        switch (status) {
            case "paid":
                return { text: "Đã thanh toán", className: "status success" };
            case "pending":
                return { text: "Chờ thanh toán", className: "status pending" };
            case "cancelled":
                return { text: "Đã hủy", className: "status cancel" };
            case "failed":
                return { text: "Thất bại", className: "status cancel" };
            case "refunding":
                return { text: "Đang hoàn tiền", className: "status pending" };
            case "refunded":
                return { text: "Đã hoàn tiền", className: "status cancel" };
            default:
                return { text: status, className: "status" };
        }
    };

    const getPaymentMethodText = (method) => {
        switch (method) {
            case "momo":
                return "Ví điện tử MoMo";
            case "cash":
                return "Tiền mặt tại quầy";
            default:
                return method || "Chưa chọn";
        }
    };

    // Lọc và sắp xếp danh sách đặt sân
    const filteredBookings = bookingList
        .filter((item) => {
            // Lọc theo từ khóa (tên cụm sân hoặc mã đơn)
            const matchesSearch = 
                item.court_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                String(item.id).includes(searchTerm);
            
            // Lọc theo trạng thái
            const matchesStatus = 
                statusFilter === "all" || 
                (statusFilter === "paid" && item.status === "paid") ||
                (statusFilter === "cancelled" && (item.status === "cancelled" || item.status === "failed")) ||
                (statusFilter === "pending" && item.status === "pending");

            // Lọc theo ngày
            const matchesDate = !dateFilter || item.first_date === dateFilter;

            return matchesSearch && matchesStatus && matchesDate;
        })
        .sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });

    return (
        <div className="booking-history-page">
            <Header />
            <div className="history-container">
                <div className="history-header">
                    <h2>Lịch sử đặt sân</h2>
                    <button onClick={() => navigate("/dashboard")}>Đặt sân mới</button>
                </div>

                <div className="history-filter">
                    <input 
                        placeholder="🔍 Tìm kiếm theo tên sân, mã đơn..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="paid">Đã thanh toán</option>
                        <option value="pending">Chờ thanh toán</option>
                        <option value="cancelled">Đã hủy / thất bại</option>
                    </select>
                    <input 
                        type="date" 
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                    </select>
                </div>

                <div className="booking-list">
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>Đang tải lịch sử...</div>
                    ) : filteredBookings.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>Không tìm thấy lịch sử đặt sân nào.</div>
                    ) : (
                        filteredBookings.map((item) => {
                            const statusInfo = getStatusTextAndClass(item.status);
                            const formattedDate = new Date(item.first_date).toLocaleDateString("vi-VN");
                            return (
                                <div className="booking-card" key={item.id}>
                                    <div className="card-top">
                                        <span className="date-badge">Mã đơn #{item.id} | Ngày đá: {formattedDate}</span>

                                        <span className={statusInfo.className}>
                                            {statusInfo.text}
                                        </span>
                                    </div>

                                    <h3>{item.court_name}</h3>

                                    <p>
                                        <b>Chi tiết đặt sân:</b> {item.slots_count} slot giờ (Sân con: {item.slots?.map(s => s.field_name).join(", ")})
                                    </p>

                                    <p className="address">📍 {item.address}</p>

                                    <div className="card-footer">
                                        <h3>Tổng tiền: {Number(item.total_price).toLocaleString("vi-VN")} đ</h3>

                                        <div className="actions">
                                            <button
                                                className="detail-btn"
                                                onClick={() => setSelectedBooking(item)}
                                            >
                                                Xem chi tiết
                                            </button>

                                            {item.status === "paid" && (
                                                <>
                                                    <button className="review-btn">☆ Đánh giá</button>
                                                    <button 
                                                        className="cancel-btn-history"
                                                        onClick={() => navigate("/booking/refund", { state: item })}
                                                        style={{
                                                            background: "#ffebee",
                                                            color: "#c62828",
                                                            border: "1px solid #ffcdd2",
                                                            padding: "6px 12px",
                                                            borderRadius: "4px",
                                                            fontWeight: "bold",
                                                            cursor: "pointer",
                                                            fontSize: "13px",
                                                            marginLeft: "6px",
                                                            transition: "all 0.2s"
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.target.style.background = "#c62828";
                                                            e.target.style.color = "white";
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.target.style.background = "#ffebee";
                                                            e.target.style.color = "#c62828";
                                                        }}
                                                    >
                                                        🚫 Hủy & Hoàn tiền
                                                    </button>
                                                </>
                                            )}

                                            <button
                                                className="rebook-btn"
                                                onClick={() => navigate("/dashboard")}
                                            >
                                                ↻ Đặt lại
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
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
                        style={{ maxWidth: "500px", width: "90%" }}
                    >
                        <div className="detail-title">
                            <h2>Chi tiết lịch đặt</h2>
                            <button onClick={() => setSelectedBooking(null)}>×</button>
                        </div>

                        <div className="detail-row">
                            <span>Mã đơn hàng</span>
                            <b>#{selectedBooking.id}</b>
                        </div>

                        <div className="detail-row">
                            <span>Tên cụm sân</span>
                            <b>{selectedBooking.court_name}</b>
                        </div>

                        <div className="detail-row">
                            <span>Địa chỉ sân</span>
                            <b>{selectedBooking.address}</b>
                        </div>

                        <div className="detail-row">
                            <span>Phương thức thanh toán</span>
                            <b>{getPaymentMethodText(selectedBooking.payment_method)}</b>
                        </div>

                        <div className="detail-row">
                            <span>Ngày đặt lệnh</span>
                            <b>{new Date(selectedBooking.created_at).toLocaleString("vi-VN")}</b>
                        </div>

                        <div className="detail-row" style={{ display: "block", borderBottom: "none" }}>
                            <span style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#555" }}>Danh sách các slot đặt:</span>
                            <div style={{ paddingLeft: "12px", borderLeft: "3px solid #4caf50", maxHeight: "150px", overflowY: "auto" }}>
                                {selectedBooking.slots?.map((slot, index) => (
                                    <div key={index} style={{ marginBottom: "6px", fontSize: "14px" }}>
                                        • <b>{slot.field_name}</b>: {slot.start_time} - {slot.end_time} | Ngày {new Date(slot.booking_date).toLocaleDateString("vi-VN")}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <h3 className="detail-total" style={{ borderTop: "1px solid #eee", paddingTop: "14px", marginTop: "10px" }}>
                            Thành tiền: {Number(selectedBooking.total_price).toLocaleString("vi-VN")} đ
                        </h3>
                    </div>
                </div>
            )}
        </div>
    );
}