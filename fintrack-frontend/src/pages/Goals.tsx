import axios from "axios";
import { useEffect, useState } from "react";
import api from "../api/api";
import type { Goal, GoalRequest } from "../types";

export default function Goals() {

  const [goals, setGoals] = useState<Goal[]>([]);

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("0");
  const [targetDate, setTargetDate] = useState("");

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<Goal[]>("/api/goals");

      setGoals(response.data);

    } catch (error: unknown) {

      console.error(error);

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;

      setError(
        message || "Failed to load goals"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadGoals = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<Goal[]>("/api/goals");

        if (!cancelled) {
          setGoals(response.data);
        }

      } catch (error: unknown) {

        console.error(error);

        if (!cancelled) {
          const message =
            axios.isAxiosError(error)
              ? error.response?.data?.message
              : undefined;

          setError(
            message || "Failed to load goals"
          );
        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadGoals();

    return () => {
      cancelled = true;
    };
  }, []);

  const resetForm = () => {
    setName("");
    setTargetAmount("");
    setCurrentAmount("0");
    setTargetDate("");
    setEditingId(null);
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {

    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter a goal name");
      return;
    }

    const target = Number(targetAmount);
    const current = Number(currentAmount);

    if (target <= 0) {
      setError(
        "Target amount must be greater than 0"
      );
      return;
    }

    if (current < 0) {
      setError(
        "Current amount cannot be negative"
      );
      return;
    }

    if (current > target) {
      setError(
        "Current amount cannot exceed target amount"
      );
      return;
    }

    if (!targetDate) {
      setError("Please select a target date");
      return;
    }

    const request: GoalRequest = {
      name: name.trim(),
      targetAmount: target,
      currentAmount: current,
      targetDate,
    };

    try {

      if (editingId) {

        await api.put(
          `/api/goals/${editingId}`,
          request
        );

        setSuccess("Goal updated successfully");

      } else {

        await api.post(
          "/api/goals",
          request
        );

        setSuccess("Goal created successfully");
      }

      resetForm();

      await fetchGoals();

    } catch (err: unknown) {

      const message =
        axios.isAxiosError(err)
          ? err.response?.data?.message
          : undefined;

      setError(
        message || "Failed to save goal"
      );
    }
  };

  const handleEdit = (goal: Goal) => {

    setEditingId(goal.id);
    setName(goal.name);
    setTargetAmount(
      String(goal.targetAmount)
    );
    setCurrentAmount(
      String(goal.currentAmount)
    );
    setTargetDate(goal.targetDate);
  };

  const handleDelete = async (id: number) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this goal?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setError("");
      setSuccess("");

      await api.delete(`/api/goals/${id}`);

      setSuccess(
        "Goal deleted successfully"
      );

      await fetchGoals();

    } catch {

      setError("Failed to delete goal");
    }
  };

  return (
    <div className="container">

      <div className="page-header">
        <div>
          <h1>Goals</h1>
          <p>
            Track your savings goals and progress.
          </p>
        </div>
      </div>

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

      <div className="form-card">

        <h2>
          {editingId
            ? "Edit Goal"
            : "Create Goal"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">
              <label>Goal Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Emergency Fund"
              />
            </div>

            <div className="form-group">
              <label>Target Amount</label>

              <input
                type="number"
                min="0.01"
                step="0.01"
                value={targetAmount}
                onChange={(e) =>
                  setTargetAmount(e.target.value)
                }
                placeholder="100000"
              />
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Current Amount</label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={currentAmount}
                onChange={(e) =>
                  setCurrentAmount(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Target Date</label>

              <input
                type="date"
                value={targetDate}
                onChange={(e) =>
                  setTargetDate(e.target.value)
                }
              />
            </div>

          </div>

          <div className="form-actions">

            <button
              type="submit"
              className="primary-button"
            >
              {editingId
                ? "Update Goal"
                : "Create Goal"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      <div className="goals-section">

        <div className="section-header">
          <h2>My Goals</h2>

          <span className="transaction-count">
            {goals.length} goal
            {goals.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (

          <p>Loading goals...</p>

        ) : goals.length === 0 ? (

          <div className="empty-state">
            <h3>No goals yet</h3>

            <p>
              Create your first savings goal.
            </p>
          </div>

        ) : (

          <div className="goals-grid">

            {goals.map((goal) => (

              <div
                key={goal.id}
                className={`goal-card ${
                  goal.completed
                    ? "goal-completed"
                    : ""
                }`}
              >

                <div className="goal-card-header">

                  <div>
                    <h3>{goal.name}</h3>

                    <p>
                      Target: ₹
                      {goal.targetAmount.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  <div className="goal-actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEdit(goal)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(goal.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

                <div className="goal-progress">

                  <div className="goal-progress-bar">

                    <div
                      className="goal-progress-fill"
                      style={{
                        width: `${Math.min(
                          Math.max(
                            goal.percentageCompleted,
                            0
                          ),
                          100
                        )}%`,
                      }}
                    />

                  </div>

                  <div className="goal-progress-info">

                    <span>
                      {goal.percentageCompleted.toFixed(
                        1
                      )}
                      % complete
                    </span>

                    <span>
                      {goal.completed
                        ? "Goal completed"
                        : `₹${goal.remainingAmount.toLocaleString(
                            "en-IN"
                          )} remaining`}
                    </span>

                  </div>

                </div>

                <div className="goal-details">

                  <div>
                    <span>Saved</span>

                    <strong>
                      ₹
                      {goal.currentAmount.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Target Date</span>

                    <strong>
                      {goal.targetDate}
                    </strong>
                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}