
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { DailyJournal } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';

const JournalViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useAppContext();
  const { t } = useLanguage();
  const [journal, setJournal] = useState<DailyJournal | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundJournal = state.journals.find(j => j.id === id);
      if (foundJournal) {
        setJournal(foundJournal);
      } else {
        navigate('/journal');
      }
    }
  }, [id, state.journals, navigate]);
  
  if (!journal) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('journal.viewEntry')}
          </h1>
          <p className="text-muted-foreground">
            {format(new Date(journal.date), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/journal')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <Button 
            size="sm" 
            onClick={() => navigate(`/journal/${journal.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            {t('common.edit')}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('journal.dailyComment')}</CardTitle>
              <CardDescription>
                Your trading plan and intentions for the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              {journal.dailyComment ? (
                <div className="prose max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap font-sans text-sm bg-muted p-4 rounded-md">
                    {journal.dailyComment}
                  </pre>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No comments were provided for this entry.</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t('journal.errorReview')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${journal.errorReviewCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>{journal.errorReviewCompleted ? 'Completed' : 'Not completed'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('journal.previousDayGoalHit')}</CardTitle>
            </CardHeader>
            <CardContent>
              {journal.previousDayGoalHit === null ? (
                <p className="text-muted-foreground">Not applicable</p>
              ) : journal.previousDayGoalHit ? (
                <div className="flex items-center space-x-2 text-green-500">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span>Goal achieved</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-red-500">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span>Goal missed</span>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Journal Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Created:</span>
                <p className="text-sm">{format(new Date(journal.createdAt || journal.date), 'MMM d, yyyy HH:mm')}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Entry ID:</span>
                <p className="text-sm font-mono">{journal.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JournalViewPage;
