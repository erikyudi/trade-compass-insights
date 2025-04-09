
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAppContext } from '@/context/AppContext';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Trade, TradingDirection, TrendPosition } from '@/types';
import { CalendarIcon } from 'lucide-react';
import SearchableAssetSelect from './SearchableAssetSelect';

interface TradeFormProps {
  trade?: Trade;
  onSubmit: (tradeData: Partial<Trade>) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  asset: z.string().min(1, 'Asset is required'),
  setupId: z.string().min(1, 'Setup is required'),
  direction: z.enum(['Buy', 'Sell'] as const, {
    required_error: 'Direction is required',
  }),
  trendPosition: z.enum(['With', 'Against', 'Neutral'] as const, {
    required_error: 'Trend position is required',
  }),
  entryTime: z.date({
    required_error: 'Entry time is required',
  }),
  exitTime: z.date().optional(),
  profitLossPercentage: z.number({ 
    required_error: 'Profit/loss is required',
    invalid_type_error: 'Must be a number'
  }).optional(),
  leverage: z.number({ 
    required_error: 'Leverage is required',
    invalid_type_error: 'Must be a number'
  }).min(1, 'Minimum leverage is 1'),
  notes: z.string().optional(),
  isMistake: z.boolean().default(false),
  mistakeTypeId: z.string().optional(),
});

const TradeForm: React.FC<TradeFormProps> = ({ trade, onSubmit, onCancel }) => {
  const { state } = useAppContext();
  const { t } = useLanguage();
  
  // Utility functions
  const hasDailyJournal = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return state.journals.some(journal => 
      format(new Date(journal.date), 'yyyy-MM-dd') === today
    );
  };
  
  const checkRiskLimit = () => {
    // Check if we are exceeding the daily risk limit
    const { riskSettings } = state;
    if (!riskSettings || !riskSettings.maxDailyRisk) return true;
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayLosses = state.trades
      .filter(t => 
        format(new Date(t.entryTime), 'yyyy-MM-dd') === today && 
        t.financialResult < 0 && 
        (!trade || t.id !== trade.id)
      )
      .reduce((sum, t) => sum + Math.abs(t.financialResult), 0);
    
    return todayLosses < (riskSettings.maxDailyRisk || 0);
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: trade ? {
      asset: trade.asset,
      setupId: trade.setupId,
      direction: trade.direction as TradingDirection,
      trendPosition: trade.trendPosition as TrendPosition,
      entryTime: new Date(trade.entryTime),
      exitTime: trade.exitTime ? new Date(trade.exitTime) : undefined,
      profitLossPercentage: trade.profitLossPercentage,
      leverage: trade.leverage,
      notes: trade.notes || '',
      isMistake: trade.isMistake,
      mistakeTypeId: trade.mistakeTypeId,
    } : {
      asset: '',
      setupId: '',
      direction: 'Buy' as const,
      trendPosition: 'With' as const,
      entryTime: new Date(),
      exitTime: undefined, // Default to undefined (no exit time)
      profitLossPercentage: undefined, // Empty by default
      leverage: 1,
      notes: '',
      isMistake: false,
      mistakeTypeId: undefined,
    },
  });
  
  const isMistake = form.watch('isMistake');
  
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (!hasDailyJournal()) {
      toast.error(t('trade.noJournal'), {
        description: t('trade.createJournalFirst')
      });
      return;
    }
    
    if (!checkRiskLimit() && values.profitLossPercentage && values.profitLossPercentage < 0) {
      toast.error('Risk limit exceeded', {
        description: 'You have exceeded your daily risk limit. Be cautious about taking additional trades.'
      });
    }
    
    // Convert values to match Trade type
    const tradeData: Partial<Trade> = {
      ...values,
      profitLossPercentage: values.profitLossPercentage || 0,
      financialResult: values.profitLossPercentage || 0
    };
    
    onSubmit(tradeData);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {trade ? t('trade.edit') : t('trade.new')}
        </CardTitle>
        <CardDescription>
          {trade ? t('trade.editDescription') : t('trade.newDescription')}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asset */}
              <FormField
                control={form.control}
                name="asset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('trade.asset')}</FormLabel>
                    <SearchableAssetSelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Setup */}
              <FormField
                control={form.control}
                name="setupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('trade.setup')}</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('trade.selectSetup')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {state.setups.map((setup) => (
                          <SelectItem key={setup.id} value={setup.id}>
                            {setup.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Direction */}
              <FormField
                control={form.control}
                name="direction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('trade.direction')}</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('trade.selectDirection')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Buy">{t('trade.buy')}</SelectItem>
                        <SelectItem value="Sell">{t('trade.sell')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Trend Position */}
              <FormField
                control={form.control}
                name="trendPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('trade.trendPosition')}</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('trade.selectTrend')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="With">{t('trade.withTrend')}</SelectItem>
                        <SelectItem value="Against">{t('trade.againstTrend')}</SelectItem>
                        <SelectItem value="Neutral">{t('trade.neutralTrend')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Entry Time */}
              <FormField
                control={form.control}
                name="entryTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('trade.entryTime')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP HH:mm")
                            ) : (
                              <span>{t('trade.selectDate')}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => date && field.onChange(date)}
                          initialFocus
                          className="pointer-events-auto"
                        />
                        <div className="p-3 border-t border-border">
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={field.value ? format(field.value, "HH:mm") : ""}
                              onChange={(e) => {
                                if (!e.target.value || !field.value) return;
                                const [hours, minutes] = e.target.value.split(':');
                                const newDate = new Date(field.value);
                                newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                                field.onChange(newDate);
                              }}
                            />
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Exit Time (Optional) */}
              <FormField
                control={form.control}
                name="exitTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('trade.exitTime')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP HH:mm")
                            ) : (
                              <span>{t('trade.exitTimeOptional')}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="flex justify-end pr-2 pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => field.onChange(undefined)}
                          >
                            {t('trade.clear')}
                          </Button>
                        </div>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                        {field.value && (
                          <div className="p-3 border-t border-border">
                            <div className="flex items-center gap-2">
                              <Input
                                type="time"
                                value={field.value ? format(field.value, "HH:mm") : ""}
                                onChange={(e) => {
                                  if (!e.target.value || !field.value) return;
                                  const [hours, minutes] = e.target.value.split(':');
                                  const newDate = new Date(field.value);
                                  newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                                  field.onChange(newDate);
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profit/Loss */}
              <FormField
                control={form.control}
                name="profitLossPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('trade.profitLoss')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="text"
                        placeholder="0.00"
                        value={field.value === undefined ? '' : field.value.toString()}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Accept empty string, minus sign alone, and valid numbers with optional minus sign
                          if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
                            field.onChange(value === '' || value === '-' ? undefined : parseFloat(value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('trade.profitLossAmountDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Leverage */}
              <FormField
                control={form.control}
                name="leverage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('trade.leverage')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min={1}
                        step={0.1}
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('trade.leverageDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('trade.notes')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t('trade.notesPlaceholder')}
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Is Mistake */}
            <FormField
              control={form.control}
              name="isMistake"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t('trade.isMistake')}
                    </FormLabel>
                    <FormDescription>
                      {t('trade.isMistakeDescription')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {/* Mistake Type - only shown if isMistake is true */}
            {isMistake && (
              <FormField
                control={form.control}
                name="mistakeTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('trade.mistakeType')}</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('trade.selectMistakeType')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {state.mistakeTypes.map((mistakeType) => (
                          <SelectItem key={mistakeType.id} value={mistakeType.id}>
                            {mistakeType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {trade ? t('common.save') : t('common.create')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default TradeForm;
