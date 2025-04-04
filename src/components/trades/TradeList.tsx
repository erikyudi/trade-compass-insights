
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ArrowDown, ArrowUp, Edit, Trash, TrendingDown, TrendingUp } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Trade } from '@/types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type TradeListProps = {
  onEdit: (trade: Trade) => void;
};

const TradeList: React.FC<TradeListProps> = ({ onEdit }) => {
  const { state, deleteTrade } = useAppContext();
  const { trades, setups, mistakeTypes } = state;
  
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Trade>('entryTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const handleSort = (field: keyof Trade) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const sortedTrades = [...trades].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle date comparison
    if (aValue instanceof Date && bValue instanceof Date) {
      aValue = aValue.getTime();
      bValue = bValue.getTime();
    }
    
    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  const handleDelete = () => {
    if (selectedTradeId) {
      deleteTrade(selectedTradeId);
      setSelectedTradeId(null);
    }
  };
  
  const getSetupName = (id: string) => {
    return setups.find(setup => setup.id === id)?.name || 'Unknown';
  };
  
  const getMistakeTypeName = (id?: string) => {
    if (!id) return '';
    return mistakeTypes.find(type => type.id === id)?.name || 'Unknown';
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('asset')}
                    className="font-medium"
                  >
                    Asset
                    {sortField === 'asset' && (
                      sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 inline" /> : <ArrowDown className="ml-1 h-4 w-4 inline" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('setupId')}
                    className="font-medium"
                  >
                    Setup
                    {sortField === 'setupId' && (
                      sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 inline" /> : <ArrowDown className="ml-1 h-4 w-4 inline" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('entryTime')}
                    className="font-medium"
                  >
                    Entry Time
                    {sortField === 'entryTime' && (
                      sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 inline" /> : <ArrowDown className="ml-1 h-4 w-4 inline" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('financialResult')}
                    className="font-medium"
                  >
                    P/L
                    {sortField === 'financialResult' && (
                      sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 inline" /> : <ArrowDown className="ml-1 h-4 w-4 inline" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>Risk/Reward</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTrades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No trades recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                sortedTrades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell className="font-medium">{trade.asset}</TableCell>
                    <TableCell>{getSetupName(trade.setupId)}</TableCell>
                    <TableCell>
                      <Badge variant={trade.direction === 'Buy' ? 'default' : 'destructive'}>
                        {trade.direction}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(trade.entryTime), 'MMM d, HH:mm')}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {trade.financialResult > 0 ? (
                          <TrendingUp className="mr-1 h-4 w-4 text-profit" />
                        ) : (
                          <TrendingDown className="mr-1 h-4 w-4 text-loss" />
                        )}
                        <span 
                          className={trade.financialResult > 0 ? 'text-profit' : 'text-loss'}
                        >
                          {formatCurrency(trade.financialResult)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{trade.riskRewardRatio}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {trade.isModelTrade && (
                          <Badge variant="outline" className="bg-blue-50">
                            Model
                          </Badge>
                        )}
                        {trade.isMistake && trade.mistakeTypeId && (
                          <Badge variant="outline" className="bg-red-50">
                            {getMistakeTypeName(trade.mistakeTypeId)}
                          </Badge>
                        )}
                        <Badge variant="outline" className="bg-gray-50">
                          {trade.trendPosition === 'With' ? 'With Trend' : 'Against Trend'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <span className="sr-only">Open menu</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal"><circle cx="7.5" cy="7.5" r="0.5" /><circle cx="11.5" cy="7.5" r="0.5" /><circle cx="3.5" cy="7.5" r="0.5" /></svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(trade)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setSelectedTradeId(trade.id)}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <AlertDialog open={!!selectedTradeId} onOpenChange={(open) => !open && setSelectedTradeId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the trade record.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default TradeList;
