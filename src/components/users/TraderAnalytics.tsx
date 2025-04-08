
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TraderAnalyticsProps {
  userId: string;
}

const TraderAnalytics: React.FC<TraderAnalyticsProps> = ({ userId }) => {
  const { t } = useLanguage();

  // In a real application, this data would be fetched from an API
  // using the userId parameter
  const traderData = {
    name: 'Trader',
    profitLoss: '$1,245',
    winRate: '65%',
    tradeCount: 42,
    averageTrade: '$29.64'
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{t('analytics.traderDetails')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{traderData.profitLoss}</div>
                  <p className="text-xs text-muted-foreground">{t('analytics.profitLoss')}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{traderData.winRate}</div>
                  <p className="text-xs text-muted-foreground">{t('analytics.winRate')}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{traderData.tradeCount}</div>
                  <p className="text-xs text-muted-foreground">{t('analytics.tradeCount')}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{traderData.averageTrade}</div>
                  <p className="text-xs text-muted-foreground">{t('analytics.averageTrade')}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Performance chart would be displayed here
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default TraderAnalytics;
