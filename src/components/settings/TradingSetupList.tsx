
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { SetupType } from '@/types';

const TradingSetupList: React.FC = () => {
  const { t } = useLanguage();
  const { 
    state: { setups }, 
    addSetup, 
    deleteSetup 
  } = useAppContext();
  const [newSetupName, setNewSetupName] = useState('');

  const handleAddSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSetupName.trim()) {
      addSetup({ name: newSetupName.trim() });
      setNewSetupName('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.tradingSetups')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAddSetup} className="flex space-x-2">
          <Input
            value={newSetupName}
            onChange={(e) => setNewSetupName(e.target.value)}
            placeholder={t('settings.newSetupPlaceholder')}
          />
          <Button type="submit" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            {t('common.add')}
          </Button>
        </form>

        <div className="space-y-2">
          {setups.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t('settings.noSetups')}
            </p>
          ) : (
            setups.map((setup: SetupType) => (
              <div
                key={setup.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <span>{setup.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteSetup(setup.id)}
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingSetupList;
