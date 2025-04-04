
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Trade } from '@/types';
import TradeForm from '@/components/trades/TradeForm';
import TradeList from '@/components/trades/TradeList';
import { toast } from 'sonner';

const TradesPage: React.FC = () => {
  const { addTrade, updateTrade } = useAppContext();
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
          <h1 className="text-3xl font-bold tracking-tight">Trade Log</h1>
          <p className="text-muted-foreground">
            Record and track all your trading activity
          </p>
        </div>
        {!isAddingTrade && !editingTrade && (
          <Button onClick={() => setIsAddingTrade(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Trade
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
        <TradeList onEdit={handleEditTrade} />
      )}
    </div>
  );
};

export default TradesPage;
