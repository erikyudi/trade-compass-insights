
import React, { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { format } from 'date-fns';
import { Trade } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CalendarPage: React.FC = () => {
  const { state } = useAppContext();
  const { trades, journals, setups } = state;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Get dates that have trades
  const tradeDates = new Set(
    trades.map(trade => format(new Date(trade.entryTime), 'yyyy-MM-dd'))
  );
  
  // Get dates that have journal entries
  const journalDates = new Set(
    journals.map(journal => format(new Date(journal.date), 'yyyy-MM-dd'))
  );
  
  // Get trades for selected date
  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const tradesForSelectedDate = trades.filter(trade => 
    format(new Date(trade.entryTime), 'yyyy-MM-dd') === selectedDateStr
  );
  
  // Get journal for selected date
  const journalForSelectedDate = journals.find(journal => 
    format(new Date(journal.date), 'yyyy-MM-dd') === selectedDateStr
  );
  
  // Calculate daily totals
  const dailyProfit = tradesForSelectedDate.reduce(
    (sum, trade) => sum + trade.financialResult, 
    0
  );
  
  const winCount = tradesForSelectedDate.filter(trade => trade.financialResult > 0).length;
  const lossCount = tradesForSelectedDate.filter(trade => trade.financialResult <= 0).length;
  
  // Calendar modifiers to highlight dates
  function dateClassName(date: Date) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const hasJournal = journalDates.has(dateStr);
    const hasTrades = tradeDates.has(dateStr);
    
    if (hasJournal && hasTrades) return "bg-green-100 text-green-800 font-bold";
    if (hasJournal) return "bg-blue-100 text-blue-800";
    if (hasTrades) return "bg-yellow-100 text-yellow-800";
    return "";
  }
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trading Calendar</h1>
        <p className="text-muted-foreground">
          View your trading history by date
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>
              Select a date to view details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-white rounded-md">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="pointer-events-auto"
                modifiers={{
                  trading: (date) => tradeDates.has(format(date, 'yyyy-MM-dd')),
                  journal: (date) => journalDates.has(format(date, 'yyyy-MM-dd')),
                }}
                modifiersClassNames={{
                  trading: "bg-yellow-100 text-yellow-800",
                  journal: "bg-blue-100 text-blue-800",
                }}
                styles={{
                  day: (date) => ({
                    className: dateClassName(date)
                  })
                }}
              />
            </div>
            
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
                <span>Journal Entry</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-100 rounded mr-2"></div>
                <span>Has Trades</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
                <span>Journal & Trades</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a date'}
              </CardTitle>
              <CardDescription>
                {tradesForSelectedDate.length} trades • {journalForSelectedDate ? 'Journal completed' : 'No journal entry'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tradesForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-sm font-medium">Daily Profit/Loss</div>
                      <div className={`text-xl font-bold ${dailyProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {formatCurrency(dailyProfit)}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-sm font-medium">Trades</div>
                      <div className="text-xl font-bold">
                        {tradesForSelectedDate.length}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-sm font-medium">Win / Loss</div>
                      <div className="text-xl font-bold">
                        {winCount} W / {lossCount} L
                      </div>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Asset</TableHead>
                        <TableHead>Setup</TableHead>
                        <TableHead>Direction</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>P/L</TableHead>
                        <TableHead>R/R</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tradesForSelectedDate.map((trade: Trade) => (
                        <TableRow key={trade.id}>
                          <TableCell className="font-medium">{trade.asset}</TableCell>
                          <TableCell>
                            {setups.find(s => s.id === trade.setupId)?.name || 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={trade.direction === 'Buy' ? 'default' : 'destructive'}>
                              {trade.direction}
                            </Badge>
                          </TableCell>
                          <TableCell>{format(new Date(trade.entryTime), 'HH:mm')}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {trade.financialResult > 0 ? (
                                <TrendingUp className="mr-1 h-4 w-4 text-profit" />
                              ) : (
                                <TrendingDown className="mr-1 h-4 w-4 text-loss" />
                              )}
                              <span 
                                className={trade.financialResult > 0 ? 'text-profit' : 'text-loss'}
                              >
                                {formatCurrency(trade.financialResult)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{trade.riskRewardRatio}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground">No trades for this date.</p>
              )}
            </CardContent>
          </Card>
          
          {journalForSelectedDate && (
            <Card>
              <CardHeader>
                <CardTitle>Journal Entry</CardTitle>
                <CardDescription>
                  {format(new Date(journalForSelectedDate.date), 'MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Daily Comment</h3>
                    <p className="text-sm">{journalForSelectedDate.dailyComment}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Error Review</h3>
                      <p className="text-sm">
                        {journalForSelectedDate.errorReviewCompleted 
                          ? 'Completed ✓' 
                          : 'Not completed ✗'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Previous Day Goal</h3>
                      <p className="text-sm">
                        {journalForSelectedDate.previousDayGoalHit === null 
                          ? 'Not applicable' 
                          : journalForSelectedDate.previousDayGoalHit 
                            ? 'Goal achieved ✓' 
                            : 'Goal missed ✗'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
