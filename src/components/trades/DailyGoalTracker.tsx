
import React from 'react';
import { CircleCheck, CircleX, CircleDot } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/context/appUtils';

interface DailyGoalTrackerProps {
  dailyTarget?: number;
}

const DailyGoalTracker: React.FC<DailyGoalTrackerProps> = ({ dailyTarget }) => {
  const { state } = useAppContext();
  const { t } = useLanguage();
  const { dailyTradeProfit, riskSettings } = state;
  
  // Calculate the daily target based on the initial capital and daily profit percentage (default 1%)
  const calculatedTarget = dailyTarget || (riskSettings?.initialCapital 
    ? riskSettings.initialCapital * (riskSettings.dailyProfitTarget || 1) / 100 
    : 50);
  
  // Calculate the percentage of target reached
  const progressPercentage = Math.min(100, Math.max(0, (dailyTradeProfit / calculatedTarget) * 100));
  
  // Determine the status indicator
  const getStatusIndicator = () => {
    if (dailyTradeProfit >= calculatedTarget) {
      return {
        icon: <CircleCheck className="h-6 w-6 text-green-500" />,
        message: t('trade.goalReached'),
        color: 'bg-green-500'
      };
    } else if (progressPercentage >= 50) {
      return {
        icon: <CircleDot className="h-6 w-6 text-yellow-500" />,
        message: t('trade.goalProgress').replace('{percentage}', Math.round(progressPercentage).toString()),
        color: 'bg-yellow-500'
      };
    } else {
      return {
        icon: <CircleX className="h-6 w-6 text-red-500" />,
        message: t('trade.goalNotReached'),
        color: 'bg-red-500'
      };
    }
  };
  
  const status = getStatusIndicator();
  
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-1">{t('trade.dailyGoalTracker')}</h3>
            <div className="flex items-center gap-2">
              {status.icon}
              <span>{status.message}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{t('trade.todayPnL')}</p>
            <p className={`text-xl font-bold ${dailyTradeProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(dailyTradeProfit)}
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm">{t('trade.target')}: {formatCurrency(calculatedTarget)}</span>
            <span className="text-sm">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyGoalTracker;
