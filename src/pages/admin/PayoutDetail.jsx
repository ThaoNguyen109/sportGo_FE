import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../../Layouts/AdminLayout";
import axiosClient from "../../api/axiosClient";

import {
  FaArrowLeft,
  FaSpinner,
  FaUniversity,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";

function PayoutDetail() {
  const { ownerId, payoutId } = useParams();
  const navigate = useNavigate();

  const isConfirmMode = Boolean(payoutId);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [payoutData, setPayoutData] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [createdPayout, setCreatedPayout] = useState(null);
  const [paymentNote, setPaymentNote] = useState("");
  const [showBankInfo, setShowBankInfo] = useState(false);

  const activePayoutId = payoutId || createdPayout?.id || payoutData?.id;
  const canConfirmPayment = showBankInfo && payoutData?.status !== "paid";

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN").format(amount || 0) + " đ";

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      if (isConfirmMode) {
        const res = await axiosClient.get(`/admin/payouts/${payoutId}`);
        const payout = res.data?.data;

        if (!payout) {
          alert("Không tìm thấy payout.");
          navigate("/admin/payout-history");
          return;
        }

        setPayoutData(payout);
      } else {
        const payoutRes = await axiosClient.get(
          `/admin/payouts/pending/${ownerId}`
        );

        setPayoutData(payoutRes.data?.data || null);
      }
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Không thể tải dữ liệu payout"
      );

      navigate(isConfirmMode ? "/admin/payout-history" : "/admin/payouts");
    } finally {
      setLoading(false);
    }
  }, [isConfirmMode, ownerId, payoutId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!isConfirmMode || !payoutData?.owner_id) return;

    const fetchBankAccount = async () => {
      try {
        const res = await axiosClient.get(
          `/admin/owners/${payoutData.owner_id}/bank-account`
        );

        setBankAccount(res.data.data);
        setShowBankInfo(true);
      } catch (error) {
        console.error("Fetch bank account error:", error);
      }
    };

    fetchBankAccount();
  }, [isConfirmMode, payoutData]);

  const handleCreatePayout = async () => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn tạo payout cho owner này?"
      )
    ) {
      return;
    }

    try {
      setCreating(true);

      const payoutRes = await axiosClient.post(
        `/admin/payouts/${ownerId}`
      );

      setCreatedPayout(payoutRes.data.data);

      const bankRes = await axiosClient.get(
        `/admin/owners/${ownerId}/bank-account`
      );

      setBankAccount(bankRes.data.data);

      setShowBankInfo(true);

      alert(
        "Tạo payout thành công. Vui lòng chuyển khoản cho owner."
      );
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Không thể tạo payout"
      );
    } finally {
      setCreating(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (
      !window.confirm(
        "Xác nhận admin đã chuyển khoản cho owner?"
      )
    ) {
      return;
    }

    if (!activePayoutId) {
      alert("Không tìm thấy payout để xác nhận.");
      return;
    }

    try {
      setConfirming(true);

      await axiosClient.post(
        `/admin/payouts/${activePayoutId}/pay`,
        {
          note: paymentNote,
        }
      );

      alert("Xác nhận thanh toán thành công");
      navigate("/admin/payout-history");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Không thể xác nhận thanh toán"
      );
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="container-fluid py-5 text-center">
          <FaSpinner className="fs-1 text-primary animate-spin" />
          <p className="mt-3 text-muted">
            Đang tải dữ liệu...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container-fluid py-4">

        {/* Header */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <button
              className="btn btn-outline-secondary mb-3"
              onClick={() => navigate("/admin/payouts")}
            >
              <FaArrowLeft className="me-2" />
              Quay lại
            </button>

            <h2 className="fw-bold mb-1">
              {isConfirmMode ? "Xác nhận thanh toán Payout" : "Chi tiết Payout"}
            </h2>

            <p className="text-muted mb-0">
              {isConfirmMode
                ? "Xem chi tiết payout và tài khoản nhận để xác nhận thanh toán."
                : "Kiểm tra booking trước khi tạo payout."}
            </p>
          </div>

          {!showBankInfo && !isConfirmMode && (
            <button
              className="btn btn-success"
              disabled={creating}
              onClick={handleCreatePayout}
            >
              {creating ? (
                <>
                  <FaSpinner className="me-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <FaMoneyBillWave className="me-2" />
                  Tạo Payout
                </>
              )}
            </button>
          )}

        </div>

        {/* Owner Info */}

        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body">

            <h5 className="fw-bold mb-3">
              Thông tin Owner
            </h5>

            <div className="row">

              <div className="col-md-4">
                <strong>Tên Owner</strong>
                <div>{payoutData?.owner_name}</div>
              </div>

              <div className="col-md-4">
                <strong>Owner ID</strong>
                <div>#{payoutData?.owner_id}</div>
              </div>

              <div className="col-md-4">
                <strong>Số booking</strong>
                <div>{payoutData?.total_bookings}</div>
              </div>

            </div>

          </div>
        </div>

        {/* Summary */}

        <div className="row g-3 mb-4">

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">

                <small className="text-muted">
                  Tổng doanh thu
                </small>

                <h4 className="fw-bold text-primary mt-2">
                  {formatMoney(
                    payoutData?.gross_amount
                  )}
                </h4>

              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">

                <small className="text-muted">
                  Phí hệ thống ({payoutData?.commission_percent}%)
                </small>

                <h4 className="fw-bold text-danger mt-2">
                  {formatMoney(
                    payoutData?.commission_amount
                  )}
                </h4>

              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body">

                <small className="text-muted">
                  Owner nhận
                </small>

                <h4 className="fw-bold text-success mt-2">
                  {formatMoney(
                    payoutData?.net_amount
                  )}
                </h4>

              </div>
            </div>
          </div>

        </div>

        {/* Booking Table */}

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

          <div className="card-header bg-white">
            <h5 className="mb-0 fw-bold">
              Danh sách Booking chờ payout
            </h5>
          </div>

          <div className="table-responsive">

            <table className="table table-hover mb-0">

              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Khách hàng</th>
                  <th>Ngày đặt sân</th>
                  <th>Số tiền</th>
                </tr>
              </thead>

              <tbody>

                {payoutData?.bookings?.map(
                  (booking) => (
                    <tr key={booking.booking_id}>
                      <td>#{booking.booking_id}</td>

                      <td>{booking.user}</td>

                      <td>{booking.booking_date}</td>

                      <td className="fw-bold">
                        {formatMoney(
                          booking.amount
                        )}
                      </td>
                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Hiện sau khi tạo payout */}

        {showBankInfo && (
          <div className="card border-0 shadow-sm rounded-4 mt-4">

            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <FaUniversity className="me-2" />
                Thông tin chuyển khoản
              </h5>
            </div>

            <div className="card-body">

              <div className="alert alert-warning">

                Payout đã được tạo thành công.

                Vui lòng chuyển khoản thủ công cho owner.

              </div>

              <div className="row g-3">

                <div className="col-md-4">
                  <strong>Ngân hàng</strong>
                  <div>
                    {bankAccount?.bank_name}
                  </div>
                </div>

                <div className="col-md-4">
                  <strong>Chủ tài khoản</strong>
                  <div>
                    {bankAccount?.account_name}
                  </div>
                </div>

                <div className="col-md-4">
                  <strong>Số tài khoản</strong>
                  <div>
                    {bankAccount?.account_number}
                  </div>
                </div>

              </div>

              <hr />

              <div className="row align-items-center">

                <div className="col-md-4">

                  <strong>
                    Số tiền cần chuyển
                  </strong>

                  <h3 className="text-success mt-2">
                    {formatMoney(
                      payoutData?.net_amount
                    )}
                  </h3>

                  <div className="text-muted">
                    Payout ID:
                    {" "}
                    #{createdPayout?.id || payoutData?.id}
                  </div>

                </div>

                <div className="col-md-8 text-center">

                  {bankAccount?.qr_image_url && (
                    <img
                      src={bankAccount.qr_image_url}
                      alt="QR Bank"
                      className="img-fluid border rounded"
                      style={{
                        maxWidth: "300px",
                      }}
                    />
                  )}

                </div>

              </div>

              <div className="mt-4">

                {canConfirmPayment && (
                  <>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Ghi chú thanh toán
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={paymentNote}
                        onChange={(e) =>
                          setPaymentNote(e.target.value)
                        }
                        placeholder="Ví dụ: Chuyển khoản hoàn tất vào 12:30"
                      />
                    </div>

                    <button
                      className="btn btn-success mb-3"
                      disabled={confirming}
                      onClick={handleConfirmPayment}
                    >
                      {confirming ? (
                        <>
                          <FaSpinner className="me-2 animate-spin" />
                          Đang xác nhận...
                        </>
                      ) : (
                        <>
                          <FaMoneyBillWave className="me-2" />
                          Đã chuyển khoản - Xác nhận
                        </>
                      )}
                    </button>
                    <hr />
                  </>
                )}

                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate(
                      "/admin/payout-history"
                    )
                  }
                >
                  Quay lại danh sách payout
                </button>

              </div>

            </div>

          </div>
        )}

        <div className="mt-4">

          <div className="alert alert-success border-0">

            <FaCheckCircle className="me-2" />

            Sau khi tạo payout, các booking sẽ được liên kết với payout và xuất hiện trong danh sách lịch sử payout để admin xác nhận thanh toán.

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}

export default PayoutDetail;