
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import Logo from '@/components/branding/Logo';

const ResetPasswordPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock function to verify token
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // In a real app, you would verify the token with your backend
        // For now, we'll just simulate a valid token if it exists
        await new Promise(resolve => setTimeout(resolve, 500));
        if (token) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
          toast.error(t('resetPassword.invalidToken'));
        }
      } catch (error) {
        setIsValidToken(false);
        toast.error(t('resetPassword.verificationError'));
      }
    };
    
    verifyToken();
  }, [token, t]);
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error(t('resetPassword.passwordsDoNotMatch'));
      return;
    }
    
    if (password.length < 6) {
      toast.error(t('resetPassword.passwordTooShort'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would call your backend API to reset the password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(t('resetPassword.success'));
      navigate('/login');
    } catch (error) {
      toast.error(t('resetPassword.error'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4">
        <div className="w-full max-w-md text-center">
          <Logo size="md" className="mx-auto mb-6" />
          <Card>
            <CardHeader>
              <CardTitle>{t('resetPassword.invalidToken')}</CardTitle>
              <CardDescription>
                {t('resetPassword.tokenRequired')}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate('/login')}
              >
                {t('common.backToLogin')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4">
      <div className="w-full max-w-md">
        <Logo size="md" className="mx-auto mb-6" />
        
        <Card>
          <CardHeader>
            <CardTitle>{t('resetPassword.title')}</CardTitle>
            <CardDescription>
              {t('resetPassword.instructions')}
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  {t('resetPassword.newPassword')}
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={!isValidToken || isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="block text-sm font-medium">
                  {t('resetPassword.confirmPassword')}
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={!isValidToken || isSubmitting}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/login')}
              >
                {t('common.cancel')}
              </Button>
              <Button 
                type="submit" 
                disabled={!isValidToken || isSubmitting || !password || !confirmPassword}
              >
                {isSubmitting ? t('common.submitting') : t('resetPassword.resetPassword')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
