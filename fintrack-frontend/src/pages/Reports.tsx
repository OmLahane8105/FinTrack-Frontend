import { useEffect, useState } from "react";
import {
  getCategoryReport,
  getMonthlyReport,
  getReportSummary,
  type CategoryReport,
  type MonthlyReport,
  type ReportSummary,
} from "../api/reportsApi";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const getMonthRange = (year: number, month: number) => {
  const from = `${year}-${String(month).padStart(2, "0")}-01`;

  const lastDay = new Date(year, month, 0).getDate();

  const to = `${year}-${String(month).padStart(2, "0")}-${String(
    lastDay
  ).padStart(2, "0")}`;

  return {
    from,
    to,
  };
};

const Reports = () => {
  const today = new Date();

  const [selectedYear, setSelectedYear] = useState(
    today.getFullYear()
  );

  const [selectedMonth, setSelectedMonth] = useState(
    today.getMonth() + 1
  );

  const [summary, setSummary] =
    useState<ReportSummary | null>(null);

  const [categories, setCategories] =
    useState<CategoryReport[]>([]);

  const [monthly, setMonthly] =
    useState<MonthlyReport[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");

        const { from, to } = getMonthRange(
          selectedYear,
          selectedMonth
        );

        const yearlyFrom = `${selectedYear}-01-01`;
        const yearlyTo = `${selectedYear}-12-31`;

        const [
          summaryData,
          categoryData,
          monthlyData,
        ] = await Promise.all([
          getReportSummary(from, to),
          getCategoryReport(from, to),
          getMonthlyReport(
            yearlyFrom,
            yearlyTo
          ),
        ]);

        if (cancelled) {
          return;
        }

        setSummary(summaryData);
        setCategories(categoryData);
        setMonthly(monthlyData);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load reports:",
          err
        );

        setError(
          "Unable to load reports. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadReports();

    return () => {
      cancelled = true;
    };
  }, [selectedYear, selectedMonth]);

  return (
    <div className="reports-page">

      <div className="reports-header">

        <div>
          <h1>Financial Reports</h1>

          <p>
            Understand your income, spending and savings.
          </p>
        </div>

        <div className="reports-filters">

          <select
            value={selectedMonth}
            onChange={(event) =>
              setSelectedMonth(
                Number(event.target.value)
              )
            }
          >
            <option value={1}>January</option>
            <option value={2}>February</option>
            <option value={3}>March</option>
            <option value={4}>April</option>
            <option value={5}>May</option>
            <option value={6}>June</option>
            <option value={7}>July</option>
            <option value={8}>August</option>
            <option value={9}>September</option>
            <option value={10}>October</option>
            <option value={11}>November</option>
            <option value={12}>December</option>
          </select>

          <select
            value={selectedYear}
            onChange={(event) =>
              setSelectedYear(
                Number(event.target.value)
              )
            }
          >
            {Array.from(
              { length: 6 },
              (_, index) =>
                today.getFullYear() - index
            ).map((year) => (
              <option
                key={year}
                value={year}
              >
                {year}
              </option>
            ))}
          </select>

        </div>

      </div>

      {loading && (
        <div className="reports-loading">
          Loading reports...
        </div>
      )}

      {!loading && error && (
        <div className="reports-error">
          {error}
        </div>
      )}

      {!loading && !error && summary && (
        <>

          <div className="report-summary-grid">

            <div className="report-card">
              <span>Income</span>

              <strong className="income-value">
                {formatCurrency(
                  summary.totalIncome
                )}
              </strong>
            </div>

            <div className="report-card">
              <span>Expenses</span>

              <strong className="expense-value">
                {formatCurrency(
                  summary.totalExpenses
                )}
              </strong>
            </div>

            <div className="report-card">
              <span>Net Savings</span>

              <strong
                className={
                  summary.netSavings >= 0
                    ? "savings-positive"
                    : "savings-negative"
                }
              >
                {formatCurrency(
                  summary.netSavings
                )}
              </strong>
            </div>

            <div className="report-card">
              <span>Savings Rate</span>

              <strong>
                {summary.savingsRate.toFixed(2)}%
              </strong>
            </div>

          </div>

          <section className="reports-section">

            <div className="reports-section-header">

              <div>
                <h2>
                  Spending by Category
                </h2>

                <p>
                  Where your money went this month.
                </p>
              </div>

            </div>

            {categories.length === 0 ? (

              <div className="reports-empty">
                No expenses found for this month.
              </div>

            ) : (

              <div className="category-list">

                {categories.map((category) => (

                  <div
                    className="category-row"
                    key={category.categoryName}
                  >

                    <div className="category-row-top">

                      <span>
                        {category.categoryName}
                      </span>

                      <strong>
                        {formatCurrency(
                          category.amount
                        )}
                      </strong>

                    </div>

                    <div className="category-bar">

                      <div
                        className="category-bar-fill"
                        style={{
                          width: `${Math.min(
                            category.percentage,
                            100
                          )}%`,
                        }}
                      />

                    </div>

                    <div className="category-percentage">
                      {category.percentage.toFixed(2)}%
                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

          <section className="reports-section">

            <div className="reports-section-header">

              <div>
                <h2>
                  Monthly Overview
                </h2>

                <p>
                  Income and expenses throughout{" "}
                  {selectedYear}.
                </p>
              </div>

            </div>

            {monthly.length === 0 ? (

              <div className="reports-empty">
                No transactions found for{" "}
                {selectedYear}.
              </div>

            ) : (

              <div className="monthly-table-wrapper">

                <table className="monthly-table">

                  <thead>

                    <tr>
                      <th>Month</th>
                      <th>Income</th>
                      <th>Expenses</th>
                      <th>Savings</th>
                    </tr>

                  </thead>

                  <tbody>

                    {monthly.map((item) => (

                      <tr key={item.month}>

                        <td>
                          {item.month}
                        </td>

                        <td className="income-value">
                          {formatCurrency(
                            item.income
                          )}
                        </td>

                        <td className="expense-value">
                          {formatCurrency(
                            item.expenses
                          )}
                        </td>

                        <td
                          className={
                            item.savings >= 0
                              ? "savings-positive"
                              : "savings-negative"
                          }
                        >
                          {formatCurrency(
                            item.savings
                          )}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        </>
      )}

    </div>
  );
};

export default Reports;