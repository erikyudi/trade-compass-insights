
import { AppState } from "./types";

// Default setups and mistake types
export const DEFAULT_SETUPS = [
  { id: '1', name: 'Victory' },
  { id: '2', name: 'Lamborghini' },
  { id: '3', name: 'Breakout' },
  { id: '4', name: 'Reversal' },
];

export const DEFAULT_MISTAKE_TYPES = [
  { id: '1', name: 'Emotional Trading' },
  { id: '2', name: 'Poor Risk Management' },
  { id: '3', name: 'Trading Against Trend' },
  { id: '4', name: 'No Clear Setup' },
  { id: '5', name: 'Position Sizing Error' },
];

export const DEFAULT_ASSETS = [
  { id: '1', symbol: 'EURUSD' },
  { id: '2', symbol: 'GBPUSD' },
  { id: '3', symbol: 'BTCUSD' },
  { id: '4', symbol: 'AAPL' },
  { id: '5', symbol: 'MSFT' },
];

// Initial state
export const initialState: AppState = {
  trades: [],
  journals: [],
  riskSettings: {
    initialCapital: 10000,
    dailyProfitTarget: 2,
    maxDailyRisk: 2,
    dailyRiskLimit: 200, // Adding the dailyRiskLimit property with a default value
  },
  setups: DEFAULT_SETUPS,
  mistakeTypes: DEFAULT_MISTAKE_TYPES,
  assets: DEFAULT_ASSETS,
  dailyTradeProfit: 0,
  dailyRiskUsed: 0,
};

// Load data from localStorage if available
export const loadInitialState = (): AppState => {
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
      
      // Ensure riskSettings has all required properties
      if (parsedState.riskSettings && !parsedState.riskSettings.dailyRiskLimit) {
        parsedState.riskSettings.dailyRiskLimit = initialState.riskSettings.dailyRiskLimit;
      }
      
      return { ...initialState, ...parsedState };
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }
  return initialState;
};
