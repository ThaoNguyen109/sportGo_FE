import OwnerLayout from "../../Layouts/OwnerLayout";
import { Box } from "@mui/material";
import OwnerCard from "../../Components/OwnerCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";


const data = [
  { name: "1/1", san1: 14, san2: 8, san3: 3 },
  { name: "2/1", san1: 15, san2: 9, san3: 3.5 },
  { name: "3/1", san1: 11, san2: 7, san3: 3 },
  { name: "4/1", san1: 18, san2: 10, san3: 4.5 },
  { name: "5/1", san1: 13, san2: 8.5, san3: 4 },
  { name: "6/1", san1: 12, san2: 8.5, san3: 3.5 },
  { name: "7/1", san1: 14, san2: 9, san3: 3.5 },
];
const pieData = [
  { name: "Thành công", value: 75 },
  { name: "Thất bại", value: 25 },
];

const COLORS = ["#22c55e", "#ef4444"]; // xanh + đỏ


//npm install recharts
const DashboardOwner = () => {
  return (
    <OwnerLayout>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 2,
          ml: "0px", // 👈 chừa chỗ sidebar
          mt: "70px",  // 👈 tránh header đè nội dung
          p: 2,
          boxShadow: "2px 0 10px rgba(0,0,0,0.05)"
        }}
      >
        <OwnerCard title="Lượt truy cập" value="0" sub="Đang hoạt động" titleColor="#18643b" />
        <OwnerCard title="Số địa điểm" value="3" sub="Địa điểm" titleColor="#18643b" />
        <OwnerCard title="Số sân" value="15" sub="Sân thể thao" titleColor="#18643b" />
        <OwnerCard title="Đánh giá" value="4.5" sub="Trên 5 sao" titleColor="#18643b" />
      </Box>



        
        <Box
          mt={3}
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
          }}
        >

          {/* PIE CHART */}
          <Box
            sx={{
              background: "white",
              borderRadius: 3,
              p: 3,
              height: 320,
            }}
          >
            <Box fontWeight={600} mb={1}>
              Tỉ lệ đặt lịch thành công
            </Box>

            <Box fontSize={13} color="gray" mb={2}>
              Thống kê tỉ lệ đặt lịch thành công và thất bại
            </Box>

            <ResponsiveContainer width="100%" height="75%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {/* LINE CHART */}
          <Box
            sx={{
              background: "white",
              borderRadius: 3,
              p: 3,
              height: 320,
            }}
          >
            <Box mb={2} fontWeight={600}>
              Doanh thu theo thời gian
            </Box>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Line type="monotone" dataKey="san1" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="san2" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="san3" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Box>

        </Box>


    </OwnerLayout>
  );
};

export default DashboardOwner;
