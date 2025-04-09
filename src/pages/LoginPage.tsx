
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
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
  password: z.string().min(6),
});

type FormData = z.infer<typeof formSchema>;

const LoginPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success(t('login.success'));
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(t('login.failed'), {
        description: t('login.tryAgain')
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetPassword = () => {
    navigate('/reset-password');
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
              {t('login.title')}
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              {t('login.description')}
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">
                        {t('login.password')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          autoComplete="current-password"
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
                  {isLoading ? t('login.loggingIn') : t('login.submit')}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col space-y-4 pt-0">
            <Button
              variant="link"
              className="text-orange-400 hover:text-orange-300"
              onClick={handleResetPassword}
            >
              {t('login.forgotPassword')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
