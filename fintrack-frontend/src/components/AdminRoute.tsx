import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const AdminRoute = () => {

  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;