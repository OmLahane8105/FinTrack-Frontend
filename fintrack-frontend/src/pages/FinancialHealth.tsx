import { useEffect, useState } from "react";

import api from "../api/api";

import type {
  FinancialHealth,
  NetWorth,
} from "../types";

export default function FinancialHealthPage() {

  const [
    health,
    setHealth,
  ] = useState<FinancialHealth | null>(null);

  const [
    netWorth,
    setNetWorth,
  ] = useState<NetWorth | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {

    const load = async () => {

      try {

        setLoading(true);

        const [
          healthResponse,
          netWorthResponse,
        ] = await Promise.all([

          api.get<FinancialHealth>(
            "/api/analytics/financial-health"
          ),

          api.get<NetWorth>(
            "/api/analytics/net-worth"
          ),

        ]);

        setHealth(
          healthResponse.data
        );

        setNetWorth(
          netWorthResponse.data
        );

      } catch (error) {

        console.error(error);

        setError(
          "Unable to load financial health"
        );

      } finally {

        setLoading(false);
      }
    };

    load();

  }, []);

  if (loading) {

    return (
      <main className="container">
        <p>
          Calculating your financial health...
        </p>
      </main>
    );
  }

  if (error || !health) {

    return (
      <main className="container">
        <div className="error-message">
          {error ||
            "Financial health unavailable"}
        </div>
      </main>
    );
  }

  return (
    <main className="container">

      <div className="page-header">

        <div>

          <h1>
            Financial Health
          </h1>

          <p>
            Understand how healthy your finances are.
          </p>

        </div>

      </div>


      <div className="dashboard-grid">

        <div className="stat-card">

          <h3>
            Financial Health
          </h3>

          <div
            style={{
              fontSize: "48px",
              fontWeight: 700,
            }}
          >
            {health.score}
            <span
              style={{
                fontSize: "20px",
              }}
            >
              /100
            </span>
          </div>

          <p>
            {health.rating}
          </p>

        </div>


        <div className="stat-card">

          <h3>
            Savings Rate
          </h3>

          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            {Number(
              health.savingsRate
            ).toFixed(1)}
            %
          </div>

        </div>


        <div className="stat-card">

          <h3>
            Emergency Fund
          </h3>

          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            {Number(
              health.emergencyFundMonths
            ).toFixed(1)}
          </div>

          <p>
            months covered
          </p>

        </div>


        <div className="stat-card">

          <h3>
            Net Worth
          </h3>

          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            ₹
            {Number(
              netWorth?.netWorth || 0
            ).toLocaleString(
              "en-IN"
            )}
          </div>

        </div>

      </div>


      <div className="section">

        <h2>
          Score Breakdown
        </h2>


        <div className="budget-list">

          <div className="budget-item">

            <strong>
              Savings Rate
            </strong>

            <span>
              {health.savingsRateScore}
              /100
            </span>

          </div>


          <div className="budget-item">

            <strong>
              Budget Discipline
            </strong>

            <span>
              {health.budgetDisciplineScore}
              /100
            </span>

          </div>


          <div className="budget-item">

            <strong>
              Spending Trend
            </strong>

            <span>
              {health.spendingTrendScore}
              /100
            </span>

          </div>


          <div className="budget-item">

            <strong>
              Emergency Fund
            </strong>

            <span>
              {health.emergencyFundScore}
              /100
            </span>

          </div>

        </div>

      </div>


      <div className="section">

        <h2>
          Current Month
        </h2>

        <p>
          Income: ₹
          {Number(
            health.monthlyIncome
          ).toLocaleString("en-IN")}
        </p>

        <p>
          Expenses: ₹
          {Number(
            health.monthlyExpenses
          ).toLocaleString("en-IN")}
        </p>

        <p>
          Average Monthly Expenses: ₹
          {Number(
            health.averageMonthlyExpenses
          ).toLocaleString("en-IN")}
        </p>

      </div>

    </main>
  );
}