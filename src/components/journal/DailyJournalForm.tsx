
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';

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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DailyJournal } from '@/types';

const formSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  errorReviewCompleted: z.boolean().default(false),
  dailyComment: z.string().optional(), // Made optional as per requirements
  previousDayGoalHit: z.enum(['true', 'false', 'na'], { 
    required_error: "Please select if you hit your previous day's goal" 
  }),
});

type DailyJournalFormProps = {
  onSubmit: (data: Partial<DailyJournal>) => void;
  initialData?: Partial<DailyJournal>;
};

const DailyJournalForm: React.FC<DailyJournalFormProps> = ({ onSubmit, initialData }) => {
  const { state } = useAppContext();
  const { t } = useLanguage();
  const { trades } = state;
  
  // Get recent mistakes
  const recentMistakes = trades
    .filter(trade => trade.isMistake)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
    
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Set form default values with initialData if provided
  const defaultValues = {
    date: initialData?.date ? new Date(initialData.date) : today,
    errorReviewCompleted: initialData?.errorReviewCompleted || false,
    dailyComment: initialData?.dailyComment || '',
    previousDayGoalHit: initialData?.previousDayGoalHit === null 
      ? 'na' 
      : initialData?.previousDayGoalHit === true 
        ? 'true' 
        : initialData?.previousDayGoalHit === false 
          ? 'false' 
          : 'na',
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const formattedValues = {
      ...values,
      previousDayGoalHit: values.previousDayGoalHit === 'na' 
        ? null 
        : values.previousDayGoalHit === 'true'
    };
    
    onSubmit(formattedValues);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{t('journal.entryFor')} {defaultValues.date.toLocaleDateString()}</CardTitle>
        <CardDescription>
          {initialData ? t('journal.editEntry') : t('journal.complete')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('journal.date')}</FormLabel>
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
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
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
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    {t('journal.date')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Recent Mistakes Review */}
            {recentMistakes.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">{t('journal.errorReview')}</h3>
                <div className="bg-secondary rounded-lg p-4 space-y-3">
                  {recentMistakes.map((mistake) => (
                    <div key={mistake.id} className="border-b pb-3 last:border-0 last:pb-0">
                      <p className="text-sm font-medium">{mistake.asset} - {format(new Date(mistake.entryTime), 'MMM d')}</p>
                      <p className="text-sm text-gray-600">
                        {state.mistakeTypes.find(t => t.id === mistake.mistakeTypeId)?.name}
                      </p>
                      {mistake.notes && (
                        <p className="text-sm mt-1">{mistake.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Error Review Completed */}
            <FormField
              control={form.control}
              name="errorReviewCompleted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t('journal.errorReviewCompleted')}
                    </FormLabel>
                    <FormDescription>
                      {t('journal.errorReview')}
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
            
            {/* Previous Day Goal Hit */}
            <FormField
              control={form.control}
              name="previousDayGoalHit"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t('journal.previousDayGoalHit')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="true" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t('journal.yes')}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="false" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t('journal.no')}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="na" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t('journal.na')}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Daily Comment */}
            <FormField
              control={form.control}
              name="dailyComment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('journal.dailyComment')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What are your goals for today? What setups are you looking for? What will you avoid?"
                      className="min-h-[150px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    {t('journal.comment')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <CardFooter className="flex justify-end px-0">
              <Button type="submit">
                {initialData ? t('common.save') : t('journal.complete')}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DailyJournalForm;
