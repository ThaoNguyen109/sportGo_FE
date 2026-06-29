import {
  Box,
  Typography,
  Button,
  IconButton,
  Switch,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import {
  Add,
  Edit,
  Delete,
  Visibility,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import CourtScheduleEditor from "./CourtScheduleEditor";

const dayMap = {
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
  7: "Chủ nhật",
};
const defaultSchedule = {
  T2: [
    {
      start: "06:00",
      end: "10:00",
      price: "200k",
    },
  ],
  T3: [
    {
      start: "06:00",
      end: "10:00",
      price: "200k",
    },
  ],
  T4: [
    {
      start: "06:00",
      end: "10:00",
      price: "200k",
    },
  ],
  T5: [
    {
      start: "06:00",
      end: "10:00",
      price: "200k",
    },
  ],
  T6: [
    {
      start: "06:00",
      end: "10:00",
      price: "200k",
    },
  ],
  T7: [
    {
      start: "06:00",
      end: "10:00",
      price: "200k",
    },
  ],
  CN: [
    {
      start: "08:00",
      end: "10:00",
      price: "250k",
    },
  ],
};

const VenueCourtsSection = ({
  venueId,

  courts,
  setCourts,

  showAddForm,
  setShowAddForm,

  newCourtName,
  setNewCourtName,

  editCourtIndex,
  setEditCourtIndex,

  editCourtName,
  setEditCourtName,

  editCourtActive,
  setEditCourtActive,

  addCourtRef,
}) => {

  /*
  ============================================
  FETCH DANH SÁCH SÂN CON
  ============================================
  */
  useEffect(() => {

    const fetchVenueFields = async () => {

      try {

        const res = await axiosClient.get(
          `/owner/courts/${venueId}`
        );

        console.log("Venue detail:", res.data);

        const venueData = res.data.data;

        const mappedCourts = (venueData.fields || []).map(
          (field) => ({

            id: field.id,

            name: field.name,

            active: Boolean(field.is_active),

            prices: field.prices || [],

            operatingHours: {},

            priceByDay: {},
          })
        );

        setCourts(mappedCourts);

      } catch (error) {

        console.log("Lỗi lấy sân con:", error);

      }
    };

    if (venueId) {
      fetchVenueFields();
    }

  }, [venueId, setCourts]);

  const [loadingAddCourt, setLoadingAddCourt] = useState(false);
  const [newCourtSchedule, setNewCourtSchedule] =
    useState(defaultSchedule);
  const [currentEditSchedule, setCurrentEditSchedule] =
    useState(defaultSchedule);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditField, setCurrentEditField] = useState(null);
  const [currentEditName, setCurrentEditName] = useState("");
  const [currentEditActive, setCurrentEditActive] = useState(true);
  useEffect(() => {
    if (editModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [editModalOpen]);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const dayOptions = [
    { day: 1, label: "Thứ 2" },
    { day: 2, label: "Thứ 3" },
    { day: 3, label: "Thứ 4" },
    { day: 4, label: "Thứ 5" },
    { day: 5, label: "Thứ 6" },
    { day: 6, label: "Thứ 7" },
    { day: 7, label: "Chủ nhật" },
  ];

  const openEditModal = (court) => {
    setCurrentEditField(court);
    setCurrentEditName(court.name || "");
    setCurrentEditActive(Boolean(court.active));

    setCurrentEditSchedule(
      payloadToSchedule(court.prices)
    );

    setCurrentEditSchedule(
        payloadToSchedule(court.prices)
    );
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setCurrentEditField(null);
    setCurrentEditSchedule(
        JSON.parse(
            JSON.stringify(defaultSchedule)
        )
    );
  };

  const parseHourMinute = (value) => {
    const raw = String(value || "").trim();
    if (!raw) {
      return { start_time: "06:00", end_time: "22:00" };
    }

    const parts = raw.split("-").map((part) => part.trim());
    const normalize = (time) => {
      const segments = time.split(":").map((segment) => segment.trim());
      const hour = segments[0] || "06";
      const minute = segments[1] || "00";
      return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
    };

    return {
      start_time: normalize(parts[0] || "06:00"),
      end_time: normalize(parts[1] || "22:00"),
    };
  };

  const buildPricePayload = () => {
    return scheduleToPayload(
      currentEditSchedule
    );
  };

  const handleSaveEdit = async () => {
    if (!currentEditField) {
      return;
    }

    if (!currentEditName.trim()) {
      alert("Vui lòng nhập tên sân");
      return;
    }

    setEditLoading(true);

    try {
      await axiosClient.put(
        `/owner/fields/${currentEditField.id}`,
        {
          name: currentEditName.trim(),
          is_active: currentEditActive,
        }
      );

      const payload = buildPricePayload();
      console.log(payload);

      const res = await axiosClient.put(
        `/owner/prices/${currentEditField.id}`,
        { prices: payload }
      );

      const updatedField = res.data.data;

      setCourts((prev) =>
        prev.map((court) =>
          court.id === updatedField.id
            ? {
                ...court,
                name: currentEditName.trim(),
                active: currentEditActive,
                prices: updatedField.prices || court.prices,
              }
            : court
        )
      );

      closeEditModal();
      alert("Cập nhật sân con thành công");
    } catch (error) {
      console.error("Lỗi cập nhật sân con:", error);
      const responseData = error.response?.data;
      const errorMessages = responseData?.errors
        ? Object.values(responseData.errors).flat().join(", ")
        : responseData?.message || responseData?.error;
      alert(`Lỗi: ${errorMessages || error.message || "Không thể cập nhật sân con."}`);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteField = async (fieldId) => {
    if (!window.confirm("Bạn có chắc muốn xóa sân con này?")) {
      return;
    }

    setDeleteLoading(fieldId);

    try {
      await axiosClient.delete(`/owner/fields/${fieldId}`);
      setCourts((prev) => prev.filter((court) => court.id !== fieldId));
      alert("Xóa sân con thành công");
    } catch (error) {
      console.error("Lỗi xóa sân con:", error);
      const responseData = error.response?.data;
      const errorMessages = responseData?.message || responseData?.error;
      alert(`Lỗi: ${errorMessages || error.message || "Không thể xóa sân con."}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Mapping from day abbreviations to day_of_week numbers
  const dayMapping = {
    "T2": 1, "Thứ 2": 1,
    "T3": 2, "Thứ 3": 2,
    "T4": 3, "Thứ 4": 3,
    "T5": 4, "Thứ 5": 4,
    "T6": 5, "Thứ 6": 5,
    "T7": 6, "Thứ 7": 6,
    "CN": 7, "Chủ nhật": 7,
  };

  // Parse price (handle "200k" or "200000" format)
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const str = priceStr.toString().toLowerCase();
    
    if (str.includes("k")) {
      return parseInt(str.replace("k", "")) * 1000;
    }
    return parseInt(str) || 0;
  };

  const normalizeTime = (value) => {
    const raw = String(value || "").trim();
    if (!raw) {
      return "06:00";
    }

    const parts = raw.split(":").map((part) => part.trim());
    if (parts.length >= 2) {
      return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
    }

    if (parts.length === 3) {
      return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}:${parts[2].padStart(2, "0")}`;
    }

    return "06:00";
  };
  const scheduleToPayload = (schedule) => {
    const result = [];
    Object.entries(schedule).forEach(
      ([day, slots]) => {
        slots.forEach((slot) => {
          result.push({
            day_of_week:
              dayMapping[day],
            start_time:
              normalizeTime(slot.start),
            end_time:
              normalizeTime(slot.end),
            price:
              parsePrice(slot.price),
          });
        });
      }
    );
    return result;
  };
  const payloadToSchedule = (prices = []) => {
    const schedule = {
      T2: [],
      T3: [],
      T4: [],
      T5: [],
      T6: [],
      T7: [],
      CN: [],
    };
    prices.forEach((item) => {
      const day = Object.keys(dayMapping).find(
        (key) =>
          dayMapping[key] === item.day_of_week
      );
      if (!day) return;
      schedule[day].push({
        start: item.start_time.slice(0, 5),
        end: item.end_time.slice(0, 5),
        price: item.price.toString(),
      });
    });
    Object.keys(schedule).forEach((day) => {
      if (schedule[day].length === 0) {
        schedule[day] = [
          {
            start: "06:00",
            end: "10:00",
            price: "",
          },
        ];
      }
    });
    return schedule;
  };
  const groupPricesByDay = (prices = []) => {
    const grouped = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
    };
    prices.forEach((item) => {
      grouped[item.day_of_week].push(item);
    });
    // Sắp xếp theo giờ bắt đầu
    Object.values(grouped).forEach((slots) => {
      slots.sort((a, b) =>
        a.start_time.localeCompare(b.start_time)
      );
    });
    return grouped;
  };

  // Parse time range (e.g., "06:00-22:00" or "06:00:00-22:00:00") to { start_time: "06:00:00", end_time: "22:00:00" }
  const parseTimeRange = (timeRange) => {
    if (!timeRange) {
      return { start_time: "06:00:00", end_time: "22:00:00" };
    }

    const parts = timeRange.split("-").map((part) => part.trim());
    return {
      start_time: normalizeTime(parts[0] || "06:00"),
      end_time: normalizeTime(parts[1] || "22:00"),
    };
  };

  // Handle add court submission
  const handleAddCourt = async () => {
    try {
      // Validation
      if (!newCourtName.trim()) {
        alert("Vui lòng nhập tên sân");
        return;
      }

      // Check if there are prices
      const hasAnyPrice = Object.values(
          newCourtSchedule
      ).some((slots)=>
          slots.some(
              slot=>slot.price.trim()!==""
          )
      );

      setLoadingAddCourt(true);

      // Convert format for API - include all 7 days
      const pricesForAPI = scheduleToPayload(
          newCourtSchedule
      );

      if (pricesForAPI.length === 0) {
        alert("Vui lòng nhập thông tin cho sân");
        setLoadingAddCourt(false);
        return;
      }

      const payload = {
        name: newCourtName.trim(),
        prices: pricesForAPI,
      };

      console.log("Add court payload:", payload);

      // Call API to add court
      const res = await axiosClient.post(
        `/owner/courts/${venueId}/fields`,
        payload
      );

      console.log("Court added successfully:", res.data);

      // Reset form
      setNewCourtName("");
      setShowAddForm(false);
      setNewCourtSchedule(
          JSON.parse(
              JSON.stringify(defaultSchedule)
          )
      );

      // Refresh courts list
      const courtRes = await axiosClient.get(`/owner/courts/${venueId}`);
      const venueData = courtRes.data.data;
      const mappedCourts = (venueData.fields || []).map((field) => ({
        id: field.id,
        name: field.name,
        active: field.is_active === 1,
        prices: field.prices || [],
        operatingHours: {},
        priceByDay: {},
      }));
      setCourts(mappedCourts);

      alert("Thêm sân thành công!");

    } catch (error) {
      console.error("Error adding court:", error);
      console.error("Server response:", error.response?.data);

      const responseData = error.response?.data;
      const status = error.response?.status;
      const errorMessages = responseData?.errors
        ? Object.values(responseData.errors).flat().join(", ")
        : responseData?.message || responseData?.error;
      const fallbackMessage = error.response?.statusText || error.message || "Lỗi khi thêm sân.";

      alert(`Lỗi (${status || "?"}): ${errorMessages || fallbackMessage}`);
    } finally {
      setLoadingAddCourt(false);
    }
  };

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
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 20,
              color: "#18643b",
            }}
          >
            Danh sách sân
          </Typography>

          <Typography
            sx={{
              fontSize: 15,
              color: "gray",
            }}
          >
            Quản lý các sân cầu lông và thêm sân mới.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setShowAddForm((prev) => !prev);

            setTimeout(() => {
              addCourtRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }, 50);
          }}
          sx={{
            textTransform: "none",
            background: "#22c55e",

            "&:hover": {
              background: "#16a34a",
            },
          }}>
          {showAddForm ? "Đóng form" : "Thêm sân mới"}
        </Button>
      </Box>

      {/* FORM THÊM */}
      {showAddForm && (
        <Box
          ref={addCourtRef}
          sx={{
            mb: 1,
            p: 2,
            border: "1px solid #dbeafe",
            borderRadius: 2,
            background: "#eff6ff",
          }}
        >
          <Typography sx={{ fontWeight: 600, mb: 2 }}>
            Thông tin sân mới
          </Typography>

          <Box display="grid" gap={2}>

            <TextField
              label="Tên sân"
              value={newCourtName}
              onChange={(e) =>
                setNewCourtName(e.target.value)
              }
              fullWidth
              size="small"
            />

            <Box>
              <Typography
                sx={{
                  fontWeight: 540,
                  fontSize: 16,
                  mb: 1,
                  color: "#18643b",
                  mt: 3,
                }}
              >
                Giờ hoạt động & Giá giờ theo ngày
              </Typography>
              <CourtScheduleEditor
                schedule={newCourtSchedule}
                setSchedule={setNewCourtSchedule}
              />
              
            </Box>

            {/* BUTTONS */}
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                sx={{
                  background: "#22c55e",
                  textTransform: "none",
                  "&:hover": {
                    background: "#16a34a",
                  },
                  "&:disabled": {
                    background: "#cbd5e1",
                    color: "#64748b",
                  },
                }}
                onClick={handleAddCourt}
                disabled={loadingAddCourt}
              >
                {loadingAddCourt ? "Đang thêm..." : "Thêm sân"}
              </Button>

              <Button
                variant="outlined"
                sx={{
                  background: "#d52929",
                  textTransform: "none",
                  borderColor: "#e2e8f0",
                  color: "#fdfeff",
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    color: "#fefefe",
                  },
                }}
                onClick={() => setShowAddForm(false)}
                disabled={loadingAddCourt}
              >
                Hủy
              </Button>
            </Box>

          </Box>
        </Box>
      )}

      {/* LIST COURTS */}
      <Box display="grid" gap={2}>

        {courts.map((court, index) => {
          const groupedPrices = groupPricesByDay(court.prices);
          return (

          <Box
            key={`${court.name}-${index}`}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 2,
              p: 2,
              background: "white",
              borderRadius: 2,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              mb: 1,
            }}
          >

            <Box sx={{ width: "100%", mb: 1 }}>

              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#18643b",
                }}
              >
                {court.name}
              </Typography>

              <Typography
                sx={{
                  fontSize: 15,
                  color: "gray",
                  mb: 1,
                }}
              >
                Trạng thái:{" "}
                {court.active
                  ? "Hoạt động"
                  : "Ngưng hoạt động"}
              </Typography>

              {/* TABLE GIÁ */}
              <Box sx={{ mt: 1 }}>

                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 2,
                    boxShadow: "none",
                    border: "1px solid #e2e8f0",
                  }}
                >

                  <Table size="small">

                    <TableHead>

                      <TableRow>

                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: "#18643b",
                          }}
                        >
                          Ngày
                        </TableCell>

                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: "#18643b",
                          }}
                        >
                          Giờ hoạt động
                        </TableCell>

                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: "#18643b",
                          }}
                        >
                          Giá giờ
                        </TableCell>

                      </TableRow>

                    </TableHead>

                    <TableBody>

  {Object.entries(groupedPrices).flatMap(([day, slots]) =>

    slots.map((slot, index) => (

      <TableRow key={`${day}-${index}`}>

        <TableCell sx={{ fontWeight: 500 }}>
          {index === 0 ? dayMap[day] : ""}
        </TableCell>

        <TableCell>
          {slot.start_time} - {slot.end_time}
        </TableCell>

        <TableCell>
          {Number(slot.price).toLocaleString()}đ
        </TableCell>

      </TableRow>

    ))

  )}

