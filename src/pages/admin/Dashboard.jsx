import AdminLayout from "../../Layouts/AdminLayout";
import DashboardCard from "../../Components/admin/DashboardCard";

function Dashboard() {

  return (
    <AdminLayout>

      <div className="row g-4">

        <div className="col-md-3">
          <DashboardCard
            title="Người dùng online"
            value="3"
          />
        </div>

        <div className="col-md-3">
          <DashboardCard
            title="Tổng địa điểm"
            value="8"
          />
        </div>

        <div className="col-md-3">
          <DashboardCard
            title="Tổng người dùng"
            value="8"
          />
        </div>

        <div className="col-md-3">
          <DashboardCard
            title="Loại thể thao"
            value="8"
          />
        </div>

      </div>

    </AdminLayout>
  );
}

export default Dashboard;