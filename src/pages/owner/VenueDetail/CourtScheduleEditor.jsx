import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

import {
  Add,
  Delete,
} from "@mui/icons-material";

const dayMap = {
  T2: "Thứ 2",
  T3: "Thứ 3",
  T4: "Thứ 4",
  T5: "Thứ 5",
  T6: "Thứ 6",
  T7: "Thứ 7",
  CN: "Chủ nhật",
};

const defaultSlot = () => ({
  start: "06:00",
  end: "22:00",
  price: "200k",
});

export default function CourtScheduleEditor({
  schedule,
  setSchedule,
}) {

  const addSlot = (day) => {

    const last =
        schedule[day][schedule[day].length - 1];
        setSchedule(prev => ({
        ...prev,
        [day]: [
            ...prev[day],
            {
                start: last.end,
                end: last.end,
                price: last.price,

            }
        ]
        }));
    };

  const removeSlot = (day, index) => {

    setSchedule((prev) => ({

      ...prev,

      [day]: prev[day].filter((_, i) => i !== index),

    }));

  };

  const updateSlot = (
    day,
    index,
    key,
    value
  ) => {

    setSchedule((prev) => {

      const copy = { ...prev };

      copy[day] = [...copy[day]];

      copy[day][index] = {
        ...copy[day][index],
        [key]: value,
      };

      return copy;

    });

  };

  return (

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
              Khung giờ
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 600,
                color: "#18643b",
              }}
            >
              Giá
            </TableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {Object.entries(schedule).map(
            ([day, slots]) => (

              <TableRow key={day}>

                <TableCell
                  sx={{
                    width: 120,
                    fontWeight: 600,
                    verticalAlign: "top",
                  }}
                >
                  {dayMap[day]}
                </TableCell>

                <TableCell>

                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={1}
                  >

                    {slots.map((slot, index) => (

                      <Box
                        key={index}
                        display="flex"
                        gap={1}
                        alignItems="center"
                      >

                        <TextField
                          size="small"
                          format="HH:mm"
                          label="Bắt đầu"
                          value={slot.start}
                          onChange={(e) =>
                            updateSlot(
                              day,
                              index,
                              "start",
                              e.target.value
                            )
                          }
                          sx={{ width: 100,}}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{
                                lang: "vi",
                                step: 1800,
                            }}
                        />

                        <TextField
                          size="small"
                          format="HH:mm"
                          label="Kết thúc"
                          value={slot.end}
                          onChange={(e) =>
                            updateSlot(
                              day,
                              index,
                              "end",
                              e.target.value
                            )
                          }
                          sx={{ width: 100,}}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{
                                lang: "vi",
                                step: 1800,
                            }}
                        />

                      </Box>

                    ))}

                    <Button
                        variant="text"
                        disableElevation
                        startIcon={<Add />}
                        onClick={() => addSlot(day)}
                        sx={{
                            fontsize :"10px", 
                            background: "transparent !important",
                            backgroundColor: "transparent !important",
                            color: "#18643b !important",
                            boxShadow: "none !important",
                            border: "none",

                            "&:hover": {
                                background: "#f1f5f9 !important",
                                boxShadow: "none",
                            },
                        }}
                    >
                        Thêm khung giờ
                    </Button>

                  </Box>

                </TableCell>

                <TableCell>

                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={1}
                  >

                    {slots.map((slot, index) => (

                      <Box
                        key={index}
                        display="flex"
                        gap={1}
                        alignItems="center"
                      >

                        <TextField
                          size="small"
                          value={slot.price}
                          onChange={(e) =>
                            updateSlot(
                              day,
                              index,
                              "price",
                              e.target.value
                            )
                          }
                          sx={{
                            width: 120,
                          }}
                        />

                        <IconButton
                          color="error"
                          sx={{
                            fontsize :"10px", 
                            background: "transparent !important",
                            backgroundColor: "transparent !important",
                            color: "#e50d35 !important",
                            boxShadow: "none !important",
                            border: "none",

                            "&:hover": {
                                background: "#f1f5f9 !important",
                                boxShadow: "none",
                            },
                          }}
                          onClick={() =>
                            removeSlot(
                              day,
                              index
                            )
                          }
                          disabled={
                            slots.length === 1
                          }
                        >
                          <Delete />
                        </IconButton>

                      </Box>

                    ))}

                  </Box>

                </TableCell>

              </TableRow>

            )
          )}

        </TableBody>

      </Table>

    </TableContainer>

  );

}