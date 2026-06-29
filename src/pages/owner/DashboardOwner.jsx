import { useEffect, useState } from "react";

import OwnerLayout from "../../Layouts/OwnerLayout";
import OwnerCard from "../../Components/OwnerCard";
import axiosClient from "../../api/axiosClient";

import {
    Box,
    CircularProgress,
} from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import StadiumIcon from "@mui/icons-material/Stadium";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

import {
  ResponsiveContainer,

  PieChart,
  Pie,
  Cell,
  Legend,

  BarChart,
  Bar,
  LabelList,

  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";


const COLORS = [ "#22c55e","#f59e0b", "#ef4444", "#3b82f6",]; // xanh + đỏ


//npm install recharts
const DashboardOwner = () => {

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState({});
  const [courts, setCourts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [bookingStatusData, setBookingStatusData] = useState([]);
  const [payoutData, setPayoutData] = useState([]);
  const [statistics, setStatistics] = useState({
      totalRevenue: 0,
      totalBookings: 0,
      totalCourts: 0,
      totalFields: 0,
  });
  const formatMoney = (money) => {
    return Number(money || 0).toLocaleString("vi-VN") + " đ";
  };
  const loadDashboard = async () => {
    try {
      const [
        dashboardRes,
        statsRes,
        revenueRes
      ] = await Promise.all([
        axiosClient.get("/owner/bookings/dashboard"),
        axiosClient.get("/owner/bookings/stats"),
        axiosClient.get("/owner/bookings/revenue?type=day")
      ]);
        setDashboard(dashboardRes.data.data);
        const stats = statsRes.data.data;
        setBookingStatusData([
            {
              name: "Đã thanh toán",
              value: stats.paid
            },
            {
              name: "Đang chờ",
              value: stats.pending
            },
            {
              name: "Đã hủy",
              value: stats.cancelled
            },
            {
              name: "Hoàn tiền",
              value: stats.refunded
            }
        ]);
        const courts = revenueRes.data.data.courts;
        setRevenueData(
          courts.map(item => ({
            label: item.name,
             revenue: Number(item.revenue)
          }))
        );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    loadDashboard();
  },[]);

  if(loading){
    return(
        <OwnerLayout>
            <Box
                sx={{
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    height:"80vh",
                }}
            >
                <CircularProgress/>
            </Box>
        </OwnerLayout>
    );
  }
  console.log("Revenue Data:", revenueData);
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
      <OwnerCard
          icon={<PaidIcon />}
          title="Booking hôm nay"
          value={dashboard.today_bookings}
          sub="Đã thanh toán"
          titleColor="#18643b"
      />

      <OwnerCard
          icon={<EventAvailableIcon />}
          title="Tổng Booking"
          value={dashboard.total_bookings}
          sub="Lượt đặt sân"
          titleColor="#2563eb"
      />

      <OwnerCard
          icon={<StadiumIcon />}
          title="Doanh thu hôm nay"
          value={Number(
                  dashboard.today_revenue || 0
                ).toLocaleString()}
          sub="VNĐ"
          titleColor="#9333ea"
      />

      <OwnerCard
          icon={<SportsSoccerIcon />}
          title="Tổng doanh thu"
          value={Number(
                  dashboard.total_revenue || 0
                ).toLocaleString()}
          sub="VNĐ"
          titleColor="#f59e0b"
      />
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
                height: 360,
                boxShadow: "0 6px 18px rgba(0,0,0,.06)",
            }}>
            <Box
                fontWeight={700}
                fontSize={18}
                mb={1}
            >
                Tỷ lệ trạng thái Booking
            </Box>
            <Box
                fontSize={13}
                color="gray"
                mb={3}
            >
                Thống kê theo trạng thái đặt sân
            </Box>
            <ResponsiveContainer
                width="100%"
                height="80%"
            >
                <PieChart>
                    <Pie
                        data={bookingStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        label
                    >
                      {
                         bookingStatusData.map(
                          (item,index)=>(
                            <Cell
                              key={index}
                              fill={COLORS[index%COLORS.length]}
                            />
                          )
                        )
                      }
                    </Pie>
                    <Tooltip/>
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
        </Box>

          {/* LINE CHART */}
          <Box
            sx={{
                background: "white",
                borderRadius: 3,
                p: 3,
                height: 360,
                boxShadow: "0 6px 18px rgba(0,0,0,.06)",
            }}>
            <Box
                fontWeight={700}
                fontSize={18}
                mb={1}
            >
                Doanh thu theo thời gian
            </Box>
            <Box
                fontSize={13}
                color="gray"
                mb={3}
            >
                Thống kê doanh thu của owner
            </Box>
            <ResponsiveContainer
              width="100%"
              height="80%"
            >
              <BarChart
                data={revenueData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 10,
                  bottom: 40,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        `${Number(value).toLocaleString()} VNĐ`,
                        "Doanh thu",
                      ]}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#22c55e"
                      radius={[8, 8, 0, 0]}
                    >
                      <LabelList
                        dataKey="revenue"
                        position="top"
                        formatter={(value) =>
                          Number(value).toLocaleString()
                        }
                      />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
          </Box>


        </Box>


    </OwnerLayout>
  );
};

export default DashboardOwner;
