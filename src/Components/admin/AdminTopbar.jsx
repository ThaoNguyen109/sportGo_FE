import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import "./AdminTopbar.css";

function AdminTopbar() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Lấy danh sách notification (backend sẽ lấy user từ token)
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      // Check token
      const token = localStorage.getItem("token");
      console.log("🔑 Token:", token ? token.substring(0, 50) + "..." : "KHÔNG CÓ TOKEN");

      // Backend middleware sẽ lấy user từ token tự động
      const res = await axiosClient.get("/notifications");

      console.log("✅ Response notifications:", res.data);

      // Backend return paginated data: { data: { data: [...], current_page, ... } }
      const paginationData = res.data?.data || {};
      const notificationsArray = Array.isArray(paginationData?.data) 
        ? paginationData.data 
        : [];
      
      setNotifications(notificationsArray);
      console.log("📋 Notifications:", notificationsArray);
    } catch (error) {
      console.error("❌ Lỗi lấy thông báo:", error.response?.data || error.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Đánh dấu đã đọc
  const handleMarkAsRead = async (id) => {
    try {
      await axiosClient.post(`/notifications/${id}/mark-as-read`);

      // Cập nhật ngay trên giao diện
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                is_read: true,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Lỗi đánh dấu đã đọc:", error);
    }
  };

  // Định dạng thời gian
  const formatTime = (date) => {
    return new Date(date).toLocaleString("vi-VN");
  };

  const unreadCount = notifications.filter(
    (item) => !item.is_read
  ).length;

  return (
    <div className="admin-topbar">
      <h4>Dashboard Admin</h4>

      <div className="topbar-actions">
        <div className="notification-bell">
          <button
            className="bell-button"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={24} />

            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h5>Thông báo</h5>

                <button
                  className="close-btn"
                  onClick={() => setShowNotifications(false)}
                >
                  ✕
                </button>
              </div>

              <div className="notification-list">
                {loading ? (
                  <div className="empty-notification">
                    Đang tải...
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`notification-item ${
                        notif.is_read ? "read" : "unread"
                      }`}
                      onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                      style={{ cursor: notif.is_read ? 'default' : 'pointer' }}
                    >
                      <div className="notification-content">
                        <p className="notification-message">
                          <strong>{notif.title}</strong>
                        </p>

                        <p>{notif.content}</p>

                        <span className="notification-time">
                          {formatTime(notif.created_at)}
                        </span>
                      </div>

                      {!notif.is_read && (
                        <button
                          className="clear-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notif.id);
                          }}
                          title="Đánh dấu đã đọc"
                        >
                          ✓
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="empty-notification">
                    <p>Không có thông báo nào</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminTopbar;