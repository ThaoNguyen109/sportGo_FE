import {
  Box,
  Typography,
  Button,
  IconButton,
  Switch,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import {
  Add,
  Edit,
  Delete,
  Visibility,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import CourtScheduleEditor from "./CourtScheduleEditor";

const dayMap = {
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
  7: "Chủ nhật",
};

const defaultSchedule = {
  T2: [{ start: "06:00", end: "22:00", price: "200k" }],
  T3: [{ start: "06:00", end: "22:00", price: "200k" }],
  T4: [{ start: "06:00", end: "22:00", price: "200k" }],
  T5: [{ start: "06:00", end: "22:00", price: "200k" }],
  T6: [{ start: "06:00", end: "22:00", price: "200k" }],
  T7: [{ start: "06:00", end: "22:00", price: "200k" }],
  CN: [{ start: "08:00", end: "22:00", price: "250k" }],
};

// Mapping từ chữ viết tắt sang số hiệu ngày trong tuần (Database)
const dayMapping = {
  "T2": 1, "Thứ 2": 1,
  "T3": 2, "Thứ 3": 2,
  "T4": 3, "Thứ 4": 3,
  "T5": 4, "Thứ 5": 4,
  "T6": 5, "Thứ 6": 5,
  "T7": 6, "Thứ 7": 6,
  "CN": 7, "Chủ nhật": 7,
};

const VenueCourtsSection = ({
  venueId,
  courts,
  setCourts,
  showAddForm,
  setShowAddForm,
  newCourtName,
  setNewCourtName,
  addCourtRef,
}) => {

  const [loadingAddCourt, setLoadingAddCourt] = useState(false);
  const [newCourtSchedule, setNewCourtSchedule] = useState(defaultSchedule);
  const [currentEditSchedule, setCurrentEditSchedule] = useState(defaultSchedule);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditField, setCurrentEditField] = useState(null);
  const [currentEditName, setCurrentEditName] = useState("");
  const [currentEditActive, setCurrentEditActive] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

 
  /*
  ============================================
  HÀM VALIDATE LOGIC & PHÁT HIỆN KHOẢNG TRỐNG GIỜ
  ============================================
  */
  const validateAndCheckGaps = (schedule) => {
    let warningMessage = "";

    for (const [day, slots] of Object.entries(schedule)) {
      const dayName = dayMapping[day] ? dayMap[dayMapping[day]] : day;

      // 1. Kiểm tra thiếu giờ hoàn toàn (Không có slot nào)
      if (!slots || slots.length === 0) {
        alert(`Vui lòng thêm ít nhất một khung giờ hoạt động cho ${dayName}.`);
        return { valid: false, warning: "" };
      }

      // Sắp xếp các slot theo giờ bắt đầu tăng dần
      const sortedSlots = [...slots].sort((a, b) => a.start.localeCompare(b.start));

      // Thiết lập mốc bao phủ mong muốn (Ví dụ sân thường mở từ 06:00 đến 22:00)
      // Nếu bạn muốn check trống từ slot đầu tiên đến slot cuối cùng nhập vào, hãy đổi thành startExpected = sortedSlots[0].start
      let startExpected = "06:00"; 
      const endExpected = "22:00";
      const dayGaps = [];

      // Kiểm tra xem có trống đoạn đầu không (Ví dụ mở từ 08:00 thì trống 06:00 - 08:00)
      if (sortedSlots[0].start > startExpected) {
        dayGaps.push(`${startExpected} - ${sortedSlots[0].start}`);
      }

      for (let i = 0; i < sortedSlots.length; i++) {
        const current = sortedSlots[i];
        
        if (!current.start || !current.end) {
          alert(`Khung giờ của ${dayName} không được để trống thời gian.`);
          return { valid: false, warning: "" };
        }

        // 2. Kiểm tra sai logic dữ liệu nhập (Bắt đầu >= Kết thúc)
        if (current.start >= current.end) {
          alert(`Lỗi tại ${dayName}: Giờ bắt đầu (${current.start}) phải nhỏ hơn giờ kết thúc (${current.end}).`);
          return { valid: false, warning: "" };
        }

        // 3. Kiểm tra chèn / chồng chéo giờ (Overlap) -> Bắt buộc phải chặn
        if (i > 0) {
          const previous = sortedSlots[i - 1];
          if (current.start < previous.end) {
            alert(
              `Lỗi trùng lịch tại ${dayName}: Khung giờ [${current.start} - ${current.end}] đang bị chồng lấn với khung giờ [${previous.start} - ${previous.end}].`
            );
            return { valid: false, warning: "" };
          }
          
          // 4. Phát hiện khoảng trống ở GIỮA các khung giờ (Ví dụ: 07-10 và 12-23 -> trống 10-12)
          if (current.start > previous.end) {
            dayGaps.push(`${previous.end} - ${current.start}`);
          }
        }
      }

      // Kiểm tra xem có trống đoạn cuối không (Ví dụ kết thúc lúc 20:00 thì trống 20:00 - 22:00)
      const lastSlot = sortedSlots[sortedSlots.length - 1];
      if (lastSlot.end < endExpected) {
        dayGaps.push(`${lastSlot.end} - ${endExpected}`);
      }

      // Nếu có khoảng trống của ngày này, gom vào chuỗi cảnh báo chung
      if (dayGaps.length > 0) {
        warningMessage += `• ${dayName} đang trống các khung giờ: ${dayGaps.join(", ")}\n`;
      }
    }

    return { valid: true, warning: warningMessage };
  };
  /*
  ============================================
  FETCH DANH SÁCH SÂN CON
  ============================================
  */
  const fetchVenueFields = async () => {
    try {
      const res = await axiosClient.get(`/owner/courts/${venueId}`);
      console.log("Venue detail:", res.data);
      const venueData = res.data.data;

      const mappedCourts = (venueData.fields || []).map((field) => ({
        id: field.id,
        name: field.name,
        active: Boolean(field.is_active),
        prices: field.prices || [],
        operatingHours: {},
        priceByDay: {},
      }));

      setCourts(mappedCourts);
    } catch (error) {
      console.log("Lỗi lấy sân con:", error);
    }
  };

  useEffect(() => {
    if (venueId) {
      fetchVenueFields();
    }
  }, [venueId, setCourts]);

  // Khóa scroll body khi mở modal chỉnh sửa
  useEffect(() => {
    document.body.style.overflow = editModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [editModalOpen]);

  /*
  ============================================
  HÀM HELPER CONVERT DỮ LIỆU GIÁ
  ============================================
  */
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const str = priceStr.toString().toLowerCase();
    if (str.includes("k")) {
      return parseInt(str.replace("k", "")) * 1000;
    }
    return parseInt(str) || 0;
  };

  const normalizeTime = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return "06:00";
    const parts = raw.split(":").map((part) => part.trim());
    if (parts.length >= 2) {
      return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
    }
    return "06:00";
  };

  const scheduleToPayload = (schedule) => {
    const result = [];
    Object.entries(schedule).forEach(([day, slots]) => {
      slots.forEach((slot) => {
        const priceVal = parsePrice(slot.price);
        const startStr = normalizeTime(slot.start); // Định dạng "HH:MM"
        const endStr = normalizeTime(slot.end);     // Định dạng "HH:MM"

        // Lấy số giờ (Hour) của thời gian bắt đầu và kết thúc
        const startHour = parseInt(startStr.split(":")[0], 10);
        const endHour = parseInt(endStr.split(":")[0], 10);

        // Vòng lặp bẻ nhỏ từng block 1 tiếng
        for (let hour = startHour; hour < endHour; hour++) {
          const currentStart = `${String(hour).padStart(2, "0")}:00`;
          const currentEnd = `${String(hour + 1).padStart(2, "0")}:00`;

          result.push({
            day_of_week: dayMapping[day],
            start_time: currentStart,
            end_time: currentEnd,
            price: priceVal,
          });
        }
      });
    });
    return result;
  };

  const payloadToSchedule = (prices = []) => {
    const schedule = { T2: [], T3: [], T4: [], T5: [], T6: [], T7: [], CN: [] };

    // 1. Nhóm các row từ DB theo thứ (day_of_week)
    prices.forEach((item) => {
      const day = Object.keys(dayMapping).find(
        (key) => dayMapping[key] === item.day_of_week
      );
      if (!day) return;
      
      schedule[day].push({
        start: item.start_time.slice(0, 5),
        end: item.end_time.slice(0, 5),
        price: (item.price / 1000).toString() + "k", // Convert ngược 200000 -> "200k" cho đúng chuẩn format editor
      });
    });

    // 2. Tiến hành gộp các khung giờ liên tiếp có chung mức giá
    Object.keys(schedule).forEach((day) => {
      const slots = schedule[day];
      if (slots.length === 0) {
        schedule[day] = [{ start: "06:00", end: "22:00", price: "200k" }];
        return;
      }

      // Sắp xếp các slot theo thời gian bắt đầu tăng dần
      slots.sort((a, b) => a.start.localeCompare(b.start));

      const mergedSlots = [];
      let currentSlot = { ...slots[0] };

      for (let i = 1; i < slots.length; i++) {
        const nextSlot = slots[i];

        // Nếu giờ kết thúc của slot hiện tại trùng với giờ bắt đầu của slot tiếp theo
        // VÀ cả 2 trùng giá tiền -> Gộp lại bằng cách kéo dài giờ kết thúc
        if (currentSlot.end === nextSlot.start && currentSlot.price === nextSlot.price) {
          currentSlot.end = nextSlot.end;
        } else {
          // Ngược lại, đẩy slot hiện tại vào kết quả và chuyển sang slot tiếp theo
          mergedSlots.push(currentSlot);
          currentSlot = { ...nextSlot };
        }
      }
      mergedSlots.push(currentSlot); // Đẩy slot cuối cùng vào list

      schedule[day] = mergedSlots;
    });

    return schedule;
  };

  const groupPricesByDay = (prices = []) => {
    // 1. Khởi tạo object gom theo thứ (1-7)
    const grouped = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
    
    prices.forEach((item) => {
      if (grouped[item.day_of_week]) {
        grouped[item.day_of_week].push({ ...item });
      }
    });

    // 2. Chạy qua từng ngày để gộp các khung giờ liên tiếp có chung mức giá
    Object.keys(grouped).forEach((day) => {
      const slots = grouped[day];
      if (slots.length === 0) return;

      // Sắp xếp các slot tăng dần theo thời gian bắt đầu
      slots.sort((a, b) => a.start_time.localeCompare(b.start_time));

      const mergedSlots = [];
      let currentSlot = { ...slots[0] };

      for (let i = 1; i < slots.length; i++) {
        const nextSlot = slots[i];

        // Rút gọn chuỗi time lấy định dạng HH:mm để so sánh chính xác hơn
        const currentEnd = currentSlot.end_time.slice(0, 5);
        const nextStart = nextSlot.start_time.slice(0, 5);

        // ĐK gộp: Giờ kết thúc bằng giờ bắt đầu slot tiếp theo VÀ bằng giá tiền
        if (currentEnd === nextStart && Number(currentSlot.price) === Number(nextSlot.price)) {
          currentSlot.end_time = nextSlot.end_time; // Kéo dài giờ kết thúc
        } else {
          mergedSlots.push(currentSlot);
          currentSlot = { ...nextSlot };
        }
      }
      mergedSlots.push(currentSlot); // Đẩy slot cuối cùng vào mảng kết quả

      grouped[day] = mergedSlots;
    });

    return grouped;
  };

  /*
  ============================================
  LOGIC MODAL CHỈNH SỬA
  ============================================
  */
  const openEditModal = (court) => {
    setCurrentEditField(court);
    setCurrentEditName(court.name || "");
    setCurrentEditActive(Boolean(court.active));
    setCurrentEditSchedule(payloadToSchedule(court.prices));
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setCurrentEditField(null);
    setCurrentEditSchedule(JSON.parse(JSON.stringify(defaultSchedule)));
  };

  /*
  ============================================
  API ACTIONS: THÊM / SỬA / XÓA / ĐỔI TRẠNG THÁI
  ============================================
  */
  const handleAddCourt = async () => {
    try {
      if (!newCourtName.trim()) {
        alert("Vui lòng nhập tên sân");
        return;
      }

      // Chạy hàm kiểm tra logic & khoảng trống
      const checkResult = validateAndCheckGaps(newCourtSchedule);
      if (!checkResult.valid) return; // Nếu sai logic nghiêm trọng (chèn giờ/trống dữ liệu) thì chặn luôn.

      // Nếu có khoảng trống giờ hoạt động -> Cảnh báo nhắc nhở chủ sân
      if (checkResult.warning) {
        const proceed = window.confirm(
          `Cảnh báo khoảng trống giờ hoạt động (Khách sẽ không thể đặt sân vào các khung giờ này):\n\n${checkResult.warning}\nBạn có chắc chắn muốn tiếp tục tạo sân không?`
        );
        if (!proceed) return; // Chủ sân chọn Hủy để sửa lại
      }

      setLoadingAddCourt(true);
      const pricesForAPI = scheduleToPayload(newCourtSchedule);

      if (pricesForAPI.length === 0) {
        alert("Vui lòng nhập thông tin cho sân");
        setLoadingAddCourt(false);
        return;
      }

      const payload = {
        name: newCourtName.trim(),
        prices: pricesForAPI,
      };

      await axiosClient.post(`/owner/courts/${venueId}/fields`, payload);

      setNewCourtName("");
      setShowAddForm(false);
      setNewCourtSchedule(JSON.parse(JSON.stringify(defaultSchedule)));

      await fetchVenueFields();
      alert("Thêm sân thành công!");
    } catch (error) {
      console.error("Error adding court:", error);
      alert("Lỗi khi thêm sân.");
    } finally {
      setLoadingAddCourt(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!currentEditField) return;
    if (!currentEditName.trim()) {
      alert("Vui lòng nhập tên sân");
      return;
    }

    // Chạy hàm kiểm tra logic & khoảng trống khi sửa lịch
    const checkResult = validateAndCheckGaps(currentEditSchedule);
    if (!checkResult.valid) return;

    // Nếu có khoảng trống -> Hỏi ý kiến chủ sân
    if (checkResult.warning) {
      const proceed = window.confirm(
        `Cảnh báo khoảng trống giờ hoạt động (Khách sẽ không thể đặt sân vào các khung giờ này):\n\n${checkResult.warning}\nBạn có chắc chắn muốn cập nhật bảng giá không?`
      );
      if (!proceed) return;
    }

    setEditLoading(true);

    try {
      // 1. Cập nhật thông tin cơ bản của sân con (Tên, Trạng thái)
      await axiosClient.put(`/owner/fields/${currentEditField.id}`, {
        name: currentEditName.trim(),
        is_active: currentEditActive ? 1 : 0,
      });

      // 2. Chuyển đổi dữ liệu bảng giá theo từng giờ mới cấu hình
      const pricePayload = scheduleToPayload(currentEditSchedule);

      // 3. Gọi API cập nhật giá mới phân phối từng giờ
      const resPrice = await axiosClient.put(`/owner/prices/${currentEditField.id}`, {
        prices: pricePayload,
      });

      // 4. Đồng bộ state React trực tiếp để re-render giao diện mà không cần reload
      setCourts((prev) =>
        prev.map((court) =>
          court.id === currentEditField.id
            ? {
                ...court,
                name: currentEditName.trim(),
                active: currentEditActive,
                prices: resPrice.data?.data || pricePayload, 
              }
            : court
        )
      );

      closeEditModal();
      alert("Cập nhật thông tin và bảng giá thành công");
    } catch (error) {
      console.error("Lỗi cập nhật sân con:", error);
      const responseData = error.response?.data;
      const errorMessages = responseData?.errors
        ? Object.values(responseData.errors).flat().join(", ")
        : responseData?.message || responseData?.error;
      alert(`Lỗi: ${errorMessages || error.message || "Không thể cập nhật sân con."}`);
    } finally {
      setEditLoading(false);
    }
  };
  const handleToggleStatus = async (court) => {
    try {
      const updatedActive = !court.active;
      await axiosClient.put(`/owner/fields/${court.id}`, {
        name: court.name,
        is_active: updatedActive ? 1 : 0,
      });

      setCourts((prev) =>
        prev.map((c) => (c.id === court.id ? { ...c, active: updatedActive } : c))
      );
    } catch (error) {
      console.error("Lỗi đổi trạng thái sân:", error);
      alert("Không thể đổi trạng thái hoạt động lúc này.");
    }
  };

  const handleDeleteField = async (fieldId) => {
    if (!window.confirm("Bạn có chắc muốn xóa sân con này?")) return;
    setDeleteLoading(true);

    try {
      await axiosClient.delete(`/owner/fields/${fieldId}`);
      setCourts((prev) => prev.filter((court) => court.id !== fieldId));
      alert("Xóa sân con thành công");
    } catch (error) {
      console.error("Lỗi xóa sân con:", error);
      alert("Không thể xóa sân con.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: "white",
        borderRadius: 3,
        p: 3,
        mb: 3,
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
      }}
    >
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: 20, color: "#18643b" }}>
            Danh sách sân
          </Typography>
          <Typography sx={{ fontSize: 15, color: "gray" }}>
            Quản lý các sân cầu lông và thêm sân mới.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setShowAddForm((prev) => !prev);
            setTimeout(() => {
              addCourtRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 50);
          }}
          sx={{
            textTransform: "none",
            background: "#22c55e",
            "&:hover": { background: "#16a34a" },
          }}
        >
          {showAddForm ? "Đóng form" : "Thêm sân mới"}
        </Button>
      </Box>

      {/* FORM THÊM MỚI SÂN */}
      {showAddForm && (
        <Box
          ref={addCourtRef}
          sx={{
            mb: 3,
            p: 2,
            border: "1px solid #dbeafe",
            borderRadius: 2,
            background: "#eff6ff",
          }}
        >
          <Typography sx={{ fontWeight: 600, mb: 2 }}>Thông tin sân mới</Typography>
          <Box display="grid" gap={2}>
            <TextField
              label="Tên sân"
              value={newCourtName}
              onChange={(e) => setNewCourtName(e.target.value)}
              fullWidth
              size="small"
            />
            <Box>
              <Typography sx={{ fontWeight: 540, fontSize: 16, mb: 1, color: "#18643b", mt: 2 }}>
                Giờ hoạt động & Giá giờ theo ngày
              </Typography>
              <CourtScheduleEditor schedule={newCourtSchedule} setSchedule={setNewCourtSchedule} />
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <Button
                variant="contained"
                onClick={handleAddCourt}
                disabled={loadingAddCourt}
                sx={{
                  background: "#22c55e",
                  textTransform: "none",
                  "&:hover": { background: "#16a34a" },
                }}
              >
                {loadingAddCourt ? "Đang thêm..." : "Thêm sân"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowAddForm(false)}
                sx={{ textTransform: "none", color: "#475569", borderColor: "#cbd5e1" }}
              >
                Hủy
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* DANH SÁCH HIỂN THỊ CÁC SÂN HIỆN TẠI */}
      <Box display="grid" gap={2}>
        {courts.map((court, index) => {
          const groupedPrices = groupPricesByDay(court.prices);
          return (
            <Box
              key={`${court.id || index}`}
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 2,
                p: 2,
                background: "white",
                borderRadius: 2,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                border: "1px solid #f1f5f9",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#18643b" }}>
                  {court.name}
                </Typography>
                <Typography sx={{ fontSize: 14, color: "gray", mb: 1 }}>
                  Trạng thái: {court.active ? "Hoạt động" : "Ngưng hoạt động"}
                </Typography>

                {/* BẢNG HIỂN THỊ KHUNG GIỜ GIÁ THEO TỪNG GIỜ */}
                <Box sx={{ mt: 1 }}>
                  <TableContainer component={Paper} sx={{ boxShadow: "none", border: "1px solid #e2e8f0" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f8fafc" }}>
                          <TableCell sx={{ fontWeight: 600, color: "#18643b" }}>Ngày</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#18643b" }}>Giờ hoạt động</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#18643b" }}>Giá giờ</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(groupedPrices).flatMap(([day, slots]) =>
                          slots.length > 0
                            ? slots.map((slot, sIdx) => (
                                <TableRow key={`${day}-${sIdx}`}>
                                  <TableCell sx={{ fontWeight: 500 }}>
                                    {sIdx === 0 ? dayMap[day] : ""}
                                  </TableCell>
                                  <TableCell>
                                    {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                                  </TableCell>
                                  <TableCell>{Number(slot.price).toLocaleString()}đ</TableCell>
                                </TableRow>
                              ))
                            : null
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>

              {/* KHU VỰC THAO TÁC */}
              <Box display="flex" alignItems="center" gap={0.5}>
                <Switch
                  checked={court.active ?? false}
                  color="success"
                  onChange={() => handleToggleStatus(court)}
                />
                <IconButton size="small" color="primary">
                  <Visibility fontSize="small" />
                </IconButton>
                <IconButton size="small" color="info" onClick={() => openEditModal(court)}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteField(court.id)}
                  disabled={deleteLoading}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* MODAL EDIT SÂN CON & GIÁ THEO GIỜ */}
      {editModalOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(6px)",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
          onClick={closeEditModal}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: "100%",
              maxWidth: "900px",
              maxHeight: "90vh",
              overflowY: "auto",
              bgcolor: "white",
              borderRadius: 3,
              p: 3,
              boxShadow: "0 18px 60px rgba(15, 23, 42, 0.18)",
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 2, color: "#096737" }}>
              Chỉnh sửa sân con & Bảng giá giờ
            </Typography>

            <Box display="grid" gap={2} sx={{ mb: 2 }}>
              <TextField
                label="Tên sân"
                value={currentEditName}
                onChange={(e) => setCurrentEditName(e.target.value)}
                fullWidth
                size="small"
              />

              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography sx={{ fontWeight: 600, color: "#374151" }}>
                  Trạng thái hoạt động
                </Typography>
                <Switch
                  checked={currentEditActive}
                  onChange={(e) => setCurrentEditActive(e.target.checked)}
                  color="success"
                />
              </Box>
            </Box>

            <Box sx={{ mt: 1 }}>
              <Typography sx={{ fontWeight: 600, mb: 1, color: "#0b6439" }}>
                Cấu hình giờ hoạt động và giá giờ (Từng slot)
              </Typography>
              <CourtScheduleEditor schedule={currentEditSchedule} setSchedule={setCurrentEditSchedule} />
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleSaveEdit}
                disabled={editLoading}
                sx={{
                  background: "#22c55e",
                  textTransform: "none",
                  "&:hover": { background: "#16a34a" },
                }}
              >
                {editLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
              <Button
                variant="contained"
                onClick={closeEditModal}
                sx={{
                  background: "#dc2626",
                  textTransform: "none",
                  "&:hover": { background: "#b91c1c" },
                }}
              >
                Hủy
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default VenueCourtsSection;