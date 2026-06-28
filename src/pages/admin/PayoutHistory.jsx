import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../Layouts/AdminLayout";
import axiosClient from "../../api/axiosClient";

import {
  FaSpinner,
  FaMoneyBillWave,
  FaCheckCircle,
  FaSyncAlt,
  FaSearch,
} from "react-icons/fa";

function PayoutHistory() {
  const navigate = useNavigate();
  const [payouts, setPayouts] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchPayouts = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);

        const params = {
          page,
        };

        if (statusFilter) {
          params.status = statusFilter;
        }

        const res = await axiosClient.get(
          "/admin/payouts",
          {
            params,
          }
        );

        const paginationData = res.data?.data;

        setPayouts(
          paginationData?.data || []
        );

        setPagination(
          paginationData || null
        );
      } catch (error) {
        console.error(
          "Fetch payouts error:",
          error
        );

        setPayouts([]);
      } finally {
        setLoading(false);
      }
    },
    [statusFilter]
  );

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  const handlePayPayout = (payoutId) => {
    if (!payoutId) return;

    navigate(`/admin/payouts/confirm/${payoutId}`);
  };

  const filteredPayouts =
    payouts.filter((item) => {
      const keyword =
        searchTerm.toLowerCase();

      return (
        item.owner?.name
          ?.toLowerCase()
          .includes(keyword) ||
        item.owner?.email
          ?.toLowerCase()
          .includes(keyword)
      );
    });

  const formatMoney = (amount) =>
    new Intl.NumberFormat(
      "vi-VN"
    ).format(Number(amount || 0)) +
    " đ";

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(
      date
    ).toLocaleString("vi-VN");
  };

  return (
    <AdminLayout>
      <div className="container-fluid py-4">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h2 className="fw-bold mb-1">
              Lịch sử Payout
            </h2>

            <p className="text-muted mb-0">
              Quản lý tất cả payout đã tạo
            </p>
          </div>

          <button
            onClick={() =>
              fetchPayouts(
                pagination?.current_page ||
                  1
              )
            }
            className="btn btn-outline-primary d-flex align-items-center gap-2"
          >
            <FaSyncAlt />
            Làm mới
          </button>

        </div>

        {/* Summary */}
        <div className="row g-3 mb-4">

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">
                <small className="text-muted">
                  Tổng payout
                </small>

                <h4 className="fw-bold text-primary mt-2 mb-0">
                  {pagination?.total || 0}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">
                <small className="text-muted">
                  Trang hiện tại
                </small>

                <h4 className="fw-bold mt-2 mb-0">
                  {pagination?.current_page ||
                    1}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">
                <small className="text-muted">
                  Tổng số trang
                </small>

                <h4 className="fw-bold mt-2 mb-0">
                  {pagination?.last_page ||
                    1}
                </h4>
              </div>
            </div>
          </div>

        </div>

        {/* Filter */}
        <div className="card shadow-sm border-0 p-3 rounded-4 mb-4">

          <div className="row g-3">

            <div className="col-md-8">

              <div className="input-group">

                <span className="input-group-text bg-light border-0">
                  <FaSearch />
                </span>

                <input
                  type="text"
                  className="form-control bg-light border-0"
                  placeholder="Tìm owner..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            <div className="col-md-4">

              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Tất cả trạng thái
                </option>

                <option value="pending">
                  Chờ thanh toán
                </option>

                <option value="paid">
                  Đã thanh toán
                </option>
              </select>

            </div>

          </div>

        </div>

        {/* Table */}
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">

          {loading ? (
            <div className="text-center py-5">

              <FaSpinner className="fs-2 text-primary animate-spin" />

              <p className="mt-3 text-muted">
                Đang tải payout...
              </p>

            </div>
          ) : (
            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">

                  <tr>
                    <th>ID</th>
                    <th>Owner</th>
                    <th>Email</th>
                    <th>Booking</th>
                    <th>Doanh thu</th>
                    <th>Phí hệ thống</th>
                    <th>Thực nhận</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Ngày thanh toán</th>
                    <th>Ghi chú</th>
                    <th className="text-end">
                      Hành động
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {filteredPayouts.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan="12"
                        className="text-center py-5 text-muted"
                      >
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    filteredPayouts.map(
                      (payout) => (
                        <tr
                          key={payout.id}
                        >
                          <td>
                            #{payout.id}
                          </td>

                          <td className="fw-semibold">
                            {
                              payout.owner
                                ?.name
                            }
                          </td>

                          <td>
                            {
                              payout.owner
                                ?.email
                            }
                          </td>

                          <td>
                            {
                              payout.bookings
                                ?.length
                            }
                          </td>

                          <td>
                            {formatMoney(
                              payout.gross_amount
                            )}
                          </td>

                          <td className="text-danger">
                            {formatMoney(
                              payout.commission_amount
                            )}
                          </td>

                          <td className="text-success fw-bold">
                            {formatMoney(
                              payout.net_amount
                            )}
                          </td>

                          <td>
                            {payout.status ===
                            "paid" ? (
                              <span className="badge bg-success">
                                Đã thanh toán
                              </span>
                            ) : (
                              <span className="badge bg-warning text-dark">
                                Chờ thanh toán
                              </span>
                            )}
                          </td>

                          <td>
                            {formatDate(
                              payout.created_at
                            )}
                          </td>

                          <td>
                            {formatDate(
                              payout.paid_at
                            )}
                          </td>

                          <td>
                            {payout.note ||
                              "-"}
                          </td>

                          <td className="text-end">

                            {payout.status ===
                            "pending" ? (
                              <button
                                onClick={() =>
                                  handlePayPayout(
                                    payout.id
                                  )
                                }
                                className="btn btn-success btn-sm d-inline-flex align-items-center gap-2"
                              >
                                <FaMoneyBillWave />
                                Xác nhận
                              </button>
                            ) : (
                              <span className="text-success d-flex align-items-center justify-content-end gap-2">
                                <FaCheckCircle />
                                Hoàn tất
                              </span>
                            )}

                          </td>

                        </tr>
                      )
                    )
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

export default PayoutHistory;