import { useState, useEffect } from "react";
import AdminLayout from "../../Layouts/AdminLayout";
import axiosClient from "../../api/axiosClient";
import {
  FaCheck,
  FaTimes,
  FaEye,
  FaSearch,
  FaSpinner,
  FaMapMarkerAlt,
  FaStore,
  FaInfoCircle,
} from "react-icons/fa";


function Venues() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCourt, setSelectedCourt] = useState(null); // Detail modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(null);


  const fetchCourts = async () => {
    try {
      setLoading(true);
      // We can query with filters
      let url = "/admin/courts";
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (searchTerm) {
        params.append("search", searchTerm);
      }
     
      const res = await axiosClient.get(`${url}?${params.toString()}`);
      // getAllCourts returns paginated data: res.data.data.data
      const courtsList = res.data.data?.data || res.data.data || [];
      setCourts(courtsList);
    } catch (err) {
      console.error("Error fetching courts:", err);
      // Mockup fallbacks
      setCourts([
        {
          id: 1,
          name: "Sân Bóng Đá Mini Rạch Miễu",
          address: "Hoa Phượng, Phú Nhuận, TPHCM",
          status: "pending",
          is_active: true,
          owner: { name: "Nguyễn Văn Chủ Sân", email: "owner@gmail.com" },
          description: "Sân cỏ nhân tạo chất lượng cao, có ánh sáng ban đêm.",
        },
        {
          id: 2,
          name: "Sân Cầu Lông Kỳ Hòa",
          address: "Sư Vạn Hạnh, Quận 10, TPHCM",
          status: "approved",
          is_active: true,
          owner: { name: "Trần Thị Chủ Sân", email: "owner2@gmail.com" },
          description: "Sân trong nhà lót thảm cao su êm ái.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCourts();
  }, [statusFilter]);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourts();
  };


  const handleToggleActive = async (court) => {
    try {
      setActionLoading(court.id);
      const res = await axiosClient.put(`/admin/courts/${court.id}/toggle-active`);
      setCourts((prev) =>
        prev.map((c) =>
          c.id === court.id ? { ...c, is_active: !c.is_active } : c
        )
      );
      if (selectedCourt && selectedCourt.id === court.id) {
        setSelectedCourt((prev) => ({ ...prev, is_active: !prev.is_active }));
      }
      alert(res.data.message || "Cập nhật trạng thái hoạt động thành công!");
    } catch (err) {
      console.error("Error toggling active status:", err);
      alert(err.response?.data?.message || "Lỗi khi cập nhật trạng thái hoạt động!");
    } finally {
      setActionLoading(null);
    }
  };


  const handleApprove = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn duyệt sân này không?")) return;


    try {
      setActionLoading(id);
      const res = await axiosClient.put(`/admin/courts/${id}/approve`);
      setCourts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "approved" } : c))
      );
      if (selectedCourt && selectedCourt.id === id) {
        setSelectedCourt((prev) => ({ ...prev, status: "approved" }));
      }
      alert(res.data.message || "Duyệt sân thành công!");
    } catch (err) {
      console.error("Error approving court:", err);
      alert(err.response?.data?.message || "Lỗi khi duyệt sân!");
    } finally {
      setActionLoading(null);
    }
  };


  const handleRejectClick = (court) => {
    setSelectedCourt(court);
    setRejectReason("");
    setShowRejectModal(true);
  };


  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      alert("Vui lòng nhập lý do từ chối!");
      return;
    }


    try {
      setActionLoading(selectedCourt.id);
      const res = await axiosClient.put(`/admin/courts/${selectedCourt.id}/reject`, {
        reason: rejectReason,
      });


      setCourts((prev) =>
        prev.map((c) =>
          c.id === selectedCourt.id
            ? { ...c, status: "rejected", rejection_reason: rejectReason }
            : c
        )
      );
      setSelectedCourt((prev) => ({
        ...prev,
        status: "rejected",
        rejection_reason: rejectReason,
      }));
      setShowRejectModal(false);
      alert(res.data.message || "Từ chối duyệt sân thành công!");
    } catch (err) {
      console.error("Error rejecting court:", err);
      alert(err.response?.data?.message || "Lỗi khi từ chối duyệt sân!");
    } finally {
      setActionLoading(null);
    }
  };


  const handleViewDetail = async (court) => {
    try {
      // Get detailed court (includes sub-fields and prices)
      const res = await axiosClient.get(`/admin/courts/${court.id}`);
      setSelectedCourt(res.data.data);
    } catch (err) {
      console.error("Error fetching detail:", err);
      setSelectedCourt(court);
    }
  };


  return (
    <AdminLayout>
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-gray-800">Quản lý địa điểm</h2>
            <p className="text-muted">Xem, phê duyệt, từ chối và quản lý trạng thái hoạt động các sân thể thao</p>
          </div>
          <button onClick={fetchCourts} className="btn btn-outline-primary">
            Làm mới
          </button>
        </div>


        {/* Filters */}
        <div className="card shadow-sm border-0 p-3 mb-4 bg-white rounded-4">
          <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-light border-0 py-2.5">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0 py-2.5"
                  placeholder="Tìm theo tên sân..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>


            <div className="col-md-3">
              <select
                className="form-select bg-light border-0 py-2.5"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái duyệt</option>
                <option value="pending">Chờ duyệt (Pending)</option>
                <option value="approved">Đã duyệt (Approved)</option>
                <option value="rejected">Bị từ chối (Rejected)</option>
              </select>
            </div>


            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill fw-bold">
                Tìm kiếm
              </button>
            </div>


            <div className="col-md-2 text-end">
              <span className="badge bg-secondary-subtle text-secondary px-3 py-2 rounded-pill fw-bold">
                Tìm thấy: {courts.length} sân
              </span>
            </div>
          </form>
        </div>


        {/* Courts Table */}
        <div className="card shadow-sm border-0 bg-white rounded-4 overflow-hidden">
          {loading ? (
            <div className="d-flex flex-column justify-content-center align-items-center py-5">
              <FaSpinner className="animate-spin text-primary fs-2 mb-3" />
              <p className="text-muted">Đang tải dữ liệu sân thể thao...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-muted">
                  <tr>
                    <th className="px-4 py-3 border-0">Địa điểm (Sân)</th>
                    <th className="py-3 border-0">Chủ sở hữu (Owner)</th>
                    <th className="py-3 border-0">Trạng thái duyệt</th>
                    <th className="py-3 border-0 text-center">Hoạt động</th>
                    <th className="px-4 py-3 border-0 text-end">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {courts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        Không tìm thấy địa điểm nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    courts.map((court) => (
                      <tr key={court.id} className="border-bottom border-light">
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="bg-light p-2.5 rounded-3 text-primary">
                              <FaStore className="fs-3" />
                            </div>
                            <div>
                              <h6 className="mb-1 fw-bold text-dark">{court.name}</h6>
                              <span className="text-muted small d-flex align-items-center gap-1">
                                <FaMapMarkerAlt className="text-danger small" /> {court.address}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="d-flex flex-column">
                            <span className="fw-semibold text-dark">{court.owner?.name || "N/A"}</span>
                            <span className="text-muted small">{court.owner?.email || ""}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          {court.status === "pending" && (
                            <span className="badge bg-warning-subtle text-warning px-3 py-1.5 rounded-pill fw-bold">
                              Chờ duyệt
                            </span>
                          )}
                          {court.status === "approved" && (
                            <span className="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-bold">
                              Đã duyệt
                            </span>
                          )}
                          {court.status === "rejected" && (
                            <span className="badge bg-danger-subtle text-danger px-3 py-1.5 rounded-pill fw-bold">
                              Từ chối
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => handleToggleActive(court)}
                            disabled={actionLoading === court.id}
                            className={`btn btn-sm py-1.5 px-3 rounded-pill fw-bold ${
                              court.is_active ? "btn-success text-white" : "btn-outline-danger"
                            }`}
                          >
                            {court.is_active ? "Hoạt động" : "Đã khóa"}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-end">
                          <div className="d-flex gap-2 justify-content-end">
                            <button
                              onClick={() => handleViewDetail(court)}
                              className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 rounded-pill px-3"
                            >
                              <FaEye /> Chi tiết
                            </button>
                            {court.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApprove(court.id)}
                                  disabled={actionLoading === court.id}
                                  className="btn btn-sm btn-success text-white d-inline-flex align-items-center gap-1 rounded-pill px-3"
                                >
                                  <FaCheck /> Duyệt
                                </button>
                                <button
                                  onClick={() => handleRejectClick(court)}
                                  className="btn btn-sm btn-danger text-white d-inline-flex align-items-center gap-1 rounded-pill px-3"
                                >
                                  <FaTimes /> Từ chối
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>


        {/* Detailed Modal Overlay */}
        {selectedCourt && !showRejectModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow-lg">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold text-dark fs-4">Chi tiết địa điểm</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedCourt(null)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-4">
                    <div className="col-12">
                      <h4 className="fw-bold text-primary mb-1">{selectedCourt.name}</h4>
                      <p className="text-muted d-flex align-items-center gap-1">
                        <FaMapMarkerAlt className="text-danger" /> {selectedCourt.address}
                      </p>
                    </div>


                    <div className="col-md-6">
                      <div className="bg-light p-3 rounded-4">
                        <h6 className="fw-bold text-dark mb-2">Thông tin chủ sân</h6>
                        <p className="mb-1 text-dark">
                          <strong>Tên:</strong> {selectedCourt.owner?.name}
                        </p>
                        <p className="mb-0 text-dark">
                          <strong>Email:</strong> {selectedCourt.owner?.email}
                        </p>
                      </div>
                    </div>


                    <div className="col-md-6">
                      <div className="bg-light p-3 rounded-4">
                        <h6 className="fw-bold text-dark mb-2">Trạng thái hiện tại</h6>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <strong>Duyệt:</strong>
                          {selectedCourt.status === "pending" && (
                            <span className="badge bg-warning-subtle text-warning fw-bold">Chờ duyệt</span>
                          )}
                          {selectedCourt.status === "approved" && (
                            <span className="badge bg-success-subtle text-success fw-bold">Đã duyệt</span>
                          )}
                          {selectedCourt.status === "rejected" && (
                            <span className="badge bg-danger-subtle text-danger fw-bold">Từ chối</span>
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <strong>Hoạt động:</strong>
                          <span
                            className={`badge ${
                              selectedCourt.is_active
                                ? "bg-success text-white"
                                : "bg-secondary text-white"
                            } fw-bold`}
                          >
                            {selectedCourt.is_active ? "Đang hoạt động" : "Ngừng hoạt động"}
                          </span>
                        </div>
                      </div>
                    </div>


                    <div className="col-12">
                      <div className="border border-light p-3 rounded-4">
                        <h6 className="fw-bold text-dark mb-2">Mô tả chi tiết</h6>
                        <p className="text-muted mb-0">{selectedCourt.description || "Không có mô tả."}</p>
                      </div>
                    </div>


                    {selectedCourt.rejection_reason && (
                      <div className="col-12">
                        <div className="bg-danger-subtle border-start border-danger border-4 p-3 rounded-3">
                          <h6 className="fw-bold text-danger mb-1">Lý do từ chối duyệt:</h6>
                          <p className="text-dark mb-0">{selectedCourt.rejection_reason}</p>
                        </div>
                      </div>
                    )}


                    {selectedCourt.fields && selectedCourt.fields.length > 0 ? (
                      <div className="col-12">
                        <h6 className="fw-bold text-dark mb-2">Danh sách sân con ({selectedCourt.fields.length})</h6>
                        <div className="row g-2">
                          {selectedCourt.fields.map((field) => (
                            <div key={field.id} className="col-md-6">
                              <div className="p-3 border rounded-3 bg-light">
                                <span className="fw-bold text-dark">{field.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="col-12">
                        <h6 className="fw-bold text-dark mb-2">Danh sách sân con (0)</h6>
                        <div className="alert alert-light border border-dashed rounded-3 p-3 text-center mb-0">
                          <p className="text-muted small mb-0">
                            Cụm sân này hiện tại chưa có sân con nào được cấu hình trong hệ thống.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer border-0 p-3">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill px-4"
                    onClick={() => setSelectedCourt(null)}
                  >
                    Đóng
                  </button>
                  {selectedCourt.status === "pending" && (
                    <>
                      <button
                        type="button"
                        className="btn btn-danger text-white rounded-pill px-4"
                        onClick={() => handleRejectClick(selectedCourt)}
                      >
                        Từ chối
                      </button>
                      <button
                        type="button"
                        className="btn btn-success text-white rounded-pill px-4"
                        onClick={() => handleApprove(selectedCourt.id)}
                      >
                        Duyệt sân này
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Rejection modal with reason */}
        {showRejectModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow-lg">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold text-dark">Lý do từ chối duyệt</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowRejectModal(false)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <p className="text-muted mb-3">
                    Vui lòng nhập lý do từ chối duyệt sân <strong>{selectedCourt?.name}</strong>. Chủ sân sẽ nhận được thông báo kèm lý do này.
                  </p>
                  <textarea
                    className="form-control rounded-3"
                    rows="4"
                    placeholder="Ví dụ: Hình ảnh sân không rõ ràng, địa chỉ không chính xác..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  ></textarea>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill px-4"
                    onClick={() => setShowRejectModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger text-white rounded-pill px-4"
                    onClick={handleRejectSubmit}
                    disabled={actionLoading === selectedCourt?.id}
                  >
                    {actionLoading === selectedCourt?.id ? "Đang gửi..." : "Gửi từ chối"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


export default Venues;



