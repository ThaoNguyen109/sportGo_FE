import { Box, Typography, Button, IconButton, TextField } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const VenueServicesSection = ({
  services,
  setServices,
  showAddService,
  setShowAddService,
  newService,
  setNewService,
}) => {
  return (
    <Box
      sx={{
        background: "white",
        borderRadius: 3,
        p: 3,
        mb: 3,
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography sx={{ fontWeight: 600 }}>Danh sách dịch vụ</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowAddService((prev) => !prev)}
          sx={{
            textTransform: "none",
            background: "#22c55e",
            "&:hover": { background: "#16a34a" },
          }}
        >
          {showAddService ? "Đóng form" : "Thêm dịch vụ"}
        </Button>
      </Box>

      {showAddService && (
        <Box
          sx={{
            mb: 3,
            p: 3,
            border: "1px solid #dbeafe",
            borderRadius: 2,
            background: "#eff6ff",
          }}
        >
          <Typography sx={{ fontWeight: 600, mb: 2 }}>Dịch vụ mới</Typography>
          <Box display="flex" gap={2}>
            <TextField
              label="Tên dịch vụ"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              fullWidth
              size="small"
            />
            <Button
              variant="contained"
              onClick={() => {
                if (newService.trim()) {
                  setServices((prev) => [...prev, newService.trim()]);
                  setNewService("");
                  setShowAddService(false);
                }
              }}
              sx={{
                textTransform: "none",
                background: "#22c55e",
                color: "white",
                "&:hover": { background: "#16a34a" },
                minWidth: 100,
              }}
            >
              Thêm
            </Button>
          </Box>
        </Box>
      )}

      <Box sx={{ display: "grid", gap: 2 }}>
        {services.map((service, index) => (
          <Box
            key={index}
            sx={{
              background: "#f8fafc",
              p: 2,
              borderRadius: 2,
              border: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>{service}</Typography>
            <IconButton
              size="small"
              color="error"
              onClick={() => setServices((prev) => prev.filter((_, i) => i !== index))}
              sx={{
                color: "#dc2626",
                "&:hover": { background: "#fef2f2" },
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default VenueServicesSection;
