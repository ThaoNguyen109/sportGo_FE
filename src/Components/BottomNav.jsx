import { Box, Typography } from "@mui/material";

const BottomNav = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
        background: "#fff",
        p: 1,
        borderTop: "1px solid #ddd",
      }}
    >
      <Typography>Trang chủ</Typography>
      <Typography>Bản đồ</Typography>
      <Typography>Khám phá</Typography>
      <Typography>Tài khoản</Typography>
    </Box>
  );
};

export default BottomNav;
