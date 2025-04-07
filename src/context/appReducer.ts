
import { AppState, ActionType } from "./types";

// Reducer
export const appReducer = (state: AppState, action: ActionType): AppState => {
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
    
    case 'UPDATE_JOURNAL': {
      // Update the existing journal entry
      const updatedJournals = state.journals.map(journal => 
        journal.id === action.payload.id ? action.payload : journal
      );
      
      newState = {
        ...state,
        journals: updatedJournals
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
