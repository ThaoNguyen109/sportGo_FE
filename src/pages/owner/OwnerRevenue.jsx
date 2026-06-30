import OwnerLayout from "../../Layouts/OwnerLayout";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from "@mui/material";
import { Download } from "@mui/icons-material";
import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

const OwnerRevenue = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    thisMonthAmount: 0,
  });
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosClient.get("/owner/bookings");
        
        let allBookings = [];
        
        // 🔍 Xử lý các cấu trúc response khác nhau
        if (res?.data?.data?.data) {
          allBookings = res.data.data.data;
        } else if (res?.data?.data) {
          allBookings = res.data.data;
        } else if (Array.isArray(res?.data)) {
          allBookings = res.data;
        }
        
        setBookings(allBookings);
        console.log("BOOKINGS =", allBookings);

        // 🔥 Tính toán các thống kê
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let totalRevenue = 0;
        let pendingAmount = 0;
        let thisMonthAmount = 0;

        allBookings.forEach((booking) => {
          const amount = parseFloat(booking.total_price) || 0;

          // Tổng doanh thu (paid)
          if (booking.status === "paid") {
            totalRevenue += amount;

            // Tháng này (paid + trong tháng hiện tại)
            const bookingDate = new Date(booking.created_at);
            if (
              bookingDate.getMonth() === currentMonth &&
              bookingDate.getFullYear() === currentYear
            ) {
              thisMonthAmount += amount;
            }
          }

          // Đang chờ xử lý (pending)
          if (booking.status === "pending") {
            pendingAmount += amount;
          }
        });

        console.log("Stats:", { totalRevenue, pendingAmount, thisMonthAmount });

        setStats({
          totalRevenue,
          pendingAmount,
          thisMonthAmount,
        });
        setLoading(false);
      } catch (error) {
        console.log(error.response?.data);
        console.error(error);

        console.error("Lỗi lấy danh sách booking:", error);
        setLoading(false);
      }
    };
    Promise.all([
      fetchBookings(),
      fetchCourts(),
    ]);
  }, []);
  const fetchCourts = async () => {
    try {
      const res = await axiosClient.get("/owner/courts");
      let courtData = [];
      if (res.data.data.data) {
        courtData = res.data.data.data;
      } else {
        courtData = res.data.data;
      }
      setCourts(courtData);
    } catch (error) {
      console.log(error);
    }
  };
  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    })
      .format(numAmount)
      .replace("₫", "")
      .trim();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "pending":
        return "Chờ xử lý";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <OwnerLayout>
        <Box sx={{ mt: "70px", p: 2, textAlign: "center" }}>
          <Typography>Đang tải dữ liệu...</Typography>
        </Box>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
      <Box sx={{ mt: "60px", p: 2 }}>
        {/* HEADER */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#18643b", mb: 1 }}>
            Thanh toán
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Quản lý lịch sử thanh toán và các giao dịch của bạn
          </Typography>
        </Box>

        {/* STATS */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, mb: 3 }}>
          <Paper sx={{ p: 2, background: "linear-gradient(135deg, #18643b, #22c55e)", color: "white", borderRadius: 2 }}>
            <Typography sx={{ fontSize: 12, opacity: 0.9, color: "white" }}>
              Tổng doanh thu
            </Typography>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: "white" }}>
              {formatCurrency(stats.totalRevenue)} ₫
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "white", borderRadius: 2 }}>
            <Typography sx={{ fontSize: 12, opacity: 0.9, color: "white" }}>
              Đang chờ xử lý
            </Typography>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: "white" }}>
              {formatCurrency(stats.pendingAmount)} ₫
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, background: "linear-gradient(135deg, #3b82f6, #60a5fa)", color: "white", borderRadius: 2 }}>
            <Typography sx={{ fontSize: 12, opacity: 0.9, color: "white" }}>
              Tháng này
            </Typography>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: "white" }}>
              {formatCurrency(stats.thisMonthAmount)} ₫
            </Typography>
          </Paper>
        </Box>

        {/* Revenue TABLE */}
        <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#f8fafc" }}>
                  <TableCell sx={{ fontWeight: 700, color: "#18643b" }}>Ngày</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#18643b" }}>Địa điểm</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#18643b" }}>Số tiền</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#18643b" }}>Trạng thái</TableCell>
                  
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => {
                    const courtId = booking.details?.[0]?.field?.court_id;
                    const court = courts.find(c => c.id === courtId);
                    const venueName = court?.name  || "N/A";
                    const fieldName = booking.details?.[0]?.field?.name || "N/A";
                      return (
                      <TableRow key={booking.id} sx={{ "&:hover": { background: "#f8fafc" } }}>
                        <TableCell>{formatDate(booking.created_at)}</TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#18643b" }}>
                          {formatCurrency(booking.total_price)} ₫
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(booking.status)}
                            color={getStatusColor(booking.status)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: "center", py: 3 }}>
                      <Typography sx={{ color: "#999" }}>
                        Chưa có dữ liệu booking
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </OwnerLayout>
  );
};

export default OwnerRevenue;
