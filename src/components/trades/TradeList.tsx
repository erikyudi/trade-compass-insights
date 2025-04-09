
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Trade } from '@/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency } from '@/context/appUtils';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  CalendarIcon, 
  Pencil, 
  Trash, 
  BarChart 
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TradeListProps {
  onEdit: (trade: Trade) => void;
}

const TradeList: React.FC<TradeListProps> = ({ onEdit }) => {
  const { state, deleteTrade } = useAppContext();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [tradeToDelete, setTradeToDelete] = useState<Trade | null>(null);
  const [searchText, setSearchText] = useState('');
  const [setupFilter, setSetupFilter] = useState('all');
  const [directionFilter, setDirectionFilter] = useState('all');
  
  // Apply filters
  const filteredTrades = state.trades.filter((trade) => {
    const matchesText =
      trade.asset.toLowerCase().includes(searchText.toLowerCase()) ||
      trade.notes?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesSetup = setupFilter === 'all' || trade.setupId === setupFilter;
    const matchesDirection = directionFilter === 'all' || trade.direction === directionFilter;
    
    return matchesText && matchesSetup && matchesDirection;
  }).sort((a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime());
  
  const handleDelete = (trade: Trade) => {
    setTradeToDelete(trade);
  };
  
  const confirmDelete = () => {
    if (tradeToDelete) {
      deleteTrade(tradeToDelete.id);
      toast.success(t('trade.deleted'), {
        description: t('trade.deletedDescription')
      });
      setTradeToDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setTradeToDelete(null);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('trade.list')}</CardTitle>
          <CardDescription>
            {t('trade.listDescription')}
          </CardDescription>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('trade.search')}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select 
              value={setupFilter} 
              onValueChange={setSetupFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('trade.filterBySetup')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('trade.allSetups')}</SelectItem>
                {state.setups.map((setup) => (
                  <SelectItem key={setup.id} value={setup.id}>
                    {setup.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={directionFilter} 
              onValueChange={setDirectionFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('trade.filterByDirection')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('trade.allDirections')}</SelectItem>
                <SelectItem value="Buy">{t('trade.buy')}</SelectItem>
                <SelectItem value="Sell">{t('trade.sell')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden md:table-cell w-[100px]">{t('trade.date')}</TableHead>
                  <TableHead>{t('trade.asset')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('trade.setup')}</TableHead>
                  <TableHead className="text-center">{t('trade.direction')}</TableHead>
                  <TableHead className="text-center">{t('trade.trend')}</TableHead>
                  <TableHead className="text-right">{t('trade.pnl')}</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      {t('trade.noTradesFound')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTrades.map((trade) => (
                    <TableRow key={trade.id} className={trade.isMistake ? "bg-red-50" : undefined}>
                      <TableCell className="hidden md:table-cell font-medium">
                        {format(new Date(trade.entryTime), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">{trade.asset}</span>
                          <div className="md:hidden text-xs text-muted-foreground mt-1">
                            {format(new Date(trade.entryTime), "MMM d, yyyy")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {state.setups.find(s => s.id === trade.setupId)?.name || '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={trade.direction === 'Buy' ? 'default' : 'destructive'}>
                          {t(`trade.${trade.direction.toLowerCase()}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span 
                          className={
                            trade.trendPosition === 'With' 
                              ? 'text-green-600 font-medium' 
                              : trade.trendPosition === 'Against' 
                                ? 'text-red-600 font-medium' 
                                : ''
                          }
                        >
                          {t(`trade.${trade.trendPosition.toLowerCase()}Trend`)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          {trade.financialResult > 0 ? (
                            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                          )}
                          <span 
                            className={
                              trade.financialResult > 0 
                                ? 'text-green-600 font-medium' 
                                : 'text-red-600 font-medium'
                            }
                          >
                            {formatCurrency(trade.financialResult)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onEdit(trade)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(trade)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={!!tradeToDelete} onOpenChange={(isOpen) => !isOpen && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('trade.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('trade.deleteWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TradeList;
