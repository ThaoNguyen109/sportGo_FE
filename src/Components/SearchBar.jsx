import { Box, TextField, Paper, Typography } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ setKeyword }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        position: "sticky",
        top: 90,
        zIndex: 1000,
        px: 2,
        mt: -3,
        alight: "center",
        display: "flex",
        justifyContent: "center",

      }}
    >
      <Paper
        elevation={6}
        sx={{
          borderRadius: 5,
          width: "94%",
          minWidth: 250,
          display: "flex",          // 👈 THÊM
          alignItems: "center",     // 👈 THÊM
          overflow: "hidden",       // 👈 THÊM
          background: "white",
        }}
      >
        {/* 🔍 LEFT - SEARCH */}
        <Box sx={{ flex: 1, p: 0.5 }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm sân..."
            variant="outlined"
            size="small"
            onChange={(e) => setKeyword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 5,
                fontSize: 14,
                height: 36,
                color: "#18643b",
                borderColor: "#18643b",

              },
            }}
          />
        </Box>

        {/* 👉 LINE NGĂN */}
        <Box
          sx={{
            width: "1px",
            height: 30,
            background: "#cccccc",
          }}
        />

        {/* 👉 RIGHT - MENU */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            px: 1,
          }}
        >
          <Box sx={{ color: "#18643b", display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}>
            <MapIcon fontSize="small" />
            <Typography fontSize={13} sx={{ color: "#18643b" }}>
              Bản đồ
            </Typography>
          </Box>

          <Box
            onClick={() => navigate("/booking/history")}
            sx={{
              color: "#18643b",
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
          >
            <CheckBoxIcon fontSize="small" />

            <Typography fontSize={13} sx={{ color: "#18643b" }}>
              Sân đã đặt
            </Typography>
          </Box>

          <Box sx={{ color: "#18643b", display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}>
            <FavoriteIcon fontSize="small" />
            <Typography fontSize={13} sx={{ color: "#18643b" }}>
              Yêu thích
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SearchBar;
