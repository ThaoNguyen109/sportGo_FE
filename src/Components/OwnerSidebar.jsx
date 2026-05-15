import { Box, Typography, Avatar, Button, TextField, Select, MenuItem, Switch } from "@mui/material";
import {
  Dashboard,
  Event,
  AccessTime,
  Payment,
  LocationOn,
  ExpandMore,
  Add,
  Close,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const OwnerSidebar = () => {
  const navigate = useNavigate();
  const [openVenue, setOpenVenue] = useState(true);
  const [showAddVenueModal, setShowAddVenueModal] = useState(false);
  const [newVenueName, setNewVenueName] = useState("");
  const [newVenueSportType, setNewVenueSportType] = useState("Cầu lông");
  const [newVenueMemberLimit, setNewVenueMemberLimit] = useState("");
  const [newVenueMinBookingTime, setNewVenueMinBookingTime] = useState("30");
  const [newVenueActive, setNewVenueActive] = useState(true);
  const [newVenueAddress, setNewVenueAddress] = useState("");
  const [newVenueHours, setNewVenueHours] = useState({
    T2: { open: "06:00", close: "22:00" },
    T3: { open: "06:00", close: "22:00" },
    T4: { open: "06:00", close: "22:00" },
    T5: { open: "06:00", close: "22:00" },
    T6: { open: "06:00", close: "22:00" },
    T7: { open: "06:00", close: "22:00" },
    CN: { open: "08:00", close: "20:00" },
  });

  const dayNames = {
    T2: "Thứ Hai",
    T3: "Thứ Ba",
    T4: "Thứ Tư",
    T5: "Thứ Năm",
    T6: "Thứ Sáu",
    T7: "Thứ Bảy",
    CN: "Chủ Nhật",
  };

  const [venues, setVenues] = useState([
    { name: "Sân cầu lông Cảnh Hồ", id: 103 },
    { name: "Đức Thảo", id: 104 },
    { name: "DINKZONE", id: 105 },
  ]);

  const menu = [
    {
      label: "Bảng điều khiển",
      icon: <Dashboard fontSize="small" />,
      path: "/owner",
    },
    {
      label: "Quản lý lịch đặt",
      icon: <Event fontSize="small" />,
      path: "/owner/bookings",
    },
    {
      label: "Quản lý khung giờ",
      icon: <AccessTime fontSize="small" />,
      path: "/owner/time",
    },
    {
      label: "Thanh toán",
      icon: <Payment fontSize="small" />,
      path: "/owner/payment",
    },
    {
      label: "Quản lý địa điểm",
      icon: <LocationOn fontSize="small" />,
      path: "/owner/venues",
    },
    
  ];

  return (
    <Box
      sx={{
        width: 220,
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        background: "#f8fafc",
        borderRight: "2px solid #e5e7eb",
        p: 2,
        zIndex: 1000,
      }}
    >
      {/* LOGO */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Typography
          sx={{
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: 1,
            color: "#18643b",
            borderBottom: "2px solid #18643b",
            pb: 1,
          }}
        >
          Sport Booking
        </Typography>
      </Box>

      {/* MENU */}
      <Box mt={5}>
        {menu.map((item, index) => {
          const isVenue = item.path === "/owner/venues";
          return (
            <Box key={index}>
              <Box
                onClick={() => {
                  if (isVenue) {
                    setOpenVenue((prev) => !prev);
                  } else {
                    navigate(item.path);
                  }
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1.5,
                  p: 1.2,
                  mt: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                  color: "#374151",

                  "&:hover": {
                    background: "#e6f4ea",
                    color: "#18643b",
                    fontWeight: 600,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  {item.icon}
                  <Typography fontSize={15}>{item.label}</Typography>
                </Box>
                {isVenue && (
                  <ExpandMore
                    sx={{
                      transform: openVenue ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "0.2s",
                    }}
                  />
                )}
              </Box>

              {isVenue && openVenue && (
                <Box sx={{ pl: 3, mt: 1 }}>
                  {venues.map((venue, index) => (
                    <Typography
                      key={index}
                      onClick={() => navigate(`/owner/venues/${venue.id}`)}
                      sx={{
                        fontSize: 14,
                        py: 0.5,
                        cursor: "pointer",
                        color: "#6b7280",

                        "&:hover": {
                          color: "#18643b",
                          fontWeight: 500,
                        },
                      }}
                    >
                      {venue.name}
                    </Typography>
                  ))}

                  <Box
                    onClick={() => setShowAddVenueModal(true)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 1,
                      cursor: "pointer",
                      color: "#2563eb",

                      "&:hover": {
                        fontWeight: 600,
                      },
                    }}
                  >
                    <Add fontSize="small" />
                    <Typography fontSize={14}>Thêm địa điểm</Typography>
                  </Box>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      {/* USER INFO */}
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: 0,
          width: 220,
          p: 2,
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          background: "#fff",
        }}
      >
        <Avatar sx={{ bgcolor: "#e5e7eb", color: "#111827" }}>
          TT
        </Avatar>

        <Box>
          <Typography fontSize={14} fontWeight={600}>
            Lãnh Thu Thủy
          </Typography>
          <Typography fontSize={12} color="gray">
            owner1@gmail.com
          </Typography>
        </Box>
      </Box>

      {/* ADD VENUE MODAL */}
      {showAddVenueModal && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",

            zIndex: 99999,

            background: "rgba(15,23,42,0.35)",

            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            overflowY: "auto",
            p: 2,
          }}
        >
          <Box
            sx={{
              width: "min(100%, 800px)",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "white",
              borderRadius: 3,
              p: 3,
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#18643b" }}>
                Thêm cụm sân mới
              </Typography>
              <Box
                onClick={() => setShowAddVenueModal(false)}
                sx={{ cursor: "pointer", p: 0.5 }}
              >
                <Close fontSize="small" />
              </Box>
            </Box>

            <Typography sx={{ fontSize: 15, color: "gray", mb: 0 }}>
              Điền thông tin cụm sân mới vào form dưới đây
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
              {/* LEFT - BASIC INFO */}
              <Box>
                <Typography fontWeight={600} mb={2} sx={{ color: "#18643b", display: "flex", gap: 0.5 }}>
                  <Box sx={{ color: "#2563eb" }}>●</Box>
                  Thông tin cơ bản
                </Typography>

                <Box sx={{ display: "grid", gap: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: 15, color: "gray", mb: 0.5 }}>
                      Tên cụm sân:
                    </Typography>
                    <TextField
                      placeholder="Nhập tên cụm sân"
                      value={newVenueName}
                      onChange={(e) => setNewVenueName(e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 15, color: "gray", mb: 0.5 }}>
                      Địa chỉ:
                    </Typography>
                    <TextField
                      placeholder="Nhập địa chỉ cụm sân"
                      value={newVenueAddress}
                      onChange={(e) => setNewVenueAddress(e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </Box>
                  

                  <Box>
                    <Typography sx={{ fontSize: 15, color: "gray", mb: 0.5 }}>
                      Giới hạn thành viên:
                    </Typography>
                    <TextField
                      value={newVenueMemberLimit}
                      onChange={(e) => setNewVenueMemberLimit(e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: 15, color: "gray", mb: 0.5 }}>
                      Thời gian đặt tối thiểu:
                    </Typography>
                    <TextField
                      value={newVenueMinBookingTime}
                      onChange={(e) => setNewVenueMinBookingTime(e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: 15, color: "gray", mb: 0.5 }}>
                      Trạng thái:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Switch
                        checked={newVenueActive}
                        onChange={(e) => setNewVenueActive(e.target.checked)}
                        color="success"
                      />
                      <Typography sx={{ fontSize: 15, color: "gray" }}>
                        {newVenueActive ? "Hoạt động" : "Ngưng hoạt động"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* RIGHT - OPENING HOURS */}
              <Box>
                <Typography fontWeight={600} mb={2} sx={{ color: "#18643b", display: "flex", gap: 0.5 }}>
                  <Box sx={{ color: "#2563eb" }}>●</Box>
                  Giờ mở cửa theo từng ngày
                </Typography>

                <Box sx={{ display: "grid", gap: 1 }}>
                  {Object.entries(newVenueHours).map(([day, hours]) => (
                    <Box key={day}>
                      <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 0, color: "#374151" }}>
                        {dayNames[day]}
                      </Typography>
                      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                        <Box>
                          <Typography sx={{ fontSize: 14, color: "gray", mb: 0.5 }}>
                            Giờ mở cửa
                          </Typography>
                          <TextField
                            type="time"
                            value={hours.open}
                            onChange={(e) =>
                              setNewVenueHours((prev) => ({
                                ...prev,
                                [day]: { ...prev[day], open: e.target.value },
                              }))
                            }
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: 14, color: "gray", mb: 0.5 }}>
                            Giờ đóng cửa
                          </Typography>
                          <TextField
                            type="time"
                            value={hours.close}
                            onChange={(e) =>
                              setNewVenueHours((prev) => ({
                                ...prev,
                                [day]: { ...prev[day], close: e.target.value },
                              }))
                            }
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setShowAddVenueModal(false)}
                sx={{
                  textTransform: "none",
                  background: "#22c55e",
                  color: "white",
                  "&:hover": { background: "#16a34a" },
                }}
              >
                Hủy
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  if (newVenueName.trim()) {
                    setVenues((prev) => [
                      ...prev,
                      {
                        name: newVenueName.trim(),
                        id: Date.now(),
                      },
                    ]);
                    setNewVenueName("");
                    setNewVenueSportType("Cầu lông");
                    setNewVenueMemberLimit("");
                    setNewVenueMinBookingTime("30");
                    setNewVenueActive(true);
                    setNewVenueHours({
                      T2: { open: "06:00", close: "22:00" },
                      T3: { open: "06:00", close: "22:00" },
                      T4: { open: "06:00", close: "22:00" },
                      T5: { open: "06:00", close: "22:00" },
                      T6: { open: "06:00", close: "22:00" },
                      T7: { open: "06:00", close: "22:00" },
                      CN: { open: "08:00", close: "20:00" },
                    });
                    setShowAddVenueModal(false);
                  }
                }}
                sx={{
                  textTransform: "none",
                  background: "#22c55e",
                  color: "white",
                  "&:hover": { background: "#16a34a" },
                }}
              >
                Tạo cụm sân
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default OwnerSidebar;