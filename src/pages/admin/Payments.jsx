import AdminLayout from "../../Layouts/AdminLayout";

function Payments() {

  return (
    <AdminLayout>

      <div className="filter-box">

        <div className="row g-3">

          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Tìm mã giao dịch..."
            />
          </div>

        </div>

      </div>

      <div className="payment-card">

        <h4 className="fw-bold">
          Mã giao dịch: #64361729707469
        </h4>

        <p className="text-secondary">
          16:53 17/01/2026
        </p>

        <h5 className="mt-4">
          DINKZONE
        </h5>

        <div className="border rounded p-3 mt-3">

          <div className="d-flex justify-content-between">

            <div>
              <h6>Pickleball</h6>
              <small>3 x 700 ₫</small>
            </div>

            <h6>2.100 ₫</h6>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
}

export default Payments;