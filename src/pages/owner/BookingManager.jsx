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

const BookingManager = () => {
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

      {/* ===== FILTER ===== */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: 3,
          border: "1px solid #18643b97",
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          overflow: "hidden",
          mb: 3,
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            background: "#eaf7ef",
            p: 2.5,
            borderBottom: "1px solid #49c08097",
          }}
        >
          <Typography sx={{ fontWeight: 600, color: "#166534" }}>
            Bộ lọc & Tìm kiếm
          </Typography>
          <Typography fontSize={13} color="#6b7280">
            Sử dụng các bộ lọc để tìm kiếm booking nhanh hơn
          </Typography>
        </Box>

        {/* FORM */}
        <Box
            sx={{
                p: 3,
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 2,
            }}
            >
            {/* SEARCH */}
            <Box>
                <Typography fontSize={13} mb={0.5} color="#374151">
                Tìm kiếm
                </Typography>
                <TextField
                size="small"
                fullWidth
                placeholder="Tên khách hàng, SĐT"
                />
            </Box>

            {/* STATUS */}
            <Box>
                <Typography fontSize={13} mb={0.5} color="#374151">
                Trạng thái
                </Typography>
                <TextField select size="small" fullWidth defaultValue="">
                <MenuItem value="">Tất cả trạng thái</MenuItem>
                <MenuItem value="pending">Chờ xác nhận</MenuItem>
                </TextField>
            </Box>

            {/* LOCATION */}
            <Box>
                <Typography fontSize={13} mb={0.5} color="#374151">
                Địa điểm
                </Typography>
                <TextField select size="small" fullWidth defaultValue="">
                <MenuItem value="">Tất cả địa điểm</MenuItem>
                </TextField>
            </Box>

            {/* FIELD GROUP */}
            <Box>
                <Typography fontSize={13} mb={0.5} color="#374151">
                Cụm sân
                </Typography>
                <TextField select size="small" fullWidth defaultValue="">
                <MenuItem value="">Tất cả cụm sân</MenuItem>
                </TextField>
            </Box>

            {/* DATE */}
            <Box>
                <Typography fontSize={13} mb={0.5} color="#374151">
                Ngày đặt
                </Typography>
                <TextField size="small" type="date" fullWidth />
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
            Tổng số 17 booking
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
          {[1, 2, 3].map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 2fr",
                py: 2,
                borderBottom: "1px solid #f1f5f9",
                alignItems: "center",
                transition: "0.2s",

                "&:hover": {
                  background: "#f9fafb",
                },
              }}
            >
              {/* KHÁCH */}
              <Box>
                <Typography fontSize={14} fontWeight={500}>
                  Hoàng Tuấn Anh 1
                </Typography>
                <Typography fontSize={12} color="#6b7280">
                  0984292224
                </Typography>
              </Box>

              {/* ĐỊA ĐIỂM */}
              <Box>
                <Typography fontSize={14}>
                  Sân cầu lông Cảnh Hồ
                </Typography>
                <Typography fontSize={12} color="#6b7280">
                  Field #1
                </Typography>
              </Box>

              <Box>17/01/2026</Box>

              <Box sx={{ color: "#22c55e", fontWeight: 600 }}>
                99.000đ
              </Box>

              {/* STATUS */}
              <Box>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.4,
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 500,
                    display: "inline-block",
                    background:
                      index === 0
                        ? "#22c55e"
                        : index === 1
                        ? "#6b7280"
                        : "#3b82f6",
                    color: "white",
                  }}
                >
                  {index === 0
                    ? "Chờ xác nhận"
                    : index === 1
                    ? "Quá hạn thanh toán"
                    : "Hoàn thành"}
                </Box>
              </Box>

              {/* ACTION */}
              <Box display="flex" gap={1}>
                {index === 0 && (
                  <>
                    <Button
                      size="small"
                      sx={{
                        background: "#22c55e",
                        color: "white",
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": { background: "#16a34a" },
                      }}
                    >
                      ✓ Xác nhận
                    </Button>

                    <Button
                      size="small"
                      sx={{
                        background: "#ef4444",
                        color: "white",
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": { background: "#dc2626" },
                      }}
                    >
                      ✕ Hủy
                    </Button>
                  </>
                )}

                <Button
                size="small"
                variant="contained"
                sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    borderColor: "#22c55e",
                    color: "#22c55e",
                    backgroundColor: "#fff !important", // 👈 thêm dòng này

                    "&:hover": {
                    backgroundColor: "#ecfdf5",
                    },
                }}
                >
                Chi tiết
                </Button>

              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </OwnerLayout>
  );
};

export default BookingManager;
