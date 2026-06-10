import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import OwnerLayout from "../../Layouts/OwnerLayout";
import BookingManagerGrid from "../../Components/BookingManagerGrid";
import { Box, Typography, Divider } from "@mui/material";
import axiosClient from "../../api/axiosClient";

const dayMap = {
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
  7: "Chủ nhật",
};

const BookingDetail = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const courtId = searchParams.get("court_id");
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [loading, setLoading] = useState(true);

  const courtName =
    location.state?.courtName ||
    selectedCourt?.name ||
    (courtId ? `Cụm sân ${courtId}` : "Booking detail");

  useEffect(() => {
    const fetchCourt = async () => {
      if (!courtId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axiosClient.get(`/owner/courts/${courtId}`);
        setSelectedCourt(res.data?.data || null);
      } catch (error) {
        console.error("Lỗi lấy thông tin cụm sân:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourt();
  }, [courtId]);

  const fields = selectedCourt?.fields || [];

  return (
    <OwnerLayout>
        <Box sx={{ mt: 8, mb: 0, border: "1px solid #18643b97", p: 2, borderRadius: 3, background: "#edf3ef" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#18643b" }}>
          Chi tiết booking
        </h1>
        <p style={{ fontSize: 14, color: "gray" }}>
          Thông tin chi tiết về booking của khách hàng
        </p>
      </Box>
      <Box sx={{ mt: 2, mb: 3, border: "1px solid #18643b97", p: 2, borderRadius: 3, background: "#edf3ef" }}>
        <h style={{ fontSize: 20, fontWeight: 600, color: "#18643b" }}>
          {courtName}
        </h>
      </Box>



      <BookingManagerGrid />
    </OwnerLayout>
  );
};

export default BookingDetail;