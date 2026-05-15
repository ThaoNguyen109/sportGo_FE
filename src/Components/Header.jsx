import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [shrink, setShrink] = useState(false);

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
  }, []);

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
        Sport Booking
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
        <Typography sx={{ fontSize: 18, color: "white", cursor: "pointer" }}>
          Bản đồ
        </Typography>
        <Typography sx={{ fontSize: 18, color: "white", cursor: "pointer" }}>
          Giới thiệu
        </Typography>
        <Typography sx={{ fontSize: 18, color: "white", cursor: "pointer" }}>
          Liên hệ
        </Typography>
        <Typography sx={{ fontSize: 18, color: "white", cursor: "pointer" }}>
          Tài khoản
        </Typography>
      </Box>

      {/* BUTTON */}
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
    </Box>
  );
};

export default Header;
