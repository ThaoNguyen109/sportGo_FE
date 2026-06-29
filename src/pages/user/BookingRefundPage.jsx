import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../Layouts/MainLayout";
import axiosClient from "../../api/axiosClient";
import "./BookingRefundPage.css";

const VIETNAMESE_BANKS = [
    "Vietcombank (VCB)",
    "Techcombank (TCB)",
    "MB Bank (MB)",
    "BIDV",
    "Vietinbank (CTG)",
    "Agribank",
    "ACB",
    "Sacombank",
    "TPBank",
    "VPBank",
    "VIB",
    "Momo (Số điện thoại)"
];

export default function BookingRefundPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const booking = location.state || {};

    const [bankName, setBankName] = useState("");
    const [bankAccountName, setBankAccountName] = useState("");
    const [bankAccountNumber, setBankAccountNumber] = useState("");
    const [reason, setReason] = useState("");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Nếu không có thông tin booking truyền qua state, redirect về trang lịch sử
    if (!booking.id) {
        return (
            <MainLayout>
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <h3>Không tìm thấy đơn hàng cần hoàn tiền.</h3>
                    <button
                        onClick={() => navigate("/booking/history")}
                        style={{
                            background: "#2f7d32",
                            color: "white",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            marginTop: "15px"
                        }}
                    >
                        Quay lại Lịch sử
                    </button>
                </div>
            </MainLayout>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!bankName || !bankAccountName || !bankAccountNumber) {
            return alert("Vui lòng điền đầy đủ thông tin tài khoản nhận tiền!");
        }

        setLoading(true);
        setErrorMsg("");

        try {
            const res = await axiosClient.post(`/bookings/${booking.id}/refund`, {
                bank_name: bankName,
                bank_account_name: bankAccountName.toUpperCase(),
                bank_account_number: bankAccountNumber,
                reason: reason || "Khách yêu cầu hủy lịch và hoàn tiền."
            });

            if (res.data?.success) {
                setSuccess(true);
                // Quay lại trang lịch sử đặt sân sau 4 giây
                setTimeout(() => {
                    navigate("/booking/history");
                }, 4000);
            }
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu hoàn tiền:", error);
            setErrorMsg(
                error.response?.data?.message ||
                "Gửi yêu cầu hoàn tiền thất bại. Vui lòng thử lại sau!"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="refund-page-container">
                <div className="refund-header-bar">
                    <button onClick={() => navigate("/booking/history")} className="back-arrow-btn">
                        ← Quay lại
                    </button>
                    <h2>Yêu Cầu Hủy Sân & Hoàn Tiền</h2>
                </div>

                {success ? (
                    <div className="refund-success-card">
                        <div className="success-icon-badge">✓</div>
                        <h2>Gửi yêu cầu thành công!</h2>
                        <p className="success-subtitle">
                            Yêu cầu hủy sân và hoàn tiền cho đơn hàng <b>#{booking.id}</b> đã được gửi tới Ban quản trị (Admin).
                        </p>
                        <div className="success-refund-details">
                            <div>• <b>Ngân hàng nhận:</b> {bankName}</div>
                            <div>• <b>Chủ tài khoản:</b> {bankAccountName.toUpperCase()}</div>
                            <div>• <b>Số tài khoản:</b> {bankAccountNumber}</div>
                            <div>• <b>Số tiền hoàn trả dự kiến:</b> <span className="highlight-price">{Number(booking.total_price).toLocaleString("vi-VN")} đ</span></div>
                        </div>
                        <p className="success-redirect-note">
                            Admin sẽ kiểm tra giao dịch và hoàn tiền cho bạn sớm nhất. Hệ thống sẽ tự động đưa bạn về trang Lịch sử đặt sân trong giây lát...
                        </p>
                        <button onClick={() => navigate("/booking/history")} className="success-btn-back">
                            VỀ TRANG LỊCH SỬ
                        </button>
                    </div>
                ) : (
                    <div className="refund-content-grid">
                        {/* Cột trái: Form nhập tài khoản hoàn tiền */}
                        <div className="refund-form-card">
                            <h3>Thông tin tài khoản nhận tiền hoàn trả</h3>
                            <p className="form-helper-text">
                                Vui lòng cung cấp chính xác thông tin tài khoản ngân hàng của bạn. Chúng tôi sẽ chuyển khoản hoàn tiền vào tài khoản này sau khi phê duyệt yêu cầu.
                            </p>

                            {errorMsg && <div className="refund-error-alert">⚠️ {errorMsg}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label>Ngân hàng nhận tiền *</label>
                                    <select
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Chọn ngân hàng nhận --</option>
                                        {VIETNAMESE_BANKS.map((b, idx) => (
                                            <option key={idx} value={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label>Số tài khoản / Số thẻ nhận tiền *</label>
                                    <input
                                        type="text"
                                        placeholder="Nhập số tài khoản ngân hàng của bạn"
                                        value={bankAccountNumber}
                                        onChange={(e) => setBankAccountNumber(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Tên chủ tài khoản (Viết hoa không dấu) *</label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: NGUYEN VAN A"
                                        value={bankAccountName}
                                        onChange={(e) => setBankAccountName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Lý do hủy sân và hoàn tiền</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Nhập lý do của bạn (Ví dụ: Bận đột xuất, thời tiết xấu...)"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="form-actions-bar">
                                    <button
                                        type="button"
                                        className="btn-cancel-refund"
                                        onClick={() => navigate("/booking/history")}
                                        disabled={loading}
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-submit-refund"
                                        disabled={loading}
                                    >
                                        {loading ? "Đang gửi yêu cầu..." : "Xác nhận & Gửi yêu cầu"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Cột phải: Thông tin đơn hàng bị hủy */}
                        <div className="refund-summary-card">
                            <h3>Tóm tắt đơn hàng hủy</h3>
                            <div className="summary-row">
                                <span>Mã đơn đặt sân</span>
                                <b>#{booking.id}</b>
                            </div>
                            <div className="summary-row">
                                <span>Cụm sân bóng</span>
                                <b>{booking.court_name}</b>
                            </div>
                            <div className="summary-row">
                                <span>Địa chỉ cụm sân</span>
                                <b>{booking.address}</b>
                            </div>
                            <div className="summary-row">
                                <span>Ngày đặt bóng</span>
                                <b>{new Date(booking.first_date).toLocaleDateString("vi-VN")}</b>
                            </div>

                            <div className="summary-slots-section">
                                <span className="section-title">Danh sách các slot giờ hủy:</span>
                                <div className="summary-slots-list">
                                    {booking.slots?.map((slot, index) => (
                                        <div key={index} className="slot-item-summary">
                                            • <b>{slot.field_name}</b>: {slot.start_time} - {slot.end_time}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="summary-total-refund">
                                <span>Số tiền hoàn trả (100%):</span>
                                <b className="refund-price">{Number(booking.total_price).toLocaleString("vi-VN")} đ</b>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
