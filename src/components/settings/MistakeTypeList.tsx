
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { MistakeType } from '@/types';

const MistakeTypeList: React.FC = () => {
  const { t } = useLanguage();
  const { 
    state: { mistakeTypes }, 
    addMistakeType, 
    deleteMistakeType 
  } = useAppContext();
  const [newMistakeName, setNewMistakeName] = useState('');

  const handleAddMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMistakeName.trim()) {
      addMistakeType({ name: newMistakeName.trim() });
      setNewMistakeName('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.mistakeTypes')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAddMistake} className="flex space-x-2">
          <Input
            value={newMistakeName}
            onChange={(e) => setNewMistakeName(e.target.value)}
            placeholder={t('settings.newMistakePlaceholder')}
          />
          <Button type="submit" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            {t('common.add')}
          </Button>
        </form>

        <div className="space-y-2">
          {mistakeTypes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t('settings.noMistakes')}
            </p>
          ) : (
            mistakeTypes.map((mistake: MistakeType) => (
              <div
                key={mistake.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <span>{mistake.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMistakeType(mistake.id)}
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

export default MistakeTypeList;
