import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/api";

import type {
  Account,
  Category,
  Transaction,
  TransactionPage,
  TransactionRequest,
  TransactionType,
} from "../types";

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-");

  return `${day}-${month}-${year}`;
}

export default function Transactions() {
  const [transactions, setTransactions] =
    useState<TransactionPage | null>(null);

  const [accounts, setAccounts] =
    useState<Account[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  // Form state
  const [amount, setAmount] = useState("");
  const [type, setType] =
    useState<TransactionType>("EXPENSE");
  const [description, setDescription] =
    useState("");
  const [transactionDate, setTransactionDate] =
    useState(getToday());
  const [accountId, setAccountId] =
    useState("");
  const [categoryId, setCategoryId] =
    useState("");

  // Edit state
  const [editingId, setEditingId] =
    useState<number | null>(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] =
    useState<TransactionType | "">("");
  const [filterCategoryId, setFilterCategoryId] =
    useState("");
  const [filterFrom, setFilterFrom] =
    useState("");
  const [filterTo, setFilterTo] =
    useState("");
  const [sortBy, setSortBy] =
    useState("date");
  const [sortDir, setSortDir] =
    useState<"asc" | "desc">("desc");

  const [page, setPage] = useState(0);

  const pageSize = 10;

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ----------------------------------
  // Load accounts
  // ----------------------------------

  const fetchAccounts = async () => {
    try {
      const response =
        await api.get<Account[]>(
          "/api/accounts"
        );

      setAccounts(response.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load accounts");
    }
  };

  // ----------------------------------
  // Load categories
  // ----------------------------------

  // const fetchCategories = async () => {
  //   try {
  //     const response =
  //       await api.get<Category[]>(
  //         "/api/categories"
  //       );

  //     setCategories(response.data);
  //   } catch (error) {
  //     console.error(error);
  //     setError("Unable to load categories");
  //   }
  // };

  // ----------------------------------
  // Load transactions
  // ----------------------------------

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const params: Record<string, string | number> = {
        page,
        size: pageSize,
        sortBy,
        sortDir,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (filterType) {
        params.type = filterType;
      }

      if (filterCategoryId) {
        params.categoryId = Number(
          filterCategoryId
        );
      }

      if (filterFrom) {
        params.from = filterFrom;
      }

      if (filterTo) {
        params.to = filterTo;
      }

      const response =
        await api.get<TransactionPage>(
          "/api/transactions",
          {
            params,
          }
        );

      setTransactions(response.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const [
          accountsResponse,
          categoriesResponse,
        ] = await Promise.all([
          api.get<Account[]>("/api/accounts"),
          api.get<Category[]>("/api/categories"),
        ]);

        if (!cancelled) {
          setAccounts(accountsResponse.data);
          setCategories(categoriesResponse.data);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setError(
            "Unable to load transaction data"
          );
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const params: Record<string, string | number> = {
          page,
          size: pageSize,
          sortBy,
          sortDir,
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        if (filterType) {
          params.type = filterType;
        }

        if (filterCategoryId) {
          params.categoryId =
            Number(filterCategoryId);
        }

        if (filterFrom) {
          params.from = filterFrom;
        }

        if (filterTo) {
          params.to = filterTo;
        }

        const response =
          await api.get<TransactionPage>(
            "/api/transactions",
            {
              params,
            }
          );

        if (!cancelled) {
          setTransactions(response.data);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setError(
            "Unable to load transactions"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTransactions();

    return () => {
      cancelled = true;
    };
  }, [
    page,
    search,
    filterType,
    filterCategoryId,
    filterFrom,
    filterTo,
    sortBy,
    sortDir,
  ]);

  // ----------------------------------
  // Create / Update
  // ----------------------------------

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (Number(amount) <= 0) {
      setError(
        "Amount must be greater than zero"
      );
      return;
    }

    if (!description.trim()) {
      setError(
        "Description is required"
      );
      return;
    }

    if (!transactionDate) {
      setError(
        "Transaction date is required"
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

    const request: TransactionRequest = {
      amount: Number(amount),
      type,
      description: description.trim(),
      transactionDate,
      accountId: Number(accountId),
      categoryId: Number(categoryId),
    };

    try {
      if (editingId !== null) {
        await api.put(
          `/api/transactions/${editingId}`,
          request
        );

        setSuccess(
          "Transaction updated successfully"
        );
      } else {
        await api.post(
          "/api/transactions",
          request
        );

        setSuccess(
          "Transaction created successfully"
        );
      }

      resetForm();

      await fetchAccounts();
      await fetchTransactions();
        } catch (error: unknown) {
      console.error(error);

      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;

      setError(
        message ||
          (editingId !== null
            ? "Unable to update transaction"
            : "Unable to create transaction")
      );
    }
  };

  // ----------------------------------
  // Edit
  // ----------------------------------

  const handleEdit = (
    transaction: Transaction
  ) => {
    setEditingId(transaction.id);

    setAmount(
      String(transaction.amount)
    );

    setType(transaction.type);

    setDescription(
      transaction.description
    );

    setTransactionDate(
      transaction.transactionDate
    );

    setAccountId(
      String(transaction.accountId)
    );

    setCategoryId(
      String(transaction.categoryId)
    );

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ----------------------------------
  // Delete
  // ----------------------------------

  const handleDelete = async (
    id: number
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/api/transactions/${id}`
      );

      setSuccess(
        "Transaction deleted successfully"
      );

      await fetchAccounts();
      await fetchTransactions();
    } catch (error) {
      console.error(error);

      setError(
        "Unable to delete transaction"
      );
    }
  };

  // ----------------------------------
  // Reset form
  // ----------------------------------

  const resetForm = () => {
    setAmount("");
    setType("EXPENSE");
    setDescription("");
    setTransactionDate(getToday());
    setAccountId("");
    setCategoryId("");
    setEditingId(null);
  };

  // ----------------------------------
  // Clear filters
  // ----------------------------------

  const clearFilters = () => {
    setSearch("");
    setFilterType("");
    setFilterCategoryId("");
    setFilterFrom("");
    setFilterTo("");

    setSortBy("date");
    setSortDir("desc");

    setPage(0);
  };

  // ----------------------------------
  // Filter handlers
  // ----------------------------------

  const handleSearchChange = (
    value: string
  ) => {
    setSearch(value);
    setPage(0);
  };

  const handleTypeFilterChange = (
    value: TransactionType | ""
  ) => {
    setFilterType(value);
    setPage(0);
  };

  const handleCategoryFilterChange = (
    value: string
  ) => {
    setFilterCategoryId(value);
    setPage(0);
  };

  const handleFromChange = (
    value: string
  ) => {
    setFilterFrom(value);
    setPage(0);
  };

  const handleToChange = (
    value: string
  ) => {
    setFilterTo(value);
    setPage(0);
  };

  const handleSortByChange = (
    value: string
  ) => {
    setSortBy(value);
    setPage(0);
  };

  const handleSortDirChange = (
    value: "asc" | "desc"
  ) => {
    setSortDir(value);
    setPage(0);
  };

  return (
    <>
      <main className="container">

        {/* Page Header */}

        <div className="page-header">
          <div>
            <h1>Transactions</h1>

            <p>
              Manage your income and expenses
            </p>
          </div>
        </div>

        {/* Messages */}

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

        {/* Transaction Form */}

        <div className="form-card">

          <h2>
            {editingId !== null
              ? "Edit Transaction"
              : "Add Transaction"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="transaction-form-grid">

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
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="form-group">
                <label>Type</label>

                <select
                  value={type}
                  onChange={(e) =>
                    setType(
                      e.target.value as TransactionType
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

              <div className="form-group">
                <label>Date</label>

                <input
                  type="date"
                  value={transactionDate}
                  onChange={(e) =>
                    setTransactionDate(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <input
                  type="text"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Grocery shopping"
                  required
                />
              </div>

              <div className="form-group">
                <label>Account</label>

                <select
                  value={accountId}
                  onChange={(e) =>
                    setAccountId(
                      e.target.value
                    )
                  }
                  required
                >
                  <option value="">
                    Select account
                  </option>

                  {accounts.map(
                    (account) => (
                      <option
                        key={account.id}
                        value={account.id}
                      >
                        {account.name}
                      </option>
                    )
                  )}
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
                  required
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    )
                  )}
                </select>
              </div>

            </div>

            <div className="form-actions">

              <button
                type="submit"
                className="primary-button form-button"
              >
                {editingId !== null
                  ? "Update Transaction"
                  : "Add Transaction"}
              </button>

              {editingId !== null && (
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

        {/* Filters */}

        <div className="form-card">

          <div className="filter-header">

            <div>
              <h2>Search & Filters</h2>

              <p>
                Find transactions quickly
              </p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>

          <div className="transaction-filters">

            <div className="form-group">
              <label>Search</label>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  handleSearchChange(
                    e.target.value
                  )
                }
                placeholder="Search description..."
              />
            </div>

            <div className="form-group">
              <label>Type</label>

              <select
                value={filterType}
                onChange={(e) =>
                  handleTypeFilterChange(
                    e.target.value as
                    | TransactionType
                    | ""
                  )
                }
              >
                <option value="">
                  All Types
                </option>

                <option value="INCOME">
                  Income
                </option>

                <option value="EXPENSE">
                  Expense
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>

              <select
                value={filterCategoryId}
                onChange={(e) =>
                  handleCategoryFilterChange(
                    e.target.value
                  )
                }
              >
                <option value="">
                  All Categories
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="form-group">
              <label>From</label>

              <input
                type="date"
                value={filterFrom}
                onChange={(e) =>
                  handleFromChange(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>To</label>

              <input
                type="date"
                value={filterTo}
                onChange={(e) =>
                  handleToChange(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>Sort By</label>

              <select
                value={sortBy}
                onChange={(e) =>
                  handleSortByChange(e.target.value)
                }
              >
                <option value="date">
                  Date
                </option>

                <option value="amount">
                  Amount
                </option>

                <option value="description">
                  Description
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Order</label>

              <select
                value={sortDir}
                onChange={(e) =>
                  handleSortDirChange(
                    e.target.value as "asc" | "desc"
                  )
                }
              >
                <option value="desc">
                  Descending
                </option>

                <option value="asc">
                  Ascending
                </option>
              </select>
            </div>

          </div>
        </div>

        {/* Transactions */}

        <section className="transactions-section">

          <div className="section-header">

            <h2>Transaction History</h2>

            {transactions && (
              <span className="transaction-count">
                {transactions.totalElements} transaction
                {transactions.totalElements !== 1
                  ? "s"
                  : ""}
              </span>
            )}

          </div>

          {loading && (
            <p>Loading transactions...</p>
          )}

          {!loading &&
            transactions &&
            transactions.content.length === 0 && (
              <div className="empty-state">
                <h3>
                  No transactions found
                </h3>

                <p>
                  Try changing your filters or
                  add a new transaction.
                </p>
              </div>
            )}

          {!loading &&
            transactions &&
            transactions.content.length > 0 && (

              <div className="table-container">

                <table>

                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Account</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {transactions.content.map(
                      (transaction) => (

                        <tr
                          key={transaction.id}
                        >

                          <td>
                            {formatDate(
                              transaction.transactionDate
                            )}
                          </td>

                          <td>
                            {transaction.description}
                          </td>

                          <td>
                            {transaction.categoryName}
                          </td>

                          <td>
                            {transaction.accountName}
                          </td>

                          <td>

                            {transaction.type ===
                              "INCOME" ? (
                              <span className="income-badge">
                                Income
                              </span>
                            ) : (
                              <span className="expense-badge">
                                Expense
                              </span>
                            )}

                          </td>

                          <td
                            className={
                              transaction.type ===
                                "INCOME"
                                ? "income-amount"
                                : "expense-amount"
                            }
                          >
                            {transaction.type ===
                              "INCOME"
                              ? "+"
                              : "-"}
                            ₹
                            {Number(
                              transaction.amount
                            ).toFixed(2)}
                          </td>

                          <td>

                            <div className="table-actions">

                              <button
                                className="edit-button"
                                onClick={() =>
                                  handleEdit(
                                    transaction
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="delete-button"
                                onClick={() =>
                                  handleDelete(
                                    transaction.id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          {/* Pagination */}

          {transactions &&
            transactions.totalPages > 0 && (
              <div className="pagination">

                <button
                  className="secondary-button"
                  disabled={page === 0}
                  onClick={() =>
                    setPage(
                      (current) =>
                        current - 1
                    )
                  }
                >
                  Previous
                </button>

                <span>
                  Page {page + 1} of{" "}
                  {transactions.totalPages}
                </span>

                <button
                  className="secondary-button"
                  disabled={
                    page >=
                    transactions.totalPages - 1
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        current + 1
                    )
                  }
                >
                  Next
                </button>

              </div>
            )}

        </section>

      </main>
    </>
  );
}