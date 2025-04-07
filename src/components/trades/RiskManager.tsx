
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RiskSettingsForm from '@/components/settings/RiskSettingsForm';

const RiskManager: React.FC = () => {
  const { state } = useAppContext();
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('risk.management')}</CardTitle>
      </CardHeader>
      <CardContent>
        <RiskSettingsForm />
      </CardContent>
    </Card>
  );
};

export default RiskManager;
