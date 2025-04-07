
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';
import { AppContextType, AppState } from './types';
import { loadInitialState } from './initialState';
import { appReducer } from './appReducer';
import { hasDailyJournal, getDailyRiskStatus, checkRiskLimit } from './appUtils';
import { Trade, DailyJournal, RiskSettings } from '@/types';

// Create the context
const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, loadInitialState());

  // Check risk limit when dailyRiskUsed changes
  useEffect(() => {
    if (state.dailyRiskUsed > state.riskSettings.maxDailyRisk) {
      toast.warning("You've exceeded your daily risk limit!", {
        description: "Be cautious about taking additional trades today."
      });
    }
  }, [state.dailyRiskUsed, state.riskSettings.maxDailyRisk]);

  // Reset daily metrics at midnight
  useEffect(() => {
    const resetMetricsAtMidnight = () => {
      const now = new Date();
      const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // tomorrow
        0, 0, 0 // midnight
      );
      
      const msUntilMidnight = night.getTime() - now.getTime();
      
      const timeoutId = setTimeout(() => {
        dispatch({ type: 'RESET_DAILY_METRICS' });
        // Recursively set the next day's timeout
        resetMetricsAtMidnight();
      }, msUntilMidnight);
      
      return timeoutId;
    };
    
    const timeoutId = resetMetricsAtMidnight();
    return () => clearTimeout(timeoutId);
  }, []);

  const value: AppContextType = {
    state,
    addTrade: (trade) => dispatch({ type: 'ADD_TRADE', payload: trade as Trade }),
    updateTrade: (trade) => dispatch({ type: 'UPDATE_TRADE', payload: trade }),
    deleteTrade: (id) => dispatch({ type: 'DELETE_TRADE', payload: id }),
    addJournal: (journal) => dispatch({ type: 'ADD_JOURNAL', payload: journal as DailyJournal }),
    updateJournal: (journal) => dispatch({ type: 'UPDATE_JOURNAL', payload: journal }),
    updateRiskSettings: (settings) => dispatch({ type: 'UPDATE_RISK_SETTINGS', payload: settings }),
    addSetup: (setup) => dispatch({ type: 'ADD_SETUP', payload: setup }),
    deleteSetup: (id) => dispatch({ type: 'DELETE_SETUP', payload: id }),
    addMistakeType: (mistakeType) => dispatch({ type: 'ADD_MISTAKE_TYPE', payload: mistakeType }),
    deleteMistakeType: (id) => dispatch({ type: 'DELETE_MISTAKE_TYPE', payload: id }),
    addAsset: (asset) => dispatch({ type: 'ADD_ASSET', payload: asset }),
    deleteAsset: (id) => dispatch({ type: 'DELETE_ASSET', payload: id }),
    resetDailyMetrics: () => dispatch({ type: 'RESET_DAILY_METRICS' }),
    hasDailyJournal: () => hasDailyJournal(state),
    getDailyRiskStatus: () => getDailyRiskStatus(state),
    checkRiskLimit: () => checkRiskLimit(state),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
