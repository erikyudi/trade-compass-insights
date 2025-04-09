
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Logo from '@/components/branding/Logo';

const formSchema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof formSchema>;

const ResetPasswordPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Mock API call for password reset
      // In a real app, you would call an API endpoint here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(t('login.resetSent'), {
        description: t('login.checkEmail')
      });
      
      // Redirect back to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(t('login.resetFailed'), {
        description: t('login.tryAgain')
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md px-4">
        <Card className="border-gray-700 bg-gray-800 shadow-lg">
          <CardHeader className="space-y-4 pb-6">
            <div className="mx-auto mb-4">
              <Logo />
            </div>
            <CardTitle className="text-2xl text-center text-white">
              {t('login.resetPassword')}
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              {t('login.resetInstructions')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">
                        {t('login.email')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email@example.com"
                          {...field}
                          autoComplete="email"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? t('login.sending') : t('login.sendResetLink')}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col space-y-4 pt-0">
            <Button
              variant="link"
              className="text-orange-400 hover:text-orange-300"
              onClick={handleBackToLogin}
            >
              {t('login.backToLogin')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
