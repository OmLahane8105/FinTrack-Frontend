import {
  useEffect,
  useState,
} from "react";

import api from "../api/api";

import type { User } from "../types";

export default function Profile() {

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    const loadProfile = async () => {

      try {

        setLoading(true);

        const response =
          await api.get<User>(
            "/api/profile"
          );

        setUser(response.data);

      } catch (error) {

        console.error(error);

        setError(
          "Unable to load profile"
        );

      } finally {

        setLoading(false);
      }
    };

    loadProfile();

  }, []);

  if (loading) {

    return (
      <main className="container">
        <p>Loading profile...</p>
      </main>
    );
  }

  if (error) {

    return (
      <main className="container">
        <div className="error-message">
          {error}
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="container">

      <div className="page-header">

        <div>

          <h1>Profile</h1>

          <p>
            Manage your FinTrack profile.
          </p>

        </div>

      </div>

      <div className="form-card">

        <div className="form-group">

          <label>Name</label>

          <input
            value={user.name}
            readOnly
          />

        </div>

        <div className="form-group">

          <label>Email</label>

          <input
            value={user.email}
            readOnly
          />

        </div>

      </div>

    </main>
  );
}