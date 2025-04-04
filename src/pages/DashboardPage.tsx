
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Dashboard from '@/components/dashboard/Dashboard';
import { useAppContext } from '@/context/AppContext';
import { ArrowRight, BookText, ClipboardEdit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, hasDailyJournal } = useAppContext();
  const { trades, journals } = state;
  
  const hasCompletedJournal = hasDailyJournal();
  const hasTrades = trades.length > 0;
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Your trading performance at a glance
          </p>
        </div>
        <div className="flex gap-2">
          {!hasCompletedJournal && (
            <Button onClick={() => navigate('/journal')}>
              <BookText className="mr-2 h-4 w-4" />
              Complete Daily Journal
            </Button>
          )}
          <Button onClick={() => navigate('/trades')}>
            <ClipboardEdit className="mr-2 h-4 w-4" />
            Log New Trade
          </Button>
        </div>
      </div>
      
      {!hasCompletedJournal && (
        <Alert variant="destructive">
          <AlertTitle>Daily Journal Required</AlertTitle>
          <AlertDescription>
            Complete your daily journal before trading to improve discipline and focus.
            <Button 
              variant="link" 
              className="p-0 h-auto ml-2" 
              onClick={() => navigate('/journal')}
            >
              Go to Journal <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {!hasTrades && hasCompletedJournal && (
        <Alert>
          <AlertTitle>Ready to Start Trading</AlertTitle>
          <AlertDescription>
            You've completed your daily journal. Now you can log your trades.
            <Button 
              variant="link" 
              className="p-0 h-auto ml-2" 
              onClick={() => navigate('/trades')}
            >
              Log First Trade <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {hasTrades ? (
        <Dashboard />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Trade Compass</CardTitle>
            <CardDescription>
              Your personal trading risk and performance management system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This dashboard will display your trading analytics once you start logging trades.
              First, complete your daily journal to set intentions for the day.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Step 1</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Complete your daily journal and error review</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate('/journal')}
                    variant="outline"
                  >
                    Go to Journal
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Step 2</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Log your trades with complete details</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate('/trades')}
                    variant="outline"
                  >
                    Go to Trades
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Step 3</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Configure your risk management settings</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate('/settings')}
                    variant="outline"
                  >
                    Go to Settings
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
