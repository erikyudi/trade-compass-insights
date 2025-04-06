
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { AssetType } from '@/types';

const AssetList: React.FC = () => {
  const { t } = useLanguage();
  const { 
    state: { assets }, 
    addAsset, 
    deleteAsset 
  } = useAppContext();
  const [newAssetSymbol, setNewAssetSymbol] = useState('');

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAssetSymbol.trim()) {
      addAsset({ symbol: newAssetSymbol.trim().toUpperCase() });
      setNewAssetSymbol('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.assets')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAddAsset} className="flex space-x-2">
          <Input
            value={newAssetSymbol}
            onChange={(e) => setNewAssetSymbol(e.target.value)}
            placeholder={t('settings.newAssetPlaceholder')}
          />
          <Button type="submit" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            {t('common.add')}
          </Button>
        </form>

        <div className="space-y-2">
          {assets.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t('settings.noAssets')}
            </p>
          ) : (
            assets.map((asset: AssetType) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <span>{asset.symbol}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteAsset(asset.id)}
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

export default AssetList;
