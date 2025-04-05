
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { calculateLeverage, formatCurrency } from '@/context/appUtils';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calculator } from 'lucide-react';

const LeverageCalculator: React.FC = () => {
  const { t } = useLanguage();
  const [stopSize, setStopSize] = useState<number>(0);
  const [riskAmount, setRiskAmount] = useState<number>(0);
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [stopType, setStopType] = useState<'percentage' | 'dollar'>('percentage');
  const [result, setResult] = useState<{ leverage: number; positionSize: number } | null>(null);

  const handleCalculate = () => {
    // If stop type is percentage, convert it to dollar amount
    const actualStopSize = stopType === 'percentage' 
      ? (stopSize / 100) * entryPrice 
      : stopSize;
    
    const calculation = calculateLeverage(actualStopSize, riskAmount, entryPrice);
    setResult(calculation);
  };

  const handleReset = () => {
    setStopSize(0);
    setRiskAmount(0);
    setEntryPrice(0);
    setResult(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {t('calculator.title') || 'Leverage Calculator'}
        </CardTitle>
        <CardDescription>
          {t('calculator.description') || 'Calculate the optimal leverage based on your risk parameters'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="stopType">
              {t('calculator.stopType') || 'Stop Loss Type'}
            </Label>
            <Select 
              value={stopType} 
              onValueChange={(value) => setStopType(value as 'percentage' | 'dollar')}
            >
              <SelectTrigger id="stopType">
                <SelectValue placeholder="Select stop type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">
                  {t('calculator.percentage') || 'Percentage (%)'}
                </SelectItem>
                <SelectItem value="dollar">
                  {t('calculator.dollar') || 'Dollar Value ($)'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stopSize">
              {stopType === 'percentage' 
                ? (t('calculator.stopPercentage') || 'Stop Size (%)')
                : (t('calculator.stopDollar') || 'Stop Size ($)')}
            </Label>
            <Input
              id="stopSize"
              type="number"
              step="0.01"
              min="0"
              value={stopSize || ''}
              onChange={(e) => setStopSize(parseFloat(e.target.value) || 0)}
              placeholder={stopType === 'percentage' ? "2.5" : "25.00"}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="riskAmount">
              {t('calculator.riskAmount') || 'Risk Amount ($)'}
            </Label>
            <Input
              id="riskAmount"
              type="number"
              step="0.01"
              min="0"
              value={riskAmount || ''}
              onChange={(e) => setRiskAmount(parseFloat(e.target.value) || 0)}
              placeholder="100.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="entryPrice">
              {t('calculator.entryPrice') || 'Entry Price ($)'}
            </Label>
            <Input
              id="entryPrice"
              type="number"
              step="0.01"
              min="0"
              value={entryPrice || ''}
              onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
              placeholder="1000.00"
            />
          </div>
        </div>

        {result && (
          <div className="mt-6 rounded-lg bg-muted p-4">
            <h3 className="font-medium">
              {t('calculator.results') || 'Calculation Results'}
            </h3>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('calculator.suggestedLeverage') || 'Suggested Leverage'}
                </p>
                <p className="text-2xl font-bold">{result.leverage}x</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('calculator.positionSize') || 'Position Size'}
                </p>
                <p className="text-2xl font-bold">{formatCurrency(result.positionSize)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          {t('common.reset') || 'Reset'}
        </Button>
        <Button onClick={handleCalculate}>
          {t('calculator.calculate') || 'Calculate'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LeverageCalculator;
