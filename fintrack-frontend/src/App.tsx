import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import VerifyEmail from "./pages/VerifyEmail";
import FinancialInsights from "./pages/FinancialInsights";
import OAuth2Callback from "./pages/OAuth2Callback";
import AIAssistant from "./pages/AIAssistant";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Analytics from "./pages/Analytics";
import FinancialHealth from "./pages/FinancialHealth";
import Transfers from "./pages/Transfers";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import RecurringTransactions from "./pages/RecurringTransactions";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Categories from "./pages/Categories";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";

function App() {
  return (
    <Routes>

      {/* Public Routes */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

    <Route
      path="/verify-email"
      element={<VerifyEmail />}
    />
    
      <Route
        path="/oauth2/callback"
        element={<OAuth2Callback />}
      />

      {/* Protected Routes */}

      <Route element={<AdminRoute />}>
      <Route
        path="/admin"
        element={<AdminDashboard />}
      />
    </Route>

      <Route element={<ProtectedRoute />}>

        <Route element={<Layout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/financial-insights"
            element={<FinancialInsights />}
          />

          <Route
            path="/accounts"
            element={<Accounts />}
          />

          <Route
            path="/categories"
            element={<Categories />}
          />

          <Route
            path="/budgets"
            element={<Budgets />}
          />

          <Route
            path="/goals"
            element={<Goals />}
          />

          <Route 
            path="/reports" 
            element={<Reports />} 
          />

          <Route
            path="/recurring-transactions"
            element={<RecurringTransactions />}
          />

          <Route
            path="/transactions"
            element={<Transactions />}
          />

          <Route
            path="/transfers"
            element={<Transfers />}
          />

          <Route
            path="/financial-health"
            element={<FinancialHealth />}
          />

          <Route
            path="/ai"
            element={<AIAssistant />}
          />
          
          <Route
            path="/analytics"
            element={<Analytics />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>

      </Route>

      {/* Default */}

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* Unknown route */}

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;