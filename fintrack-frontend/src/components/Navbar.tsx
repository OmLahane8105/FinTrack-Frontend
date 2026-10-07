import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type Notification,
} from "../api/notificationsApi";

import fintrackLogo from "../assets/fintrack-logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [notificationsLoading, setNotificationsLoading] =
    useState(false);

  const handleLogout = async () => {
    setMoreOpen(false);
    setMobileOpen(false);
    setNotificationsOpen(false);

    await logout();
    navigate("/login");
  };

  const closeMenus = () => {
    setMoreOpen(false);
    setMobileOpen(false);
    setNotificationsOpen(false);
  };

  const loadNotifications = async () => {
    try {
      setNotificationsLoading(true);

      const data = await getNotifications();

      setNotifications(data);

      const unreadResponse =
        await getUnreadNotificationCount();

      setUnreadCount(unreadResponse.count);
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error
      );
    } finally {
      setNotificationsLoading(false);
    }
  };

  const toggleNotifications = async () => {
    setMoreOpen(false);

    const nextOpen = !notificationsOpen;

    setNotificationsOpen(nextOpen);

    if (nextOpen) {
      await loadNotifications();
    }
  };

  const handleNotificationClick = async (
    notification: Notification
  ) => {
    if (notification.read) {
      return;
    }

    try {
      await markNotificationAsRead(notification.id);

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, read: true }
            : item
        )
      );

      setUnreadCount((current) =>
        Math.max(0, current - 1)
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      await markAllNotificationsAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;

    const fetchUnreadCount = async () => {
      try {
        const response =
          await getUnreadNotificationCount();

        if (!cancelled) {
          setUnreadCount(response.count);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load notification count:",
            error
          );
        }
      }
    };

    fetchUnreadCount();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const formatNotificationTime = (
    createdAt: string
  ) => {
    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <nav className="navbar">

      <div className="navbar-brand">
        <Link
          to="/dashboard"
          onClick={closeMenus}
          aria-label="FinTrack Dashboard"
        >
          <img
            src={fintrackLogo}
            alt="FinTrack"
            className="navbar-logo"
          />
        </Link>
      </div>

      <button
        type="button"
        className="navbar-mobile-toggle"
        onClick={() => {
          setMobileOpen((open) => !open);
          setNotificationsOpen(false);
          setMoreOpen(false);
        }}
        aria-label="Toggle navigation"
        aria-expanded={mobileOpen}
      >
        ☰
      </button>

      <div
        className={`navbar-content ${
          mobileOpen ? "navbar-content-open" : ""
        }`}
      >

        <div className="navbar-links">

          <Link
            to="/dashboard"
            onClick={closeMenus}
          >
            Dashboard
          </Link>

          <Link
            to="/accounts"
            onClick={closeMenus}
          >
            Accounts
          </Link>

          <Link
            to="/transactions"
            onClick={closeMenus}
          >
            Transactions
          </Link>

          <Link
            to="/categories"
            onClick={closeMenus}
          >
            Categories
          </Link>

          <Link
            to="/transfers"
            onClick={closeMenus}
          >
            Transfers
          </Link>

          <Link
            to="/budgets"
            onClick={closeMenus}
          >
            Budgets
          </Link>

          <Link
            to="/goals"
            onClick={closeMenus}
          >
            Goals
          </Link>

          <Link
            to="/recurring-transactions"
            onClick={closeMenus}
          >
            Recurring
          </Link>

          <Link
            to="/reports"
            onClick={closeMenus}
          >
            Reports
          </Link>

          <Link
            to="/ai"
            onClick={closeMenus}
          >
            AI Assistant
          </Link>

          <div className="navbar-more">

            <button
              type="button"
              className="navbar-more-button"
              onClick={() => {
                setMoreOpen((open) => !open);
                setNotificationsOpen(false);
              }}
            >
              More

              <span className="navbar-more-arrow">
                ▼
              </span>
            </button>

            {moreOpen && (
              <div className="navbar-dropdown">

                <Link
                  to="/insights"
                  onClick={closeMenus}
                >
                  Financial Insights
                </Link>

              </div>
            )}

          </div>

        </div>

        <div className="navbar-user-links">

          <div className="navbar-notifications">

            <button
              type="button"
              className="navbar-notification-button"
              onClick={toggleNotifications}
              aria-label="Notifications"
            >
              <span className="navbar-notification-icon">
                🔔
              </span>

              {unreadCount > 0 && (
                <span className="navbar-notification-badge">
                  {unreadCount > 9
                    ? "9+"
                    : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="navbar-notification-dropdown">

                <div className="navbar-notification-header">

                  <h3>Notifications</h3>

                  <div>
                    <span>
                      {unreadCount} unread
                    </span>

                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                    >
                      Mark all as read
                    </button>
                  </div>

                </div>

                <div className="navbar-notification-list">

                  {notificationsLoading ? (
                    <div className="navbar-notification-empty">
                      Loading notifications...
                    </div>

                  ) : notifications.length === 0 ? (
                    <div className="navbar-notification-empty">

                      <div className="navbar-notification-empty-icon">
                        🔔
                      </div>

                      <strong>
                        No notifications
                      </strong>

                      <span>
                        You're all caught up.
                      </span>

                    </div>

                  ) : (
                    notifications.map(
                      (notification) => (
                        <button
                          type="button"
                          key={notification.id}
                          className={`navbar-notification-item ${
                            notification.read
                              ? ""
                              : "navbar-notification-unread"
                          }`}
                          onClick={() =>
                            handleNotificationClick(
                              notification
                            )
                          }
                        >

                          <div className="navbar-notification-item-top">

                            <strong>
                              {notification.title}
                            </strong>

                            {!notification.read && (
                              <span className="navbar-notification-dot" />
                            )}

                          </div>

                          <p>
                            {notification.message}
                          </p>

                          <span className="navbar-notification-time">
                            {formatNotificationTime(
                              notification.createdAt
                            )}
                          </span>

                        </button>
                      )
                    )
                  )}

                </div>

              </div>
            )}

          </div>

          <Link
            to="/profile"
            onClick={closeMenus}
          >
            Profile
          </Link>

          <button
            type="button"
            className="navbar-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

    </nav>
  );
}
