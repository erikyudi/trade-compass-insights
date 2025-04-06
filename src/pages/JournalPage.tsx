
import React from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import DailyJournalForm from '@/components/journal/DailyJournalForm';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CalendarDays, Edit, Eye, Plus } from 'lucide-react';
import { DailyJournal } from '@/types';

const JournalPage: React.FC = () => {
  const { addJournal, state } = useAppContext();
  const { t } = useLanguage();
  const { journals } = state;
  
  // Sort journals by date in descending order
  const sortedJournals = [...journals].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handleSubmit = (journalData: Partial<DailyJournal>) => {
    // Check if journal already exists for this date
    const journalDate = new Date(journalData.date as Date);
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
    toast.success(t('journal.saved'), {
      description: 'Your daily journal has been saved successfully.'
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('journal.complete')}</h1>
        <p className="text-muted-foreground">
          Reflect on your past mistakes and set your intentions for the day
        </p>
      </div>
      
      <Tabs defaultValue="new">
        <TabsList className="mb-4">
          <TabsTrigger value="new">
            <Plus className="mr-2 h-4 w-4" />
            New Journal
          </TabsTrigger>
          <TabsTrigger value="entries">
            <CalendarDays className="mr-2 h-4 w-4" />
            {t('journal.entries')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="new">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <DailyJournalForm onSubmit={handleSubmit} />
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{t('journal.entries')}</CardTitle>
                  <CardDescription>
                    {t('journal.entriesDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sortedJournals.length === 0 ? (
                    <p className="text-muted-foreground">{t('journal.noEntries')}</p>
                  ) : (
                    <div className="space-y-4">
                      {sortedJournals.slice(0, 5).map((journal) => (
                        <div key={journal.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-medium">
                              {format(new Date(journal.date), 'EEEE, MMMM d, yyyy')}
                            </h3>
                            <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                              {journal.errorReviewCompleted ? t('journal.errorReview') : 'Not Reviewed'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {journal.previousDayGoalHit === null 
                              ? t('journal.na')
                              : journal.previousDayGoalHit 
                                ? t('journal.yes') + ' ✅' 
                                : t('journal.no') + ' ❌'}
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
        </TabsContent>
        
        <TabsContent value="entries">
          <JournalEntriesList journals={sortedJournals} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

type JournalEntriesListProps = {
  journals: DailyJournal[];
};

const JournalEntriesList: React.FC<JournalEntriesListProps> = ({ journals }) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('journal.entries')}</CardTitle>
        <CardDescription>{t('journal.entriesDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        {journals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t('journal.noEntries')}</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left font-medium">{t('journal.date')}</th>
                  <th className="py-3 px-4 text-left font-medium">{t('journal.errorReview')}</th>
                  <th className="py-3 px-4 text-left font-medium">{t('journal.goalHit')}</th>
                  <th className="py-3 px-4 text-left font-medium">{t('journal.comment')}</th>
                  <th className="py-3 px-4 text-right font-medium">{t('journal.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {journals.map((journal) => (
                  <tr key={journal.id} className="border-b">
                    <td className="py-3 px-4 font-medium">
                      {format(new Date(journal.date), 'MMM d, yyyy')}
                    </td>
                    <td className="py-3 px-4">
                      {journal.errorReviewCompleted ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {t('journal.yes')}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                          {t('journal.no')}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {journal.previousDayGoalHit === null ? (
                        <span className="text-muted-foreground">{t('journal.na')}</span>
                      ) : journal.previousDayGoalHit ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-red-500">✗</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="max-w-xs truncate">
                        {journal.dailyComment || <span className="text-muted-foreground italic">No comment</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="icon" variant="ghost">
                          <a href={`/journal/${journal.id}/view`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">{t('common.view')}</span>
                          </a>
                        </Button>
                        <Button asChild size="icon" variant="ghost">
                          <a href={`/journal/${journal.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">{t('common.edit')}</span>
                          </a>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JournalPage;
