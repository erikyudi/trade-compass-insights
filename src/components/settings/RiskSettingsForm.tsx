
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAppContext } from '@/context/AppContext';
import { toast } from 'sonner';

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

const RiskSettingsForm: React.FC = () => {
  const { state, updateRiskSettings } = useAppContext();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: state.riskSettings,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateRiskSettings(values);
    toast.success('Risk settings updated');
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Risk Management Settings</CardTitle>
        <CardDescription>
          Configure your risk parameters to maintain discipline in your trading
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
                  <FormLabel>Initial Capital ($)</FormLabel>
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
                    Your trading account starting balance
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
                  <FormLabel>Daily Profit Target (%)</FormLabel>
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
                    Your target daily profit as a percentage of initial capital
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
                  <FormLabel>Maximum Daily Risk (%)</FormLabel>
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
                    The maximum percentage of your capital you're willing to risk in a single day
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <CardFooter className="flex justify-end px-0">
              <Button type="submit">
                Save Risk Settings
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RiskSettingsForm;
