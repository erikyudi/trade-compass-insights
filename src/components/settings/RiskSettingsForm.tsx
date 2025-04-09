
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAppContext } from '@/context/AppContext';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  initialCapital: z.number({
    required_error: "Initial capital is required",
    invalid_type_error: "Initial capital must be a number",
  }).positive({
    message: "Initial capital must be positive",
  }),
  dailyProfitTarget: z.number({
    required_error: "Daily profit target is required",
    invalid_type_error: "Daily profit target must be a number",
  }).positive({
    message: "Daily profit target must be positive",
  }),
  maxDailyRisk: z.number({
    required_error: "Maximum daily risk is required",
    invalid_type_error: "Maximum daily risk must be a number",
  }).positive({
    message: "Maximum daily risk must be positive",
  }).max(100, {
    message: "Maximum daily risk cannot exceed 100%",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const RiskSettingsForm: React.FC = () => {
  const { state, updateRiskSettings } = useAppContext();
  const { t } = useLanguage();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialCapital: state.riskSettings.initialCapital,
      dailyProfitTarget: state.riskSettings.dailyProfitTarget,
      maxDailyRisk: state.riskSettings.maxDailyRisk,
    },
  });

  const onSubmit = (values: FormValues) => {
    // Ensure all values are filled before updating
    const updatedSettings = {
      initialCapital: values.initialCapital,
      dailyProfitTarget: values.dailyProfitTarget,
      maxDailyRisk: values.maxDailyRisk,
      dailyRiskLimit: state.riskSettings.dailyRiskLimit // Preserve the existing value
    };
    
    updateRiskSettings(updatedSettings);
    toast.success(t('risk.managementUpdated'));
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{t('risk.management')}</CardTitle>
        <CardDescription>
          {t('risk.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="initialCapital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('risk.initialCapital')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="10000.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('risk.initialCapitalDesc')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dailyProfitTarget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('risk.dailyProfit')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1"
                      placeholder="2.0"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('risk.dailyProfitDesc')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxDailyRisk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('risk.maxDailyRisk')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1"
                      placeholder="2.0"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('risk.maxDailyRiskDesc')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <CardFooter className="flex justify-end px-0">
              <Button type="submit">
                {t('settings.save')}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RiskSettingsForm;
