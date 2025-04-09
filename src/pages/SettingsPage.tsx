
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AssetList from '@/components/settings/AssetList';
import TradingSetupList from '@/components/settings/TradingSetupList';
import MistakeTypeList from '@/components/settings/MistakeTypeList';
import { useLanguage } from '@/context/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SettingsPage = () => {
  const { t, currentLanguage, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('assets');
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('settings.title', 'Settings')}</h1>
        <p className="text-muted-foreground">
          {t('settings.description', 'Manage your application settings')}
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('settings.language', 'Language')}</CardTitle>
          <CardDescription>{t('settings.languageDescription', 'Choose your preferred language')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Select 
            value={currentLanguage} 
            onValueChange={setLanguage}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder={t('settings.selectLanguage', 'Select language')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="pt">Português</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      <Tabs 
        defaultValue="assets" 
        value={activeTab} 
        onValueChange={handleTabChange}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="assets">{t('settings.assets', 'Assets')}</TabsTrigger>
          <TabsTrigger value="setups">{t('settings.setups', 'Setups')}</TabsTrigger>
          <TabsTrigger value="mistakes">{t('settings.mistakes', 'Mistakes')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assets">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.assets', 'Assets')}</CardTitle>
              <CardDescription>
                {t('settings.assetsDescription', 'Manage trading assets and markets')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AssetList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="setups">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.setups', 'Setups')}</CardTitle>
              <CardDescription>
                {t('settings.setupsDescription', 'Manage your trading strategies and setups')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TradingSetupList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mistakes">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.mistakes', 'Mistakes')}</CardTitle>
              <CardDescription>
                {t('settings.mistakesDescription', 'Track and categorize common trading mistakes')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MistakeTypeList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
