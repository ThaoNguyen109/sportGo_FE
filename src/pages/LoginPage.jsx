import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff, Email } from "@mui/icons-material";

export default function Login() {
const [email, setEmail] = useState("thuy5@gmail.com");
const [password, setPassword] = useState("123456");

  //const [email, setEmail] = useState("");
  //const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  
  const navigate = useNavigate();

  // code giả login owner Dashboard
  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "thuy5@gmail.com" && password === "123456") {
      localStorage.setItem("token", "fake-token");

      navigate("/owner"); // 👈 chuyển sang owner dashboard
    } else {
      alert("Sai tài khoản hoặc mật khẩu");
    }
  };



  //code giả login user Dashboard
  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (email === "thuy5@gmail.com" && password === "123456") {
  //     localStorage.setItem("token", "fake-token");
  //     navigate("/dashboard");
  //   } else {
  //     alert("Sai tài khoản hoặc mật khẩu");
  //   }
  // };

  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const res = await axiosClient.post("/login", {
  //       email,
  //       password,
  //     });

  //     localStorage.setItem("token", res.data.token);

  //     navigate("/dashboard"); // ✅ dùng ở đây

  //   } catch (err) {
  //   alert(err.response?.data?.message || "Login failed");
  // }
  // };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        background: "linear-gradient(135deg, #6366f1, #22c55e)",
      }}
    >
      {/* LEFT INTRO */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          px: 8,
        }}
      >
        {/* 🔥 OVERLAY (xịn nhất) */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(6px)",
          }}
        />

        {/* CONTENT */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            color: "white",
            maxWidth: 480,
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              textShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            SportGo ⚽
          </Typography>

          <Typography
            mt={2}
            fontSize={18}
            sx={{
              opacity: 0.95,
              lineHeight: 1.6,
              textShadow: "0 2px 10px rgba(0,0,0,0.4)",
            }}
          >
            Nền tảng đặt sân thể thao hiện đại, giúp bạn tìm sân, đặt lịch
            và thanh toán nhanh chóng chỉ trong vài bước.
          </Typography>

          <Box mt={4}>
            <Typography sx={{ mb: 1 }}>
              ✔ Đặt sân nhanh chóng trong vài giây
            </Typography>
            <Typography sx={{ mb: 1 }}>
              ✔ Quản lý lịch đặt sân dễ dàng
            </Typography>
            <Typography>
              ✔ Thanh toán tiện lợi, an toàn
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* RIGHT LOGIN */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={12}
          sx={{
            p: 4,
            width: 360,
            borderRadius: 4,
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          }}
        >
          {/* Title */}
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                background: "linear-gradient(135deg, #6366f1, #22c55e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome Back
            </Typography>

            <Typography
              variant="body2"
              sx={{ mt: 1, color: "#6b7280" }}
            >
              Đăng nhập để tiếp tục 🚀
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Email của bạn"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "#6366f1" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />

            <TextField
              fullWidth
              placeholder="Mật khẩu"
              type={showPass ? "text" : "password"}
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(!showPass)}>
                      {showPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                py: 1.3,
                fontWeight: "bold",
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, #6366f1, #22c55e)",
                boxShadow: "0 8px 25px rgba(99,102,241,0.4)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  background:
                    "linear-gradient(135deg, #4f46e5, #16a34a)",
                },
              }}
            >
              ĐĂNG NHẬP
            </Button>
          </Box>

          {/* Footer */}
          <Typography mt={3} textAlign="center" fontSize={14}>
            Chưa có tài khoản?{" "}
            <span
              style={{
                color: "#6366f1",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Đăng ký
            </span>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}