
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
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
    deleteMistakeType 
  } = useAppContext();
  
  const [newSetupName, setNewSetupName] = useState('');
  const [newMistakeTypeName, setNewMistakeTypeName] = useState('');
  const [deletingSetupId, setDeletingSetupId] = useState<string | null>(null);
  const [deletingMistakeTypeId, setDeletingMistakeTypeId] = useState<string | null>(null);
  
  const handleAddSetup = () => {
    if (newSetupName.trim()) {
      addSetup({ name: newSetupName.trim() });
      setNewSetupName('');
      toast.success('Setup added', {
        description: 'New trading setup has been added.'
      });
    }
  };
  
  const handleAddMistakeType = () => {
    if (newMistakeTypeName.trim()) {
      addMistakeType({ name: newMistakeTypeName.trim() });
      setNewMistakeTypeName('');
      toast.success('Mistake type added', {
        description: 'New mistake type has been added.'
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your trading parameters and preferences
        </p>
      </div>
      
      <Tabs defaultValue="risk">
        <TabsList>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
          <TabsTrigger value="setups">Trading Setups</TabsTrigger>
          <TabsTrigger value="mistakes">Mistake Types</TabsTrigger>
        </TabsList>
        
        <TabsContent value="risk" className="space-y-6">
          <RiskSettingsForm />
          
          <Card>
            <CardHeader>
              <CardTitle>About Risk Management</CardTitle>
              <CardDescription>
                Understanding your risk parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Initial Capital</h3>
                  <p className="text-sm text-muted-foreground">
                    The starting amount in your trading account. This is used as the basis for calculating percentage-based profit targets and risk limits.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Daily Profit Target</h3>
                  <p className="text-sm text-muted-foreground">
                    Your target profit for each trading day, expressed as a percentage of your initial capital. Setting realistic targets helps maintain discipline.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Maximum Daily Risk</h3>
                  <p className="text-sm text-muted-foreground">
                    The maximum percentage of your capital you're willing to risk in a single day. When this limit is reached, the system will alert you to stop trading for the day.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="setups">
          <Card>
            <CardHeader>
              <CardTitle>Trading Setups</CardTitle>
              <CardDescription>
                Manage the setups you use in your trading strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-end gap-4">
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-medium">New Setup Name</label>
                    <Input 
                      placeholder="Enter setup name" 
                      value={newSetupName}
                      onChange={(e) => setNewSetupName(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddSetup}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Setup
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Setup Name</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.setups.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center">
                          No setups defined.
                        </TableCell>
                      </TableRow>
                    ) : (
                      state.setups.map((setup) => (
                        <TableRow key={setup.id}>
                          <TableCell className="font-medium">{setup.name}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setDeletingSetupId(setup.id)}
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
          <Card>
            <CardHeader>
              <CardTitle>Mistake Types</CardTitle>
              <CardDescription>
                Categorize trading mistakes to learn from them
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-end gap-4">
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-medium">New Mistake Type</label>
                    <Input 
                      placeholder="Enter mistake type" 
                      value={newMistakeTypeName}
                      onChange={(e) => setNewMistakeTypeName(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddMistakeType}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Type
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mistake Type</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.mistakeTypes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center">
                          No mistake types defined.
                        </TableCell>
                      </TableRow>
                    ) : (
                      state.mistakeTypes.map((type) => (
                        <TableRow key={type.id}>
                          <TableCell className="font-medium">{type.name}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setDeletingMistakeTypeId(type.id)}
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this trading setup.
              Any trades using this setup will still remain in your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSetup} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Mistake Type Confirmation */}
      <AlertDialog 
        open={!!deletingMistakeTypeId} 
        onOpenChange={(open) => !open && setDeletingMistakeTypeId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this mistake type.
              Any trades using this mistake type will still remain in your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMistakeType} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsPage;
