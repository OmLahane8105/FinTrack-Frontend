import { useEffect, useState } from "react";

import api from "../api/api";

import type {
  Account,
  Category,
  RecurringFrequency,
  RecurringTransaction,
} from "../types";

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function RecurringTransactions() {

  const [items, setItems] =
    useState<RecurringTransaction[]>([]);

  const [accounts, setAccounts] =
    useState<Account[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [amount, setAmount] =
    useState("");

  const [type, setType] =
    useState<"INCOME" | "EXPENSE">("EXPENSE");

  const [description, setDescription] =
    useState("");

  const [nextExecutionDate, setNextExecutionDate] =
    useState(getToday());

  const [frequency, setFrequency] =
    useState<RecurringFrequency>("MONTHLY");

  const [accountId, setAccountId] =
    useState("");

  const [categoryId, setCategoryId] =
    useState("");

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
        try {
        const [
            recurringResponse,
            accountsResponse,
            categoriesResponse,
        ] = await Promise.all([
            api.get<RecurringTransaction[]>(
            "/api/recurring-transactions"
            ),

            api.get<Account[]>(
            "/api/accounts"
            ),

            api.get<Category[]>(
            "/api/categories"
            ),
        ]);

        if (cancelled) return;

        setItems(recurringResponse.data);
        setAccounts(accountsResponse.data);
        setCategories(categoriesResponse.data);

        } catch {
        if (!cancelled) {
            setError(
            "Failed to load recurring transactions"
            );
        }
        }
    };

    loadInitialData();

    return () => {
        cancelled = true;
    };
    }, []);

  const refreshRecurringTransactions = async () => {
    try {
      const response =
        await api.get<RecurringTransaction[]>(
          "/api/recurring-transactions"
        );

      setItems(response.data);

    } catch {
      setError(
        "Failed to refresh recurring transactions"
      );
    }
  };

  const resetForm = () => {

    setAmount("");
    setType("EXPENSE");
    setDescription("");
    setNextExecutionDate(getToday());
    setFrequency("MONTHLY");
    setAccountId("");
    setCategoryId("");
    setEditingId(null);
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {

    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !amount ||
      Number(amount) <= 0
    ) {
      setError(
        "Amount must be greater than 0"
      );
      return;
    }

    if (!description.trim()) {
      setError(
        "Description is required"
      );
      return;
    }

    if (!accountId) {
      setError(
        "Please select an account"
      );
      return;
    }

    if (!categoryId) {
      setError(
        "Please select a category"
      );
      return;
    }

    const data = {
      amount: Number(amount),
      type,
      description,
      nextExecutionDate,
      frequency,
      accountId: Number(accountId),
      categoryId: Number(categoryId),
    };

    try {

      if (editingId !== null) {

        await api.put(
          `/api/recurring-transactions/${editingId}`,
          data
        );

        setSuccess(
          "Recurring transaction updated"
        );

      } else {

        await api.post(
          "/api/recurring-transactions",
          data
        );

        setSuccess(
          "Recurring transaction created"
        );
      }

      resetForm();
      await refreshRecurringTransactions();

    } catch {
      setError(
        "Failed to save recurring transaction"
      );
    }
  };

  const handleEdit = (
    item: RecurringTransaction
  ) => {

    setEditingId(item.id);

    setAmount(
      String(item.amount)
    );

    setType(item.type);

    setDescription(
      item.description
    );

    setNextExecutionDate(
      item.nextExecutionDate
    );

    setFrequency(
      item.frequency
    );

    setAccountId(
      String(item.accountId)
    );

    setCategoryId(
      String(item.categoryId)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (
    id: number
  ) => {

    if (
      !window.confirm(
        "Delete this recurring transaction?"
      )
    ) {
      return;
    }

    try {

      await api.delete(
        `/api/recurring-transactions/${id}`
      );

      setSuccess(
        "Recurring transaction deleted"
      );

      await refreshRecurringTransactions();

    } catch {
      setError(
        "Failed to delete recurring transaction"
      );
    }
  };

  const toggleActive = async (
    id: number
  ) => {

    try {

      await api.patch(
        `/api/recurring-transactions/${id}/toggle`
      );

      await refreshRecurringTransactions();

    } catch (error) {
        console.error("Toggle error:", error);

        setError(
          "Failed to update status"
        );
      }
  };

  return (
    <div className="container">

      <div className="page-header">
        <div>
          <h1>Recurring Transactions</h1>

          <p>
            Automatically create recurring
            income and expense transactions.
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
            ? "Edit Recurring Transaction"
            : "Add Recurring Transaction"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">
              <label>Amount</label>

              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                placeholder="20000"
              />
            </div>

            <div className="form-group">
              <label>Type</label>

              <select
                value={type}
                onChange={(e) =>
                  setType(
                    e.target.value as
                      | "INCOME"
                      | "EXPENSE"
                  )
                }
              >
                <option value="EXPENSE">
                  Expense
                </option>

                <option value="INCOME">
                  Income
                </option>
              </select>
            </div>

          </div>

          <div className="form-group">
            <label>Description</label>

            <input
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Monthly Rent"
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Next Execution Date</label>

              <input
                type="date"
                value={nextExecutionDate}
                onChange={(e) =>
                  setNextExecutionDate(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>Frequency</label>

              <select
                value={frequency}
                onChange={(e) =>
                  setFrequency(
                    e.target.value as
                      RecurringFrequency
                  )
                }
              >
                <option value="DAILY">
                  Daily
                </option>

                <option value="WEEKLY">
                  Weekly
                </option>

                <option value="MONTHLY">
                  Monthly
                </option>

                <option value="YEARLY">
                  Yearly
                </option>
              </select>
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Account</label>

              <select
                value={accountId}
                onChange={(e) =>
                  setAccountId(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select account
                </option>

                {accounts.map((account) => (
                  <option
                    key={account.id}
                    value={account.id}
                  >
                    {account.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>

              <select
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(
                    e.target.value
                  )
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

          </div>

          <button
            className="primary-button"
            type="submit"
          >
            {editingId
              ? "Update Recurring Transaction"
              : "Create Recurring Transaction"}
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

        </form>
      </div>

      <div className="section-header">
        <h2>Scheduled Transactions</h2>

        <span className="transaction-count">
          {items.length} scheduled
        </span>
      </div>

      <div className="recurring-grid">

        {items.length === 0 ? (

          <div className="empty-state">
            No recurring transactions yet.
          </div>

        ) : (

          items.map((item) => (

            <div
              className={`recurring-card ${
                item.active
                  ? ""
                  : "recurring-inactive"
              }`}
              key={item.id}
            >

              <div className="recurring-card-header">

                <div>
                  <h3>
                    {item.description}
                  </h3>

                  <span>
                    {item.frequency}
                  </span>
                </div>

                <strong
                  className={
                    item.type === "INCOME"
                      ? "income-amount"
                      : "expense-amount"
                  }
                >
                  {item.type === "INCOME"
                    ? "+"
                    : "-"}
                  ₹
                  {item.amount.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <p>
                Next:
                {" "}
                {item.nextExecutionDate}
              </p>

              <p>
                Account:
                {" "}
                {item.accountName}
              </p>

              <p>
                Category:
                {" "}
                {item.categoryName}
              </p>

              <p>
                Status:
                {" "}
                {item.active
                  ? "Active"
                  : "Paused"}
              </p>

              <div className="table-actions">

                <button
                  className="secondary-button"
                  onClick={() =>
                    handleEdit(item)
                  }
                >
                  Edit
                </button>

                <button
                  className="secondary-button"
                  onClick={() =>
                    toggleActive(item.id)
                  }
                >
                  {item.active
                    ? "Pause"
                    : "Resume"}
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    handleDelete(item.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}