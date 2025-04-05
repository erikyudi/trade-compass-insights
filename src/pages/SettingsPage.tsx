import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import RiskSettingsForm from '@/components/settings/RiskSettingsForm';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash } from 'lucide-react';
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

const SettingsPage: React.FC = () => {
  const { 
    state, 
    addSetup, 
    deleteSetup, 
    addMistakeType, 
    deleteMistakeType,
    addAsset,
    deleteAsset
  } = useAppContext();
  
  const { language, setLanguage, t } = useLanguage();
  
  const [newSetupName, setNewSetupName] = useState('');
  const [newMistakeTypeName, setNewMistakeTypeName] = useState('');
  const [newAssetSymbol, setNewAssetSymbol] = useState('');
  const [deletingSetupId, setDeletingSetupId] = useState<string | null>(null);
  const [deletingMistakeTypeId, setDeletingMistakeTypeId] = useState<string | null>(null);
  const [deletingAssetId, setDeletingAssetId] = useState<string | null>(null);
  
  const handleAddSetup = () => {
    if (newSetupName.trim()) {
      addSetup({ name: newSetupName.trim() });
      setNewSetupName('');
      toast.success(t('settings.addSetup'), {
        description: t('common.add')
      });
    }
  };
  
  const handleAddMistakeType = () => {
    if (newMistakeTypeName.trim()) {
      addMistakeType({ name: newMistakeTypeName.trim() });
      setNewMistakeTypeName('');
      toast.success(t('settings.addMistakeType'), {
        description: t('common.add')
      });
    }
  };
  
  const handleAddAsset = () => {
    if (newAssetSymbol.trim()) {
      addAsset({ symbol: newAssetSymbol.trim() });
      setNewAssetSymbol('');
      toast.success(t('settings.addAsset'), {
        description: t('common.add')
      });
    }
  };
  
  const confirmDeleteSetup = () => {
    if (deletingSetupId) {
      deleteSetup(deletingSetupId);
      setDeletingSetupId(null);
      toast.success('Setup deleted', {
        description: 'The trading setup has been removed.'
      });
    }
  };
  
  const confirmDeleteMistakeType = () => {
    if (deletingMistakeTypeId) {
      deleteMistakeType(deletingMistakeTypeId);
      setDeletingMistakeTypeId(null);
      toast.success('Mistake type deleted', {
        description: 'The mistake type has been removed.'
      });
    }
  };
  
  const confirmDeleteAsset = () => {
    if (deletingAssetId) {
      deleteAsset(deletingAssetId);
      setDeletingAssetId(null);
      toast.success('Asset deleted', {
        description: 'The asset has been removed.'
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-100">{t('nav.settings')}</h1>
        <p className="text-muted-foreground">
          Manage your trading parameters and preferences
        </p>
      </div>
      
      <Tabs defaultValue="language" className="w-full">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="language" className="data-[state=active]:bg-orange-500">{t('settings.language')}</TabsTrigger>
          <TabsTrigger value="risk" className="data-[state=active]:bg-orange-500">{t('settings.riskManagement')}</TabsTrigger>
          <TabsTrigger value="setups" className="data-[state=active]:bg-orange-500">{t('settings.tradingSetups')}</TabsTrigger>
          <TabsTrigger value="mistakes" className="data-[state=active]:bg-orange-500">{t('settings.mistakeTypes')}</TabsTrigger>
          <TabsTrigger value="assets" className="data-[state=active]:bg-orange-500">{t('settings.assets')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="language" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">{t('settings.language')}</CardTitle>
              <CardDescription>
                Choose your preferred language
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                defaultValue={language} 
                onValueChange={(value) => setLanguage(value as "en-US" | "pt-BR")}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="en-US" id="en-US" />
                  <Label htmlFor="en-US">English (US)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pt-BR" id="pt-BR" />
                  <Label htmlFor="pt-BR">Português (Brasil)</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="risk" className="space-y-6">
          <RiskSettingsForm />
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">About Risk Management</CardTitle>
              <CardDescription>
                Understanding your risk parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-100">Initial Capital</h3>
                  <p className="text-sm text-muted-foreground">
                    The starting amount in your trading account. This is used as the basis for calculating percentage-based profit targets and risk limits.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-100">Daily Profit Target</h3>
                  <p className="text-sm text-muted-foreground">
                    Your target profit for each trading day, expressed as a percentage of your initial capital. Setting realistic targets helps maintain discipline.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-100">Maximum Daily Risk</h3>
                  <p className="text-sm text-muted-foreground">
                    The maximum percentage of your capital you're willing to risk in a single day. When this limit is reached, the system will alert you to stop trading for the day.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="setups">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">{t('settings.tradingSetups')}</CardTitle>
              <CardDescription>
                Manage the setups you use in your trading strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-end gap-4">
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-medium text-gray-200">{t('settings.newSetup')}</label>
                    <Input 
                      placeholder="Enter setup name" 
                      value={newSetupName}
                      onChange={(e) => setNewSetupName(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <Button onClick={handleAddSetup} className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="mr-2 h-4 w-4" />
                    {t('settings.addSetup')}
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border border-gray-700">
                <Table>
                  <TableHeader className="bg-gray-900">
                    <TableRow>
                      <TableHead className="text-gray-300">Setup Name</TableHead>
                      <TableHead className="w-[100px] text-right text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.setups.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-gray-400">
                          No setups defined.
                        </TableCell>
                      </TableRow>
                    ) : (
                      state.setups.map((setup) => (
                        <TableRow key={setup.id} className="border-gray-700">
                          <TableCell className="font-medium text-gray-300">{setup.name}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setDeletingSetupId(setup.id)}
                              className="text-gray-300 hover:text-red-400"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mistakes">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">{t('settings.mistakeTypes')}</CardTitle>
              <CardDescription>
                Categorize trading mistakes to learn from them
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-end gap-4">
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-medium text-gray-200">{t('settings.newMistakeType')}</label>
                    <Input 
                      placeholder="Enter mistake type" 
                      value={newMistakeTypeName}
                      onChange={(e) => setNewMistakeTypeName(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <Button onClick={handleAddMistakeType} className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="mr-2 h-4 w-4" />
                    {t('settings.addMistakeType')}
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border border-gray-700">
                <Table>
                  <TableHeader className="bg-gray-900">
                    <TableRow>
                      <TableHead className="text-gray-300">Mistake Type</TableHead>
                      <TableHead className="w-[100px] text-right text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.mistakeTypes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-gray-400">
                          No mistake types defined.
                        </TableCell>
                      </TableRow>
                    ) : (
                      state.mistakeTypes.map((type) => (
                        <TableRow key={type.id} className="border-gray-700">
                          <TableCell className="font-medium text-gray-300">{type.name}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setDeletingMistakeTypeId(type.id)}
                              className="text-gray-300 hover:text-red-400"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assets">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">{t('settings.assets')}</CardTitle>
              <CardDescription>
                Manage the assets you trade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-end gap-4">
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-medium text-gray-200">{t('settings.newAsset')}</label>
                    <Input 
                      placeholder="e.g., EURUSD, AAPL, BTC" 
                      value={newAssetSymbol}
                      onChange={(e) => setNewAssetSymbol(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <Button onClick={handleAddAsset} className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="mr-2 h-4 w-4" />
                    {t('settings.addAsset')}
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border border-gray-700">
                <Table>
                  <TableHeader className="bg-gray-900">
                    <TableRow>
                      <TableHead className="text-gray-300">Asset Symbol</TableHead>
                      <TableHead className="w-[100px] text-right text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.assets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-gray-400">
                          No assets defined.
                        </TableCell>
                      </TableRow>
                    ) : (
                      state.assets.map((asset) => (
                        <TableRow key={asset.id} className="border-gray-700">
                          <TableCell className="font-medium text-gray-300">{asset.symbol}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setDeletingAssetId(asset.id)}
                              className="text-gray-300 hover:text-red-400"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Delete Setup Confirmation */}
      <AlertDialog 
        open={!!deletingSetupId} 
        onOpenChange={(open) => !open && setDeletingSetupId(null)}
      >
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-100">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This action cannot be undone. This will permanently delete this trading setup.
              Any trades using this setup will still remain in your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-gray-300">{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSetup} className="bg-red-600 text-gray-50">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Mistake Type Confirmation */}
      <AlertDialog 
        open={!!deletingMistakeTypeId} 
        onOpenChange={(open) => !open && setDeletingMistakeTypeId(null)}
      >
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-100">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This action cannot be undone. This will permanently delete this mistake type.
              Any trades using this mistake type will still remain in your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-gray-300">{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMistakeType} className="bg-red-600 text-gray-50">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Asset Confirmation */}
      <AlertDialog 
        open={!!deletingAssetId} 
        onOpenChange={(open) => !open && setDeletingAssetId(null)}
      >
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-100">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This action cannot be undone. This will permanently delete this asset.
              Any trades using this asset will still remain in your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-gray-300">{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAsset} className="bg-red-600 text-gray-50">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsPage;
