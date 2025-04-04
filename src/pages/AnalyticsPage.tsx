
import React from 'react';
import Dashboard from '@/components/dashboard/Dashboard';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Detailed analysis of your trading performance
        </p>
      </div>
      
      <Dashboard />
    </div>
  );
};

export default AnalyticsPage;
