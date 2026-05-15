import React, { useState } from "react";
import "./BookingGrid.css";
import { useNavigate } from "react-router-dom";

const times = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
  "21:00", "21:30", "22:00", "22:30", "23:00", "23:30",
  "00:00"
];

const courts = ["Sân 1", "Sân 2", "Sân 3", "Sân 4", "Sân 5"];

const priceList = [
  { court: "Sân 1", morning: "80.000đ", afternoon: "100.000đ", evening: "150.000đ" },
  { court: "Sân 2", morning: "80.000đ", afternoon: "100.000đ", evening: "150.000đ" },
  { court: "Sân 3", morning: "90.000đ", afternoon: "120.000đ", evening: "170.000đ" },
  { court: "Sân 4", morning: "90.000đ", afternoon: "120.000đ", evening: "170.000đ" },
  { court: "Sân 5", morning: "100.000đ", afternoon: "130.000đ", evening: "180.000đ" },
];

function BookingGrid() {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showPriceTable, setShowPriceTable] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const navigate = useNavigate();

  const handleSelectSlot = (court, time) => {
    const key = `${court}-${time}`;

    if (selectedSlots.includes(key)) {
      setSelectedSlots(selectedSlots.filter((item) => item !== key));
    } else {
      setSelectedSlots([...selectedSlots, key]);
    }
  };

  // 👉 TÍNH TOÁN
  const totalHours = selectedSlots.length * 0.5;
  const pricePerSlot = 50000;
  const totalPrice = selectedSlots.length * pricePerSlot;

  return (
    <div className="booking-container">

      {/* HEADER */}
      <div className="booking-header">
        <div className="header-left">
          <div className="header-title">Đặt sân theo khung giờ</div>

          <div className="legend">
            <span className="box empty"></span> Trống
            <span className="box selected-box"></span> Đã chọn
            <span className="box booked"></span> Đã đặt
            <span className="box locked"></span> Khoá
          </div>
        </div>

        <div className="header-right">
          <input
            type="date"
            className="booking-date"
            value={selectedDate}
            min={today}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSlots([]);
            }}
          />
        </div>
      </div>

      {/* GRID */}
      <div className="grid-wrapper">
        <div className="grid-inner">

          <div className="time-row">
            <div className="corner-cell"></div>

            {times.map((t) => (
              <div key={t} className="time-cell">{t}</div>
            ))}
          </div>

          {courts.map((court) => (
            <div key={court} className="court-row">

              <div className="court-name">{court}</div>

              {times.map((time) => {
                const key = `${court}-${time}`;
                const isSelected = selectedSlots.includes(key);
                const isPastSlot = (time) => {
                  const now = new Date();
                  const [hour, minute] = time.split(":").map(Number);

                  const slotDateTime = new Date(selectedDate);
                  slotDateTime.setHours(hour, minute, 0, 0);

                  return slotDateTime <= now;
                };

                return (
                  <div
                    key={key}
                    className={`slot ${isSelected ? "selected" : ""} ${isPastSlot(time) ? "disabled" : ""}`}
                    onClick={() => {
                      if (!isPastSlot(time)) {
                        handleSelectSlot(court, time);
                      }
                    }}
                  ></div>
                );
              })}

            </div>
          ))}

        </div>
      </div>

      {/* NÚT XEM GIÁ */}
      <div className="price-action">
        <button
          className="price-detail-btn"
          onClick={() => setShowPriceTable(!showPriceTable)}
        >
          {showPriceTable ? "Ẩn chi tiết giá" : "Xem chi tiết giá các sân"}
        </button>
      </div>

      {/* BẢNG GIÁ */}
      {showPriceTable && (
        <div className="price-table-box">
          <h3>Bảng giá các sân theo khung giờ</h3>

          <table className="price-table">
            <thead>
              <tr>
                <th>Sân</th>
                <th>06:00 - 12:00</th>
                <th>12:00 - 17:00</th>
                <th>17:00 - 00:00</th>
              </tr>
            </thead>

            <tbody>
              {priceList.map((item) => (
                <tr key={item.court}>
                  <td>{item.court}</td>
                  <td>{item.morning}</td>
                  <td>{item.afternoon}</td>
                  <td>{item.evening}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔥 FOOTER THANH TOÁN (chỉ thêm phần này) */}
      <div className="booking-footer">
        <div>
          <div className="footer-label">Tổng giờ đặt</div>
          <div className="footer-value">{totalHours} giờ</div>
        </div>

        <div>
          <div className="footer-label">Tổng chi phí</div>
          <div className="footer-value">
            💰 {totalPrice.toLocaleString("vi-VN")} VND
          </div>
        </div>

        <button
          className="payment-btn"
          onClick={() =>
            navigate("/booking-confirm", {
              state: {
                fieldName: "Sân A",
                address: "Hải Phòng",
                phone: "0984229224",
                date: selectedDate,
                selectedSlots,
                totalHours,
                totalPrice,
              },
            })
          }
        >
          🏃 Thanh toán ngay
        </button>
      </div>

    </div>
  );
}

export default BookingGrid;