import AdminSidebar from "../Components/admin/AdminSidebar";
import AdminTopbar from "../Components/admin/AdminTopbar";

function AdminLayout({ children }) {

  return (
    <div>

      <AdminSidebar />

      <div className="admin-main">

        <AdminTopbar />

        <div className="p-4">
          {children}
        </div>

      </div>

    </div>
  );
}

export default AdminLayout;