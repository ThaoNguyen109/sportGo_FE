import {
  Box,
  Button,
  Typography,
  IconButton,
  Badge,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";


const Header = () => {
  const navigate = useNavigate();
  const [shrink, setShrink] = useState(false);
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // 👇 bắt sự kiện scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShrink(true); // 👈 thu nhỏ
      } else {
        setShrink(false); // 👈 bình thường
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  },
    []);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <Box
      sx={{
        height: 60, // 👈 co lại
        transition: "all 0.3s ease", // 👈 animation mượt
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
          fontSize: shrink ? 24 : 26, // 👈 chữ nhỏ lại
          transition: "0.3s",
          color: "white",
          cursor: "pointer"
        }}
      >
        Sport Go
      </Typography>

      {/* MENU */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row", // 👈 ép ngang
          gap: 4,
          alignItems: "center",


        }}
      >
        <Typography
          component={Link}
          to="/dashboard"
          sx={{
            transition: "0.25s",
            "&:hover": {
              transform: "translateY(-4px)",
              color: "#dcfce7",
            },
            fontSize: 18,
            color: "white",
            cursor: "pointer",
            textDecoration: "none",
            position: "relative",
            zIndex: 10,
          }}
        >
          Trang chủ
        </Typography>
        <Typography sx={{
          fontSize: 18,
          color: "white",
          cursor: "pointer",
          transition: "0.25s",
          "&:hover": {
            transform: "translateY(-4px)",
            color: "#dcfce7",
          },
        }}>
          Bản đồ
        </Typography>
        <Typography sx={{
          fontSize: 18,
          color: "white",
          cursor: "pointer",
          transition: "0.25s",
          "&:hover": {
            transform: "translateY(-4px)",
            color: "#dcfce7",
          },
        }}>
          Giới thiệu
        </Typography>
        <Typography sx={{
          fontSize: 18,
          color: "white",
          cursor: "pointer",
          transition: "0.25s",
          "&:hover": {
            transform: "translateY(-4px)",
            color: "#dcfce7",
          },
        }}>
          Liên hệ
        </Typography>
        <Typography
          component={Link}
          to="/profile"
          sx={{
            transition: "0.25s",
            "&:hover": {
              transform: "translateY(-4px)",
              color: "#dcfce7",
            },
            fontSize: 18,
            color: "white",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          Tài khoản
        </Typography>
      </Box>

      {/* BUTTON */}
      {isLoggedIn ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1.5,
          }}
        >

          {/* Thông báo */}
          <Box sx={{ position: "relative" }}>
            <IconButton
              sx={{ color: "white" }}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Badge badgeContent={8} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {showNotifications && (
              <div
                className="notification-dropdown"
                style={{
                  zIndex: 9999,
                  position: "absolute",
                  top: "70px",
                  right: "20px",
                }}
              >
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
                    "& *": {
                      color: "#111827",
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderBottom: "1px solid #e5e7eb",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography fontWeight="bold" color="#111827">
                      Thông báo
                    </Typography>

                    <Typography fontSize={13} color="#166534" sx={{ cursor: "pointer" }}>
                      ✓ Đánh dấu đã đọc
                    </Typography>
                  </Box>

                  {[
                    {
                      title: "Booking đã hết hạn",
                      time: "17:23 12/01/2026",
                      desc: "Booking của bạn tại Đức Thảo vào ngày 2026-01-12 đã hết hạn do chưa thanh toán",
                    },
                    {
                      title: "Booking đã hoàn thành",
                      time: "17:17 12/01/2026",
                      desc: "Booking của bạn tại Đức Thảo vào ngày 2026-01-12 đã hoàn thành. Cảm ơn bạn đã sử dụng dịch vụ!",
                    },
                    {
                      title: "Booking đã được xác nhận",
                      time: "17:16 12/01/2026",
                      desc: "Booking của bạn tại Đức Thảo vào ngày 2026-01-12 đã được xác nhận",
                    },
                    {
                      title: "Booking đã hết hạn",
                      time: "10:40 12/01/2026",
                      desc: "Booking của bạn tại Sân cầu lông Cảnh Hồ vào ngày 2026-01-12 đã hết hạn do chưa thanh toán",
                    },
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        borderBottom: "1px solid #f1f5f9",
                        cursor: "pointer",
                        "&:hover": {
                          background: "#f0fdf4",
                        },
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" gap={1}>
                        <Typography fontWeight="bold" fontSize={14} color="#111827">
                          {item.title}
                        </Typography>

                        <Typography fontSize={12} color="#64748b" whiteSpace="nowrap">
                          {item.time}
                        </Typography>
                      </Box>

                      <Typography fontSize={13} color="#64748b" mt={0.7}>
                        {item.desc}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </div>
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

          <Button
            variant="contained"
            sx={{
              height: shrink ? 30 : 34,
              transition: "0.3s",
              textTransform: "none",
              mr: 2,
              background: "#2272af !important",
              "&:hover": {
                background: "#0b5ea8 !important",
              },
              fontSize: 15,
            }}
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </Button>

          <Button
            variant="outlined"
            sx={{
              height: shrink ? 30 : 34,
              color: "white",
              borderColor: "white",
              transition: "0.3s",
              textTransform: "none",
              background: "#2272af !important",
              "&:hover": {
                background: "#0b5ea8 !important",
              },
              fontSize: 15,
            }}
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </Button>

        </Box>
      )}
    </Box>
  );
};

export default Header;
