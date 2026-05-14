import { Box, Typography, Button } from "@mui/material";

const VenueInfoSection = ({ selectedVenue }) => {
  return (
    <>
      <Box
        sx={{
          background: "white",
          borderRadius: 3,
          p: 3,
          mb: 3,
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        }}
      >
        <Typography sx={{ fontWeight: 600, mb: 2 }}>Tổng quan địa điểm</Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2 }}>
          <Box
            sx={{
              background: "#e0ecff",
              p: 2,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography fontSize={22} fontWeight={700}>
              4
            </Typography>
            <Typography fontSize={13}>Danh mục dịch vụ</Typography>
          </Box>

          <Box
            sx={{
              background: "#e6f4ea",
              p: 2,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography fontSize={22} fontWeight={700}>
              32
            </Typography>
            <Typography fontSize={13}>Tổng dịch vụ</Typography>
          </Box>

          <Box
            sx={{
              background: "#f3e8ff",
              p: 2,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography fontSize={22} fontWeight={700}>
              6
            </Typography>
            <Typography fontSize={13}>Hình ảnh</Typography>
          </Box>

          <Box
            sx={{
              background: "#fef3c7",
              p: 2,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography fontSize={22} fontWeight={700}>
              5
            </Typography>
            <Typography fontSize={13}>Sân thể thao</Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          background: "white",
          borderRadius: 3,
          p: 3,
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography sx={{ fontWeight: 600 }}>Thông tin địa điểm</Typography>

          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              background: "#22c55e",
              color: "white",
              "&:hover": { background: "#16a34a" },
            }}
          >
            Chỉnh sửa thông tin
          </Button>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>Thông tin cơ bản</Typography>

            <Typography sx={{ fontSize: 13, color: "gray" }}>Tên địa điểm</Typography>
            <Box sx={{ background: "#f1f5f9", p: 1, borderRadius: 1, mb: 2 }}>
              {selectedVenue.name}
            </Box>

            <Typography sx={{ fontSize: 13, color: "gray" }}>Địa chỉ</Typography>
            <Box sx={{ background: "#f1f5f9", p: 1, borderRadius: 1 }}>
              {selectedVenue.address}
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>Thông tin thanh toán</Typography>

            <Typography sx={{ fontSize: 13, color: "gray" }}>Tên ngân hàng</Typography>
            <Box sx={{ background: "#f1f5f9", p: 1, borderRadius: 1, mb: 2 }}>
              {selectedVenue.bankName}
            </Box>

            <Typography sx={{ fontSize: 13, color: "gray" }}>Số tài khoản</Typography>
            <Box sx={{ background: "#f1f5f9", p: 1, borderRadius: 1 }}>
              {selectedVenue.bankAccount}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default VenueInfoSection;
