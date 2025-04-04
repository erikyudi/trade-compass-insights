
import React from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useAppContext } from '@/context/AppContext';
import DailyJournalForm from '@/components/journal/DailyJournalForm';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

const JournalPage: React.FC = () => {
  const { addJournal, state } = useAppContext();
  const { journals } = state;
  
  // Sort journals by date in descending order
  const sortedJournals = [...journals].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handleSubmit = (journalData: any) => {
    // Check if journal already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const journalDate = new Date(journalData.date);
    journalDate.setHours(0, 0, 0, 0);
    
    const existingJournal = journals.find(journal => {
      const journalDt = new Date(journal.date);
      journalDt.setHours(0, 0, 0, 0);
      return journalDt.getTime() === journalDate.getTime();
    });
    
    if (existingJournal) {
      toast.error('Journal already exists for this date', {
        description: 'You can only have one journal entry per day.'
      });
      return;
    }
    
    addJournal(journalData);
    toast.success('Journal entry added', {
      description: 'Your daily journal has been saved successfully.'
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Daily Trading Journal</h1>
        <p className="text-muted-foreground">
          Reflect on your past mistakes and set your intentions for the day
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DailyJournalForm onSubmit={handleSubmit} />
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Previous Journals</CardTitle>
              <CardDescription>
                Your recent daily reflections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sortedJournals.length === 0 ? (
                <p className="text-muted-foreground">No journal entries yet.</p>
              ) : (
                <div className="space-y-4">
                  {sortedJournals.slice(0, 5).map((journal) => (
                    <div key={journal.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium">
                          {format(new Date(journal.date), 'EEEE, MMMM d, yyyy')}
                        </h3>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {journal.errorReviewCompleted ? 'Reviewed' : 'Not Reviewed'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {journal.previousDayGoalHit === null 
                          ? 'No previous goal' 
                          : journal.previousDayGoalHit 
                            ? 'Hit previous goal ✅' 
                            : 'Missed previous goal ❌'}
                      </p>
                      <p className="text-sm line-clamp-2">{journal.dailyComment}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Benefits of Journaling</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside text-sm">
                <li>Enforces discipline and consistency</li>
                <li>Identifies patterns in your trading behavior</li>
                <li>Improves learning from mistakes</li>
                <li>Creates accountability for your trading plan</li>
                <li>Enhances decision-making under pressure</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
