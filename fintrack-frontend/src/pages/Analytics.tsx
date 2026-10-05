import {
  useEffect,
  useState,
} from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import api from "../api/api";

import type {
  MonthlySummary,
  CategoryExpense,
} from "../types";

function formatDate(
  date: Date
) {

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getStartDate() {

  const date =
    new Date();

  date.setMonth(
    date.getMonth() - 5
  );

  date.setDate(1);

  return formatDate(date);
}

function getEndDate() {

  return formatDate(
    new Date()
  );
}

function formatMonth(
  year: number,
  month: number
) {

  return new Date(
    year,
    month - 1,
    1
  ).toLocaleString(
    "en-IN",
    {
      month: "short",
    }
  );
}

export default function Analytics() {

  const [monthly, setMonthly] =
    useState<MonthlySummary[]>([]);

  const [categories, setCategories] =
    useState<CategoryExpense[]>([]);

  const [from, setFrom] =
    useState(getStartDate());

  const [to, setTo] =
    useState(getEndDate());

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          monthlyResponse,
          categoryResponse,
        ] = await Promise.all([
          api.get<MonthlySummary[]>(
            "/api/dashboard/monthly",
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
        ]);

        if (!cancelled) {
          setMonthly(
            monthlyResponse.data
          );

          setCategories(
            categoryResponse.data
          );
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setError(
            "Unable to load analytics"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, [from, to]);

  const monthlyChart =
    [...monthly]
      .reverse()
      .map(item => ({
        month:
          formatMonth(
            item.year,
            item.month
          ),

        income:
          Number(item.income),

        expenses:
          Number(item.expenses),

        savings:
          Number(item.savings),
      }));

  const categoryChart =
    categories.map(item => ({
      category:
        item.categoryName,

      amount:
        Number(item.amount),
    }));

  if (loading) {

    return (
      <main className="container">
        <p>
          Loading analytics...
        </p>
      </main>
    );
  }

  return (
    <main className="container">

      <div className="page-header">

        <div>

          <h1>
            Analytics
          </h1>

          <p>
            Understand your spending patterns.
          </p>

        </div>

        <div className="date-filter">

          <div>

            <label>
              From
            </label>

            <input
              type="date"
              value={from}
              onChange={(e) =>
                setFrom(
                  e.target.value
                )
              }
            />

          </div>

          <div>

            <label>
              To
            </label>

            <input
              type="date"
              value={to}
              onChange={(e) =>
                setTo(
                  e.target.value
                )
              }
            />

          </div>

        </div>

      </div>


      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      <section className="section">

        <h2>
          Income vs Expenses
        </h2>

        <div
          style={{
            width: "100%",
            height: 400,
          }}
        >

          <ResponsiveContainer>

            <BarChart
              data={monthlyChart}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="month"
              />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="income"
                name="Income"
              />

              <Bar
                dataKey="expenses"
                name="Expenses"
              />

              <Bar
                dataKey="savings"
                name="Savings"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </section>


      <section className="section">

        <h2>
          Spending by Category
        </h2>

        <div
          style={{
            width: "100%",
            height: 400,
          }}
        >

          <ResponsiveContainer>

            <BarChart
              data={categoryChart}
              layout="vertical"
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                type="number"
              />

              <YAxis
                type="category"
                dataKey="category"
                width={120}
              />

              <Tooltip />

              <Bar
                dataKey="amount"
                name="Expenses"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </section>

    </main>
  );
}