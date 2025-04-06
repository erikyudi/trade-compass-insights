
export type SetupType = {
  id: string;
  name: string;
};

export type MistakeType = {
  id: string;
  name: string;
};

export type AssetType = {
  id: string;
  symbol: string;
};

export type Direction = 'Buy' | 'Sell';
export type TrendPosition = 'With' | 'Against';

export type Trade = {
  id: string;
  asset: string;
  setupId: string;
  direction: Direction;
  trendPosition: TrendPosition;
  entryTime: Date;
  exitTime: Date;
  financialResult: number;
  profitLossPercentage: number;
  leverage: number;
  notes: string;
  isMistake: boolean;
  mistakeTypeId?: string;
  isModelTrade: boolean;
  createdAt: Date;
  riskRewardRatio?: string;
};

export type DailyJournal = {
  id: string;
  date: Date;
  errorReviewCompleted: boolean;
  dailyComment: string;
  previousDayGoalHit: boolean | null;
  createdAt: Date;
};

export type RiskSettings = {
  initialCapital: number;
  dailyProfitTarget: number; // percentage
  maxDailyRisk: number; // percentage
};

// User roles including admin
export type UserRole = 'admin' | 'mentor' | 'mentored';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mentorId?: string; // If the user is mentored, this is the ID of their mentor
  createdAt: Date;
};
