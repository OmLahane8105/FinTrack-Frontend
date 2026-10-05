import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);


  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {

      await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      setSuccess(
        "Registration successful. You can now login."
      );

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error: unknown) {

      console.error(error);

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;

      setError(
        message || "Registration failed"
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>FinTrack</h1>

        <h2>Create Account</h2>


        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {success && (
          <div className="success-message">
            {success}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />

          </div>


          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

          </div>


          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              minLength={6}
              required
            />

          </div>


          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? "Creating..." : "Register"}
          </button>

        </form>


        <p className="auth-link">

          Already have an account?

          {" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}