
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/context/LanguageContext';
import { useAppContext } from '@/context/AppContext';
import DailyJournalForm from '@/components/journal/DailyJournalForm';
import { toast } from 'sonner';
import { formatDate } from '@/context/appUtils';
import { DailyJournal } from '@/types';

const JournalPage: React.FC = () => {
  const { t } = useLanguage();
  const { 
    state: { journals }, 
    addJournal 
  } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (data: {
    date: Date;
    errorReviewCompleted: boolean;
    dailyComment: string;
    previousDayGoalHit: "true" | "false" | "na";
  }) => {
    // Convert string values to booleans where needed
    const journalData: Omit<DailyJournal, 'id' | 'createdAt'> = {
      date: data.date,
      errorReviewCompleted: data.errorReviewCompleted,
      dailyComment: data.dailyComment,
      previousDayGoalHit: data.previousDayGoalHit === 'true' 
        ? true 
        : data.previousDayGoalHit === 'false' 
          ? false 
          : null
    };

    addJournal(journalData);
    toast.success(t('journal.submitted'));
    navigate('/');
  };

  const sortedJournals = [...journals].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('journal.entries')}</h1>
        <p className="text-muted-foreground">{t('journal.entriesDescription')}</p>
      </div>

      {sortedJournals.length > 0 && (
        <>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">{t('journal.previousEntries')}</h2>
              <div className="space-y-4">
                {sortedJournals.map((journal) => (
                  <div key={journal.id} className="flex justify-between items-center pb-4 border-b border-border last:border-0 last:pb-0">
                    <div>
                      <h3 className="font-medium">{formatDate(journal.date)}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {journal.dailyComment.substring(0, 100)}
                        {journal.dailyComment.length > 100 ? '...' : ''}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/journal/${journal.id}/view`)}
                      >
                        {t('common.view')}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/journal/${journal.id}/edit`)}
                      >
                        {t('common.edit')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Separator />
        </>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">{t('journal.newEntry')}</h2>
        <DailyJournalForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default JournalPage;
