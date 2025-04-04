import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, AlertTriangle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
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
  exitTime: z.date({ required_error: 'Exit time is required' }),
  financialResult: z.number({ 
    required_error: 'Financial result is required',
    invalid_type_error: 'Must be a number'
  }),
  profitLossPercentage: z.number({ 
    required_error: 'Profit/loss percentage is required',
    invalid_type_error: 'Must be a number'
  }),
  riskRewardRatio: z.number({ 
    required_error: 'Risk/reward ratio is required',
    invalid_type_error: 'Must be a number'
  }),
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
  const { setups, mistakeTypes } = state;
  
  const defaultValues = trade ? {
    ...trade,
  } : {
    asset: '',
    setupId: '',
    direction: 'Buy' as const,
    trendPosition: 'With' as const,
    entryTime: new Date(),
    exitTime: new Date(),
    financialResult: 0,
    profitLossPercentage: 0,
    riskRewardRatio: 0,
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
  
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (!hasDailyJournal()) {
      toast.error('Daily journal required', {
        description: 'You must complete your daily journal before logging trades.'
      });
      return;
    }
    
    if (!checkRiskLimit() && values.financialResult < 0) {
      toast.error('Risk limit exceeded', {
        description: 'You have exceeded your daily risk limit. Be cautious about taking additional trades.'
      });
    }
    
    onSubmit(values);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{trade ? 'Edit Trade' : 'Log New Trade'}</CardTitle>
        <CardDescription>Record the details of your trade</CardDescription>
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
              {/* Asset */}
              <FormField
                control={form.control}
                name="asset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset (Symbol)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. AAPL, BTC, EUR/USD" {...field} />
                    </FormControl>
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
                    <FormLabel>Setup</FormLabel>
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
                    <FormLabel>Direction</FormLabel>
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
                        <SelectItem value="Buy">Buy</SelectItem>
                        <SelectItem value="Sell">Sell</SelectItem>
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
                    <FormLabel>Trend Position</FormLabel>
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
                        <SelectItem value="With">With Trend</SelectItem>
                        <SelectItem value="Against">Against Trend</SelectItem>
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
                    <FormLabel>Entry Time</FormLabel>
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
                          className="pointer-events-auto"
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
                    <FormLabel>Exit Time</FormLabel>
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
                          className="pointer-events-auto"
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
              
              {/* Financial Result */}
              <FormField
                control={form.control}
                name="financialResult"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Financial Result ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Profit/Loss Percentage */}
              <FormField
                control={form.control}
                name="profitLossPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profit/Loss Percentage (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Risk/Reward Ratio */}
              <FormField
                control={form.control}
                name="riskRewardRatio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk/Reward Ratio</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                  <FormLabel>Trade Notes</FormLabel>
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
                        Was this trade a mistake?
                      </FormLabel>
                      <FormDescription>
                        Mark trades that violated your trading rules or had execution errors
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
                      <FormLabel>Type of Mistake</FormLabel>
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
                      <FormLabel>Save as Model Trade</FormLabel>
                      <FormDescription>
                        Mark this as an exemplary trade to reference in the future
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <CardFooter className="flex justify-between px-0">
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={!hasDailyJournal()}>
                {trade ? 'Update Trade' : 'Log Trade'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TradeForm;
