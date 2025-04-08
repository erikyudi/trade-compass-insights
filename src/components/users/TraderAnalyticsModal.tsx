
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
          <DialogTitle>
            {t('users.analyticsFor')} {user.name}
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
