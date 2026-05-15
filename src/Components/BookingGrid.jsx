import React, { useState, useEffect, useMemo } from "react";
import "./BookingGrid.css";
import { useNavigate, useLocation } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function BookingGrid() {
  const navigate = useNavigate();
  const location = useLocation();
  const courtId = location.state?.courtId || 240; // Fallback to 240 if direct access

  console.log("📌 BookingGrid mounted, courtId:", courtId);

  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showPriceTable, setShowPriceTable] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  console.log("📅 Today:", today, "Selected Date:", selectedDate);

  // Dynamic API state
  const [loading, setLoading] = useState(true);
  const [courtData, setCourtData] = useState(null); // the /slots response
  const [pricesData, setPricesData] = useState([]); // the /prices fields
  const [courtInfo, setCourtInfo] = useState(null); // the /prices court info

  useEffect(() => {
    const fetchBookingData = async () => {
      setLoading(true);
      try {
        const [slotsRes, pricesRes] = await Promise.all([
          axiosClient.get(`/courts/${courtId}/slots?date=${selectedDate}`),
          axiosClient.get(`/courts/${courtId}/prices`)
        ]);

        console.log("🔍 Slots API Response:", slotsRes.data);

        const parsePrice = (priceVal) => {
          if (!priceVal) return 0;
          let p = Number(priceVal.toString().replace(/\./g, '').replace(/,/g, ''));
          if (p < 1000 && p > 0) p = p * 1000;
          return p;
        };

        if (slotsRes.data?.success) {
          const data = slotsRes.data.data;
          data.fields?.forEach(f => {
            f.slots?.forEach(s => {
              s.price = parsePrice(s.price);
            });
          });
          setCourtData(data);
        }
        if (pricesRes.data?.success) {
          const pData = pricesRes.data.data.fields || [];
          pData.forEach(f => {
             f.schedule?.forEach(sch => {
                sch.slots?.forEach(s => {
                   s.price = parsePrice(s.price);
                });
             });
          });
          setPricesData(pData);
          setCourtInfo(pricesRes.data.data.court);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sân:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
    setSelectedSlots([]);
  }, [courtId, selectedDate]);

  const fields = courtData?.fields || [];

  const times = useMemo(() => {
    if (fields.length === 0) return [];
    const allTimes = new Map();
    fields.forEach(f => {
      if (f.slots && Array.isArray(f.slots)) {
        f.slots.forEach(s => {
          const start = s.start_time?.slice(0, 5) || '';
          const end = s.end_time?.slice(0, 5) || '';
          if (start && end) {
            allTimes.set(start, `${start} - ${end}`);
          }
        });
      }
    });
    const sortedTimes = Array.from(allTimes.entries()).sort((a, b) => {
      const [aH, aM] = a[0].split(':').map(Number);
      const [bH, bM] = b[0].split(':').map(Number);
      return (aH * 60 + aM) - (bH * 60 + bM);
    });
    const timeObjects = sortedTimes.map(([start, label]) => ({ start, label }));
    console.log('Times:', timeObjects, 'Fields:', fields);
    return timeObjects;
  }, [fields]);

  console.log("📦 Render preview:", {
    fieldCount: fields.length,
    times,
    fields: fields.map((f) => ({
      field_id: f.field_id,
      field_name: f.field_name,
      slots: f.slots?.map((s) => `${s.start_time} - ${s.end_time}`),
    })),
  });

  const handleSelectSlot = (field, slot) => {
    const key = `${field.field_id}-${slot.start_time}`;

    const isSelected = selectedSlots.some(s => s.key === key);
    if (isSelected) {
      setSelectedSlots(selectedSlots.filter((item) => item.key !== key));
    } else {
      setSelectedSlots([...selectedSlots, { key, field, slot }]);
    }
  };

  const calculateDuration = (start, end) => {
    let [sh, sm] = start.split(":").map(Number);
    let [eh, em] = end.split(":").map(Number);
    if (eh === 0) eh = 24;
    return (eh + em / 60) - (sh + sm / 60);
  };

  const totalHours = selectedSlots.reduce((sum, item) => sum + calculateDuration(item.slot.start_time, item.slot.end_time), 0);
  const totalPrice = selectedSlots.reduce((sum, item) => sum + Number(item.slot.price), 0);

  const getPriceRange = (field) => {
    const prices = [];
    field.schedule?.forEach(sch => sch.slots?.forEach(s => prices.push(Number(s.price))));
    if (prices.length === 0) return "Chưa có giá";
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `${min.toLocaleString("vi-VN")}đ`;
    return `${min.toLocaleString("vi-VN")}đ - ${max.toLocaleString("vi-VN")}đ`;
  };

  const isPastSlot = (time) => {
    const now = new Date();
    const [hour, minute] = time.split(":").map(Number);

    const slotDateTime = new Date(selectedDate);
    slotDateTime.setHours(hour, minute, 0, 0);

    return slotDateTime <= now;
  };

  const getSlotTooltip = (slot) => {
    return `${slot.start_time} - ${slot.end_time}\n${slot.price.toLocaleString("vi-VN")}đ`;
  };

  return (
    <div className="booking-container">
      {/* HEADER */}
      <div className="booking-header">
        <div className="header-left">
          <div className="header-title">Đặt sân {courtInfo?.name ? `- ${courtInfo.name}` : ""}</div>

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
            }}
          />
        </div>
      </div>

      {/* GRID */}
      <div className="grid-wrapper">
        <div className="grid-inner">
          {loading ? (
            <div style={{ padding: 20, color: "white", textAlign: "center" }}>Đang tải dữ liệu...</div>
          ) : fields.length === 0 ? (
            <div style={{ padding: 20, color: "white", textAlign: "center" }}>Không có dữ liệu sân cho ngày này.</div>
          ) : times.length === 0 ? (
            <div style={{ padding: 20, color: "white", textAlign: "center" }}>Không có khung giờ trống cho ngày này.</div>
          ) : (
            <>
              <div className="time-row">
                <div className="corner-cell"></div>
                {times.map((t) => (
                  <div key={t.start} className="time-cell">{t.label}</div>
                ))}
              </div>

              {fields.map((field) => (
                <div key={field.field_id} className="court-row">
                  <div className="court-name">{field.field_name}</div>

                  {times.map((time) => {
                    const slot = field.slots?.find(s => {
                      const sTime = s.start_time?.slice(0, 5) || '';
                      return sTime === time.start;
                    });

                    const key = `${field.field_id}-${time.start}`;
                    const isSelected = selectedSlots.some(s => s.key === key);

                    // If no slot for this time in this field
                    if (!slot) {
                      return (
                        <div 
                          key={key} 
                          className="slot empty-slot"
                          style={{ visibility: 'hidden' }}
                        ></div>
                      );
                    }

                    const isBooked = slot.status !== "available";
                    const isPast = isPastSlot(time.start);

                    let classNames = "slot";
                    if (isSelected) classNames += " selected";
                    if (isBooked) classNames += " booked";
                    if (isPast) classNames += " disabled";

                    return (
                      <div
                        key={key}
                        className={classNames}
                        title={`${slot.start_time} - ${slot.end_time}`}
                        onClick={() => {
                          if (!isBooked && !isPast) {
                            handleSelectSlot(field, slot);
                          }
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </>
          )}
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
          <h3>Bảng giá các sân</h3>

          <table className="price-table">
            <thead>
              <tr>
                <th>Sân</th>
                <th>Mức giá</th>
              </tr>
            </thead>

            <tbody>
              {pricesData.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ textAlign: "center" }}>Chưa có dữ liệu giá</td>
                </tr>
              ) : (
                pricesData.map((field) => (
                  <tr key={field.id}>
                    <td>{field.name}</td>
                    <td>{getPriceRange(field)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔥 FOOTER THANH TOÁN */}
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
          onClick={async () => {
            if (selectedSlots.length === 0) {
              return alert("Vui lòng chọn ít nhất 1 khung giờ!");
            }

            try {
              // 1. Chuẩn bị dữ liệu slots
              const slotsPayload = selectedSlots.map((item) => ({
                field_id: item.field.field_id,
                date: selectedDate,
                start_time: item.slot.start_time.slice(0, 5),
                end_time: item.slot.end_time.slice(0, 5),
                price: Number(item.slot.price)
              }));

              // 2. Kiểm tra trạng thái slot (gọi api /slots/status)
              const params = new URLSearchParams();
              slotsPayload.forEach((slot, index) => {
                params.append(`slots[${index}][field_id]`, slot.field_id);
                params.append(`slots[${index}][date]`, slot.date);
                params.append(`slots[${index}][start_time]`, slot.start_time);
                params.append(`slots[${index}][end_time]`, slot.end_time);
              });

              const statusRes = await axiosClient.get(`/slots/status?${params.toString()}`);
              
              if (statusRes.data?.success === false || statusRes.data?.locked_slots?.length > 0) {
                const lockedMsg = statusRes.data?.message || "Một số slot bạn chọn đã bị khóa. Vui lòng chọn lại.";
                return alert(`Thông báo: ${lockedMsg}`);
              }

              // 3. Giữ chỗ (gọi api /bookings/reserve)
              const reserveRes = await axiosClient.post("/bookings/reserve", {
                slots: slotsPayload
              });

              if (reserveRes.data?.success === false) {
                return alert(reserveRes.data?.message || "Lỗi khi giữ chỗ. Vui lòng thử lại.");
              }

              const data = reserveRes.data;
              const bookingId = data?.data?.id || data?.data?.booking_id || data?.booking?.id || data?.booking_id || data?.id;
              console.log("Chi tiết response đặt sân:", data, "=> Extracted bookingId:", bookingId);

              // 4. Nếu thành công, chuyển hướng sang trang Booking Confirm
              navigate("/booking-confirm", {
                state: {
                  bookingId,
                  fieldName: courtInfo?.name || courtData?.court_name || "Chưa rõ sân",
                  address: courtInfo?.address || "Chưa rõ địa chỉ",
                  phone: "0984229224", // Assuming hardcoded for now
                  date: selectedDate,
                  selectedSlots,
                  totalHours,
                  totalPrice,
                },
              });

            } catch (error) {
              console.error("Lỗi khi thanh toán:", error);
              if (error.response?.data?.message) {
                alert(`Lỗi: ${error.response.data.message}`);
              } else {
                alert("Đã có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại.");
              }
            }
          }}
        >
          🏃 Thanh toán ngay
        </button>
      </div>
    </div>
  );
}

export default BookingGrid;