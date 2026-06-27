import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Badge, ClickAwayListener } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DashboardIcon from "@mui/icons-material/Dashboard";
import axiosClient from "../api/axiosClient";

const OwnerHeader = () => {
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!localStorage.getItem("token")) {
        return;
      }

      setLoadingNotifications(true);

      try {
        const res = await axiosClient.get("/notifications");
        const page = res.data?.data;
        const items = Array.isArray(page?.data) ? page.data : [];
        setNotifications(items);
        setUnreadCount(items.filter((item) => !item.is_read).length);
      } catch (error) {
        console.error("Lỗi tải thông báo:", error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Box
      sx={{
        height: 70,
        width: "calc(100% - 300px)", // 👈 QUAN TRỌNG
        ml: "240px", // 👈 đẩy qua phải
        background: "linear-gradient(135deg, #2272af, #0eb64c)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        position: "fixed", // 👈 để cố định
        top: 0,
        right: 0,
        zIndex: 100,
      }}
    >
      {/* LEFT - BREADCRUMB */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexDirection: "row", // 👈 QUAN TRỌNG
        }}
      >
        <DashboardIcon sx={{ color: "#ffffff", fontSize: 20 }} />

        <Typography sx={{ color: "#ffffff", fontSize: 14 }}>
          Trang chủ
        </Typography>

        <Typography sx={{ color: "#ffffff" }}>/</Typography>

        <Typography sx={{ color: "#ffffff", fontSize: 14 }}>
          Bảng điều khiển
        </Typography>
      </Box>

      {/* RIGHT - NOTIFICATION */}
      <ClickAwayListener onClickAway={() => setOpenNotifications(false)}>
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <IconButton
            onClick={() => setOpenNotifications((prev) => !prev)}
            sx={{ color: "white" }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon sx={{ color: "white" }} />
            </Badge>
          </IconButton>

          {openNotifications && (
            <Box
              sx={{
                position: "absolute",
                top: 56,
                right: 0,
                width: 320,
                background: "white",
                borderRadius: 3,
                boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                color: "#111827",
                overflow: "hidden",
                zIndex: 150,
              }}
            >
              <Box sx={{ p: 2, borderBottom: "1px solid #e5e7eb" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ fontWeight: 700, color: "#111827" }}>Thông báo</Typography>
                  <Typography sx={{ fontSize: 12, color: "#000000" }}>Đã đánh dấu đã đọc</Typography>
                </Box>
              </Box>

              <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
                {loadingNotifications ? (
                  <Box sx={{ p: 2 }}>
                    <Typography sx={{ color: "#374151" }}>Đang tải thông báo...</Typography>
                  </Box>
                ) : notifications.length === 0 ? (
                  <Box sx={{ p: 2 }}>
                    <Typography sx={{ color: "#374151" }}>Không có thông báo nào.</Typography>
                  </Box>
                ) : (
                  notifications.map((item, index) => (
                    <Box
                      key={item.id || index}
                      sx={{
                        px: 2,
                        py: 2,
                        borderBottom: index !== notifications.length - 1 ? "1px solid #f1f5f9" : "none",
                        background: item.is_read ? "#ffffff" : "#f0fdf4",
                      }}
                    >
                      <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 0.5, color: "#111827" }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#525252", mb: 1 }}>
                        {item.content || item.description}
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>
                        {item.created_at ? new Date(item.created_at).toLocaleString() : item.time}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          )}
        </Box>
      </ClickAwayListener>
    </Box>
  );
};

export default OwnerHeader;
