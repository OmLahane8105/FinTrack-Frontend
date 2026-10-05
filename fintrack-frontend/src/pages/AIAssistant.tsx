import {
  useState,
  type FormEvent,
} from "react";

import axios from "axios";

import api from "../api/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "How much did I spend this month?",
  "What is my biggest expense category?",
  "How healthy are my finances?",
  "Can I afford to save more money?",
];

export default function AIAssistant() {

  const [messages, setMessages] =
    useState<Message[]>([
      {
        role: "assistant",
        content:
          "Hi! I'm FinTrack AI. I can help you understand your spending, budgets, savings, goals and overall financial health.",
      },
    ]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent
  ) => {

    event.preventDefault();

    const message =
      input.trim();

    if (!message || loading) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {

      const response =
        await api.post<{
          response: string;
        }>(
          "/api/ai/chat",
          {
            message,
          }
        );

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            response.data.response,
        },
      ]);

    } catch (error) {

        console.error(
          "AI request failed:",
          error
        );

        let errorMessage =
          "I couldn't process your request right now. Please try again.";

        if (axios.isAxiosError(error)) {

          if (error.response?.status === 401) {

            errorMessage =
              "Your session has expired. Please log in again.";

          } else if (
            error.response?.status === 429
          ) {

            errorMessage =
              "Too many AI requests. Please wait a moment and try again.";

          } else if (
            error.response?.status &&
            error.response.status >= 500
          ) {

            errorMessage =
              "FinTrack AI is temporarily unavailable. Please try again in a moment.";

          } else if (!error.response) {

            errorMessage =
              "Unable to connect to FinTrack AI. Please check your connection and try again.";
          }
        }

        setMessages((previous) => [
          ...previous,
          {
            role: "assistant",
            content: errorMessage,
          },
        ]);

      } finally {

      setLoading(false);
    }
  };

  const handleSuggestedQuestion =
    (question: string) => {

      if (loading) {
        return;
      }

      setInput(question);
    };

  const handleClearChat = () => {

    if (loading) {
      return;
    }

    setMessages([
      {
        role: "assistant",
        content:
          "Chat cleared. What would you like to know about your finances?",
      },
    ]);
  };

  return (
    <div className="ai-page">

      {/* Header */}

      <div className="ai-page-header">

        <div>

          <div className="ai-title-row">

            <div className="ai-logo">
              AI
            </div>

            <h1>
              FinTrack AI
            </h1>

          </div>

          <p>
            Your personal financial assistant
          </p>

        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={handleClearChat}
          disabled={loading}
        >
          Clear Chat
        </button>

      </div>


      {/* Suggested Questions */}

      <div className="ai-suggestions">

        <h2>
          Ask FinTrack AI
        </h2>

        <p>
          Get insights based on your
          FinTrack financial data.
        </p>

        <div className="ai-suggestion-grid">

          {suggestedQuestions.map(
            (question) => (

              <button
                key={question}
                type="button"
                className="ai-suggestion"
                onClick={() =>
                  handleSuggestedQuestion(
                    question
                  )
                }
                disabled={loading}
              >
                {question}
              </button>

            )
          )}

        </div>

      </div>


      {/* Chat */}

      <div className="ai-chat-card">

        <div className="ai-chat-header">

          <div>

            <h2>
              Financial Assistant
            </h2>

            <span className="ai-status">
              <span className="ai-status-dot" />
              AI Assistant
            </span>

          </div>

        </div>


        {/* Messages */}

        <div className="ai-messages">

          {messages.map(
            (message, index) => (

              <div
                key={`${message.role}-${index}`}
                className={`ai-message-row ${
                  message.role === "user"
                    ? "user-message-row"
                    : "assistant-message-row"
                }`}
              >

                <div
                  className={`ai-avatar ${
                    message.role === "user"
                      ? "user-avatar"
                      : "assistant-avatar"
                  }`}
                >
                  {message.role === "user"
                    ? "You"
                    : "AI"}
                </div>

                <div
                  className={`ai-message ${
                    message.role === "user"
                      ? "user-message"
                      : "assistant-message"
                  }`}
                >
                  {message.content}
                </div>

              </div>

            )
          )}

          {loading && (

            <div className="ai-message-row assistant-message-row">

              <div className="ai-avatar assistant-avatar">
                AI
              </div>

              <div className="ai-message assistant-message ai-thinking">

                <span />
                <span />
                <span />

                <span className="ai-thinking-text">
                  Thinking...
                </span>

              </div>

            </div>

          )}

        </div>


        {/* Input */}

        <form
          className="ai-input-area"
          onSubmit={handleSubmit}
        >

          <input
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            placeholder="Ask about your spending, budget, savings..."
            disabled={loading}
            maxLength={1000}
          />

          <button
            type="submit"
            className="primary-button ai-send-button"
            disabled={
              loading ||
              input.trim().length < 2
            }
          >
            {loading
              ? "Sending..."
              : "Ask AI"}
          </button>

        </form>

        <div className="ai-disclaimer">

          FinTrack AI provides informational
          financial insights and is not a
          substitute for professional financial
          advice.

        </div>

      </div>

    </div>
  );
}