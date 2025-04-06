
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/branding/Logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const { t, currentLanguage, setLanguage } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password, rememberMe);
      navigate('/');
    } catch (error) {
      let errorMessage = 'Invalid credentials';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleLanguage = () => {
    if (currentLanguage === 'en-US') {
      setLanguage('pt-BR');
    } else {
      setLanguage('en-US');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        
        <div className="bg-card border border-border rounded-lg shadow-xl p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            {t('login.title')}
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                {t('login.email')}
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                {t('login.password')}
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => 
                    setRememberMe(checked as boolean)
                  }
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t('login.rememberMe')}
                </label>
              </div>
              
              <a href="#" className="text-sm text-primary hover:underline">
                {t('login.forgotPassword')}
              </a>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : t('login.submit')}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              {t('login.noAccount')}{' '}
              <a href="#" className="text-primary hover:underline">
                {t('login.signUp')}
              </a>
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-xs"
            >
              {t('login.switchLanguage')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
