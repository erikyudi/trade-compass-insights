
import React, { useState } from 'react';
import { 
  Shield, 
  Shapes, 
  AlertTriangle, 
  Banknote, 
  Globe 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RiskSettingsForm from '@/components/settings/RiskSettingsForm';
import TradingSetupList from '@/components/settings/TradingSetupList';
import MistakeTypeList from '@/components/settings/MistakeTypeList';
import AssetList from '@/components/settings/AssetList';

const SettingsPage: React.FC = () => {
  const { t, currentLanguage, setLanguage } = useLanguage();
  
  const handleLanguageChange = (value: string) => {
    if (value === 'en-US' || value === 'pt-BR') {
      setLanguage(value);
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('nav.settings')}</h1>
        <p className="text-muted-foreground">
          Manage your trading preferences, risk settings, and application configuration
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{t('settings.language')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Select 
                value={currentLanguage} 
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-full sm:w-[240px]">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="pt-BR">Português (BR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="risk" className="space-y-4">
        <TabsList>
          <TabsTrigger value="risk" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span>{t('settings.riskManagement')}</span>
          </TabsTrigger>
          <TabsTrigger value="setups" className="flex items-center gap-1">
            <Shapes className="h-4 w-4" />
            <span>{t('settings.tradingSetups')}</span>
          </TabsTrigger>
          <TabsTrigger value="mistakes" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            <span>{t('settings.mistakeTypes')}</span>
          </TabsTrigger>
          <TabsTrigger value="assets" className="flex items-center gap-1">
            <Banknote className="h-4 w-4" />
            <span>{t('settings.assets')}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="risk" className="space-y-4">
          <RiskSettingsForm />
        </TabsContent>
        
        <TabsContent value="setups" className="space-y-4">
          <TradingSetupList />
        </TabsContent>
        
        <TabsContent value="mistakes" className="space-y-4">
          <MistakeTypeList />
        </TabsContent>
        
        <TabsContent value="assets" className="space-y-4">
          <AssetList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
