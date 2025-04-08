import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, AlertTriangle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Trade } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import SearchableAssetSelect from './SearchableAssetSelect';

// Modify the schema to make exitTime optional and remove financialResult
const formSchema = z.object({
  asset: z.string().min(1, { message: 'Asset symbol is required' }),
  setupId: z.string().min(1, { message: 'Setup is required' }),
  direction: z.enum(['Buy', 'Sell'], { 
    required_error: 'Direction is required' 
  }),
  trendPosition: z.enum(['With', 'Against'], { 
    required_error: 'Trend position is required' 
  }),
  entryTime: z.date({ required_error: 'Entry time is required' }),
  exitTime: z.date().optional(), // Make exitTime optional
  profitLossPercentage: z.number({ 
    required_error: 'Profit/loss is required',
    invalid_type_error: 'Must be a number'
  }),
  leverage: z.number({ 
    required_error: 'Leverage is required',
    invalid_type_error: 'Must be a number'
  }).min(1, { message: 'Leverage must be at least 1' }),
  notes: z.string().optional(),
  isMistake: z.boolean().default(false),
  mistakeTypeId: z.string().optional(),
  isModelTrade: z.boolean().default(false),
});

type TradeFormProps = {
  trade?: Trade;
  onSubmit: (data: Partial<Trade>) => void;
  onCancel: () => void;
};

const TradeForm: React.FC<TradeFormProps> = ({ 
  trade, 
  onSubmit,
  onCancel
}) => {
  const { state, hasDailyJournal, checkRiskLimit } = useAppContext();
  const { t } = useLanguage();
  const { setups, mistakeTypes } = state;
  
  const defaultValues = trade ? {
    ...trade,
  } : {
    asset: '',
    setupId: '',
    direction: 'Buy' as const,
    trendPosition: 'With' as const,
    entryTime: new Date(),
    exitTime: undefined, // Default to undefined (no exit time)
    profitLossPercentage: 0,
    leverage: 1,
    notes: '',
    isMistake: false,
    mistakeTypeId: undefined,
    isModelTrade: false,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  const isMistake = form.watch('isMistake');
  const exitTime = form.watch('exitTime');
  
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (!hasDailyJournal()) {
      toast.error('Daily journal required', {
        description: 'You must complete your daily journal before logging trades.'
      });
      return;
    }
    
    if (!checkRiskLimit() && values.profitLossPercentage < 0) {
      toast.error('Risk limit exceeded', {
        description: 'You have exceeded your daily risk limit. Be cautious about taking additional trades.'
      });
    }
    
    // Set financialResult based on profitLossPercentage for backward compatibility
    const tradeData = {
      ...values,
      financialResult: values.profitLossPercentage
    };
    
    onSubmit(tradeData);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{trade ? t('trade.edit') : t('trade.new')}</CardTitle>
        <CardDescription>{t('trade.details')}</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasDailyJournal() && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Daily Journal Required</AlertTitle>
            <AlertDescription>
              You must complete your daily journal before logging trades.
            </AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asset - Using SearchableAssetSelect */}
              <FormField
                control={form.control}
                name="asset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('trade.asset')}</FormLabel>
                    <SearchableAssetSelect
                      value={field.value}
                      onChange={field.onChange}
                      disabled={field.disabled}
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
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select setup" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {setups.map((setup) => (
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
              
              {/* Direction */}
              <FormField
                control={form.control}
                name="direction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('trade.direction')}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select direction" />
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
                    <FormLabel>{t('trade.trend')}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trend position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="With">{t('trade.withTrend')}</SelectItem>
                        <SelectItem value="Against">{t('trade.againstTrend')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                              <span>Select date and time</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                        <div className="p-3 border-t border-border">
                          <Input
                            type="time"
                            value={field.value ? format(field.value, "HH:mm") : ""}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(':');
                              const newDate = new Date(field.value);
                              newDate.setHours(parseInt(hours), parseInt(minutes));
                              field.onChange(newDate);
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Exit Time */}
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
                              <span>Select exit date and time</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                        <div className="p-3 border-t border-border">
                          <Input
                            type="time"
                            value={field.value ? format(field.value, "HH:mm") : ""}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(':');
                              const newDate = field.value || new Date();
                              newDate.setHours(parseInt(hours), parseInt(minutes));
                              field.onChange(newDate);
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Profit/Loss - Allow negative values */}
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
                        value={field.value.toString()}
                        onChange={(e) => {
                          // Only allow numbers, decimal point and minus sign
                          const value = e.target.value;
                          if (/^-?\d*\.?\d*$/.test(value)) {
                            field.onChange(value === '' ? 0 : parseFloat(value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('trade.profitLossDescription')}
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
                        step="1"
                        min="1"
                        placeholder="1"
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
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
                      placeholder="What did you observe during this trade?"
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Was this a mistake? */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="isMistake"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('trade.mistake')}
                      </FormLabel>
                      <FormDescription>
                        {t('trade.mistakeDescription')}
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
              
              {/* Mistake Type (conditional) */}
              {isMistake && (
                <FormField
                  control={form.control}
                  name="mistakeTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('trade.mistakeType')}</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select mistake type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mistakeTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {/* Model Trade */}
              <FormField
                control={form.control}
                name="isModelTrade"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t('trade.modelTrade')}</FormLabel>
                      <FormDescription>
                        {t('trade.modelDescription')}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <CardFooter className="flex justify-between px-0">
              <Button variant="outline" type="button" onClick={onCancel}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={!hasDailyJournal()}>
                {trade ? t('trade.update') : t('trade.log')}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TradeForm;
