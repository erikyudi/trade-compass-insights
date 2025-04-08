
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import TraderAnalytics from '@/components/users/TraderAnalytics';
import { User } from '@/types';

interface TraderAnalyticsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const TraderAnalyticsModal: React.FC<TraderAnalyticsModalProps> = ({
  user,
  isOpen,
  onClose
}) => {
  const { t } = useLanguage();

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{t('users.analyticsFor')} {user.name}</span>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogTitle>
          <DialogDescription>
            {t('users.analyticsDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <TraderAnalytics userId={user.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TraderAnalyticsModal;
