import { Box, Typography, Button, IconButton, Switch, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";

const VenueCourtsSection = ({
  courts,
  setCourts,
  showAddForm,
  setShowAddForm,
  newCourtName,
  setNewCourtName,
  newCourtPrices,
  setNewCourtPrices,
  newCourtHours,
  setNewCourtHours,
  editCourtIndex,
  setEditCourtIndex,
  editCourtName,
  setEditCourtName,
  editCourtActive,
  setEditCourtActive,
  editCourtPrices,
  setEditCourtPrices,
  editCourtHours,
  setEditCourtHours,
  addCourtRef,
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
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: 20, color: "#18643b" }}>
            Danh sách sân
          </Typography>
          <Typography sx={{ fontSize: 15, color: "gray" }}>
            Quản lý các sân cầu lông và thêm sân mới.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setShowAddForm((prev) => !prev);
            setTimeout(() => {
              addCourtRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 50);
          }}
          sx={{
            textTransform: "none",
            background: "#22c55e",
            "&:hover": { background: "#16a34a" },
          }}
        >
          {showAddForm ? "Đóng form" : "Thêm sân mới"}
        </Button>
      </Box>

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
          <Typography sx={{ fontWeight: 600, mb: 2 }}>Thông tin sân mới</Typography>

          <Box display="grid" gap={2}>
            <TextField
              label="Tên sân"
              value={newCourtName}
              onChange={(e) => setNewCourtName(e.target.value)}
              fullWidth
              size="small"
            />

            <Box>
              <Typography sx={{ fontWeight: 540, fontSize: 16, mb: 1, color: "#18643b", mt: 3 }}>
                Giờ hoạt động & Giá giờ theo ngày
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "none", border: "1px solid #e2e8f0",mb: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: "#18643b" }}>Ngày</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#18643b" }}>Giờ hoạt động</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#18643b" }}>Giá giờ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(newCourtHours).map((day) => (
                      <TableRow key={day}>
                        <TableCell sx={{ fontWeight: 500 }}>{day}</TableCell>
                        <TableCell>
                          <TextField
                            value={newCourtHours[day]}
                            onChange={(e) =>
                              setNewCourtHours((prev) => ({
                                ...prev,
                                [day]: e.target.value,
                              }))
                            }
                            fullWidth
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={newCourtPrices[day]}
                            onChange={(e) =>
                              setNewCourtPrices((prev) => ({
                                ...prev,
                                [day]: e.target.value,
                              }))
                            }
                            fullWidth
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                onClick={() => {
                  if (!newCourtName.trim()) return;
                  setCourts((prev) => [
                    ...prev,
                    {
                      name: newCourtName.trim(),
                      active: true,
                      priceByDay: { ...newCourtPrices },
                      operatingHours: { ...newCourtHours },
                    },
                  ]);
                  setNewCourtName("");
                  setNewCourtPrices({
                    T2: "",
                    T3: "",
                    T4: "",
                    T5: "",
                    T6: "",
                    T7: "",
                    CN: "",
                  });
                  setNewCourtHours({
                    T2: "",
                    T3: "",
                    T4: "",
                    T5: "",
                    T6: "",
                    T7: "",
                    CN: "",
                  });
                  setShowAddForm(false);
                }}
                sx={{
                  textTransform: "none",
                  background: "#22c55e",
                  color: "white",
                  "&:hover": { background: "#16a34a" },
                }}
              >
                Lưu sân mới
              </Button>
              <Button
                variant="contained"
                onClick={() => setShowAddForm(false)}
                sx={{
                  textTransform: "none",
                  background: "#22c55e",
                  color: "white",
                  "&:hover": { background: "#16a34a" },
                }}
              >
                Hủy
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      <Box display="grid" gap={2}>
        {courts.map((court, index) => (
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
              <Typography sx={{fontSize : 16, fontWeight: 600, color: "#18643b" }}>{court.name}</Typography>
              <Typography sx={{ fontSize: 15, color: "gray", mb: 1 }}>
                Trạng thái: {court.active ? "Hoạt động" : "Ngưng hoạt động"}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "none", border: "1px solid #e2e8f0" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: "#18643b" }}>Ngày</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#18643b" }}>Giờ hoạt động</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#18643b" }}>Giá giờ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(court.operatingHours || {}).map(([day, hours]) => (
                        <TableRow key={day}>
                          <TableCell sx={{ fontWeight: 500 }}>{day}</TableCell>
                          <TableCell>{hours || "-"}</TableCell>
                          <TableCell>{court.priceByDay[day] || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Switch
                checked={court.active}
                onChange={() =>
                  setCourts((prev) =>
                    prev.map((item, i) => (i === index ? { ...item, active: !item.active } : item))
                  )
                }
                color="success"
              />
              <IconButton
                size="small"
                color="primary"
                sx={{
                  background: "white",
                  color: "#2563eb",
                  "&:hover": { background: "#f8fafc" },
                }}
              >
                <Visibility fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="info"
                onClick={() => {
                  setEditCourtIndex(index);
                  setEditCourtName(court.name);
                  setEditCourtActive(court.active);
                  setEditCourtPrices({ ...court.priceByDay });
                  setEditCourtHours({ ...court.operatingHours });
                }}
                sx={{
                  background: "white",
                  color: "#0ea5e9",
                  "&:hover": { background: "#f8fafc" },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => setCourts((prev) => prev.filter((_, i) => i !== index))}
                sx={{
                  background: "white",
                  color: "#dc2626",
                  "&:hover": { background: "#fef2f2" },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      {editCourtIndex !== null && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(15,23,42,0.45)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Box
            sx={{
              width: "min(100%, 900px)",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "white",
              borderRadius: 3,
              p: 3,
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            }}
          >
            <Typography fontWeight={700} fontSize={18} mb={2}>
              Chỉnh sửa thông tin sân
            </Typography>

            <Box sx={{ display: "grid", gap: 2 }}>
              <TextField
                label="Tên sân"
                value={editCourtName}
                onChange={(e) => setEditCourtName(e.target.value)}
                fullWidth
                size="small"
              />

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 600, color: "#18643b" }}>Trạng thái</Typography>
                <Switch
                  checked={editCourtActive}
                  onChange={(e) => setEditCourtActive(e.target.checked)}
                  color="success"
                />
                <Typography sx={{ fontSize: 13, color: "gray" }}>
                  {editCourtActive ? "Hoạt động" : "Ngưng hoạt động"}
                </Typography>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: 600, mb: 1, color: "#18643b" }}>Giờ hoạt động</Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 2 }}>
                    {Object.entries(editCourtHours).map(([day, value]) => (
                      <TextField
                        key={day}
                        label={day}
                        value={value}
                        onChange={(e) =>
                          setEditCourtHours((prev) => ({
                            ...prev,
                            [day]: e.target.value,
                          }))
                        }
                        fullWidth
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, mb: 1, color: "#18643b" }}>Giờ hoạt động</Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 2 }}>
                    {Object.entries(editCourtPrices).map(([day, value]) => (
                      <TextField
                        key={day}
                        label={day}
                        value={value}
                        onChange={(e) =>
                          setEditCourtPrices((prev) => ({
                            ...prev,
                            [day]: e.target.value,
                          }))
                        }
                        fullWidth
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setEditCourtIndex(null)}
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
                    setCourts((prev) =>
                      prev.map((court, i) =>
                        i === editCourtIndex
                          ? {
                              ...court,
                              name: editCourtName.trim(),
                              active: editCourtActive,
                              priceByDay: { ...editCourtPrices },
                              operatingHours: { ...editCourtHours },
                            }
                          : court
                      )
                    );
                    setEditCourtIndex(null);
                  }}
                  sx={{
                    textTransform: "none",
                    background: "#22c55e",
                    color: "white",
                    "&:hover": { background: "#16a34a" },
                  }}
                  disabled={!editCourtName.trim()}
                >
                  Lưu thay đổi
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default VenueCourtsSection;
