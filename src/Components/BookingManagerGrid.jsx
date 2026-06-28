import React, { useEffect, useState } from "react";
import "./BookingManagerGrid.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";

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

const dayMap = {
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
  7: "Chủ nhật",
};

function BookingManagerGrid() {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showPriceTable, setShowPriceTable] = useState(false);
  const [fields, setFields] = useState([]);
  const [bookedSlots, setBookedSlots] = useState(new Set());
  const [bookings, setBookings] = useState([]);
  const [bookingLookup, setBookingLookup] = useState({});
  const [selectedBookedSlotInfo, setSelectedBookedSlotInfo] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courtId = searchParams.get("court_id");

  const handleSelectSlot = (court, time) => {
    const key = `${court}-${time}`;

    if (selectedSlots.includes(key)) {
      setSelectedSlots(selectedSlots.filter((item) => item !== key));
    } else {
      setSelectedSlots([...selectedSlots, key]);
    }
  };

  useEffect(() => {
    const fetchCourtPrices = async () => {
      if (!courtId) {
        setFields([]);
        return;
      }

      try {
        setLoadingPrices(true);
        setPriceError("");
        const res = await axiosClient.get(`/owner/courts/${courtId}`);
        const courtData = res.data?.data;
        setFields(courtData?.fields || []);
      } catch (error) {
        console.error("Lỗi lấy giá sân con:", error);
        setPriceError("Không thể tải thông tin giá giờ.");
      } finally {
        setLoadingPrices(false);
      }
    };

    fetchCourtPrices();
  }, [courtId]);

  useEffect(() => {
    const fetchCourtBookings = async () => {
      if (!courtId || !selectedDate) {
        setBookings([]);
        setBookedSlots(new Set());
        setSelectedBookedSlotInfo(null);
        return;
      }

      try {
        setLoadingBookings(true);
        setBookingError("");
        const res = await axiosClient.get("/owner/bookings", {
          params: {
            court_id: courtId,
            date: selectedDate,
          },
        });

        const rootData = res.data?.data;
        const items = Array.isArray(rootData)
          ? rootData
          : Array.isArray(rootData?.data)
          ? rootData.data
          : [];

        setBookings(items);

        const booked = new Set();
        const bookingLookup = {};

        items.forEach((booking) => {
          booking.details?.forEach((detail) => {
            if (detail.booking_date !== selectedDate) return;
            const fieldName = detail.field?.name || detail.field_id || "Unknown";
            const slotTimes = [];
            const start = detail.start_time?.slice(0, 5) || "";
            const end = detail.end_time?.slice(0, 5) || "";
            if (!start || !end) return;

            let current = start;
            while (current < end) {
              slotTimes.push(current);
              const [hour, minute] = current.split(":").map(Number);
              const nextDate = new Date();
              nextDate.setHours(hour, minute + 30, 0, 0);
              const nextHour = nextDate.getHours().toString().padStart(2, "0");
              const nextMinute = nextDate.getMinutes().toString().padStart(2, "0");
              current = `${nextHour}:${nextMinute}`;
            }

            slotTimes.forEach((time) => {
              const key = `${fieldName}-${time}`;
              booked.add(key);
              bookingLookup[key] = {
                booking,
                detail,
              };
            });
          });
        });

        setBookedSlots(booked);
        setSelectedBookedSlotInfo(null);
        setBookingLookup(bookingLookup);
      } catch (error) {
        console.error("Lỗi lấy booking:", error);
        setBookingError("Không thể tải danh sách booking.");
        setBookedSlots(new Set());
        setSelectedBookedSlotInfo(null);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchCourtBookings();
  }, [courtId, selectedDate]);

  const getDayOfWeek = (dateString) => {
    if (!dateString) return null;
    const date = new Date(`${dateString}T00:00:00`);
    const day = date.getDay();
    return day === 0 ? 7 : day;
  };

  const formatCurrency = (value) => {
    if (value == null || value === "") return "-";
    return Number(value).toLocaleString("vi-VN") + "đ";
  };

  const selectedDay = getDayOfWeek(selectedDate);

  const displayFields = fields.length
    ? fields
    : courts.map((name, index) => ({ id: index, name }));

  const priceRows = displayFields.flatMap((field) =>
    (field.prices || [])
      .filter((price) => price.day_of_week === selectedDay)
      .slice()
      .sort((a, b) => {
        const startA = a.start_time || "";
        const startB = b.start_time || "";
        return startA.localeCompare(startB);
      })
      .map((price) => ({
        fieldName: field.name,
        ...price,
      }))
  );

  const groupedEmptyFields = fields.filter(
    (field) => !(field.prices || []).some((price) => price.day_of_week === selectedDay)
  );

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

          {displayFields.map((field) => (
            <div key={field.id || field.name} className="court-row">

              <div className="court-name">{field.name}</div>

              {times.map((time) => {
                const key = `${field.name}-${time}`;
                const isBooked = bookedSlots.has(key);
                const isSelectedBookedSlot = selectedBookedSlotInfo?.slotKey === key;
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
                    className={`slot ${isBooked ? "booked" : ""} ${isSelectedBookedSlot ? "active-booked" : ""} ${isPastSlot(time) ? "disabled" : ""}`}
                    onClick={() => {
                      if (isPastSlot(time)) return;

                      if (isBooked) {
                        if (bookingLookup[key]) {
                          setSelectedBookedSlotInfo({
                            slotKey: key,
                            ...bookingLookup[key],
                          });
                        }
                      } else {
                        handleSelectSlot(field.name, time);
                        setSelectedBookedSlotInfo(null);
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

      {selectedBookedSlotInfo && (
        <div className="booking-selected-detail-box">
          <h3>Thông tin booking đã đặt</h3>
          <div className="booking-selected-detail-row">
            <div>
              <strong>Ngày:</strong> {selectedBookedSlotInfo.detail.booking_date}
            </div>
            <div>
              <strong>Giờ:</strong> {selectedBookedSlotInfo.detail.start_time?.slice(0, 5)} - {selectedBookedSlotInfo.detail.end_time?.slice(0, 5)}
            </div>
          </div>
          <div className="booking-selected-detail-row">
            <div>
              <strong>Sân:</strong> {selectedBookedSlotInfo.detail.field?.name || "-"}
            </div>
            <div>
              <strong>Court:</strong> {selectedBookedSlotInfo.detail.field?.court?.name || "-"}
            </div>
          </div>
          <div className="booking-selected-detail-row">
            <div>
              <strong>Khách hàng:</strong> {selectedBookedSlotInfo.booking.user?.name || "-"}
            </div>
            <div>
              <strong>Email:</strong> {selectedBookedSlotInfo.booking.user?.email || "-"}
            </div>
          </div>
          <div className="booking-selected-detail-row">
            <div>
              <strong>Giá:</strong> {selectedBookedSlotInfo.detail.price ? Number(selectedBookedSlotInfo.detail.price).toLocaleString("vi-VN") + "đ" : "-"}
            </div>
            <div>
              <strong>Trạng thái:</strong> {selectedBookedSlotInfo.booking.status || "-"}
            </div>
          </div>
        </div>
      )}

      {/* BẢNG GIÁ */}
      {showPriceTable && (
        <div className="price-table-box">
          <h3>Bảng giá các sân theo khung giờ</h3>
          <div className="price-meta">
            <div>Ngày: {selectedDate}</div>
            <div>Ngày trong tuần: {dayMap[selectedDay] || "Không xác định"}</div>
          </div>

          {!courtId ? (
            <div className="price-empty-message">
              Vui lòng chọn một sân để xem giá chi tiết.
            </div>
          ) : loadingPrices ? (
            <div className="price-loading">Đang tải giá từ hệ thống...</div>
          ) : priceError ? (
            <div className="price-error">{priceError}</div>
          ) : (
            <>
              <table className="price-table">
                <thead>
                  <tr>
                    <th>Sân con</th>
                    <th>Ngày</th>
                    <th>Giờ bắt đầu</th>
                    <th>Giờ kết thúc</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {priceRows.length > 0 ? (
                    priceRows.map((row, index) => (
                      <tr key={`${row.fieldName}-${row.start_time}-${index}`}>
                        <td>{row.fieldName}</td>
                        <td>{dayMap[row.day_of_week] || row.day_of_week}</td>
                        <td>{row.start_time}</td>
                        <td>{row.end_time}</td>
                        <td>{formatCurrency(row.price)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="price-empty-message">
                        Chưa có bảng giá cho ngày đã chọn hoặc giá chưa được cấu hình.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {groupedEmptyFields.length > 0 && (
                <div className="price-note">
                  <strong>Ghi chú:</strong> Các sân con sau chưa có giá cho ngày này:
                  {groupedEmptyFields.map((field) => (
                    <div key={field.id || field.name}>- {field.name}</div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 🔥 FOOTER THANH TOÁN (chỉ thêm phần này)
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
      </div> */}

    </div>
  );
}

export default BookingManagerGrid;