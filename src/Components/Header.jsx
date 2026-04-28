import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
    
const Header = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: 90,
        background: "#16a34a",
        color: "white",
        p: 2,
        position: "sticky",
        top: 0,
        bottom: 20,
        zIndex: 1000,
      }}
    >
      <Typography>Thứ hai, 27/04/2026</Typography>

      <Box mt={1} display="flex" gap={2}  >
        <Button variant="contained" sx={{ mr: 1, ml: 2, borderRadius: 2, textTransform: "none",}} onClick={() => navigate("/login")}>
          Đăng nhập
        </Button>

        <Button variant="outlined" sx={{ color: "white", borderColor: "white", borderRadius: 2, textTransform: "none" }}>
          Đăng kí
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
