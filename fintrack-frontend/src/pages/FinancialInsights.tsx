import { useState } from "react";

import {
  getAiInsights,
  type AiInsightsResponse,
} from "../api/aiApi";

export default function FinancialInsights() {

  const [data, setData] =
    useState<AiInsightsResponse | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const generateInsights = async () => {

    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {

      const response =
        await getAiInsights();

      setData(response);

    } catch (error) {

      console.error(
        "Failed to generate AI insights:",
        error
      );

      setError(
        "Unable to generate financial insights right now."
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="financial-insights-page">

      <div className="financial-insights-header">

        <div>
          <h1>
            Financial Insights
          </h1>

          <p>
            Get an AI-powered overview of
            your financial situation and
            practical recommendations.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={generateInsights}
          disabled={loading}
        >
          {loading
            ? "Analyzing..."
            : "Generate Insights"}
        </button>

      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!data &&
        !loading &&
        !error && (

          <div className="financial-insights-empty">

            <div className="financial-insights-empty-icon">
              ✦
            </div>

            <h2>
              Understand your finances better
            </h2>

            <p>
              FinTrack AI can analyze your
              spending, savings, budgets,
              goals and financial health.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={generateInsights}
            >
              Analyze My Finances
            </button>

          </div>
        )}

      {loading && (

        <div className="financial-insights-loading">

          <div className="ai-thinking">
            FinTrack AI is analyzing your
            finances...
          </div>

          <p>
            Reviewing your spending, savings,
            budgets and financial health.
          </p>

        </div>
      )}

      {data && !loading && (

        <div className="financial-insights-content">

          <section className="insight-summary-card">

            <div className="insight-card-label">
              FINANCIAL OVERVIEW
            </div>

            <h2>
              Your Financial Snapshot
            </h2>

            <p>
              {data.summary}
            </p>

          </section>

          <section className="insight-section">

            <div className="insight-section-header">

              <span className="insight-section-icon">
                ✦
              </span>

              <div>
                <h2>
                  Key Insights
                </h2>

                <p>
                  Important observations from
                  your financial data.
                </p>
              </div>

            </div>

            <div className="insight-grid">

              {data.insights.map(
                (insight, index) => (

                  <div
                    className="insight-card"
                    key={index}
                  >

                    <div className="insight-number">
                      {index + 1}
                    </div>

                    <p>
                      {insight}
                    </p>

                  </div>
                )
              )}

            </div>

          </section>

          <section className="insight-section">

            <div className="insight-section-header">

              <span className="insight-section-icon">
                ✓
              </span>

              <div>
                <h2>
                  Recommendations
                </h2>

                <p>
                  Practical actions based on
                  your current financial data.
                </p>
              </div>

            </div>

            <div className="recommendation-list">

              {data.recommendations.map(
                (recommendation, index) => (

                  <div
                    className="recommendation-item"
                    key={index}
                  >

                    <span>
                      {index + 1}
                    </span>

                    <p>
                      {recommendation}
                    </p>

                  </div>
                )
              )}

            </div>

          </section>

          <div className="ai-disclaimer">
            AI-generated insights are
            informational and are based on
            your recorded FinTrack financial
            data. They are not professional
            financial advice.
          </div>

        </div>
      )}

    </div>
  );
}