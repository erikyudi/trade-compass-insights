
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { User } from '@/context/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TraderAnalyticsProps {
  trader: User;
  onClose: () => void;
}

const TraderAnalytics: React.FC<TraderAnalyticsProps> = ({ trader, onClose }) => {
  const { t } = useLanguage();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('analytics.traderDetails')}: {trader.name}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">$1,245</div>
                  <p className="text-xs text-muted-foreground">{t('analytics.profitLoss')}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">65%</div>
                  <p className="text-xs text-muted-foreground">{t('analytics.winRate')}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">{t('analytics.tradeCount')}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">$29.64</div>
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
