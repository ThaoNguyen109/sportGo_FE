import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import MainLayout from "../../Layouts/MainLayout";
import SearchBar from "../../Components/SearchBar";
import FieldCard from "../../Components/FieldCard";
import { Grid, Box, CircularProgress } from "@mui/material";

const Dashboard = () => {
  const [keyword, setKeyword] = useState("");
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourts = async (lat, lng) => {
      try {
        let url = "/courts";
        if (lat && lng) {
          url += `?lat=${lat}&lng=${lng}&max_distance=10`;
        }
        const res = await axiosClient.get(url);
        if (res.data && res.data.success) {
          setFields(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách sân:", error);
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCourts(latitude, longitude);
        },
        (error) => {
          console.error("Lỗi lấy vị trí:", error);
          fetchCourts(); // Gọi API không có location nếu lỗi
        }
      );
    } else {
      fetchCourts();
    }
  }, []);

  // 🔍 FILTER
  const filteredData = fields.filter((item) =>
    item.name.toLowerCase().includes(keyword.toLowerCase()) ||
    (item.address && item.address.toLowerCase().includes(keyword.toLowerCase()))
  );

  const getImageUrl = (url) => {
    if (!url) return "https://picsum.photos/400/200/?text=SportGo";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    const cleanPath = url.startsWith("/") ? url.slice(1) : url;
    if (cleanPath.startsWith("storage/")) {
      return `https://sportgo.ddnsfree.com/${cleanPath}`;
    }
    return `https://sportgo.ddnsfree.com/storage/${cleanPath}`;
  };

  return (
    <MainLayout>
      {/* 🔍 SEARCH */}
      <SearchBar setKeyword={setKeyword} />

      {/* SCROLL AREA */}
      <Box
        sx={{
          height: "calc(100vh - 140px)", // trừ header + bottom nav
          overflowY: "auto",
          px: 16,
          pb: 2,
          pt: 3,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(3, 1fr)", // 👈 3 card / hàng
            },
            gap: 2,
          }}
        >
          {loading ? (
            <Box sx={{ color: "white", width: "100%", gridColumn: "1 / -1", textAlign: "center", mt: 4 }}>
              Đang tải danh sách sân gần bạn...
            </Box>
          ) : (
            filteredData.map((item) => (
              <FieldCard 
                key={item.id} 
                id={item.id}
                name={item.name}
                location={item.address}
                image={getImageUrl(item.image)}
                distance={item.distance_km ? `${item.distance_km.toFixed(1)}km` : ""}
                time={`${item.open_time ? item.open_time.slice(0,5) : "00:00"} - ${item.close_time ? item.close_time.slice(0,5) : "24:00"}`}
              />
            ))
          )}

        </Box>
        {/* ❗ Không có kết quả */}
        {!loading && filteredData.length === 0 && (
          <p style={{ color: "white", marginTop: 20 }}>
            Không tìm thấy sân
          </p>
        )}
      </Box>
    </MainLayout>
  );
};

export default Dashboard;
