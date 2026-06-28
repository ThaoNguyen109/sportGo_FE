import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Register() {

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Đăng ký thành công!");
  };

  return (
    <>
      <style>{`

        body{
          background: #f8f9fa;
          font-family: Arial, Helvetica, sans-serif;
          overflow-x: hidden;
        }

        /* NAVBAR */

        .navbar{
          padding: 14px 0;
        }

        .navbar-brand{
          font-size: 36px;
          font-weight: bold;
        }

        .navbar-brand span{
          color: #17c1e8;
        }

        .nav-link{
          margin: 0 14px;
          font-weight: 600;
          color: #222 !important;
        }

        .btn-login{
          border: 1px solid #ccc;
          background: white;
          padding: 8px 18px;
          border-radius: 8px;
          transition: 0.3s;
          font-weight: 600;
        }

        .btn-login:hover{
          background: #f1f1f1;
        }

        .btn-register{
          border: none;
          background: #111;
          color: white;
          padding: 8px 18px;
          border-radius: 8px;
          transition: 0.3s;
          font-weight: 600;
        }

        .btn-register:hover{
          background: #222;
        }

        /* REGISTER */

        .register-section{
          min-height: 90vh;
          display: flex;
          align-items: center;
          padding: 60px 0;
        }

        .welcome-text{
          font-size: 34px;
          font-weight: bold;
        }

        .welcome-text span{
          color: #17c1e8;
        }

        .register-title{
          font-size: 48px;
          font-weight: bold;
          margin-top: 10px;
          margin-bottom: 30px;
        }

        .google-btn{
          width: 100%;
          border: 1px solid #ccc;
          background: white;
          padding: 14px;
          border-radius: 10px;
          font-weight: 600;
          transition: 0.3s;
        }

        .google-btn:hover{
          background: #f3f3f3;
        }

        .or-text{
          text-align: center;
          margin: 22px 0;
          color: #777;
        }

        .form-label{
          font-weight: 600;
        }

        .form-control{
          height: 55px;
          border-radius: 10px;
        }

        .policy-text{
          font-size: 15px;
          color: #555;
          line-height: 1.7;
        }

        .policy-text a{
          text-decoration: none;
          font-weight: bold;
        }

        .robot-wrapper{
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .robot-img{
          width: 520px;
          max-width: 100%;
        }

        /* MOBILE */

        @media(max-width: 992px){

          .register-title{
            font-size: 36px;
          }

          .welcome-text{
            font-size: 28px;
          }

          .robot-wrapper{
            margin-top: 40px;
          }

        }

      `}</style>

      {/* NAVBAR */}

      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">

        <div className="container">

          <a href="#" className="navbar-brand text-primary">
            Sport <span>Booking</span>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">

            <ul className="navbar-nav mx-auto">

              <li className="nav-item">
                <a href="#" className="nav-link">
                  Trang chủ
                </a>
              </li>

              <li className="nav-item">
                <a href="#" className="nav-link">
                  Bản đồ
                </a>
              </li>

              <li className="nav-item">
                <a href="#" className="nav-link">
                  Giới thiệu
                </a>
              </li>

              <li className="nav-item">
                <a href="#" className="nav-link">
                  Liên hệ
                </a>
              </li>

            </ul>

            <div className="d-flex gap-2">

              <button className="btn-login">
                Đăng nhập
              </button>

              <button className="btn-register">
                Đăng ký
              </button>

            </div>

          </div>

        </div>

      </nav>

      {/* REGISTER */}

      <section className="register-section">

        <div className="container">

          <div className="row align-items-center">

            {/* LEFT */}

            <div className="col-lg-6">

              <div className="welcome-text">
                Chào mừng bạn đến với
                <span> Sport Booking</span>
              </div>

              <div className="register-title">
                Đăng ký tài khoản
              </div>

              {/* GOOGLE POLICY */}

              <div className="form-check mb-3">

                <input
                  className="form-check-input"
                  type="checkbox"
                  id="googleAgree"
                />

                <label
                  className="form-check-label policy-text"
                  htmlFor="googleAgree"
                >
                  Bằng việc đăng ký bằng tài khoản Google,
                  bạn đồng ý với các

                  <a href="#"> Điều khoản dịch vụ </a>

                  và

                  <a href="#"> Chính sách quyền riêng tư </a>

                  của SportBooking
                </label>

              </div>

              {/* GOOGLE BUTTON */}

              <button className="google-btn" sx={{color: "#000000" }} >

                <i className="fa-brands fa-google text-danger" sx={{color: "#000000"}}></i>

                {" "}Đăng ký bằng Google

              </button>

              <div className="or-text">
                hoặc
              </div>

              {/* FORM */}

              <form onSubmit={handleSubmit}>

                {/* NAME */}

                <div className="mb-3">

                  <label className="form-label">

                    Họ và Tên
                    <span className="text-danger"> *</span>

                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập họ và tên"
                    required
                  />

                </div>

                {/* EMAIL */}

                <div className="mb-3">

                  <label className="form-label">

                    Email
                    <span className="text-danger"> *</span>

                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Nhập email"
                    required
                  />

                </div>

                {/* PHONE */}

                <div className="mb-3">

                  <label className="form-label">

                    Số điện thoại
                    <span className="text-danger"> *</span>

                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập số điện thoại"
                    required
                  />

                </div>

                {/* PASSWORD */}

                <div className="mb-4">

                  <label className="form-label">

                    Mật khẩu
                    <span className="text-danger"> *</span>

                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Nhập mật khẩu"
                    required
                  />

                </div>

                {/* POLICY */}

                <div className="form-check mb-4">

                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="policyCheck"
                    required
                  />

                  <label
                    className="form-check-label policy-text"
                    htmlFor="policyCheck"
                  >

                    Tôi đã đọc và đồng ý với các

                    <a href="#"> Điều khoản dịch vụ </a>

                    và

                    <a href="#"> Chính sách quyền riêng tư </a>

                    của SportBooking

                  </label>

                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-3 fw-bold"
                >
                  Đăng ký
                </button>

              </form>

            </div>

            {/* RIGHT */}

            <div className="col-lg-6">

              <div className="robot-wrapper">

                <img
                  src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                  alt="Robot"
                  className="robot-img"
                />

              </div>

            </div>

          </div>

        </div>

      </section>
    </>
  );
}

export default Register;