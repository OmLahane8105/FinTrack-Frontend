import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import type {
  NetWorth,
} from "../types";
import api from "../api/api";

import type {
  DashboardSummary,
  CategoryExpense,
  MonthlySummary,
  TransactionPage,
} from "../types";

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getToday() {
  return formatLocalDate(new Date());
}

function getFirstDayOfMonth() {
  const date = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );

  return formatLocalDate(date);
}

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-");

  return `${day}-${month}-${year}`;
}

function formatMonth(year: number, month: number) {
  return new Date(year, month - 1, 1).toLocaleString("en-IN", {
    month: "short",
  });
}

export default function Dashboard() {
  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  const [categoryExpenses, setCategoryExpenses] =
    useState<CategoryExpense[]>([]);

  const [monthlySummary, setMonthlySummary] =
    useState<MonthlySummary[]>([]);

  const [recentTransactions, setRecentTransactions] =
    useState<TransactionPage | null>(null);

  const [from, setFrom] =
    useState(getFirstDayOfMonth());

  const [to, setTo] =
    useState(getToday());

  const [netWorth, setNetWorth] =
    useState<NetWorth | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // const loadDashboard = async () => {
  //   try {
  //     setLoading(true);
  //     setError("");

  //     const [
  //       summaryResponse,
  //       categoryResponse,
  //       monthlyResponse,
  //       recentResponse,
  //     ] = await Promise.all([
  //       api.get<DashboardSummary>(
  //         "/api/dashboard/summary",
  //         {
  //           params: {
  //             from,
  //             to,
  //           },
  //         }
  //       ),

  //       api.get<CategoryExpense[]>(
  //         "/api/dashboard/expenses-by-category",
  //         {
  //           params: {
  //             from,
  //             to,
  //           },
  //         }
  //       ),

  //       api.get<MonthlySummary[]>(
  //         "/api/dashboard/monthly",
  //         {
  //           params: {
  //             from,
  //             to,
  //           },
  //         }
  //       ),

  //       api.get<TransactionPage>(
  //         "/api/transactions",
  //         {
  //           params: {
  //             page: 0,
  //             size: 5,
  //           },
  //         }
  //       ),
  //     ]);

  //     setSummary(summaryResponse.data);
  //     setCategoryExpenses(categoryResponse.data);
  //     setMonthlySummary(monthlyResponse.data);
  //     setRecentTransactions(recentResponse.data);
  //   } catch (error) {
  //     console.error(error);
  //     setError("Unable to load dashboard");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          summaryResponse,
          categoryResponse,
          monthlyResponse,
          recentResponse,
          netWorthResponse,
        ] = await Promise.all([
          api.get<DashboardSummary>(
            "/api/dashboard/summary",
            {
              params: {
                from,
                to,
              },
            }
          ),

          api.get<CategoryExpense[]>(
            "/api/dashboard/expenses-by-category",
            {
              params: {
                from,
                to,
              },
            }
          ),

          api.get<MonthlySummary[]>(
            "/api/dashboard/monthly",
            {
              params: {
                from,
                to,
              },
            }
          ),

          api.get<TransactionPage>(
            "/api/transactions",
            {
              params: {
                page: 0,
                size: 5,
              },
            }
          ),

          api.get<NetWorth>(
            "/api/analytics/net-worth"
          ),
        ]);

        if (!cancelled) {
          setSummary(
            summaryResponse.data
          );

          setCategoryExpenses(
            categoryResponse.data
          );

          setMonthlySummary(
            monthlyResponse.data
          );

          setRecentTransactions(
            recentResponse.data
          );

          setNetWorth(
            netWorthResponse.data
          );
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setError(
            "Unable to load dashboard"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [from, to]);
  const monthlyChartData = monthlySummary.map(
    (item) => ({
      month: formatMonth(item.year, item.month),
      income: Number(item.income),
      expenses: Number(item.expenses),
    })
  );

  const categoryChartData = categoryExpenses.map(
    (item) => ({
      name: item.categoryName,
      value: Number(item.amount),
    })
  );

  return (
    <>
      <main className="container">

        {/* Header */}

        <div className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p>
              Overview of your finances
            </p>
          </div>

          <div className="date-filter">

            <div>
              <label>From</label>

              <input
                type="date"
                value={from}
                onChange={(e) =>
                  setFrom(e.target.value)
                }
              />
            </div>

            <div>
              <label>To</label>

              <input
                type="date"
                value={to}
                onChange={(e) =>
                  setTo(e.target.value)
                }
              />
            </div>

          </div>
        </div>

        {/* Loading */}

        {loading && (
          <div className="loading-message">
            Loading dashboard...
          </div>
        )}

        {/* Error */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Dashboard */}

        {!loading && summary && (
          <>

            {/* Summary Cards */}

            <div className="dashboard-grid">

              <div className="summary-card">
                <h3>Net Worth</h3>

                <p>
                  ₹
                  {Number(
                    netWorth?.netWorth || 0
                  ).toFixed(2)}
                </p>
              </div>

              <div className="summary-card">
                <h3>Total Balance</h3>

                <p>
                  ₹{Number(
                    summary.totalBalance
                  ).toFixed(2)}
                </p>
              </div>

              <div className="summary-card income-card">
                <h3>Total Income</h3>

                <p>
                  ₹{Number(
                    summary.totalIncome
                  ).toFixed(2)}
                </p>
              </div>

              <div className="summary-card expense-card">
                <h3>Total Expenses</h3>

                <p>
                  ₹{Number(
                    summary.totalExpenses
                  ).toFixed(2)}
                </p>
              </div>

              <div className="summary-card savings-card">
                <h3>Savings</h3>

                <p>
                  ₹{Number(
                    summary.savings
                  ).toFixed(2)}
                </p>
              </div>

            </div>

            {/* Charts */}

            <div className="dashboard-charts">

              {/* Expense by Category */}

              <div className="dashboard-card">

                <div className="dashboard-card-header">
                  <div>
                    <h2>Expenses by Category</h2>
                    <p>
                      Where your money was spent
                    </p>
                  </div>
                </div>

                {categoryChartData.length === 0 ? (
                  <div className="chart-empty">
                    No expense data available
                  </div>
                ) : (
                  <div className="chart-container">

                    <ResponsiveContainer
                      width="100%"
                      height={320}
                    >
                      <PieChart>

                        <Pie
                          data={categoryChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {categoryChartData.map(
                            (_, index) => (
                              <Cell
                                key={`cell-${index}`}
                              />
                            )
                          )}
                        </Pie>

                        <Tooltip
                          formatter={(value) =>
                            `₹${Number(value).toFixed(2)}`
                          }
                        />

                        <Legend />

                      </PieChart>
                    </ResponsiveContainer>

                  </div>
                )}

              </div>

              {/* Monthly Income vs Expense */}

              <div className="dashboard-card">

                <div className="dashboard-card-header">
                  <div>
                    <h2>Monthly Overview</h2>
                    <p>
                      Income vs expenses
                    </p>
                  </div>
                </div>

                {monthlyChartData.length === 0 ? (
                  <div className="chart-empty">
                    No monthly data available
                  </div>
                ) : (
                  <div className="chart-container">

                    <ResponsiveContainer
                      width="100%"
                      height={320}
                    >
                      <BarChart
                        data={monthlyChartData}
                      >

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip
                          formatter={(value) =>
                            `₹${Number(value).toFixed(2)}`
                          }
                        />

                        <Legend />

                        <Bar
                          dataKey="income"
                          name="Income"
                        />

                        <Bar
                          dataKey="expenses"
                          name="Expenses"
                        />

                      </BarChart>
                    </ResponsiveContainer>

                  </div>
                )}

              </div>

            </div>

            {/* Recent Transactions */}

            <div className="dashboard-card recent-transactions">

              <div className="dashboard-card-header">

                <div>
                  <h2>Recent Transactions</h2>

                  <p>
                    Your latest financial activity
                  </p>
                </div>

                <Link
                  to="/transactions"
                  className="view-all-link"
                >
                  View All
                </Link>

              </div>

              {!recentTransactions ||
                recentTransactions.content.length === 0 ? (
                <div className="chart-empty">
                  No transactions found
                </div>
              ) : (

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
                      </tr>
                    </thead>

                    <tbody>

                      {recentTransactions.content.map(
                        (transaction) => (
                          <tr key={transaction.id}>

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

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </>
        )}

      </main>
    </>
  );
}