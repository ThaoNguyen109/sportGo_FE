import { useState, useEffect } from "react";
import AdminLayout from "../../Layouts/AdminLayout";
import axiosClient from "../../api/axiosClient";
import { FaSpinner, FaClock, FaUsers, FaMapMarkedAlt, FaDollarSign } from "react-icons/fa";


function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourts: 0,
    pendingCourts: 0,
    approvedCourts: 0,
    rejectedCourts: 0,
    activeCourts: 0,
    inactiveCourts: 0,
    monthlyRevenue: 0,
    topOwners: [],
    totalBookings: 0,
    pendingBookings: 0,
    paidBookings: 0,
    cancelledBookings: 0,
    refundedBookings: 0,
    totalBookingRevenue: 0,
    topCourts: [],
  });
  const [loading, setLoading] = useState(true);


  const fetchDashboardData = async () => {
    try {
      setLoading(true);
     
      // 1. Fetch courts stats
      let courtTotal = 0;
      let courtPending = 0;
      let courtApproved = 0;
      let courtRejected = 0;
      let courtActive = 0;
      let courtInactive = 0;
      let topOwnersList = [];
      try {
        const courtsStatsRes = await axiosClient.get("/admin/courts/stats");
        const courtStatsData = courtsStatsRes.data?.data || {};
        courtTotal = Number(courtStatsData.total || 0);
        courtPending = Number(courtStatsData.pending || 0);
        courtApproved = Number(courtStatsData.approved || 0);
        courtRejected = Number(courtStatsData.rejected || 0);
        courtActive = Number(courtStatsData.active || 0);
        courtInactive = Number(courtStatsData.inactive || 0);
        topOwnersList = Array.isArray(courtStatsData.top_owners) ? courtStatsData.top_owners : [];
      } catch (e) {
        console.error("Error fetching court stats:", e);
      }


      // 2. Fetch users count
      let usersCount = 0;
      try {
        const usersRes = await axiosClient.get("/admin/users");
        const usersData = Array.isArray(usersRes.data?.data)
          ? usersRes.data.data
          : Array.isArray(usersRes.data?.users)
            ? usersRes.data.users
            : [];
        usersCount = usersData.length;
      } catch (e) {
        console.error("Error fetching users count:", e);
      }


      // 3. Fetch monthly revenue
      let revenue = 0;
      try {
        const revRes = await axiosClient.get("/admin/bookings/revenue?type=month");
        revenue = revRes.data.data?.total_revenue || 0;
      } catch (e) {
        console.error("Error fetching revenue stats:", e);
      }


      // 4. Fetch booking stats
      let bookingStats = {
        totalBookings: 0,
        pendingBookings: 0,
        paidBookings: 0,
        cancelledBookings: 0,
        refundedBookings: 0,
        totalBookingRevenue: 0,
        topCourts: [],
      };
      try {
        const bookingStatsRes = await axiosClient.get("/admin/bookings/stats");
        const data = bookingStatsRes.data?.data || {};
        bookingStats = {
          totalBookings: Number(data.total_bookings || 0),
          pendingBookings: Number(data.pending || 0),
          paidBookings: Number(data.paid || 0),
          cancelledBookings: Number(data.cancelled || 0),
          refundedBookings: Number(data.refunded || 0),
          totalBookingRevenue: Number(data.total_revenue || 0),
          topCourts: Array.isArray(data.top_courts) ? data.top_courts : [],
        };
      } catch (e) {
        console.error("Error fetching booking stats:", e);
      }


      setStats({
        totalUsers: usersCount,
        totalCourts: courtTotal,
        pendingCourts: courtPending,
        approvedCourts: courtApproved,
        rejectedCourts: courtRejected,
        activeCourts: courtActive,
        inactiveCourts: courtInactive,
        monthlyRevenue: revenue,
        topOwners: topOwnersList,
        totalBookings: bookingStats.totalBookings,
        pendingBookings: bookingStats.pendingBookings,
        paidBookings: bookingStats.paidBookings,
        cancelledBookings: bookingStats.cancelledBookings,
        refundedBookings: bookingStats.refundedBookings,
        totalBookingRevenue: bookingStats.totalBookingRevenue,
        topCourts: bookingStats.topCourts,
      });


    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDashboardData();
  }, []);


  const formatCurrency = (val) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };


  const bookingStatusStats = [
    { label: "Chờ thanh toán", value: stats.pendingBookings, color: "#f59e0b" },
    { label: "Đã thanh toán", value: stats.paidBookings, color: "#198754" },
    { label: "Đã hủy", value: stats.cancelledBookings, color: "#dc3545" },
    { label: "Đã hoàn tiền", value: stats.refundedBookings, color: "#0d6efd" },
  ];


  const courtStatusStats = [
    { label: "Hoạt động", value: stats.activeCourts, color: "#198754" },
    { label: "Không hoạt động", value: stats.inactiveCourts, color: "#6c757d" },
  ];


  const totalBookingStatus = bookingStatusStats.reduce((sum, item) => sum + item.value, 0) || 1;
  const totalCourtStatus = courtStatusStats.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = 46;
  const courtRadius = 46;
  const circumference = 2 * Math.PI * radius;
  const courtCircumference = 2 * Math.PI * courtRadius;
  let cumulativeOffset = 0;
  let courtCumulative = 0;


  return (
    <AdminLayout>
      <div className="container-fluid py-2">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-gray-800">Bảng điều khiển Admin</h2>
            <p className="text-muted">Tổng quan số liệu và phê duyệt các hoạt động trên hệ thống SportGo</p>
          </div>
          <button onClick={fetchDashboardData} className="btn btn-outline-primary py-2 px-4 rounded-pill fw-bold">
            Làm mới dữ liệu
          </button>
        </div>


        {loading ? (
          <div className="d-flex flex-column justify-content-center align-items-center py-5">
            <FaSpinner className="animate-spin text-primary fs-1 mb-3" />
            <p className="text-muted">Đang tải số liệu thống kê mới nhất...</p>
          </div>
        ) : (
          <>
            {/* Top Cards Row */}
            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="dashboard-card border-0 shadow-sm rounded-4 p-4 bg-white d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-secondary mb-1">Tổng người dùng</h6>
                    <h2 className="fw-bold text-dark mb-0">{stats.totalUsers}</h2>
                  </div>
                  <div className="bg-primary-soft text-primary p-3 rounded-4 fs-3">
                    <FaUsers />
                  </div>
                </div>
              </div>


              <div className="col-md-3">
                <div className="dashboard-card border-0 shadow-sm rounded-4 p-4 bg-white d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-secondary mb-1">Tổng số sân</h6>
                    <h2 className="fw-bold text-dark mb-0">{stats.totalCourts}</h2>
                  </div>
                  <div className="bg-success-subtle text-success p-3 rounded-4 fs-3">
                    <FaMapMarkedAlt />
                  </div>
                </div>
              </div>


              <div className="col-md-3">
                <div className="dashboard-card border-0 shadow-sm rounded-4 p-4 bg-white d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-secondary mb-1">Sân chờ duyệt</h6>
                    <h2 className={`fw-bold mb-0 ${stats.pendingCourts > 0 ? "text-danger" : "text-dark"}`}>
                      {stats.pendingCourts}
                    </h2>
                  </div>
                  <div className={`p-3 rounded-4 fs-3 ${stats.pendingCourts > 0 ? "bg-danger-subtle text-danger" : "bg-warning-subtle text-warning"}`}>
                    <FaClock />
                  </div>
                </div>
              </div>


              <div className="col-md-3">
                <div className="dashboard-card border-0 shadow-sm rounded-4 p-4 bg-white d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-secondary mb-1">Tổng doanh thu (tháng)</h6>
                    <h3 className="fw-bold text-success mb-0">{formatCurrency(stats.monthlyRevenue)}</h3>
                  </div>
                  <div className="bg-success-subtle text-success p-3 rounded-4 fs-3">
                    <FaDollarSign />
                  </div>
                </div>
              </div>
            </div>


            <div className="row g-4 mb-4">
              <div className="col-12 col-xl-6">
                <div className="card shadow-sm border-0 rounded-4 bg-white p-4 h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="fw-bold text-dark mb-1">Trạng thái sân</h5>
                      <p className="text-muted small mb-0">Phân bổ tổng số sân theo trạng thái hiện tại</p>
                    </div>
                    <span className="badge bg-light text-dark">Cập nhật từ API</span>
                  </div>


                  <div className="d-flex flex-column flex-lg-row align-items-center gap-4">
                    <div className="position-relative" style={{ width: 180, height: 180 }}>
                      <svg viewBox="0 0 120 120" width="180" height="180">
                        <circle cx="60" cy="60" r={radius} fill="none" stroke="#e9ecef" strokeWidth="18" />
                        {courtStatusStats.map((item) => {
                          const length = (item.value / totalCourtStatus) * courtCircumference;
                          const offset = -courtCumulative;
                          courtCumulative += length;


                          return (
                            <circle
                              key={item.label}
                              cx="60"
                              cy="60"
                              r={courtRadius}
                              fill="none"
                              stroke={item.color}
                              strokeWidth="18"
                              strokeLinecap="round"
                              strokeDasharray={`${length} ${courtCircumference - length}`}
                              strokeDashoffset={offset}
                              transform="rotate(-90 60 60)"
                            />
                          );
                        })}
                      </svg>
                      <div className="position-absolute top-50 start-50 translate-middle text-center">
                        <div className="fw-bold fs-4 text-dark">{stats.totalCourts}</div>
                        <div className="small text-muted">tổng sân</div>
                      </div>
                    </div>


                    <div className="flex-grow-1 w-100">
                      <div className="d-flex flex-column gap-2">
                        {courtStatusStats.map((item) => (
                          <div key={item.label} className="d-flex justify-content-between align-items-center border rounded-3 px-3 py-2">
                            <div className="d-flex align-items-center gap-2">
                              <span className="rounded-circle" style={{ width: 10, height: 10, backgroundColor: item.color }} />
                              <span className="small fw-semibold text-dark">{item.label}</span>
                            </div>
                            <span className="fw-bold text-dark">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="col-12 col-xl-6">
                <div className="card shadow-sm border-0 rounded-4 bg-white p-4 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="fw-bold text-dark mb-1">Top sân có nhiều booking</h5>
                      <p className="text-muted small mb-0">Danh sách các sân có lượt booking cao nhất</p>
                    </div>
                  </div>


                  <div className="border rounded-4 p-3 bg-light">
                    {stats.topCourts.length === 0 ? (
                      <div className="text-muted small py-4 text-center">Không có dữ liệu top sân</div>
                    ) : (
                      <div className="d-flex flex-column gap-2">
                        {stats.topCourts.map((court) => (
                          <div key={court.court_id} className="d-flex justify-content-between align-items-center rounded-3 bg-white p-3">
                            <div>
                              <div className="fw-semibold">{court.court_name}</div>
                              <div className="text-muted small">ID: {court.court_id}</div>
                            </div>
                            <span className="badge bg-primary-subtle text-primary">{court.booking_count} booking</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>


            <div className="row g-4 mb-4">
              <div className="col-12 col-lg-8">
                <div className="card shadow-sm border-0 rounded-4 bg-white p-4 h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-dark mb-0">Trạng thái booking</h5>
                    <span className="badge bg-light text-dark">Cập nhật từ API</span>
                  </div>


                  <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between gap-4">
                    <div className="position-relative" style={{ width: 180, height: 180 }}>
                      <svg viewBox="0 0 120 120" width="180" height="180">
                        <circle cx="60" cy="60" r={radius} fill="none" stroke="#e9ecef" strokeWidth="18" />
                        {bookingStatusStats.map((item) => {
                          const length = (item.value / totalBookingStatus) * circumference;
                          const offset = -cumulativeOffset;
                          cumulativeOffset += length;


                          return (
                            <circle
                              key={item.label}
                              cx="60"
                              cy="60"
                              r={radius}
                              fill="none"
                              stroke={item.color}
                              strokeWidth="18"
                              strokeLinecap="round"
                              strokeDasharray={`${length} ${circumference - length}`}
                              strokeDashoffset={offset}
                              transform="rotate(-90 60 60)"
                            />
                          );
                        })}
                      </svg>
                      <div className="position-absolute top-50 start-50 translate-middle text-center">
                        <div className="fw-bold fs-4 text-dark">{stats.totalBookings}</div>
                        <div className="small text-muted">tổng booking</div>
                      </div>
                    </div>


                    <div className="flex-grow-1 w-100">
                      <div className="d-flex flex-column gap-2">
                        {bookingStatusStats.map((item) => (
                          <div key={item.label} className="d-flex justify-content-between align-items-center border rounded-3 px-3 py-2">
                            <div className="d-flex align-items-center gap-2">
                              <span className="rounded-circle" style={{ width: 10, height: 10, backgroundColor: item.color }} />
                              <span className="small fw-semibold text-dark">{item.label}</span>
                            </div>
                            <span className="fw-bold text-dark">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="col-12 col-lg-4">
                <div className="card shadow-sm border-0 rounded-4 bg-white p-4 h-100">
                  <h5 className="fw-bold text-dark mb-3">Top chủ sân</h5>
                  {stats.topOwners.length === 0 ? (
                    <div className="text-center py-4 text-muted small">Chưa có dữ liệu chủ sân</div>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {stats.topOwners.map((owner, index) => (
                        <div key={`${owner.owner_id}-${index}`} className="d-flex justify-content-between align-items-center border rounded-3 px-3 py-2">
                          <div>
                            <div className="fw-semibold text-dark">Chủ sân #{owner.owner_id}</div>
                            <div className="text-muted small">Số sân sở hữu</div>
                          </div>
                          <span className="badge bg-primary-subtle text-primary">{owner.total}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}


export default Dashboard;

