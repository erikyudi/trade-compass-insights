
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, addMonths, subMonths, startOfDay, endOfDay } from 'date-fns';
import { useLanguage } from '@/context/LanguageContext';
import Dashboard from '@/components/dashboard/Dashboard';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterType = 'month' | 'range';

const AnalyticsPage: React.FC = () => {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState<FilterType>('month');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));
  const [dateRangeApplied, setDateRangeApplied] = useState(false);
  
  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const applyFilter = () => {
    setDateRangeApplied(true);
    console.log('Applied filter:', filterType === 'month' 
      ? { month: currentMonth } 
      : { startDate, endDate });
  };
  
  const resetFilter = () => {
    setFilterType('month');
    setCurrentMonth(new Date());
    setStartDate(startOfMonth(new Date()));
    setEndDate(endOfMonth(new Date()));
    setDateRangeApplied(false);
  };

  // Compute the actual date range for filtering
  const effectiveStartDate = filterType === 'month' 
    ? startOfMonth(currentMonth) 
    : startOfDay(startDate);
  
  const effectiveEndDate = filterType === 'month' 
    ? endOfMonth(currentMonth) 
    : endOfDay(endDate);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('analytics.title')}</h1>
        <p className="text-muted-foreground">
          {t('analytics.description')}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.filter')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="month" 
            value={filterType} 
            onValueChange={(value) => setFilterType(value as FilterType)}
            className="mb-4"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="month">{t('analytics.month')}</TabsTrigger>
              <TabsTrigger value="range">{t('analytics.dateRange')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="month" className="space-y-4">
              <div className="flex items-center justify-between">
                <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="font-medium">
                  {format(currentMonth, 'MMMM yyyy')}
                </div>
                <Button variant="outline" size="icon" onClick={handleNextMonth}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="range" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-medium text-sm">{t('analytics.startDate')}</div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal justify-start"
                        )}
                      >
                        {format(startDate, "PPP")}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setStartDate(date)}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <div className="font-medium text-sm">{t('analytics.endDate')}</div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal justify-start"
                        )}
                      >
                        {format(endDate, "PPP")}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => date && setEndDate(date)}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={resetFilter}>
              {t('analytics.reset')}
            </Button>
            <Button onClick={applyFilter}>
              {t('analytics.apply')}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Dashboard 
        startDate={effectiveStartDate}
        endDate={effectiveEndDate}
        dateRangeApplied={dateRangeApplied}
      />
    </div>
  );
};

export default AnalyticsPage;
