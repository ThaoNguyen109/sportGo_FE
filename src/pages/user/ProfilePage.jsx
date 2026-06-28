import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import "./ProfilePage.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../Layouts/MainLayout";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axiosClient from "../../api/axiosClient";

export default function ProfilePage() {
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    role: "",
  });

  const [backupData, setBackupData] = useState(formData);

  // Lấy dữ liệu profile thực tế từ Backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get("/auth/me");
        if (res.data?.user) {
          const user = res.data.user;
          const userProfile = {
            id: user.id || "",
            name: user.name || "",
            phone: user.phone || "",
            email: user.email || "",
            role: user.role || "user",
          };
          setFormData(userProfile);
          setBackupData(userProfile);

          // Đồng bộ lại với localStorage
          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin cá nhân:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setBackupData(formData);
    setIsEdit(true);
    setMessage("");
  };

  const handleSave = () => {
    setIsEdit(false);
    setMessage("success");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const handleCancel = () => {
    setFormData(backupData);
    setIsEdit(false);
    setMessage("cancel");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const handleLogout = async () => {
    const confirm = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (!confirm) return;

    try {
      await axiosClient.post("/auth/logout");
    } catch (error) {
      console.error("Lỗi khi gọi API đăng xuất:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      navigate("/login");
    }
  };
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const handleChangePassword = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "Vui lòng nhập mật khẩu mới";
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Xác nhận mật khẩu mới không khớp";
    }

    setPasswordErrors(errors);

    if (Object.keys(errors).length > 0) return;
    setPasswordSuccess(true);

    setTimeout(() => {
      setPasswordSuccess(false);
    }, 3000);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordErrors({});
  };
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  if (loading) {
    return (
      <MainLayout>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100vh - 90px)" }}>
          <h3 style={{ color: "#2f7d32" }}>Đang tải thông tin cá nhân...</h3>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <div>
              <h1>Thông tin tài khoản</h1>
              <p>Quản lý thông tin cá nhân và trạng thái tài khoản của bạn</p>
            </div>

            {!isEdit && (
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="edit-btn" onClick={handleEdit}>
                  ✎ Chỉnh sửa
                </button>
                <button 
                  className="logout-btn" 
                  onClick={handleLogout}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "0.2s"
                  }}
                  onMouseOver={(e) => e.target.style.background = "#dc2626"}
                  onMouseOut={(e) => e.target.style.background = "#ef4444"}
                >
                  🚪 Đăng xuất
                </button>
              </div>
            )}
          </div>
          {message === "success" && (
            <div className="profile-alert success-alert">
              ✅ Bạn đã thay đổi thành công thông tin tài khoản của mình
            </div>
          )}

          {message === "cancel" && (
            <div className="profile-alert cancel-alert">
              ⚠️ Đã huỷ chỉnh sửa, thông tin không thay đổi
            </div>
          )}

          <div className="profile-card main-info-card">
            <div className="profile-card-title">
              <h3>Thông tin cơ bản</h3>
              <p>Thông tin cá nhân và liên hệ của bạn</p>
            </div>

            <div className="profile-content">
              <div className="avatar-box">
                <div className="profile-avatar">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span>Đã xác thực</span>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <label>Họ và tên</label>
                  {isEdit ? (
                    <input
                      className="edit-input"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  ) : (
                    <div className="info-value">{formData.name}</div>
                  )}
                </div>

                <div className="info-item">
                  <label>Email</label>
                  <div className="info-value">{formData.email}</div>
                  <small>Email không thể thay đổi</small>
                </div>

                <div className="info-item">
                  <label>Số điện thoại</label>
                  {isEdit ? (
                    <input
                      className="edit-input"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  ) : (
                    <div className="info-value">{formData.phone}</div>
                  )}
                </div>

                <div className="info-item">
                  <label>Vai trò</label>
                  <div className="role-badge" style={{ textTransform: "uppercase" }}>
                    {formData.role === "owner" ? "Chủ sân (Owner)" : formData.role === "admin" ? "Quản trị viên (Admin)" : "Khách hàng (User)"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isEdit && (
            <div className="edit-actions">
              <button className="save-btn" onClick={handleSave}>
                Lưu thay đổi
              </button>

              <button className="cancel-edit-btn" onClick={handleCancel}>
                Huỷ
              </button>
            </div>
          )}

          <div className="profile-card">
            <div className="profile-card-title">
              <h3>Thông tin bổ sung</h3>
              <p>Các thông tin khác về tài khoản của bạn</p>
            </div>

            <div className="status-box">
              <div>
                <h4>Trạng thái tài khoản</h4>
                <p>Tài khoản đang hoạt động bình thường</p>
              </div>

              <span className="status-badge">Đang hoạt động</span>
            </div>

            <div className="user-id">
              ID người dùng: #{formData.id || "N/A"}
            </div>
          </div>

          <div className="profile-card password-card">
            <div className="password-row">
              <div>
                <h3>Đổi mật khẩu</h3>
                <p>Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
              </div>

              <button
                className="change-password-btn"
                onClick={() => setShowChangePassword(!showChangePassword)}
              >
                {showChangePassword ? "Ẩn" : "Đổi mật khẩu"}
              </button>
            </div>

            {showChangePassword && (
              <>
                {passwordSuccess && (
                  <div className="success-message">
                    ✅ Đổi mật khẩu thành công
                  </div>
                )}

                <div className="change-password-box">
                  <h3>Thay đổi mật khẩu</h3>
                  <p>Vui lòng nhập mật khẩu hiện tại và mật khẩu mới</p>

                  <label>Mật khẩu hiện tại *</label>

                  <div className="password-input-wrap">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      placeholder="Nhập mật khẩu hiện tại"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                    />

                    <span
                      className="eye-icon"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          current: !showPassword.current,
                        })
                      }
                    >
                      {showPassword.current ? <VisibilityOff /> : <Visibility />}
                    </span>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="password-error">{passwordErrors.currentPassword}</p>
                  )}
                  {(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }

                  <label>Mật khẩu mới *</label>
                  <div className="password-input-wrap">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      placeholder="Nhập mật khẩu mới ít nhất 8 ký tự"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                    />

                    <span
                      className="eye-icon"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          new: !showPassword.new,
                        })
                      }
                    >
                      {showPassword.new ? <VisibilityOff /> : <Visibility />}
                    </span>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="password-error">{passwordErrors.newPassword}</p>
                  )}

                  <label>Xác nhận mật khẩu mới *</label>
                  <div className="password-input-wrap">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu mới"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />

                    <span
                      className="eye-icon"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          confirm: !showPassword.confirm,
                        })
                      }
                    >
                      {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                    </span>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="password-error">{passwordErrors.confirmPassword}</p>
                  )}

                  <div className="password-note">
                    <b>Gợi ý tạo mật khẩu mạnh:</b>
                    <ul>
                      <li>Sử dụng ít nhất 8 ký tự</li>
                      <li>Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                      <li>Không sử dụng thông tin cá nhân dễ đoán</li>
                      <li>Không sử dụng mật khẩu đã dùng ở nơi khác</li>
                    </ul>
                  </div>

                  <div className="password-actions">
                    <button className="save-password-btn" onClick={handleChangePassword}>
                      Đổi mật khẩu
                    </button>

                    <button
                      className="cancel-password-btn"
                      onClick={() => {
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                        setPasswordErrors({});
                        setShowChangePassword(false);
                      }}
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}