import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Trade, DailyJournal, RiskSettings, SetupType, MistakeType, AssetType } from '@/types';
import { toast } from 'sonner';

// Default setups and mistake types
const DEFAULT_SETUPS: SetupType[] = [
  { id: '1', name: 'Victory' },
  { id: '2', name: 'Lamborghini' },
  { id: '3', name: 'Breakout' },
  { id: '4', name: 'Reversal' },
];

const DEFAULT_MISTAKE_TYPES: MistakeType[] = [
  { id: '1', name: 'Emotional Trading' },
  { id: '2', name: 'Poor Risk Management' },
  { id: '3', name: 'Trading Against Trend' },
  { id: '4', name: 'No Clear Setup' },
  { id: '5', name: 'Position Sizing Error' },
];

const DEFAULT_ASSETS: AssetType[] = [
  { id: '1', symbol: 'EURUSD' },
  { id: '2', symbol: 'GBPUSD' },
  { id: '3', symbol: 'BTCUSD' },
  { id: '4', symbol: 'AAPL' },
  { id: '5', symbol: 'MSFT' },
];

// Initial state
type AppState = {
  trades: Trade[];
  journals: DailyJournal[];
  riskSettings: RiskSettings;
  setups: SetupType[];
  mistakeTypes: MistakeType[];
  assets: AssetType[];
  dailyTradeProfit: number;
  dailyRiskUsed: number;
};

const initialState: AppState = {
  trades: [],
  journals: [],
  riskSettings: {
    initialCapital: 10000,
    dailyProfitTarget: 2,
    maxDailyRisk: 2,
  },
  setups: DEFAULT_SETUPS,
  mistakeTypes: DEFAULT_MISTAKE_TYPES,
  assets: DEFAULT_ASSETS,
  dailyTradeProfit: 0,
  dailyRiskUsed: 0,
};

