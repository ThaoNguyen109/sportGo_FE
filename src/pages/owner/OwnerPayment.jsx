import { useState } from "react";
import {
  Box, Button, Typography, Paper, Grid, Avatar, Divider, TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import AddCardIcon from "@mui/icons-material/AddCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import QrCode2Icon from "@mui/icons-material/QrCode2";

import OwnerLayout from "../../Layouts/OwnerLayout";
import { useEffect } from "react";
import axiosClient from "../../api/axiosClient";

const OwnerPayment = () => {
  const [openForm, setOpenForm] = useState(false);

  // Sau này lấy từ API
  const [bankInfo, setBankInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [statistics, setStatistics] = useState({
    totalReceived: 0,
    totalPayouts: 0,
  });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [formData, setFormData] = useState({
    bank_name: "",
    account_number: "",
    account_name: "",
    qr_image: null,
    });

    const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    });
    };

    const handleFile = (e) => {
    setFormData({
        ...formData,
        qr_image: e.target.files[0],
    });
    };

    const handleSave = async () => {
        try {
            const body = new FormData();

            body.append("bank_name", formData.bank_name);
            body.append("account_number", formData.account_number);
            body.append("account_name", formData.account_name);

            if (formData.qr_image) {
            body.append("qr_image", formData.qr_image);
            }

            const response = await axiosClient.post(
            "/owner/bank-account",
            body,
            {
                headers: {
                "Content-Type": "multipart/form-data",
                },
            }
            );

            console.log(response.data);

            // Cập nhật lại thông tin tài khoản trên giao diện
            setBankInfo(response.data.data);

            setOpenForm(false);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                if (errors?.qr_image) {
                alert("Ảnh mã QR không được lớn hơn 2MB.");
                return;
                }
                if (errors?.bank_name) {
                alert("Vui lòng nhập tên ngân hàng.");
                return;
                }
                if (errors?.account_number) {
                alert("Vui lòng nhập số tài khoản.");
                return;
                }
                if (errors?.account_name) {
                alert("Vui lòng nhập tên chủ tài khoản.");
                return;
                }
            }
            alert("Có lỗi xảy ra, vui lòng thử lại.");
            }
        };

  const formatMoney = (money) =>
    new Intl.NumberFormat("vi-VN").format(money) + " đ";
  // =======================
    // Lấy tài khoản ngân hàng
    // =======================

    const fetchBankAccount = async () => {
        try {
            const res = await axiosClient.get("/owner/bank-account");

            console.log("GET bank-account:", res.data);

            if (res.data.data) {
                setBankInfo(res.data.data);
            } else {
                setBankInfo(null);
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Lấy lịch sử payout
    const fetchPayouts = async () => {
      try {
        const res = await axiosClient.get("/owner/payouts");
        const payouts = res.data.data.data || [];
        setPaymentHistory(payouts);

        // Chỉ tính các khoản đã thanh toán
        const paidPayouts = payouts.filter(
          (item) => item.status === "paid"
        );

        const totalReceived = paidPayouts.reduce(
          (sum, item) => sum + Number(item.net_amount),
          0
        );
        setStatistics({
          totalReceived,
          totalPayouts: paidPayouts.length,
        });
      } catch (err) {
        console.log(err);
        setPaymentHistory([]);
        setStatistics({
          totalReceived: 0,
          totalPayouts: 0,
        });
      }
    };

    // Load dữ liệu
    const loadData = async () => {
        setLoading(true);

        await Promise.all([
            fetchBankAccount(),
            fetchPayouts(),
        ]);

        setLoading(false);
        };

        useEffect(() => {
            
        loadData();
        }, []);
    const getStatusColor = (status) => {
      switch (status) {
        case "paid":
          return "success"; // xanh
        case "pending":
          return "warning"; // vàng
        case "cancel":
        case "cancelled":
          return "error"; // đỏ
        default:
          return "default";
      }
    };
    const getStatusText = (status) => {
      switch (status) {
        case "paid":
          return "Đã thanh toán";
        case "pending":
          return "Đang chờ";
        case "cancel":
        case "cancelled":
          return "Đã hủy";
        default:
          return status;
      }
    };

  return (
    <OwnerLayout>
      <Box
        sx={{
          mt: "35px",
          background: "#f8fafc",
          minHeight: "100vh",
          p: 4,
        }}
      >
        {/* ================= HEADER ================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, fontSize: 28, color: "#075324" }}
            >
              Thanh toán
            </Typography>

            <Typography
              sx={{
                color: "#141415",
                mt: .5,
              }}
            >
              Quản lý tài khoản nhận tiền và lịch sử thanh toán.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddCardIcon />}
            onClick={() => {
                if (bankInfo) {
                    setFormData({
                    bank_name:
                        bankInfo.bank_name || "",

                    account_number:
                        bankInfo.account_number || "",

                    account_name:
                        bankInfo.account_name || "",
                    qr_image: null,

                    });

                }

                setOpenForm(true);

                }}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              px: 3,
              py: 1.2,
              background:
                "linear-gradient(90deg,#0ea5e9,#2563eb)",
            }}
          >
            {bankInfo
              ? "Cập nhật tài khoản"
              : "Đăng ký tài khoản"}
          </Button>
        </Box>

        {/* ================= THỐNG KÊ ================= */}

        <Grid
          container
          spacing={3}
          sx={{ mb: 4 }}
        >
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                p: 3,
                background:
                  "linear-gradient(135deg,#22c55e,#16a34a)",
                color: "white",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
              >
                <Box>
                  <Typography sx={{ color: "white" }}>
                    Tổng tiền đã nhận
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    mt={1}
                  >
                    {formatMoney(
                      statistics.totalReceived
                    )}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: "rgba(255,255,255,.2)",
                  }}
                >
                  <PaymentsIcon />
                </Avatar>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                p: 3,
                background:
                  "linear-gradient(135deg,#3b82f6,#2563eb)",
                color: "white",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
              >
                <Box>
                  <Typography sx={{ color: "white" }}>
                    Số lần nhận tiền
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                    mt={1}
                  >
                    {statistics.totalPayouts}
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: "rgba(255,255,255,.2)",
                  }}
                >
                  <ReceiptLongIcon />
                </Avatar>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* ================= TÀI KHOẢN NHẬN TIỀN ================= */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              background:
                "linear-gradient(135deg,#0ea5e9,#2563eb)",
              color: "white",
              p: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "white", fontSize: 20, fontWeight:600 }}
            >
              Tài khoản nhận tiền
            </Typography>

            <Typography
              sx={{
                opacity: .9,
                mt: .5,
                color: "white",
              }}
            >
              Đây là tài khoản admin sẽ chuyển tiền doanh thu cho bạn.
            </Typography>
          </Box>

          <Box sx={{ p: 4, background: "#c1e0ff" }}>
            {!bankInfo ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 70,
                      height: 70,
                      bgcolor: "#dbeafe",
                    }}
                  >
                    <AccountBalanceIcon
                      sx={{
                        color: "#2563eb",
                        fontSize: 35,
                      }}
                    />
                  </Avatar>

                  <Box>
                    <Typography
                      fontWeight={700}
                      fontSize={18}
                    >
                      Chưa đăng ký tài khoản
                    </Typography>

                    <Typography
                      sx={{
                        color: "#64748b",
                        mt: .5,
                      }}
                    >
                      Hãy đăng ký tài khoản ngân hàng để
                      nhận tiền từ hệ thống.
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  onClick={() =>
                    setOpenForm(true)
                  }
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                  }}
                >
                  Đăng ký ngay
                </Button>
              </Box>
            ) : (
              <Grid container spacing={10} >
                <Grid item xs={12} md={8}>
                  <Typography sx={{color: "#000000",fontSize: 16}}>
                    Ngân hàng:
                  </Typography>

                  <Typography
                   sx={{color: "#000000", fontSize: 16  }}
                  
                    mb={2}
                  >
                    {bankInfo.bank_name}
                  </Typography>

                  <Divider sx={{ mb: 2 , color: "#166512"}} />

                  <Typography sx={{color: "#000000",fontSize: 16}}>
                    Chủ tài khoản :
                  </Typography>

                  <Typography
                    sx={{color: "#000000",  fontSize: 16  }}
                    mb={2}
                  >
                    {bankInfo.account_name}
                  </Typography>

                    <Divider sx={{ mb: 2, }} />

                  <Typography sx={{color: "#000000",fontSize: 16}}>
                    Số tài khoản :
                  </Typography>

                  <Typography
                    sx={{color: "#000000", fontSize: 16  }}
                    fontWeight={600}
                  >
                    {bankInfo.account_number}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography
                    fontWeight={600}
                    mb={2}
                    sx={{color: "#000000",}}>
                    Mã QR nhận tiền :
                  </Typography>

                  {bankInfo.qr_image_url ? (
                    <Box
                      component="img"
                      alt="QR Code"
                      src={bankInfo.qr_image_url}
                      sx={{
                        width: 180,
                        borderRadius: 3,
                        border:
                          "1px solid #e5e7eb",
                      }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 180,
                        height: 180,
                        bgcolor: "#f1f5f9",
                      }}
                    >
                      <QrCode2Icon
                        sx={{
                          fontSize: 90,
                          color: "#94a3b8",
                        }}
                      />
                    </Avatar>
                  )}
                </Grid>
              </Grid>
            )}
          </Box>
        </Paper>
        
        {/* ================= LỊCH SỬ NHẬN TIỀN ================= */}

            <Paper
            elevation={0}
            sx={{
                mt: 4,
                borderRadius: 5,
                overflow: "hidden",
            }}
            >
            <Box
                sx={{
                p: 3,
                borderBottom: "1px solid #e5e7eb",
                background: "#f8fafc",
                }}
            >
                <Typography
                variant="h6"
                sx={{ color: "#075324", fontSize: 20, fontWeight: 600 }}
                >
                Lịch sử nhận tiền
                </Typography>

                <Typography
                sx={{ color: "#141415",
                }}
                mt={0.5}
                >
                Danh sách các khoản tiền admin đã thanh toán.
                </Typography>
            </Box>

            <TableContainer>
                <Table>

                <TableHead>

                    <TableRow
                    sx={{
                        background: "#f8fafc",
                    }}
                    >
                    <TableCell>
                        <b>STT</b>
                    </TableCell>

                    <TableCell>
                        <b>Thời gian</b>
                    </TableCell>

                    <TableCell>
                        <b>Nội dung</b>
                    </TableCell>

                    <TableCell align="right">
                        <b>Số tiền</b>
                    </TableCell>

                    <TableCell align="center">
                        <b>Trạng thái</b>
                    </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {Array.isArray(paymentHistory) &&
                        paymentHistory.map((item) => (

                    <TableRow
                        key={item.id}
                        hover
                        sx={{
                        "&:hover": {
                            background: "#f9fafb",
                        },
                        }}
                    >

                        <TableCell>
                        {item.id}
                        </TableCell>

                        <TableCell>
                        {item.created_at}
                        </TableCell>

                        <TableCell>
                        {"Thanh toán từ hệ thống"}
                        </TableCell>

                        <TableCell
                        align="right"
                        >
                        <Typography
                            fontWeight={700}
                            color="#16a34a"
                        >
                            + {formatMoney(item.net_amount)}
                        </Typography>
                        </TableCell>

                        <TableCell align="center">
                          <Chip
                            label={getStatusText(item.status)}
                            color={getStatusColor(item.status)}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              minWidth: 120,
                            }}
                          />
                        </TableCell>

                    </TableRow>

                    ))}

                </TableBody>

                </Table>
            </TableContainer>
            </Paper>



        {/* PHẦN 2 sẽ bắt đầu từ đây */}
        {openForm && (
            <Box
                sx={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.45)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
                }}
            >
                <Box
                sx={{
                    width: 600,
                    bgcolor: "white",
                    borderRadius: 5,
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,.2)",
                }}
                >
                {/* Header */}

                <Box
                    sx={{
                    background:
                        "linear-gradient(135deg,#0ea5e9,#2563eb)",
                    color: "white",
                    p: 3,
                    }}
                >
                    <Typography
                    variant="h6"
                    fontWeight={700}
                    >
                    Đăng ký tài khoản nhận tiền
                    </Typography>

                    <Typography sx={{ opacity: .9 }}>
                    Điền đầy đủ thông tin để nhận tiền
                    thanh toán từ hệ thống.
                    </Typography>
                </Box>

                {/* Body */}

                <Box sx={{ p: 4 }}>
                    <TextField
                    fullWidth
                    label="Tên ngân hàng"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                    />

                    <TextField
                    fullWidth
                    label="Số tài khoản"
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                    />

                    <TextField
                    fullWidth
                    label="Tên chủ tài khoản"
                    name="account_name"
                    value={formData.account_name}
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                    />

                    <Typography
                    fontWeight={600}
                    mb={1}
                    >
                    Ảnh mã QR nhận tiền
                    </Typography>

                    <Button
                    component="label"
                    fullWidth
                    variant="outlined"
                    sx={{
                        height: 55,
                        borderStyle: "dashed",
                        borderRadius: 3,
                    }}
                    >
                    Chọn ảnh QR

                    <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                    />
                    </Button>

                    {formData.qr_image && (
                    <Box
                        sx={{
                        mt: 3,
                        textAlign: "center",
                        }}
                    >
                        <Typography
                        mb={2}
                        color="#64748b"
                        >
                        Xem trước
                        </Typography>

                        <Box
                        component="img"
                        src={URL.createObjectURL(
                            formData.qr_image
                        )}
                        sx={{
                            width: 220,
                            borderRadius: 3,
                            border: "1px solid #ddd",
                        }}
                        />
                    </Box>
                    )}

                    <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                        mt: 4,
                    }}
                    >
                    <Button
                        variant="outlined"
                        onClick={() =>
                        setOpenForm(false)
                        }
                        sx={{
                        borderRadius: 3,
                        px: 4,
                        }}
                    >
                        Hủy
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{
                        borderRadius: 3,
                        px: 4,
                        background:
                            "linear-gradient(90deg,#22c55e,#16a34a)",
                        }}
                    >
                        Lưu thông tin
                    </Button>
                    </Box>
                </Box>
                </Box>
            </Box>
            )}



      </Box>
    </OwnerLayout>
  );
};

export default OwnerPayment;