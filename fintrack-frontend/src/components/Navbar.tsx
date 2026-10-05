import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const {
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="navbar-brand">
        <Link to="/dashboard">
          FinTrack
        </Link>
      </div>

      <div className="navbar-links">

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/accounts">
          Accounts
        </Link>

        <Link to="/transfers">
          Transfers
        </Link>

        <Link to="/categories">
          Categories
        </Link>

        <Link to="/budgets">
          Budgets
        </Link>

        <Link to="/goals">
          Goals
        </Link>

        <Link to="/analytics">
          Analytics
        </Link>

        <Link to="/reports">
          Reports
        </Link>

        <Link to="/financial-health">
          Financial Health
        </Link>

        <Link to="/financial-insights">
          Financial Insights
        </Link>

        <Link to="/ai">
          🤖 FinTrack AI
        </Link>

        <Link to="/recurring-transactions">
          Recurring
        </Link>

        <Link to="/transactions">
          Transactions
        </Link>

        <Link to="/profile">
          Profile
        </Link>

        {user?.role === "ADMIN" && (
          <Link to="/admin">
            Admin
          </Link>
        )}

        <button
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}