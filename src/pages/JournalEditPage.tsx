
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { DailyJournal } from '@/types';
import DailyJournalForm from '@/components/journal/DailyJournalForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const JournalEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, updateJournal } = useAppContext();
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
  
  const handleSubmit = (updatedJournal: Partial<DailyJournal>) => {
    if (!journal) return;
    
    // Check if there's another journal for the same date (except this one)
    const sameDate = state.journals.find(j => 
      j.id !== journal.id && 
      new Date(j.date).toDateString() === new Date(updatedJournal.date!).toDateString()
    );
    
    if (sameDate) {
      toast.error(t('journal.duplicateEntry'));
      return;
    }
    
    const updatedData = {
      ...journal,
      ...updatedJournal,
    };
    
    // Use updateJournal instead of addJournal to prevent duplication
    updateJournal(updatedData);
    toast.success(t('journal.updated'), {
      description: 'Your journal entry has been updated successfully.'
    });
    
    navigate('/journal');
  };
  
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
            {t('journal.editEntry')}
          </h1>
          <p className="text-muted-foreground">
            {t('journal.updateDescription')}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/journal')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back')}
        </Button>
      </div>
      
      <DailyJournalForm 
        onSubmit={handleSubmit}
        initialData={journal}
      />
    </div>
  );
};

export default JournalEditPage;
