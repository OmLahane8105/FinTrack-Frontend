export type AccountType =
  | "BANK"
  | "CASH"
  | "SAVINGS"
  | "CREDIT_CARD"
  | "WALLET";

export type TransactionType = "INCOME" | "EXPENSE";


// =========================
// USER
// =========================

export interface User {
  id: number;
  name: string;
  email: string;
}


// =========================
// ACCOUNT
// =========================

export interface Account {
  id: number;
  name: string;
  type: AccountType;
  balance: number;
}

export interface AccountRequest {
  name: string;
  type: AccountType;
  balance: number;
}


// =========================
// CATEGORY
// =========================

export interface Category {
  id: number;
  name: string;
}

export interface CategoryRequest {
  name: string;
}


// =========================
// TRANSACTION
// =========================

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  description: string;
  transactionDate: string;

  accountId: number;
  accountName: string;

  categoryId: number;
  categoryName: string;
}

export interface TransactionRequest {
  amount: number;
  type: TransactionType;
  description: string;
  transactionDate: string;
  accountId: number;
  categoryId: number;
}


// =========================
// TRANSACTION PAGINATION
// =========================

export interface TransactionPage {
  content: Transaction[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}


// =========================
// DASHBOARD
// =========================

export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
}


export interface CategoryExpense {
  categoryId: number;
  categoryName: string;
  amount: number;
}


export interface MonthlySummary {
  year: number;
  month: number;
  income: number;
  expenses: number;
  savings: number;
}

export interface Budget {
  id: number;
  categoryId: number;
  categoryName: string;
  year: number;
  month: number;
  monthlyLimit: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  exceeded: boolean;
}

export interface BudgetRequest {
  categoryId: number;
  year: number;
  month: number;
  monthlyLimit: number;
}

export interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  targetDate: string;
  percentageCompleted: number;
  completed: boolean;
}

export interface GoalRequest {
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

export type RecurringFrequency =
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "YEARLY";

export interface RecurringTransaction {
  id: number;
  amount: number;
  type: TransactionType;
  description: string;
  nextExecutionDate: string;
  frequency: RecurringFrequency;
  accountId: number;
  accountName: string;
  categoryId: number;
  categoryName: string;
  active: boolean;
}

export interface RecurringTransactionRequest {
  amount: number;
  type: TransactionType;
  description: string;
  nextExecutionDate: string;
  frequency: RecurringFrequency;
  accountId: number;
  categoryId: number;
}

// =========================
// TRANSFERS
// =========================

export interface Transfer {
  id: number;
  amount: number;
  transferDate: string;
  description: string | null;

  fromAccountId: number;
  fromAccountName: string;

  toAccountId: number;
  toAccountName: string;
}

export interface TransferRequest {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  transferDate: string;
  description: string;
}


// =========================
// NET WORTH
// =========================

export interface NetWorth {
  totalAssets: number;
  creditCardBalance: number;
  netWorth: number;
}


// =========================
// FINANCIAL HEALTH
// =========================

export interface FinancialHealth {
  score: number;
  rating: string;

  savingsRateScore: number;
  budgetDisciplineScore: number;
  spendingTrendScore: number;
  emergencyFundScore: number;

  savingsRate: number;

  averageMonthlyExpenses: number;
  emergencyFundMonths: number;

  monthlyIncome: number;
  monthlyExpenses: number;
}

export type UserRole = "USER" | "ADMIN";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}