
import { AppState } from "./types";

// Utility functions for the AppContext
export const hasDailyJournal = (state: AppState): boolean => {
  const today = new Date().toDateString();
  return state.journals.some(journal => 
    new Date(journal.date).toDateString() === today && journal.errorReviewCompleted
  );
};

export const getDailyRiskStatus = (state: AppState): 'safe' | 'warning' | 'danger' => {
  const { dailyRiskUsed, riskSettings } = state;
  if (dailyRiskUsed < riskSettings.maxDailyRisk * 0.75) {
    return 'safe';
  } else if (dailyRiskUsed < riskSettings.maxDailyRisk) {
    return 'warning';
  } else {
    return 'danger';
  }
};

export const checkRiskLimit = (state: AppState): boolean => {
  return state.dailyRiskUsed < state.riskSettings.maxDailyRisk;
};

// Calculate leverage based on risk parameters
export const calculateLeverage = (
  stopSize: number, 
  riskAmount: number, 
  entryPrice: number
): { leverage: number; positionSize: number } => {
  if (stopSize <= 0 || riskAmount <= 0 || entryPrice <= 0) {
    return { leverage: 0, positionSize: 0 };
  }
  
  // Calculate position size based on risk amount and stop size
  const positionSize = (riskAmount / stopSize) * 100;
  
  // Calculate leverage as position size divided by entry price
  const leverage = positionSize / entryPrice;
  
  return {
    leverage: Number(leverage.toFixed(2)),
    positionSize: Number(positionSize.toFixed(2))
  };
};

// Utility function to format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

// Utility function for date formatting
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};
