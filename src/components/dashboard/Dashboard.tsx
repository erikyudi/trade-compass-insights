
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  ReferenceLine
} from 'recharts';
import { format, isWithinInterval } from 'date-fns';
import { useAppContext } from '@/context/AppContext';
import { Trade } from '@/types';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

interface DashboardProps {
  userData?: {
    trades: Trade[];
    journals: any[];
    setups: any[];
  };
  startDate?: Date;
  endDate?: Date;
  dateRangeApplied?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  userData,
  startDate,
  endDate,
  dateRangeApplied = false
}) => {
  const { state } = useAppContext();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Use provided userData or fall back to global state
  const { trades, journals, setups } = userData || state;
  
  // Filter data by date range if provided
  const filteredTrades = startDate && endDate && dateRangeApplied
    ? trades.filter(trade => {
        const tradeDate = new Date(trade.entryTime);
        return isWithinInterval(tradeDate, { start: startDate, end: endDate });
      })
    : trades;
  
  const filteredJournals = startDate && endDate && dateRangeApplied
    ? journals.filter(journal => {
        const journalDate = new Date(journal.date);
        return isWithinInterval(journalDate, { start: startDate, end: endDate });
      })
    : journals;
  
  // Format date range for display
  const dateRangeDisplay = startDate && endDate
    ? `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`
    : "(30 Days)";
  
  // Calculate key metrics based on filtered data
  const totalProfitLoss = filteredTrades.reduce((sum, trade) => sum + trade.financialResult, 0);
  const winCount = filteredTrades.filter(trade => trade.financialResult > 0).length;
  const winRate = filteredTrades.length > 0 ? (winCount / filteredTrades.length * 100).toFixed(1) : '0.0';
  const mistakeCount = filteredTrades.filter(trade => trade.isMistake).length;
  
  // Data for setup performance - IMPROVED VERSION
  const setupPerformance = setups.map(setup => {
    const setupTrades = filteredTrades.filter(trade => trade.setupId === setup.id);
    
    const winningTrades = setupTrades.filter(trade => trade.financialResult > 0);
    const losingTrades = setupTrades.filter(trade => trade.financialResult <= 0);
    
    const totalProfit = winningTrades.reduce((sum, trade) => sum + trade.financialResult, 0);
    const totalLoss = losingTrades.reduce((sum, trade) => sum + trade.financialResult, 0);
    
    const setupWinRate = setupTrades.length > 0 
      ? (winningTrades.length / setupTrades.length * 100) 
      : 0;
    
    return {
      name: setup.name,
      profit: totalProfit,
      loss: Math.abs(totalLoss), // Store as positive value for display purposes
      actualLoss: totalLoss,     // Store actual negative value for calculations
      trades: setupTrades.length,
      winRate: setupWinRate,
      winCount: winningTrades.length,
      lossCount: losingTrades.length
    };
  }).filter(setup => setup.trades > 0) // Only show setups with trades
    .sort((a, b) => (b.profit - b.loss) - (a.profit - a.loss)); // Sort by net profit
  
  // Data for profit by day
  interface DailyProfit {
    date: string;
    profit: number;
  }
  
  const profitByDay: DailyProfit[] = [];
  
  // Group trades by date
  const tradesByDate = new Map<string, Trade[]>();
  
  // Use either filtered trades or recent trades
  const tradesForLineChart = filteredTrades;
  
  tradesForLineChart.forEach(trade => {
    const dateStr = format(new Date(trade.entryTime), 'yyyy-MM-dd');
    if (!tradesByDate.has(dateStr)) {
      tradesByDate.set(dateStr, []);
    }
    tradesByDate.get(dateStr)?.push(trade);
  });
  
  // Sort by date and calculate profit for each day
  Array.from(tradesByDate.keys())
    .sort()
    .forEach(dateStr => {
      const dayTrades = tradesByDate.get(dateStr) || [];
      const dayProfit = dayTrades.reduce((sum, trade) => sum + trade.financialResult, 0);
      profitByDay.push({
        date: format(new Date(dateStr), 'MMM d'),
        profit: dayProfit
      });
    });
  
  // Data for time of day performance
  interface TimePerformance {
    timeSlot: string;
    profit: number;
    trades: number;
  }
  
  const timePerformance: TimePerformance[] = [
    { timeSlot: '8-10', profit: 0, trades: 0 },
    { timeSlot: '10-12', profit: 0, trades: 0 },
    { timeSlot: '12-14', profit: 0, trades: 0 },
    { timeSlot: '14-16', profit: 0, trades: 0 },
    { timeSlot: '16+', profit: 0, trades: 0 },
  ];
  
  filteredTrades.forEach(trade => {
    const hour = new Date(trade.entryTime).getHours();
    let index;
    
    if (hour < 10) index = 0;
    else if (hour < 12) index = 1;
    else if (hour < 14) index = 2;
    else if (hour < 16) index = 3;
    else index = 4;
    
    timePerformance[index].profit += trade.financialResult;
    timePerformance[index].trades += 1;
  });
  
  // Win/Loss Ratio
  const winLossData = [
    { name: 'Win', value: winCount },
    { name: 'Loss', value: filteredTrades.length - winCount }
  ];
  
  const COLORS = ['#38A169', '#E53E3E'];
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };
  
  // Custom tooltip for the setup performance chart
  const SetupPerformanceTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const setupData = payload[0].payload;
      
      return (
        <div className="bg-background border border-input p-3 rounded-md shadow-md">
          <p className="font-medium">{`Setup: ${label}`}</p>
          <p className="text-profit">{`Profit: ${formatCurrency(setupData.profit)}`}</p>
          <p className="text-loss">{`Loss: ${formatCurrency(-setupData.loss)}`}</p>
          <p>{`Net: ${formatCurrency(setupData.profit + setupData.actualLoss)}`}</p>
          <p>{`Win Rate: ${setupData.winRate.toFixed(1)}%`}</p>
          <p>{`Wins/Losses: ${setupData.winCount}/${setupData.lossCount}`}</p>
          <p>{`Total Trades: ${setupData.trades}`}</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('analytics.totalPnL')}</CardTitle>
            <CardDescription>{t('analytics.overallPerformance')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${totalProfitLoss >= 0 ? 'text-profit' : 'text-loss'}`}>
              {formatCurrency(totalProfitLoss)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('analytics.winRate')}</CardTitle>
            <CardDescription>{t('analytics.winRateDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{winRate}%</p>
            <p className="text-sm text-muted-foreground">
              ({winCount}/{filteredTrades.length} {t('analytics.trades')})
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('analytics.mistakeCount')}</CardTitle>
            <CardDescription>{t('analytics.mistakeDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{mistakeCount}</p>
            <p className="text-sm text-muted-foreground">
              ({(mistakeCount / (filteredTrades.length || 1) * 100).toFixed(1)}% {t('analytics.ofTrades')})
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('analytics.leverage')}</CardTitle>
            <CardDescription>{t('analytics.leverageDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {filteredTrades.length > 0 
                ? (filteredTrades.reduce((sum, trade) => sum + trade.leverage, 0) / filteredTrades.length).toFixed(1) 
                : '0.0'}x
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="profit">
        <TabsList>
          <TabsTrigger value="profit">{t('analytics.profitHistory')}</TabsTrigger>
          <TabsTrigger value="setup">{t('analytics.setupPerformance')}</TabsTrigger>
          <TabsTrigger value="time">{t('analytics.timeOfDay')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.profitLossTrend')} {dateRangeDisplay}</CardTitle>
              <CardDescription>
                {t('analytics.dailyPnL')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={profitByDay}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      formatter={(value) => [`${formatCurrency(value as number)}`, t('analytics.profitLoss')]}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="#3b82f6"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.winLossDistribution')}</CardTitle>
              <CardDescription>
                {t('analytics.winLossDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={winLossData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {winLossData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => [`${value} ${t('analytics.trades')}`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.setupPerformance')} {dateRangeDisplay}</CardTitle>
              <CardDescription>
                {t('analytics.setupDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={setupPerformance}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <ReferenceLine y={0} stroke="#000" />
                    <Tooltip content={<SetupPerformanceTooltip />} />
                    <Legend />
                    <Bar dataKey="profit" name={t('analytics.profit')} fill="#38A169" barSize={25} />
                    <Bar dataKey="loss" name={t('analytics.loss')} fill="#E53E3E" barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <div className="text-xs text-muted-foreground text-center">
                  {t('analytics.setupPerformanceNote')}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="time">
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.timePerformance')} {dateRangeDisplay}</CardTitle>
              <CardDescription>
                {t('analytics.timeDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timePerformance}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timeSlot" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === 'profit') return [formatCurrency(value as number), t('analytics.profitLoss')];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="profit" name={t('analytics.profitLoss')} fill="#3b82f6" />
                    <Bar dataKey="trades" name={t('analytics.numberOfTrades')} fill="#93c5fd" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
