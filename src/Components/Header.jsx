import {
  Box,
  Button,
  Typography,
  IconButton,
  Badge,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axiosClient from "../api/axiosClient";

const Header = () => {
  const navigate = useNavigate();
  const [shrink, setShrink] = useState(false);
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // State cho thông báo
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);

  // 👇 1. Bắt sự kiện scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShrink(true);
      } else {
        setShrink(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 👇 2. Tự động gọi API lấy thông báo nếu người dùng đã đăng nhập
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

  // 👇 3. Hàm gọi API lấy danh sách thông báo
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/notifications");
      
      // Bóc tách dữ liệu phân trang giống code mẫu Admin của bạn
      const paginationData = res.data?.data || {};
      const notificationsArray = Array.isArray(paginationData?.data) 
        ? paginationData.data 
        : [];
        
      setNotifications(notificationsArray);
    } catch (error) {
      console.error("❌ Lỗi lấy thông báo:", error.response?.data || error.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // 👇 4. Hàm xử lý đánh dấu đã đọc
  const handleMarkAsRead = async (id) => {
    try {
      await axiosClient.post(`/notifications/${id}/mark-as-read`);

      // Cập nhật local state ngay lập tức mà không cần gọi lại API
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_read: true } : item
        )
      );
    } catch (error) {
      console.error("Lỗi đánh dấu đã đọc:", error);
    }
  };

  // 👇 5. Đếm số lượng thông báo chưa đọc
  const unreadCount = notifications.filter((item) => !item.is_read).length;

  // Định dạng thời gian nhanh
  const formatTime = (date) => {
    return new Date(date).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Box
      sx={{
        height: 60,
        transition: "all 0.3s ease",
        background: "linear-gradient(135deg, #2272af, #0eb94d)",
        color: "white",
        px: 4,
        p: 4,
        pr: 6,
        pl: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* LOGO */}
      <Typography
        fontWeight="bold"
        sx={{
          fontSize: shrink ? 24 : 26,
          transition: "0.3s",
          color: "white",
          cursor: "pointer"
        }}
      >
        Sport Go
      </Typography>

      {/* MENU */}
      <Box sx={{ display: "flex", flexDirection: "row", gap: 4, alignItems: "center" }}>
        <Typography component={Link} to="/dashboard" sx={{ transition: "0.25s", "&:hover": { transform: "translateY(-4px)", color: "#dcfce7" }, fontSize: 18, color: "white", cursor: "pointer", textDecoration: "none", position: "relative", zIndex: 10 }}>
          Trang chủ
        </Typography>
        <Typography sx={{ fontSize: 18, color: "white", cursor: "pointer", transition: "0.25s", "&:hover": { transform: "translateY(-4px)", color: "#dcfce7" } }}>
          Bản đồ
        </Typography>
        <Typography sx={{ fontSize: 18, color: "white", cursor: "pointer", transition: "0.25s", "&:hover": { transform: "translateY(-4px)", color: "#dcfce7" } }}>
          Giới thiệu
        </Typography>
        <Typography sx={{ fontSize: 18, color: "white", cursor: "pointer", transition: "0.25s", "&:hover": { transform: "translateY(-4px)", color: "#dcfce7" } }}>
          Liên hệ
        </Typography>
        <Typography component={Link} to="/profile" sx={{ transition: "0.25s", "&:hover": { transform: "translateY(-4px)", color: "#dcfce7" }, fontSize: 18, color: "white", textDecoration: "none", cursor: "pointer" }}>
          Tài khoản
        </Typography>
      </Box>

      {/* BUTTON ACTION & NOTIFICATION */}
      {isLoggedIn ? (
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5 }}>

          {/* Khối thông báo */}
          <Box sx={{ position: "relative" }}>
            <IconButton
              sx={{ color: "white" }}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              {/* Thay số 8 cứng bằng biến unreadCount động 👇 */}
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {showNotifications && (
              <Box
                sx={{
                  position: "absolute",
                  top: 50,
                  right: 0,
                  width: 360,
                  maxHeight: 430,
                  overflowY: "auto",
                  background: "white",
                  borderRadius: "14px",
                  boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
                  zIndex: 9999,
                  border: "1px solid #e5e7eb",
                  color: "#111827",
                  "& *": { color: "#111827" },
                }}
              >
                {/* Header Dropdown */}
                <Box sx={{ p: 2, borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography fontWeight="bold" color="#111827">
                    Thông báo
                  </Typography>
                  {unreadCount > 0 && (
                    <Typography 
                      fontSize={13} 
                      color="#166534" 
                      sx={{ cursor: "pointer", fontWeight: '500' }}
                      onClick={() => {
                        // Tính năng mở rộng: Đọc hết (Nếu backend có hỗ trợ endpoint này)
                        notifications.forEach(n => !n.is_read && handleMarkAsRead(n.id));
                      }}
                    >
                      ✓ Đánh dấu tất cả đã đọc
                    </Typography>
                  )}
                </Box>

                {/* List thông báo */}
                <Box>
                  {loading ? (
                    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <CircularProgress size={24} color="success" />
                      <Typography sx={{ ml: 1, fontSize: 14 }}>Đang tải...</Typography>
                    </Box>
                  ) : notifications.length > 0 ? (
                    notifications.map((item) => (
                      <Box
                        key={item.id}
                        onClick={() => !item.is_read && handleMarkAsRead(item.id)}
                        sx={{
                          p: 2,
                          borderBottom: "1px solid #f1f5f9",
                          cursor: item.is_read ? "default" : "pointer",
                          // Đổi màu nền nếu chưa đọc (unread) giống file Admin
                          background: item.is_read ? "transparent" : "#f0fdf4", 
                          transition: "0.2s",
                          "&:hover": {
                            background: item.is_read ? "#f8fafc" : "#e6fbf0",
                          },
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
                          <Typography 
                            fontWeight={item.is_read ? "normal" : "bold"} 
                            fontSize={14} 
                            color="#111827"
                          >
                            {item.title}
                          </Typography>

                          <Typography fontSize={11} color="#64748b" whiteSpace="nowrap">
                            {formatTime(item.created_at)}
                          </Typography>
                        </Box>

                        <Typography fontSize={13} color="#475569" mt={0.7}>
                          {item.content || item.desc}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography fontSize={14} color="#64748b">Không có thông báo nào</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>

          {/* Avatar */}
          <Avatar
            onClick={() => navigate("/profile")}
            sx={{
              width: shrink ? 34 : 40,
              height: shrink ? 34 : 40,
              bgcolor: "#f4a261",
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            T
          </Avatar>

        </Box>
      ) : (
        <Box display="flex" gap={2}>
          <Button variant="contained" sx={{ height: shrink ? 30 : 34, transition: "0.3s", textTransform: "none", mr: 2, background: "#2272af !important", "&:hover": { background: "#0b5ea8 !important" }, fontSize: 15 }} onClick={() => navigate("/login")}>
            Đăng nhập
          </Button>
          <Button variant="outlined" sx={{ height: shrink ? 30 : 34, color: "white", borderColor: "white", transition: "0.3s", textTransform: "none", background: "#2272af !important", "&:hover": { background: "#0b5ea8 !important" }, fontSize: 15 }} onClick={() => navigate("/register")}>
            Đăng ký
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Header;