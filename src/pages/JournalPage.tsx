
import React, { useState } from 'react';
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from 'lucide-react';

const JournalPage: React.FC = () => {
  const { t } = useLanguage();
  const { 
    state: { journals }, 
    addJournal,
    deleteJournal
  } = useAppContext();
  const navigate = useNavigate();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [journalToDelete, setJournalToDelete] = useState<string | null>(null);

  const handleSubmit = (data: {
    date: Date;
    errorReviewCompleted: boolean;
    dailyComment: string;
    previousDayGoalHit: "true" | "false" | "na";
  }) => {
    // Check if there's already a journal for this date
    const existingEntryForDate = journals.find(journal => 
      new Date(journal.date).toDateString() === new Date(data.date).toDateString()
    );

    if (existingEntryForDate) {
      toast.error(t('journal.duplicateEntry'));
      return;
    }

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

  // Handle journal deletion
  const handleDeleteJournal = () => {
    if (journalToDelete) {
      deleteJournal(journalToDelete);
      setJournalToDelete(null);
      toast.success(t('common.delete'));
    }
  };

  // Sort journals by date (newest first)
  const sortedJournals = [...journals].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedJournals.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedJournals.slice(indexOfFirstItem, indexOfLastItem);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Change items per page
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Generate page numbers
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => paginate(i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show limited pages with ellipsis
      const startPage = Math.max(1, currentPage - 1);
      const endPage = Math.min(totalPages, currentPage + 1);
      
      // First page
      if (startPage > 1) {
        pageNumbers.push(
          <PaginationItem key={1}>
            <PaginationLink onClick={() => paginate(1)}>1</PaginationLink>
          </PaginationItem>
        );
        
        if (startPage > 2) {
          pageNumbers.push(
            <PaginationItem key="ellipsis-start">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
      }
      
      // Middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => paginate(i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      // Last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push(
            <PaginationItem key="ellipsis-end">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
        
        pageNumbers.push(
          <PaginationItem key={totalPages}>
            <PaginationLink onClick={() => paginate(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('journal.entries')}</h1>
        <p className="text-muted-foreground">{t('journal.entriesDescription')}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">{t('journal.newEntry')}</h2>
        <DailyJournalForm onSubmit={handleSubmit} />
      </div>

      {sortedJournals.length > 0 && (
        <>
          <Separator />
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{t('journal.previousEntries')}</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{t('common.itemsPerPage')}:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={handleItemsPerPageChange}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="5" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                {currentItems.map((journal) => (
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
                      <AlertDialog open={journalToDelete === journal.id} onOpenChange={(open) => !open && setJournalToDelete(null)}>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 border-red-200 hover:bg-red-50"
                            onClick={() => setJournalToDelete(journal.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('journal.deleteConfirm')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('journal.deleteConfirmMessage')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={handleDeleteJournal}
                              className="bg-red-500 text-white hover:bg-red-600"
                            >
                              {t('common.delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
              
              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {renderPageNumbers()}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default JournalPage;
