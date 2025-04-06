
import { AppState } from "./types";

// Utility functions for the AppContext
export const hasDailyJournal = (state: AppState): boolean => {
  // Journal is now optional, not mandatory
  return true;
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

// Calculate leverage based on new risk parameters
export const calculateLeverage = (
  stopSizePercent: number, 
  marginAmount: number, 
  riskPercent: number
): { leverage: number; positionSize: number } => {
  if (stopSizePercent <= 0 || marginAmount <= 0 || riskPercent <= 0) {
    return { leverage: 0, positionSize: 0 };
  }
  
  // The maximum amount the trader is willing to lose (in dollars)
  const maxLossAmount = (marginAmount * riskPercent) / 100;
  
  // Calculate position size based on risk amount and stop size percentage
  const positionSize = (maxLossAmount / (stopSizePercent / 100)) * 100;
  
  // Calculate leverage as position size divided by margin amount
  const leverage = positionSize / marginAmount;
  
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
