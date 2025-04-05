
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
