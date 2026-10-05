import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    setMoreOpen(false);
    setMobileOpen(false);

    await logout();
    navigate("/login");
  };

  const closeMenus = () => {
    setMoreOpen(false);
    setMobileOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard" onClick={closeMenus}>
          FinTrack
        </Link>
      </div>

      <button
        type="button"
        className="navbar-mobile-toggle"
        onClick={() => setMobileOpen((open) => !open)}
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
          <Link to="/dashboard" onClick={closeMenus}>
            Dashboard
          </Link>

          <Link to="/accounts" onClick={closeMenus}>
            Accounts
          </Link>

          <Link to="/transactions" onClick={closeMenus}>
            Transactions
          </Link>

          <Link to="/budgets" onClick={closeMenus}>
            Budgets
          </Link>

          <Link to="/goals" onClick={closeMenus}>
            Goals
          </Link>

          <Link to="/reports" onClick={closeMenus}>
            Reports
          </Link>

          <div className="navbar-more">
            <button
              type="button"
              className="navbar-more-button"
              onClick={() => setMoreOpen((open) => !open)}
              aria-expanded={moreOpen}
            >
              More
              <span className="navbar-more-arrow">
                {moreOpen ? "▲" : "▼"}
              </span>
            </button>

            {moreOpen && (
              <div className="navbar-dropdown">
                <Link to="/transfers" onClick={closeMenus}>
                  Transfers
                </Link>

                <Link to="/categories" onClick={closeMenus}>
                  Categories
                </Link>

                <Link to="/analytics" onClick={closeMenus}>
                  Analytics
                </Link>

                <Link to="/financial-health" onClick={closeMenus}>
                  Financial Health
                </Link>

                <Link to="/financial-insights" onClick={closeMenus}>
                  Financial Insights
                </Link>

                <Link
                  to="/recurring-transactions"
                  onClick={closeMenus}
                >
                  Recurring Transactions
                </Link>

                <Link to="/ai" onClick={closeMenus}>
                  FinTrack AI 🤖 
                </Link>

                {user?.role === "ADMIN" && (
                  <Link to="/admin" onClick={closeMenus}>
                    Admin
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="navbar-user-links">
          <Link to="/profile" onClick={closeMenus}>
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