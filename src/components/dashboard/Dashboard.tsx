
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
  Legend
} from 'recharts';
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { useAppContext } from '@/context/AppContext';
import { Trade } from '@/types';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
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
  
  // Data for setup performance
  const setupPerformance = setups.map(setup => {
    const setupTrades = filteredTrades.filter(trade => trade.setupId === setup.id);
    const setupProfit = setupTrades.reduce((sum, trade) => sum + trade.financialResult, 0);
    const setupWins = setupTrades.filter(trade => trade.financialResult > 0).length;
    const setupWinRate = setupTrades.length > 0 ? (setupWins / setupTrades.length * 100) : 0;
    
    return {
      name: setup.name,
      profit: setupProfit,
      trades: setupTrades.length,
      winRate: setupWinRate
    };
  }).sort((a, b) => b.profit - a.profit);
  
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
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total P&L</CardTitle>
            <CardDescription>Overall performance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${totalProfitLoss >= 0 ? 'text-profit' : 'text-loss'}`}>
              {formatCurrency(totalProfitLoss)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Win Rate</CardTitle>
            <CardDescription>Percentage of winning trades</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{winRate}%</p>
            <p className="text-sm text-muted-foreground">
              ({winCount}/{filteredTrades.length} trades)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Mistake Count</CardTitle>
            <CardDescription>Number of mistake trades</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{mistakeCount}</p>
            <p className="text-sm text-muted-foreground">
              ({(mistakeCount / (filteredTrades.length || 1) * 100).toFixed(1)}% of trades)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Leverage</CardTitle>
            <CardDescription>Average leverage used</CardDescription>
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
              <CardTitle>Profit/Loss Trend {dateRangeDisplay}</CardTitle>
              <CardDescription>
                Daily P&L for the selected time period
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
                      formatter={(value) => [`${formatCurrency(value as number)}`, 'Profit/Loss']}
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
              <CardTitle>Win/Loss Distribution</CardTitle>
              <CardDescription>
                Breakdown of winning and losing trades
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
                    <Tooltip formatter={(value) => [`${value} trades`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle>Setup Performance {dateRangeDisplay}</CardTitle>
              <CardDescription>
                Profit/loss by trading setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={setupPerformance}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tickFormatter={(value) => `$${value}`} />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tickFormatter={(value) => `${value}%`} />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === 'profit') return [formatCurrency(value as number), 'Profit/Loss'];
                        if (name === 'winRate') return [`${value}%`, 'Win Rate'];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="profit" name="Profit/Loss" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="winRate" name="Win Rate %" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="time">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Time of Day {dateRangeDisplay}</CardTitle>
              <CardDescription>
                Which hours are most profitable for your trading
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
                        if (name === 'profit') return [formatCurrency(value as number), 'Profit/Loss'];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="profit" name="Profit/Loss" fill="#3b82f6" />
                    <Bar dataKey="trades" name="Number of Trades" fill="#93c5fd" />
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
