import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axiosClient from "../../api/axiosClient";
function Register() {
  // Khởi tạo state khớp với cấu trúc Validator của API Laravel
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    role: "user", // Mặc định là user
  });

  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(false);

  // Xử lý thay đổi dữ liệu ô nhập
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi cũ của ô đó khi người dùng đang gõ lại
    if (errorMessages[name]) {
      setErrorMessages((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Xử lý chọn vai trò (role)
  const handleRoleChange = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  // Gửi dữ liệu đăng ký lên API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessages({});

    try {
      const response = await axiosClient.post("/register", formData);
      
      // Nếu API trả về Token (đăng nhập hộ sau khi đăng ký thành công như trong code Service)
      if (response.data.data && response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        localStorage.setItem("isLoggedIn", "true");
      }

      alert("Đăng ký thành công!");
      window.location.href = "/"; // Hoặc chuyển hướng tùy ý bạn
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Bắt lỗi validate trả về từ Laravel Validator
        setErrorMessages(error.response.data.errors || {});
      } else {
        alert(error.response?.data?.message || "Đã có lỗi hệ thống xảy ra.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        body {
          background: #f4f7f6;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          overflow-x: hidden;
        }

        /* NAVBAR */
        .navbar {
          padding: 12px 0;
          border-bottom: 1px solid #eaeaea;
        }

        .navbar-brand {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .nav-link {
          margin: 0 10px;
          font-weight: 500;
          color: #4a5568 !important;
          transition: color 0.2s ease;
        }

        .nav-link:hover {
          color: #17c1e8 !important;
        }

        .btn-login {
          border: 1px solid #e2e8f0;
          background: white;
          padding: 8px 20px;
          border-radius: 8px;
          transition: all 0.3s ease;
          font-weight: 600;
          color: #4a5568;
        }

        .btn-login:hover {
          background: #f7fafc;
          border-color: #cbd5e0;
        }

        .btn-register-nav {
          border: none;
          background: #111;
          color: white;
          padding: 8px 20px;
          border-radius: 8px;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        /* REGISTER SECTION */
        .register-section {
          min-height: calc(100vh - 73px);
          display: flex;
          align-items: center;
          padding: 30px 0;
        }

        .register-card {
          background: #ffffff;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          max-width: 850px;
          margin: 0 auto;
        }

        .welcome-text {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #a0aec0;
          margin-bottom: 5px;
        }

        .register-title {
          font-size: 30px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 25px;
        }

        /* ROLE SELECTOR BUTTONS */
        .role-selector {
          display: flex;
          gap: 15px;
          margin-bottom: 25px;
        }

        .role-box {
          flex: 1;
          border: 2px solid #e2e8f0;
          padding: 12px;
          border-radius: 10px;
          text-align: center;
          cursor: pointer;
          font-weight: 600;
          color: #718096;
          transition: all 0.2s ease;
        }

        .role-box:hover {
          border-color: #cbd5e0;
          color: #4a5568;
        }

        .role-box.active {
          border-color: #17c1e8;
          background-color: rgba(23, 193, 232, 0.06);
          color: #17c1e8;
        }

        /* INPUT FIELD CUSTOM */
        .input-group-custom {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-group-custom i {
          position: absolute;
          left: 16px;
          color: #a0aec0;
          font-size: 16px;
          z-index: 5;
        }

        .input-group-custom .form-control {
          height: 48px;
          padding-left: 46px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background-color: #f8fafc;
          font-size: 15px;
          transition: all 0.3s ease;
        }

        .input-group-custom .form-control:focus {
          background-color: #fff;
          border-color: #17c1e8;
          box-shadow: 0 0 0 3px rgba(23, 193, 232, 0.15);
        }

        .form-label {
          font-weight: 600;
          font-size: 14px;
          color: #4a5568;
          margin-bottom: 6px;
        }

        .error-text {
          font-size: 13px;
          color: #e53e3e;
          margin-top: 4px;
        }

        /* BUTTONS */
        .btn-submit-form {
          height: 48px;
          border-radius: 10px;
          background: linear-gradient(135deg, #17c1e8 0%, #0084ff 100%);
          border: none;
          color: white;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .btn-submit-form:hover:not(:disabled) {
          opacity: 0.95;
          box-shadow: 0 4px 12px rgba(23, 193, 232, 0.25);
        }

        .btn-submit-form:disabled {
          background: #cbd5e0;
          cursor: not-allowed;
        }

        .policy-text {
          font-size: 13.5px;
          color: #718096;
        }

        .policy-text a {
          text-decoration: none;
          color: #17c1e8;
          font-weight: 600;
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top">
        <div className="container">
          <a href="#" className="navbar-brand text-dark">
            Sport <span style={{ color: "#17c1e8" }}>Booking</span>
          </a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item"><a href="#" className="nav-link">Trang chủ</a></li>
              <li className="nav-item"><a href="#" className="nav-link">Bản đồ</a></li>
              <li className="nav-item"><a href="#" className="nav-link">Giới thiệu</a></li>
              <li className="nav-item"><a href="#" className="nav-link">Liên hệ</a></li>
            </ul>
            <div className="d-flex gap-2">
              <button className="btn-login">Đăng nhập</button>
              <button className="btn-register-nav">Đăng ký</button>
            </div>
          </div>
        </div>
      </nav>

      {/* REGISTER FORM */}
      <section className="register-section">
        <div className="container">
          <div className="register-card">
            <div className="welcome-text">Chào mừng bạn đến với Sport Booking</div>
            <div className="register-title">Đăng ký tài khoản</div>

            <form onSubmit={handleSubmit}>
              
              {/* VAI TRÒ (ROLE SELECTOR) */}
              <div className="mb-4">
                <label className="form-label">Bạn là ai? <span className="text-danger">*</span></label>
                <div className="role-selector">
                  <div 
                    className={`role-box ${formData.role === "user" ? "active" : ""}`}
                    onClick={() => handleRoleChange("user")}
                  >
                    <i className="fa-solid fa-user-tennis me-2"></i> Người Đặt Sân (User)
                  </div>
                  <div 
                    className={`role-box ${formData.role === "owner" ? "active" : ""}`}
                    onClick={() => handleRoleChange("owner")}
                  >
                    <i className="fa-solid fa-file-invoice-dollar me-2"></i> Chủ Sân (Owner)
                  </div>
                </div>
              </div>

              <div className="row">
                {/* HỌ VÀ TÊN */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Họ và Tên <span className="text-danger">*</span></label>
                  <div className="input-group-custom">
                    <i className="fa-regular fa-user"></i>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Nhập họ và tên"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {errorMessages.name && <div className="error-text">{errorMessages.name[0]}</div>}
                </div>

                {/* SỐ ĐIỆN THOẠI */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <div className="input-group-custom">
                    <i className="fa-solid fa-phone"></i>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      placeholder="Nhập số điện thoại (tùy chọn)"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  {errorMessages.phone && <div className="error-text">{errorMessages.phone[0]}</div>}
                </div>
              </div>

              <div className="row">
                {/* EMAIL */}
                <div className="col-md-12 mb-3">
                  <label className="form-label">Email <span className="text-danger">*</span></label>
                  <div className="input-group-custom">
                    <i className="fa-regular fa-envelope"></i>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Nhập địa chỉ email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {errorMessages.email && <div className="error-text">{errorMessages.email[0]}</div>}
                </div>
              </div>

              <div className="row">
                {/* MẬT KHẨU */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Mật khẩu <span className="text-danger">*</span></label>
                  <div className="input-group-custom">
                    <i className="fa-solid fa-lock"></i>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Tối thiểu 6 ký tự"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {errorMessages.password && <div className="error-text">{errorMessages.password[0]}</div>}
                </div>

                {/* XÁC NHẬN MẬT KHẨU (BẮT BUỘC DO LUẬT CONFIRMED CỦA LARAVEL) */}
                <div className="col-md-6 mb-4">
                  <label className="form-label">Xác nhận mật khẩu <span className="text-danger">*</span></label>
                  <div className="input-group-custom">
                    <i className="fa-solid fa-shield-halved"></i>
                    <input
                      type="password"
                      name="password_confirmation"
                      className="form-control"
                      placeholder="Nhập lại mật khẩu"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* POLICY CHECKBOX */}
              <div className="form-check mb-4">
                <input className="form-check-input" type="checkbox" id="policyCheck" required />
                <label className="form-check-label policy-text" htmlFor="policyCheck">
                  Tôi đã đọc và đồng ý với các <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách bảo mật</a>.
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <button type="submit" className="btn btn-submit-form w-100" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang xử lý tài khoản...
                  </>
                ) : (
                  "Đăng Ký Ngay"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default Register;