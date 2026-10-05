import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/api";
import type {
  Budget,
  BudgetRequest,
  Category,
} from "../types";

function getCurrentYear() {
  return new Date().getFullYear();
}

function getCurrentMonth() {
  return new Date().getMonth() + 1;
}

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [year, setYear] = useState(getCurrentYear());
  const [month, setMonth] = useState(getCurrentMonth());

  const [categoryId, setCategoryId] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // const fetchCategories = async () => {
  //   try {
  //     const response = await api.get<Category[]>("/api/categories");
  //     setCategories(response.data);
  //   } catch {
  //     setError("Failed to load categories");
  //   }
  // };

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<Budget[]>("/api/budgets", {
        params: {
          year,
          month,
        },
      });

      setBudgets(response.data);
    } catch {
      setError("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        const response =
          await api.get<Category[]>(
            "/api/categories"
          );

        if (!cancelled) {
          setCategories(response.data);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load categories");
        }
      }
    };

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadBudgets = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<Budget[]>(
            "/api/budgets",
            {
              params: {
                year,
                month,
              },
            }
          );

        if (!cancelled) {
          setBudgets(response.data);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load budgets");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBudgets();

    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const resetForm = () => {
    setCategoryId("");
    setMonthlyLimit("");
    setEditingId(null);
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!categoryId) {
      setError("Please select a category");
      return;
    }

    const limit = Number(monthlyLimit);

    if (limit <= 0) {
      setError("Budget limit must be greater than 0");
      return;
    }

    const request: BudgetRequest = {
      categoryId: Number(categoryId),
      year,
      month,
      monthlyLimit: limit,
    };

    try {
      if (editingId) {
        await api.put(
          `/api/budgets/${editingId}`,
          request
        );

        setSuccess("Budget updated successfully");
      } else {
        await api.post("/api/budgets", request);

        setSuccess("Budget created successfully");
      }

      resetForm();
      await fetchBudgets();
    } catch (err: unknown) {
        const message =
          axios.isAxiosError(err)
            ? err.response?.data?.message
            : undefined;

        setError(
          message || "Failed to save budget"
        );
      }
  };

  const handleEdit = (budget: Budget) => {
    setEditingId(budget.id);
    setCategoryId(String(budget.categoryId));
    setMonthlyLimit(String(budget.monthlyLimit));
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(`/api/budgets/${id}`);

      setSuccess("Budget deleted successfully");

      await fetchBudgets();
    } catch {
      setError("Failed to delete budget");
    }
  };

  const getProgressWidth = (percentage: number) => {
    return Math.min(Math.max(percentage, 0), 100);
  };

  return (
    <div className="container">

      <div className="page-header">
        <div>
          <h1>Budgets</h1>
          <p>Manage your monthly spending limits.</p>
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
            ? "Edit Budget"
            : "Create Budget"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">
              <label>Category</label>

              <select
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(e.target.value)
                }
              >
                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Monthly Limit</label>

              <input
                type="number"
                min="0.01"
                step="0.01"
                value={monthlyLimit}
                onChange={(e) =>
                  setMonthlyLimit(e.target.value)
                }
                placeholder="10000"
              />
            </div>

          </div>

          <div className="form-actions">

            <button
              type="submit"
              className="primary-button"
            >
              {editingId
                ? "Update Budget"
                : "Create Budget"}
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

      <div className="budget-filter-card">

        <div>
          <label>Year</label>

          <select
            value={year}
            onChange={(e) =>
              setYear(Number(e.target.value))
            }
          >
            {[2025, 2026, 2027].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Month</label>

          <select
            value={month}
            onChange={(e) =>
              setMonth(Number(e.target.value))
            }
          >
            {Array.from(
              { length: 12 },
              (_, index) => index + 1
            ).map((item) => (
              <option key={item} value={item}>
                {new Date(
                  2000,
                  item - 1,
                  1
                ).toLocaleString("en-US", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div className="budgets-section">

        <div className="section-header">
          <h2>Monthly Budgets</h2>

          <span className="transaction-count">
            {budgets.length} budget
            {budgets.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <p>Loading budgets...</p>
        ) : budgets.length === 0 ? (
          <div className="empty-state">
            <h3>No budgets yet</h3>
            <p>
              Create a budget for a category to
              start tracking your spending.
            </p>
          </div>
        ) : (
          <div className="budgets-grid">

            {budgets.map((budget) => (

              <div
                key={budget.id}
                className={`budget-card ${budget.exceeded
                    ? "budget-exceeded"
                    : ""
                  }`}
              >

                <div className="budget-card-header">

                  <div>
                    <h3>
                      {budget.categoryName}
                    </h3>

                    <p>
                      Monthly limit: ₹
                      {budget.monthlyLimit.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  <div className="budget-actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEdit(budget)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(budget.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

                <div className="budget-progress">

                  <div className="budget-progress-bar">

                    <div
                      className="budget-progress-fill"
                      style={{
                        width: `${getProgressWidth(
                          budget.percentageUsed
                        )}%`,
                      }}
                    />

                  </div>

                  <div className="budget-progress-info">

                    <span>
                      {budget.percentageUsed.toFixed(
                        1
                      )}
                      % used
                    </span>

                    <span>
                      {budget.exceeded
                        ? `₹${Math.abs(
                          budget.remaining
                        ).toLocaleString(
                          "en-IN"
                        )} over`
                        : `₹${budget.remaining.toLocaleString(
                          "en-IN"
                        )} remaining`}
                    </span>

                  </div>

                </div>

                <div className="budget-spending">

                  <div>
                    <span>Spent</span>
                    <strong>
                      ₹
                      {budget.spent.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Limit</span>
                    <strong>
                      ₹
                      {budget.monthlyLimit.toLocaleString(
                        "en-IN"
                      )}
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