import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import SearchBar from "../../components/SearchBar";
import FieldCard from "../../components/FieldCard";
import { Grid, Box } from "@mui/material";

const Dashboard = () => {
  const [keyword, setKeyword] = useState("");

  const data = [
    { name: "Sân A", location: "Hà Nội", image: "https://picsum.photos/400/200?1", time:"05:00 - 24:00", rating:"4.9" },
    { name: "Sân B", location: "HCM", image: "https://picsum.photos/400/200?2" },

    { name: "Sân C", location: "Đà Nẵng", image: "https://picsum.photos/400/200?3" },
    { name: "Sân D", location: "Hải Phòng", image: "https://picsum.photos/400/200?4" },
    { name: "Sân E", location: "Cần Thơ", image: "https://picsum.photos/400/200?5" },

    { name: "Sân F", location: "Huế", image: "https://picsum.photos/400/200?6" },
    { name: "Sân G", location: "Quảng Ninh", image: "https://picsum.photos/400/200?7" },
    { name: "Sân H", location: "Bình Dương", image: "https://picsum.photos/400/200?8" },

    { name: "Sân I", location: "Đồng Nai", image: "https://picsum.photos/400/200?9" },
    { name: "Sân J", location: "Nha Trang", image: "https://picsum.photos/400/200?10" },
    { name: "Sân K", location: "Vũng Tàu", image: "https://picsum.photos/400/200?11" },
    { name: "Sân L", location: "Thanh Hóa", image: "https://picsum.photos/400/200?12" },

     { name: "Sân M", location: "Tháp Mười", image: "https://picsum.photos/400/200?13" },
    { name: "Sân N", location: "Hai Bà Trưng", image: "https://picsum.photos/400/200?14" },
    { name: "Sân O", location: "Hoàng Mai", image: "https://picsum.photos/400/200?15" },
    { name: "Sân P", location: "Thanh Xuân", image: "https://picsum.photos/400/200?16" },
  ];

   // 🔍 FILTER
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(keyword.toLowerCase()) ||
    item.location.toLowerCase().includes(keyword.toLowerCase())
  );

  //gọi data từ DB
// const Dashboard = () => {
//   const [fields, setFields] = useState([]);

//   useEffect(() => {
//     const fetchFields = async () => {
//       try {
//         const res = await axiosClient.get("/fields");
//         setFields(res.data); // 👈 dữ liệu từ DB
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchFields();
//   }, []);

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
          {filteredData.map((item, index) => (
            <FieldCard key={index} {...item} />
          ))}

        </Box>
        {/* ❗ Không có kết quả */}
        {filteredData.length === 0 && (
          <p style={{ color: "white", marginTop: 20 }}>
            Không tìm thấy sân
          </p>
        )}
      </Box>
    </MainLayout>
  );
};

export default Dashboard;
