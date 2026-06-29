import { useState, useEffect } from "react";
import AdminLayout from "../../Layouts/AdminLayout";
import axiosClient from "../../api/axiosClient";
import { FaUserSlash, FaUserCheck, FaSearch, FaUserCircle, FaSpinner } from "react-icons/fa";


function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null); // stores id of user currently being toggled


  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/admin/users");
      const responseData = res.data || {};
      const usersData = Array.isArray(responseData.data)
        ? responseData.data
        : Array.isArray(responseData.users)
          ? responseData.users
          : [];


      setUsers(usersData);
    } catch (err) {
      console.error("Error fetching users:", err);
      // Fallback mockup users if database is empty or error
      setUsers([
        { id: 1, name: "Nguyễn Văn A", email: "userA@gmail.com", role: "user", status: true, phone: "0987654321" },
        { id: 2, name: "Trần Thị B (Owner)", email: "ownerB@gmail.com", role: "owner", status: true, phone: "0123456789" },
        { id: 3, name: "Admin Thùy", email: "admin@gmail.com", role: "admin", status: true, phone: "0909090909" },
      ]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);


  const handleToggleStatus = async (user) => {
    if (actionLoading) return;
   
    // Check lock self
    const currentUserStr = localStorage.getItem("user");
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser.id === user.id) {
        alert("Bạn không thể tự khóa chính mình!");
        return;
      }
    }


    if (!window.confirm(`Bạn có chắc chắn muốn ${user.status ? "khóa" : "mở khóa"} tài khoản của ${user.name}?`)) {
      return;
    }


    try {
      setActionLoading(user.id);
      const res = await axiosClient.patch(`/admin/users/${user.id}/toggle-status`);
     
      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(u => u.id === user.id ? { ...u, status: !u.status } : u)
      );
     
      alert(res.data.message || "Cập nhật trạng thái thành công!");
    } catch (err) {
      console.error("Error toggling status:", err);
      alert(err.response?.data?.message || "Lỗi khi cập nhật trạng thái người dùng!");
    } finally {
      setActionLoading(null);
    }
  };


  // Filter logic
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm);
     
    const matchesRole = roleFilter === "all" ? true : user.role === roleFilter;
   
    return matchesSearch && matchesRole;
  });


  return (
    <AdminLayout>
      <div className="container-fluid py-4">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-gray-800">Quản lý người dùng</h2>
            <p className="text-muted">Quản lý tài khoản khách hàng, chủ sân và phân quyền hệ thống</p>
          </div>
          <button onClick={fetchUsers} className="btn btn-outline-primary d-flex align-items-center gap-2">
            Làm mới danh sách
          </button>
        </div>


        {/* Filter and Search Box */}
        <div className="card shadow-sm border-0 p-3 mb-4 bg-white rounded-4">
          <div className="row g-3 align-items-center">
            {/* Search */}
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-0 py-2.5">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0 py-2.5"
                  placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>


            {/* Role Filter */}
            <div className="col-md-3">
              <select
                className="form-select bg-light border-0 py-2.5"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Tất cả vai trò</option>
                <option value="user">Khách đặt sân (User)</option>
                <option value="owner">Chủ sân (Owner)</option>
                <option value="admin">Quản trị viên (Admin)</option>
              </select>
            </div>


            {/* User count badge */}
            <div className="col-md-3 text-md-end">
              <span className="badge bg-primary-soft text-primary px-3 py-2 rounded-pill font-semibold">
                Tổng số: {filteredUsers.length} thành viên
              </span>
            </div>
          </div>
        </div>


        {/* Table/Data list */}
        <div className="card shadow-sm border-0 bg-white rounded-4 overflow-hidden">
          {loading ? (
            <div className="d-flex flex-column justify-content-center align-items-center py-5">
              <FaSpinner className="animate-spin text-primary fs-2 mb-3" />
              <p className="text-muted">Đang tải dữ liệu người dùng...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-muted">
                  <tr>
                    <th className="px-4 py-3 border-0">Người dùng</th>
                    <th className="py-3 border-0">Thông tin liên lạc</th>
                    <th className="py-3 border-0">Vai trò</th>
                    <th className="py-3 border-0 text-center">Trạng thái</th>
                    <th className="px-4 py-3 border-0 text-end">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        Không tìm thấy người dùng phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-bottom border-light">
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="rounded-circle"
                                width="44"
                                height="44"
                                style={{ objectFit: "cover" }}
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&bold=true`;
                                }}
                              />
                            ) : (
                              <FaUserCircle className="text-secondary fs-1" />
                            )}
                            <div>
                              <h6 className="mb-0 fw-bold">{user.name}</h6>
                              <span className="text-muted small">ID: #{user.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="d-flex flex-column">
                            <span className="fw-semibold text-dark">{user.email}</span>
                            <span className="text-muted small">{user.phone || "Chưa cập nhật SĐT"}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          {user.role === "admin" && (
                            <span className="badge bg-danger px-2.5 py-1.5 rounded-pill text-white fw-bold">Admin</span>
                          )}
                          {user.role === "owner" && (
                            <span className="badge bg-success px-2.5 py-1.5 rounded-pill text-white fw-bold">Chủ sân</span>
                          )}
                          {user.role === "user" && (
                            <span className="badge bg-info px-2.5 py-1.5 rounded-pill text-white fw-bold">Khách đặt</span>
                          )}
                        </td>
                        <td className="py-3 text-center">
                          {user.status ? (
                            <span className="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-bold">
                              Hoạt động
                            </span>
                          ) : (
                            <span className="badge bg-danger-subtle text-danger px-3 py-1.5 rounded-pill fw-bold">
                              Bị khóa
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-end">
                          {(() => {
                            const currentUserStr = localStorage.getItem("user");
                            const currentUserId = currentUserStr ? JSON.parse(currentUserStr).id : null;
                            const isSelf = user.id === currentUserId;


                            if (isSelf) {
                              return (
                                <button className="btn btn-sm btn-light text-muted" disabled>
                                  Không thể tự khóa
                                </button>
                              );
                            }


                            return (
                              <button
                                onClick={() => handleToggleStatus(user)}
                                disabled={actionLoading === user.id}
                                className={`btn btn-sm ${
                                  user.status ? "btn-outline-danger" : "btn-success text-white"
                                } d-inline-flex align-items-center gap-1.5 rounded-pill px-3 py-1.5`}
                              >
                                {actionLoading === user.id ? (
                                  <FaSpinner className="animate-spin" />
                                ) : user.status ? (
                                  <>
                                    <FaUserSlash /> Khóa
                                  </>
                                ) : (
                                  <>
                                    <FaUserCheck /> Mở khóa
                                  </>
                                )}
                              </button>
                            );
                          })()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}


export default Users;



