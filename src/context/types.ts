
import { Trade, DailyJournal, RiskSettings, SetupType, MistakeType, AssetType } from '@/types';

// App State
export type AppState = {
  trades: Trade[];
  journals: DailyJournal[];
  riskSettings: RiskSettings;
  setups: SetupType[];
  mistakeTypes: MistakeType[];
  assets: AssetType[];
  dailyTradeProfit: number;
  dailyRiskUsed: number;
};

// Action types
export type ActionType = 
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

// Context Type
export type AppContextType = {
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

// User types for authentication
export type UserRole = 'mentor' | 'mentored';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mentorId?: string; // If the user is mentored, this is the ID of their mentor
  createdAt: Date;
};