// Load data from localStorage if available
const loadInitialState = (): AppState => {
  try {
    const savedState = localStorage.getItem('tradeAppState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      
      // Parse date strings back to Date objects
      if (parsedState.trades) {
        parsedState.trades = parsedState.trades.map((trade: any) => ({
          ...trade,
          entryTime: new Date(trade.entryTime),
          exitTime: new Date(trade.exitTime),
          createdAt: new Date(trade.createdAt),
        }));
      }
      
      if (parsedState.journals) {
        parsedState.journals = parsedState.journals.map((journal: any) => ({
          ...journal,
          date: new Date(journal.date),
          createdAt: new Date(journal.createdAt),
        }));
      }
      
      return { ...initialState, ...parsedState };
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }
  return initialState;
};

// Action types
type ActionType = 
  | { type: 'ADD_TRADE'; payload: Trade }
  | { type: 'UPDATE_TRADE'; payload: Trade }
  | { type: 'DELETE_TRADE'; payload: string }
  | { type: 'ADD_JOURNAL'; payload: DailyJournal }
  | { type: 'UPDATE_RISK_SETTINGS'; payload: RiskSettings }
  | { type: 'ADD_SETUP'; payload: Omit<SetupType, 'id'> }
  | { type: 'DELETE_SETUP'; payload: string }
  | { type: 'ADD_MISTAKE_TYPE'; payload: Omit<MistakeType, 'id'> }
  | { type: 'DELETE_MISTAKE_TYPE'; payload: string }
  | { type: 'ADD_ASSET'; payload: Omit<AssetType, 'id'> }
  | { type: 'DELETE_ASSET'; payload: string }
  | { type: 'RESET_DAILY_METRICS' };

// Reducer
const appReducer = (state: AppState, action: ActionType): AppState => {
  let newState: AppState;
  
  switch (action.type) {
    case 'ADD_TRADE': {
      // Generate a random ID for the new trade
      const newTrade = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      
      // Calculate daily metrics
      const today = new Date().toDateString();
      const dailyTrades = [...state.trades, newTrade].filter(
        trade => new Date(trade.entryTime).toDateString() === today
      );
      
      const dailyTradeProfit = dailyTrades.reduce(
        (sum, trade) => sum + trade.financialResult, 
        0
      );
      
      // For simplicity, we'll calculate risk used as sum of potential losses
      const dailyRiskUsed = dailyTrades
        .filter(trade => trade.financialResult < 0)
        .reduce((sum, trade) => {
          return sum + Math.abs(trade.financialResult);
        }, 0) / state.riskSettings.initialCapital * 100;
        
      newState = {
        ...state,
        trades: [...state.trades, newTrade],
        dailyTradeProfit,
        dailyRiskUsed,
      };
      break;
    }
    
    case 'UPDATE_TRADE': {
      const updatedTrades = state.trades.map(trade => 
        trade.id === action.payload.id ? action.payload : trade
      );
      
      // Recalculate daily metrics
      const today = new Date().toDateString();
      const dailyTrades = updatedTrades.filter(
        trade => new Date(trade.entryTime).toDateString() === today
      );
      
      const dailyTradeProfit = dailyTrades.reduce(
        (sum, trade) => sum + trade.financialResult, 
        0
      );
      
      const dailyRiskUsed = dailyTrades
        .filter(trade => trade.financialResult < 0)
        .reduce((sum, trade) => {
          return sum + Math.abs(trade.financialResult);
        }, 0) / state.riskSettings.initialCapital * 100;
      
      newState = {
        ...state,
        trades: updatedTrades,
        dailyTradeProfit,
        dailyRiskUsed,
      };
      break;
    }
    
    case 'DELETE_TRADE': {
      const filteredTrades = state.trades.filter(trade => trade.id !== action.payload);
      
      // Recalculate daily metrics
      const today = new Date().toDateString();
      const dailyTrades = filteredTrades.filter(
        trade => new Date(trade.entryTime).toDateString() === today
      );
      
      const dailyTradeProfit = dailyTrades.reduce(
        (sum, trade) => sum + trade.financialResult, 
        0
      );
      
      const dailyRiskUsed = dailyTrades
        .filter(trade => trade.financialResult < 0)
        .reduce((sum, trade) => {
          return sum + Math.abs(trade.financialResult);
        }, 0) / state.riskSettings.initialCapital * 100;
      
      newState = {
        ...state,
        trades: filteredTrades,
        dailyTradeProfit,
        dailyRiskUsed,
      };
      break;
    }
    
    case 'ADD_JOURNAL': {
      // Generate a random ID for the new journal entry
      const newJournal = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      
      newState = {
        ...state,
        journals: [...state.journals, newJournal]
      };
      break;
    }
    
    case 'UPDATE_RISK_SETTINGS': {
      newState = {
        ...state,
        riskSettings: action.payload
      };
      break;
    }
    
    case 'ADD_SETUP': {
      const newSetup = {
        ...action.payload,
        id: crypto.randomUUID(),
      };
      
      newState = {
        ...state,
        setups: [...state.setups, newSetup]
      };
      break;
    }
    
    case 'DELETE_SETUP': {
      newState = {
        ...state,
        setups: state.setups.filter(setup => setup.id !== action.payload)
      };
      break;
    }
    
    case 'ADD_MISTAKE_TYPE': {
      const newMistakeType = {
        ...action.payload,
        id: crypto.randomUUID(),
      };
      
      newState = {
        ...state,
        mistakeTypes: [...state.mistakeTypes, newMistakeType]
      };
      break;
    }
    
    case 'DELETE_MISTAKE_TYPE': {
      newState = {
        ...state,
        mistakeTypes: state.mistakeTypes.filter(type => type.id !== action.payload)
      };
      break;
    }
    
    case 'ADD_ASSET': {
      const newAsset = {
        ...action.payload,
        id: crypto.randomUUID(),
      };
      
      newState = {
        ...state,
        assets: [...state.assets, newAsset]
      };
      break;
    }
    
    case 'DELETE_ASSET': {
      newState = {
        ...state,
        assets: state.assets.filter(asset => asset.id !== action.payload)
      };
      break;
    }
    
    case 'RESET_DAILY_METRICS': {
      newState = {
        ...state,
        dailyTradeProfit: 0,
        dailyRiskUsed: 0
      };
      break;
    }
    
    default:
      return state;
  }
  
  // Save to localStorage
  try {
    localStorage.setItem('tradeAppState', JSON.stringify(newState));
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
  
  return newState;
};

// Context
type AppContextType = {
  state: AppState;
  addTrade: (trade: Omit<Trade, 'id' | 'createdAt'>) => void;
  updateTrade: (trade: Trade) => void;
  deleteTrade: (id: string) => void;
  addJournal: (journal: Omit<DailyJournal, 'id' | 'createdAt'>) => void;
  updateRiskSettings: (settings: RiskSettings) => void;
  addSetup: (setup: Omit<SetupType, 'id'>) => void;
  deleteSetup: (id: string) => void;
  addMistakeType: (mistakeType: Omit<MistakeType, 'id'>) => void;
  deleteMistakeType: (id: string) => void;
  addAsset: (asset: Omit<AssetType, 'id'>) => void;
  deleteAsset: (id: string) => void;
  resetDailyMetrics: () => void;
  hasDailyJournal: () => boolean;
  getDailyRiskStatus: () => 'safe' | 'warning' | 'danger';
  checkRiskLimit: () => boolean;
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, loadInitialState);

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

  const hasDailyJournal = () => {
    const today = new Date().toDateString();
    return state.journals.some(journal => 
      new Date(journal.date).toDateString() === today && journal.errorReviewCompleted
    );
  };

  const getDailyRiskStatus = (): 'safe' | 'warning' | 'danger' => {
    const { dailyRiskUsed, riskSettings } = state;
    if (dailyRiskUsed < riskSettings.maxDailyRisk * 0.75) {
      return 'safe';
    } else if (dailyRiskUsed < riskSettings.maxDailyRisk) {
      return 'warning';
    } else {
      return 'danger';
    }
  };

  const checkRiskLimit = (): boolean => {
    return state.dailyRiskUsed < state.riskSettings.maxDailyRisk;
  };

  const value = {
    state,
    addTrade: (trade) => dispatch({ type: 'ADD_TRADE', payload: trade as Trade }),
    updateTrade: (trade) => dispatch({ type: 'UPDATE_TRADE', payload: trade }),
    deleteTrade: (id) => dispatch({ type: 'DELETE_TRADE', payload: id }),
    addJournal: (journal) => dispatch({ type: 'ADD_JOURNAL', payload: journal as DailyJournal }),
    updateRiskSettings: (settings) => dispatch({ type: 'UPDATE_RISK_SETTINGS', payload: settings }),
    addSetup: (setup) => dispatch({ type: 'ADD_SETUP', payload: setup }),
    deleteSetup: (id) => dispatch({ type: 'DELETE_SETUP', payload: id }),
    addMistakeType: (mistakeType) => dispatch({ type: 'ADD_MISTAKE_TYPE', payload: mistakeType }),
    deleteMistakeType: (id) => dispatch({ type: 'DELETE_MISTAKE_TYPE', payload: id }),
    addAsset: (asset) => dispatch({ type: 'ADD_ASSET', payload: asset }),
    deleteAsset: (id) => dispatch({ type: 'DELETE_ASSET', payload: id }),
    resetDailyMetrics: () => dispatch({ type: 'RESET_DAILY_METRICS' }),
    hasDailyJournal,
    getDailyRiskStatus,
    checkRiskLimit,
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
