import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OwnerLayout from "../../Layouts/OwnerLayout";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
} from "@mui/material";
import { Search, CalendarMonth } from "@mui/icons-material";
import axiosClient from "../../api/axiosClient";

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [totalBookings, setTotalBookings] = useState(0);
  const [courts, setCourts] = useState([]);
  const [fields, setFields] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [courtFilter, setCourtFilter] = useState("");
  const [fieldFilter, setFieldFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const navigate = useNavigate();

  const getOwnerCourts = async () => {
    try {
      const res = await axiosClient.get("/owner/courts");
      const data = res.data?.data;
      const courtItems = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setCourts(courtItems);
      setFields(
        courtItems.flatMap((court) =>
          court.fields?.map((field) => ({
            ...field,
            court_name: court.name,
            court_id: court.id,
          })) || []
        )
      );
    } catch (error) {
      console.error("Lỗi lấy danh sách sân owner:", error);
    }
  };

  const buildBookingParams = (override = {}) => {
    const params = {};
    const search = override.search ?? searchQuery;
    const status = override.status ?? statusFilter;
    const court = override.court_id ?? courtFilter;
    const field = override.field_id ?? fieldFilter;
    const date = override.date ?? dateFilter;

    if (search) params.search = search;
    if (status) params.status = status;
    if (court) params.court_id = court;
    if (field) params.field_id = field;
    if (date) params.date = date;

    return params;
  };

  const fetchBookings = async (overrideFilters = {}) => {
    setLoadingBookings(true);

    try {
      const res = await axiosClient.get("/owner/bookings", {
        params: buildBookingParams(overrideFilters),
      });
      console.log("Owner bookings response:", res.data);

      const rootData = res.data?.data;
      const items = Array.isArray(rootData)
        ? rootData
        : Array.isArray(rootData?.data)
        ? rootData.data
        : [];

      setBookings(items);
      setTotalBookings(rootData?.total ?? items.length);
    } catch (error) {
      console.error("Lỗi lấy booking owner:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getOwnerCourts();
      fetchBookings();
    }
  }, []);

  const handleApplyFilters = () => {
    fetchBookings();
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setCourtFilter("");
    setFieldFilter("");
    setDateFilter("");
    fetchBookings({});
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return { background: "#fde68a", color: "#92400e" };
      case "paid":
        return { background: "#d1fae5", color: "#166534" };
      case "cancelled":
        return { background: "#fee2e2", color: "#991b1b" };
      case "completed":
        return { background: "#bfdbfe", color: "#1e40af" };
      default:
        return { background: "#e5e7eb", color: "#374151" };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "paid":
        return "Đã thanh toán";
      case "cancelled":
        return "Đã hủy";
      case "completed":
        return "Hoàn thành";
      default:
        return "Khác";
    }
  };

  const getFieldSummary = (details) => {
    const fields = details
      ?.map((detail) => detail.field?.name)
      .filter(Boolean);

    return fields?.length > 0 ? fields.join(", ") : "-";
  };

  const getCourtSummary = (details) => {
    const courts = details
      ?.map((detail) => detail.field?.court?.name)
      .filter(Boolean);

    return courts?.length > 0 ? Array.from(new Set(courts)).join(", ") : "-";
  };

  const handleSelectCourt = (court) => {
    if (!court?.id) return;
    navigate(`/owner/booking-detail?court_id=${court.id}`, {
      state: { courtName: court.name },
    });
  };

  return (
    <OwnerLayout>
      {/* ===== HEADER ===== */}
      <Box sx={{ mt: 8, mb: 3 }}>
        <Typography sx={{ fontSize: 26, fontWeight: 700, color: "#18643b" }}>
          Quản lý đặt sân
        </Typography>
        <Typography sx={{ fontSize: 14, color: "gray" }}>
          Danh sách các booking từ khách hàng
        </Typography>
      </Box>

      {/* ===== FIELD GROUP FILTER (CHỌN CỤM SÂN xem booking) ===== */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: 3,
          border: "1px solid #18643b97",
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          overflow: "hidden",
          mb: 2,
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            background: "#eaf7ef",
            p: 2,
            borderBottom: "1px solid #49c08097",
          }}
        >
          <Typography sx={{ fontWeight: 600, color: "#166534" }}>
            Chi tiết booking theo khung giờ 
          </Typography>
          <Typography fontSize={13} sx={{ color: "#000000" }}>
            Chọn cụm sân muốn xem chi tiết booking
          </Typography>
        </Box>
        
        <Box
            sx={{
                p: 3,
                display: "grid",
                gridTemplateColumns: "repeat(9, 1fr)",
                gap: 2,
                left: 0,
            }}
            >
            
            {courts.length === 0 ? (
              <Typography color="gray" sx={{ gridColumn: "1 / -1" }}>
                Chưa có cụm sân để hiển thị.
              </Typography>
            ) : (
              courts.map((court) => {
                return (
                  <Button
                    key={court.id}
                    variant="outlined"
                    onClick={() => handleSelectCourt(court)}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      py: 1.5,
                      background: "#eaf7ef",
                      borderColor: "#779b85",
                      color: "#166534",
                      '&:hover': {
                        background: "#d4f0de",
                      },
                    }}
                  >
                    {court.name}
                  </Button>
                );
              })
            )}
        </Box>
      </Box>

      {/* ===== FILTER ===== */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: 3,
          border: "1px solid #18643b97",
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          overflow: "hidden",
          mb: 2,
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            background: "#eaf7ef",
            p: 2,
            borderBottom: "1px solid #49c08097",
          }}
        >
          <Typography sx={{ fontWeight: 600, color: "#166534" }}>
            Bộ lọc & Tìm kiếm
          </Typography>
          <Typography fontSize={13} sx={{ color: "#000000" }}>
            Sử dụng các bộ lọc để tìm kiếm booking nhanh hơn
          </Typography>
        </Box>


        
        {/* FORM */}
        <Box
            sx={{
                p: 2,
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 2,
            }}
            >
            {/* SEARCH */}
            <Box>
                <Typography fontSize={13} mb={0.5} sx={{ color: "#000000" }}>
                Tìm kiếm
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Tên khách hàng, SĐT"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "#6b7280" }} />
                      </InputAdornment>
                    ),
                  }}
                />
            </Box>

            {/* STATUS */}
            <Box>
                <Typography fontSize={13} mb={0.5} sx={{ color: "#000000" }}>
                Trạng thái
                </Typography>
                <TextField
                  select
                  size="small"
                  fullWidth
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">Tất cả trạng thái</MenuItem>
                  <MenuItem value="pending">Chờ xác nhận</MenuItem>
                  <MenuItem value="paid">Đã thanh toán</MenuItem>
                  <MenuItem value="cancelled">Đã hủy</MenuItem>
                  <MenuItem value="completed">Hoàn thành</MenuItem>
                </TextField>
            </Box>

            {/* LOCATION */}
            <Box>
                <Typography fontSize={13} mb={0.5} sx={{ color: "#000000" }}>
                Địa điểm
                </Typography>
                <TextField
                  select
                  size="small"
                  fullWidth
                  value={courtFilter}
                  onChange={(e) => setCourtFilter(e.target.value)}
                >
                  <MenuItem value="">Tất cả địa điểm</MenuItem>
                  {courts.map((court) => (
                    <MenuItem key={court.id} value={String(court.id)}>
                      {court.name}
                    </MenuItem>
                  ))}
                </TextField>
            </Box>

            {/* FIELD GROUP */}
            <Box>
                <Typography fontSize={13} mb={0.5} sx={{ color: "#000000" }}>
                Cụm sân
                </Typography>
                <TextField
                  select
                  size="small"
                  fullWidth
                  value={fieldFilter}
                  onChange={(e) => setFieldFilter(e.target.value)}
                >
                  <MenuItem value="">Tất cả sân con</MenuItem>
                  {fields.map((field) => (
                    <MenuItem key={field.id} value={String(field.id)}>
                      {field.name} - {field.court_name}
                    </MenuItem>
                  ))}
                </TextField>
            </Box>

            {/* DATE */}
            <Box>
                <Typography fontSize={13} mb={0.5} sx={{ color: "#000000" }}>
                Ngày đặt
                </Typography>
                <TextField
                  size="small"
                  type="date"
                  fullWidth
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarMonth sx={{ color: "#6b7280" }} />
                      </InputAdornment>
                    ),
                  }}
                />
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 2,
              }}
            >
              <Button
                size="medium"
                variant="outlined"
                onClick={handleApplyFilters}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  background: '#eaf7ef',
                  borderColor: '#779b85',
                  color: '#166534',
                  '&:hover': { background: '#d4f0de' },
                }}
              >
                Tìm kiếm
              </Button>

              <Button
                size="medium"
                variant="outlined"
                onClick={handleResetFilters}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  background: '#eaf7ef',
                  borderColor: '#779b85',
                  color: '#166534',
                  '&:hover': { background: '#d4f0de' },
                }}
              >
                Đặt lại
              </Button>
            </Box>
        </Box>
      </Box>

      {/* ===== BOOKING LIST (2 BOX LỒNG NHAU) ===== */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: 3,
          border: "1px solid #18643b97",
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {/* HEADER CHA */}
        <Box
          sx={{
            background: "#eaf7ef",
            p: 2.5,
            borderBottom: "1px solid #49c08097",
          }}
        >
          <Typography  sx={{ color: "#166534", fontWeight: 600 }}>
            Danh sách booking
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#6b7280" }}>
            Tổng số {totalBookings} booking
          </Typography>
        </Box>

        {/* BOX CON (TABLE) */}
        <Box sx={{ p: 3 }}>
          {/* TABLE HEADER */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 2fr",
              fontWeight: 600,
              fontSize: 14,
              color: "#166534",
              pb: 1.5,
              borderBottom: "1px solid #dcfce7",
            }}
          >
            <Box>Khách hàng</Box>
            <Box>Địa điểm</Box>
            <Box>Ngày đặt</Box>
            <Box>Tổng tiền</Box>
            <Box>Trạng thái</Box>
            <Box>Thao tác</Box>
          </Box>

          {/* ROW */}
          {loadingBookings ? (
            <Box sx={{ p: 4 }}>
              <Typography>Đang tải booking...</Typography>
            </Box>
          ) : bookings.length === 0 ? (
            <Box sx={{ p: 4 }}>
              <Typography>Chưa có booking nào.</Typography>
            </Box>
          ) : (
            bookings.map((booking, index) => {
              const courtId = booking.details?.[0]?.field?.court_id;
              const court = courts.find(c => c.id === courtId);
              const venueName = court?.name  || "N/A";
              const fieldName = booking.details?.[0]?.field?.name || "N/A";
              const bookingDate = booking.details?.[0]?.booking_date
                ? new Date(booking.details[0].booking_date).toLocaleDateString("vi-VN")
                : "-";
              const totalPrice = booking.total_price
                ? Number(booking.total_price).toLocaleString("vi-VN") + "đ"
                : "-";

              return (
                <Box
                  key={booking.id || index}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 2fr",
                    py: 2,
                    borderBottom: "1px solid #f1f5f9",
                    alignItems: "center",
                    transition: "0.2s",
                    background: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    "&:hover": {
                      background: "#f1f5f9",
                    },
                  }}
                >
                  <Box>
                    <Typography fontSize={14} fontWeight={500}sx={{ color: "#000000" }}>
                      {booking.user?.name || "Khách hàng"}
                    </Typography>
                    <Typography fontSize={12} sx={{ color: "#000000" }}>
                      {booking.user?.email || "-"}
                    </Typography>
                  </Box>

                  <Box>
                    
                    <Typography fontWeight={600} sx={{ color: "#000000" }}>
                      {venueName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ color: "#000000"}}
                    >
                      {fieldName}
                    </Typography>
                                          
                  </Box>

                  <Box>{bookingDate}</Box>

                  <Box sx={{ color: "#22c55e", fontWeight: 600 }}>
                    {totalPrice}
                  </Box>

                  <Box>
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.4,
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 500,
                        display: "inline-block",
                        ...getStatusStyle(booking.status),
                      }}
                    >
                      {getStatusLabel(booking.status)}
                    </Box>
                  </Box>

                  <Box display="flex" gap={1}>
                    <Button
                      key={courtId}
                      onClick={() => handleSelectCourt(court)}
                      size="small"
                      variant="outlined"
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        background: '#eaf7ef',
                        borderColor: '#779b85',
                        color: '#166534',
                        '&:hover': { background: '#d4f0de' },
                              
                      }}
                    >
                      Chi tiết
                    </Button>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </Box>
    </OwnerLayout>
  );
};

export default BookingManager;
