
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Trade } from '@/types';
import TradeForm from '@/components/trades/TradeForm';
import TradeList from '@/components/trades/TradeList';
import LeverageCalculator from '@/components/trades/LeverageCalculator';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/context/LanguageContext';

const TradesPage: React.FC = () => {
  const { addTrade, updateTrade } = useAppContext();
  const { t } = useLanguage();
  const [isAddingTrade, setIsAddingTrade] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  
  const handleTradeSubmit = (tradeData: Partial<Trade>) => {
    if (editingTrade) {
      updateTrade({ ...editingTrade, ...tradeData } as Trade);
      toast.success('Trade updated', {
        description: 'Your trade has been updated successfully.'
      });
      setEditingTrade(null);
    } else {
      addTrade(tradeData as Omit<Trade, 'id' | 'createdAt'>);
      toast.success('Trade added', {
        description: 'Your trade has been logged successfully.'
      });
      setIsAddingTrade(false);
    }
  };
  
  const handleCancel = () => {
    setIsAddingTrade(false);
    setEditingTrade(null);
  };
  
  const handleEditTrade = (trade: Trade) => {
    setEditingTrade(trade);
    setIsAddingTrade(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('trade.logTitle') || 'Trade Log'}</h1>
          <p className="text-muted-foreground">
            {t('trade.logDescription') || 'Record and track all your trading activity'}
          </p>
        </div>
        {!isAddingTrade && !editingTrade && (
          <Button onClick={() => setIsAddingTrade(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('trade.new') || 'New Trade'}
          </Button>
        )}
      </div>
      
      {isAddingTrade && (
        <TradeForm 
          onSubmit={handleTradeSubmit}
          onCancel={handleCancel}
        />
      )}
      
      {editingTrade && (
        <TradeForm 
          trade={editingTrade}
          onSubmit={handleTradeSubmit}
          onCancel={handleCancel}
        />
      )}
      
      {!isAddingTrade && !editingTrade && (
        <Tabs defaultValue="trades" className="w-full">
          <TabsList>
            <TabsTrigger value="trades">{t('trade.list') || 'Trade List'}</TabsTrigger>
            <TabsTrigger value="calculator">{t('calculator.title') || 'Leverage Calculator'}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trades">
            <TradeList onEdit={handleEditTrade} />
          </TabsContent>
          
          <TabsContent value="calculator">
            <LeverageCalculator />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default TradesPage;
