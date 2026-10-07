# FinTrack Frontend

The React and TypeScript frontend for FinTrack, a full-stack personal finance management application.

The frontend provides a responsive user interface for financial tracking, reporting, authentication, AI-assisted financial analysis, and account management.

## Features

### Authentication

* Registration and email verification
* Password login
* JWT-based authentication
* Refresh-token handling
* Logout
* Google OAuth2 login
* Protected routes

### Dashboard

* Financial overview
* Account balances
* Income and expenses
* Savings information
* Financial health indicators
* Financial charts

### Finance Management

* Account management
* Transaction management
* Categories
* Budgets
* Savings goals
* Recurring transactions
* Transaction search and filters

### Reports

* Monthly reports
* Income and expense summaries
* Savings-rate calculations
* Spending-by-category charts
* Monthly financial overview
* CSV export
* PDF export

### AI Features

#### AI Assistant

Users can ask questions about their personal finances.

The frontend sends authenticated financial context to the Spring Boot AI service and displays the generated response.

#### Financial Insights

The Financial Insights screen presents:

* Financial snapshot
* Key insights
* Recommendations

Insights are generated from the user's recorded FinTrack data and displayed in a structured interface.

### Notifications

* Notification list
* Read/unread state
* Notification interaction

## Tech Stack

* React 19
* TypeScript
* Vite
* Axios
* React Router
* Recharts
* CSS

## Project Structure

```text
fintrack-frontend
├── src
│   ├── api
│   ├── components
│   ├── pages
│   ├── types
│   ├── styles
│   ├── App.tsx
│   └── main.tsx
├── public
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Environment Variables

Create the frontend environment configuration with:

```text
VITE_API_URL=http://localhost:8080
```

For production, `VITE_API_URL` points to the deployed FinTrack backend.

Never commit private credentials or secrets to the frontend repository.

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite development server runs on the configured local development port.

## Production Build

Build the application:

```bash
npm run build
```

The production build performs:

```text
TypeScript compilation
        +
Vite production bundling
```

Preview the production build:

```bash
npm run preview
```

## API Communication

The frontend uses Axios for backend communication.

The API layer handles:

* JWT authorization headers
* Access-token refresh
* Authenticated requests
* API errors
* Production API configuration

The backend API base URL is controlled by:

```text
VITE_API_URL
```

## Authentication Flow

```text
User
  |
  v
React Login/Register
  |
  v
Spring Boot REST API
  |
  +---- JWT Access Token
  |
  +---- Refresh Token
  |
  +---- Google OAuth2
  |
  v
Authenticated FinTrack UI
```

## Production Deployment

The frontend is deployed as a static site.

Production configuration includes:

* Production backend API URL
* React Router rewrite to `index.html`
* Automatic deployment from Git
* Vite production builds

## Quality Checks

The frontend build currently succeeds with:

```bash
npm run build
```

The project also provides:

```bash
npm run lint
```

for ESLint checks.

## Application Flow

```text
Authentication
      |
      v
Dashboard
      |
      +---- Accounts
      +---- Transactions
      +---- Budgets
      +---- Goals
      +---- Recurring Transactions
      +---- Reports
      +---- AI Assistant
      +---- Financial Insights
      +---- Notifications
```

## Portfolio Highlights

This frontend demonstrates:

* React component architecture
* TypeScript interfaces and type-safe API usage
* Protected routing
* JWT authentication
* OAuth2 integration
* Axios interceptors
* API error handling
* Financial dashboards
* Data visualization with Recharts
* Structured AI output presentation
* Production environment configuration
* Deployment-ready Vite builds


## Project Status

The FinTrack frontend is production-deployed and integrated with the FinTrack Spring Boot backend.

The application currently supports authentication, financial management, reports, exports, notifications, charts, and AI-powered financial features.

## Live Application

The frontend is deployed as a production React application and communicates with the FinTrack backend through a configurable API endpoint.

## Closing Note

The FinTrack frontend was built to provide a complete and practical user experience for personal finance management, combining type-safe React development with authentication, data visualization, API integration, and AI-powered financial features.

The goal was to create a portfolio application that demonstrates how a modern frontend can work together with a secure production backend to deliver a complete real-world product.

---

Built with React, TypeScript, Vite, Axios, React Router, Recharts, and modern web development practices.
