import { AppState } from './types';

// Function to determine if a daily journal entry exists for today
export const hasDailyJournal = (state: AppState): boolean => {
  // Always return true to bypass the daily journal requirement
  return true;
  
  // Original code was something like:
  // const today = new Date();
  // today.setHours(0, 0, 0, 0);
  // 
  // return state.journals.some(journal => {
  //   const journalDate = new Date(journal.date);
  //   journalDate.setHours(0, 0, 0, 0);
  //   return journalDate.getTime() === today.getTime();
  // });
};

// Function to determine the daily risk status based on profit and risk settings
export const getDailyRiskStatus = (state: AppState): 'safe' | 'warning' | 'danger' => {
  const { dailyTradeProfit, riskSettings } = state;
  const profitTarget = riskSettings.dailyProfitTarget / 100 * riskSettings.initialCapital;

  if (dailyTradeProfit >= profitTarget) {
    return 'safe';
  } else if (dailyTradeProfit < 0 && Math.abs(dailyTradeProfit) > riskSettings.maxDailyRisk / 100 * riskSettings.initialCapital) {
    return 'danger';
  } else {
    return 'warning';
  }
};

// Function to check if the daily risk limit has been exceeded
export const checkRiskLimit = (state: AppState): boolean => {
  return state.dailyRiskUsed > state.riskSettings.maxDailyRisk;
};
