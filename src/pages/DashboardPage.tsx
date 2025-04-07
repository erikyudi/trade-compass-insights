
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Dashboard from '@/components/dashboard/Dashboard';
import { useAppContext } from '@/context/AppContext';
import { ArrowRight, BookText, ClipboardEdit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/context/LanguageContext';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, hasDailyJournal } = useAppContext();
  const { trades, journals } = state;
  const { t } = useLanguage();
  
  const hasCompletedJournal = hasDailyJournal();
  const hasTrades = trades.length > 0;
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">
            {t('dashboard.description')}
          </p>
        </div>
        <div className="flex gap-2">
          {!hasCompletedJournal && (
            <Button onClick={() => navigate('/journal')}>
              <BookText className="mr-2 h-4 w-4" />
              {t('dashboard.completeJournal')}
            </Button>
          )}
          <Button onClick={() => navigate('/trades')}>
            <ClipboardEdit className="mr-2 h-4 w-4" />
            {t('dashboard.logTrade')}
          </Button>
        </div>
      </div>
      
      {!hasCompletedJournal && (
        <Alert variant="destructive">
          <AlertTitle>{t('dashboard.journalRequired')}</AlertTitle>
          <AlertDescription>
            {t('dashboard.journalRequiredDesc')}
            <Button 
              variant="link" 
              className="p-0 h-auto ml-2" 
              onClick={() => navigate('/journal')}
            >
              {t('dashboard.goToJournal')} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {!hasTrades && hasCompletedJournal && (
        <Alert>
          <AlertTitle>{t('dashboard.readyToTrade')}</AlertTitle>
          <AlertDescription>
            {t('dashboard.readyToTradeDesc')}
            <Button 
              variant="link" 
              className="p-0 h-auto ml-2" 
              onClick={() => navigate('/trades')}
            >
              {t('dashboard.logFirstTrade')} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {hasTrades ? (
        <Dashboard />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.welcome')}</CardTitle>
            <CardDescription>
              {t('dashboard.welcomeDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              {t('dashboard.dashboardDesc')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('dashboard.step1')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{t('dashboard.step1Desc')}</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate('/journal')}
                    variant="outline"
                  >
                    {t('dashboard.goToJournal')}
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('dashboard.step2')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{t('dashboard.step2Desc')}</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate('/trades')}
                    variant="outline"
                  >
                    {t('nav.trades')}
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('dashboard.step3')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{t('dashboard.step3Desc')}</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate('/settings')}
                    variant="outline"
                  >
                    {t('nav.settings')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;