</TableBody>

                  </Table>

                </TableContainer>

              </Box>

            </Box>

            {/* ACTIONS */}
            <Box
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Switch
                checked={court.active ?? false}
                color="success"
              />
              <IconButton
                size="small"
                color="primary"
                sx={{
                  background: "white",
                  color: "#2563eb",
                  "&:hover": {
                    background: "#f8fafc",
                  },
                }}
              >
                <Visibility fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                color="info"
                sx={{
                  background: "white",
                  color: "#0ea5e9",
                  "&:hover": {
                    background: "#f8fafc",
                  },
                }}
                onClick={() => openEditModal(court)}
              >
                <Edit fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                color="error"
                sx={{
                  background: "white",
                  color: "#dc2626",
                  "&:hover": {
                    background: "#fef2f2",
                  },
                }}
                onClick={() => handleDeleteField(court.id)}
                disabled={deleteLoading === court.id}
              >
                <Delete fontSize="small" />
              </IconButton>

            </Box>

          </Box>
          );


        })}

      </Box>

      {editModalOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(6px)",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
          onClick={closeEditModal}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: "100%",
              maxWidth: "900px",

              maxHeight: "90vh",      // hoặc 80vh
              overflowY: "auto", 
              bgcolor: "white",
              borderRadius: 3,
          
              p: 3,
              boxShadow: "0 18px 60px rgba(15, 23, 42, 0.18)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 20,
                mb: 2,
                color:"#096737",
              }}
            >
              Chỉnh sửa sân con
            </Typography>

            <TextField
              label="Tên sân"
              value={currentEditName}
              onChange={(e) => setCurrentEditName(e.target.value)}
              fullWidth
              size="small"
            />

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mt: 1 }}
            >
              <Typography sx={{ fontWeight: 600, color: "#374151" }}>
                Trạng thái hoạt động
              </Typography>
              <Switch
                checked={currentEditActive}
                onChange={(e) => setCurrentEditActive(e.target.checked)}
                color="success"
              />
            </Box>

            <Box sx={{ mt: 1 }}>
              <Typography sx={{ fontWeight: 600, mb: 2, color: "#0b6439" }}>
                Giờ hoạt động và giá giờ
              </Typography>
              <CourtScheduleEditor
                  schedule={currentEditSchedule}
                  setSchedule={setCurrentEditSchedule}
              />
              
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                sx={{
                  background: "#22c55e",
                  textTransform: "none",
                  "&:hover": {
                    background: "#16a34a",
                  },
                }}
                onClick={handleSaveEdit}
                disabled={editLoading}
              >
                {editLoading ? "Đang lưu..." : "Lưu"}
              </Button>

              <Button
                variant="outlined"
                sx={{
                  fontsize :"10px", 
                  background: "#e71212 !important",
                  backgroundColor: "#e71212 !important",
                  color: "#f8f8f8 !important",
                  boxShadow: "none !important",
                  border: "none",

                    "&:hover": {
                      background: "#a10a0a !important",
                      boxShadow: "none",
                    },
                }}
                onClick={closeEditModal}
              >
                Hủy
              </Button>
            </Box>
          </Box>
        </Box>
      )}

    </Box>
  );
};

export default VenueCourtsSection;