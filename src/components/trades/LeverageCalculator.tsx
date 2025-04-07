
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency } from '@/context/appUtils';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

const LeverageCalculator: React.FC = () => {
  const { t } = useLanguage();
  const [stopSize, setStopSize] = useState<number>(0);
  const [marginAmount, setMarginAmount] = useState<number>(0);
  const [riskPercent, setRiskPercent] = useState<number>(0);
  const [result, setResult] = useState<{ leverage: number; positionSize: number } | null>(null);

  const handleCalculate = () => {
    if (stopSize <= 0 || marginAmount <= 0 || riskPercent <= 0) {
      // Don't calculate if any input is invalid
      return;
    }
    
    // Calculate maximum risk amount in dollars
    const maxRiskAmount = (marginAmount * riskPercent) / 100;
    
    // Convert stop size to decimal (5% becomes 0.05)
    const stopSizeDecimal = stopSize / 100;
    
    // Calculate leverage using the formula: leverage = capitalRisk / (marginUsed × stopPercent)
    const leverage = maxRiskAmount / (marginAmount * stopSizeDecimal);
    
    // Calculate position size based on leverage and margin
    const positionSize = marginAmount * leverage;
    
    setResult({
      leverage: Number(leverage.toFixed(2)),
      positionSize: Number(positionSize.toFixed(2))
    });
  };

  const handleReset = () => {
    setStopSize(0);
    setMarginAmount(0);
    setRiskPercent(0);
    setResult(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {t('calculator.title')}
        </CardTitle>
        <CardDescription>
          {t('calculator.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="stopSize">
              {t('calculator.stopPercentage')}
            </Label>
            <Input
              id="stopSize"
              type="number"
              step="0.01"
              min="0"
              value={stopSize || ''}
              onChange={(e) => setStopSize(parseFloat(e.target.value) || 0)}
              placeholder="2.5"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="marginAmount">
              {t('calculator.marginAmount')}
            </Label>
            <Input
              id="marginAmount"
              type="number"
              step="0.01"
              min="0"
              value={marginAmount || ''}
              onChange={(e) => setMarginAmount(parseFloat(e.target.value) || 0)}
              placeholder="1000.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="riskPercent">
              {t('calculator.riskPercentage')}
            </Label>
            <Input
              id="riskPercent"
              type="number"
              step="0.01"
              min="0"
              value={riskPercent || ''}
              onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
              placeholder="2.00"
            />
          </div>
        </div>

        {result && (
          <div className="mt-6 rounded-lg bg-muted p-4">
            <h3 className="font-medium">
              {t('calculator.results')}
            </h3>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('calculator.suggestedLeverage')}
                </p>
                <p className="text-2xl font-bold">{result.leverage}x</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('calculator.positionSize')}
                </p>
                <p className="text-2xl font-bold">{formatCurrency(result.positionSize)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          {t('common.reset')}
        </Button>
        <Button onClick={handleCalculate}>
          {t('calculator.calculate')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LeverageCalculator;
