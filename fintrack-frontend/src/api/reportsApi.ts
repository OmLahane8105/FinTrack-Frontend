import api from "./api";

export interface ReportSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
}

export interface CategoryReport {
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface MonthlyReport {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export const getReportSummary = async (
  from: string,
  to: string
): Promise<ReportSummary> => {
  const response = await api.get<ReportSummary>(
    "/api/reports/summary",
    {
      params: {
        from,
        to,
      },
    }
  );

  return response.data;
};

export const getCategoryReport = async (
  from: string,
  to: string
): Promise<CategoryReport[]> => {
  const response = await api.get<CategoryReport[]>(
    "/api/reports/categories",
    {
      params: {
        from,
        to,
      },
    }
  );

  return response.data;
};

export const getMonthlyReport = async (
  from: string,
  to: string
): Promise<MonthlyReport[]> => {
  const response = await api.get<MonthlyReport[]>(
    "/api/reports/monthly",
    {
      params: {
        from,
        to,
      },
    }
  );

  return response.data;
};