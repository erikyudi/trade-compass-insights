
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/LanguageContext';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DailyJournal } from '@/types';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DailyJournalFormProps {
  defaultValues?: {
    date?: Date;
    errorReviewCompleted?: boolean;
    dailyComment?: string;
    previousDayGoalHit?: "true" | "false" | "na";
  };
  initialData?: DailyJournal;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

const formSchema = z.object({
  date: z.date(),
  errorReviewCompleted: z.boolean(),
  dailyComment: z.string().min(1, 'Please provide a daily comment'),
  previousDayGoalHit: z.enum(['true', 'false', 'na'])
});

const DailyJournalForm: React.FC<DailyJournalFormProps> = ({
  defaultValues,
  initialData,
  onSubmit,
  isSubmitting = false
}) => {
  const { t } = useLanguage();
  
  // Use initialData if provided, otherwise use defaultValues
  const formDefaultValues = initialData ? {
    date: initialData.date,
    errorReviewCompleted: initialData.errorReviewCompleted,
    dailyComment: initialData.dailyComment,
    previousDayGoalHit: initialData.previousDayGoalHit === true 
      ? 'true' 
      : initialData.previousDayGoalHit === false 
        ? 'false' 
        : 'na'
  } : {
    date: defaultValues?.date || new Date(),
    errorReviewCompleted: defaultValues?.errorReviewCompleted || false,
    dailyComment: defaultValues?.dailyComment || '',
    previousDayGoalHit: defaultValues?.previousDayGoalHit || 'na'
  };
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{t('journal.dailyTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="previousDayGoalHit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('journal.goalHit')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('journal.selectGoalStatus')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">{t('common.yes')}</SelectItem>
                      <SelectItem value="false">{t('common.no')}</SelectItem>
                      <SelectItem value="na">{t('common.notApplicable')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t('journal.goalHitDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="errorReviewCompleted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {t('journal.errorReview')}
                    </FormLabel>
                    <FormDescription>
                      {t('journal.errorReviewDescription')}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dailyComment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('journal.dailyComment')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('journal.dailyCommentPlaceholder')}
                      {...field}
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.submitting') : t('common.submit')}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default DailyJournalForm;
