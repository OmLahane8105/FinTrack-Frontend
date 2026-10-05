import { useEffect, useState } from "react";
import api from "../api/api";

const AdminDashboard = () => {

  const [message, setMessage] =
    useState("Loading...");

  useEffect(() => {

    api.get("/admin/dashboard")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch(() => {
        setMessage("Access denied");
      });

  }, []);

  return (
    <div className="page-container">

      <h1>Admin Dashboard</h1>

      <div className="card">

        <h2>FinTrack Administration</h2>

        <p>{message}</p>

      </div>

    </div>
  );
};

export default AdminDashboard;