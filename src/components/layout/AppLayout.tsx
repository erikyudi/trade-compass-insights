
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarGroup,
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter
} from '@/components/ui/sidebar';
import { 
  BarChart3, 
  BookText, 
  Calendar, 
  Home, 
  Settings, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const { hasDailyJournal, getDailyRiskStatus } = useAppContext();
  const { t } = useLanguage();

  const menuItems = [
    { title: t('nav.dashboard'), path: '/', icon: Home },
    { title: t('nav.journal'), path: '/journal', icon: BookText },
    { title: t('nav.trades'), path: '/trades', icon: TrendingUp },
    { title: t('nav.analytics'), path: '/analytics', icon: BarChart3 },
    { title: t('nav.calendar'), path: '/calendar', icon: Calendar },
    { title: t('nav.settings'), path: '/settings', icon: Settings }
  ];

  const riskStatus = getDailyRiskStatus();
  const hasCompletedJournal = hasDailyJournal();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <Sidebar className="bg-navy text-white" collapsible="none">
          <SidebarHeader className="py-6">
            <div className="text-xl font-bold px-6">Trade Compass</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild>
                        <Link 
                          to={item.path}
                          className={cn(
                            "flex items-center",
                            location.pathname === item.path && "bg-blue-800"
                          )}
                        >
                          <item.icon className="mr-2" size={18} />
                          <span>{item.title}</span>
                          
                          {item.path === '/journal' && !hasCompletedJournal && (
                            <Badge className="ml-auto bg-yellow-500">{t('common.required')}</Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-6">
            <div className={cn(
              "flex items-center p-3 rounded-md",
              riskStatus === 'safe' && "bg-green-800/20 text-green-400",
              riskStatus === 'warning' && "bg-yellow-800/20 text-yellow-400",
              riskStatus === 'danger' && "bg-red-800/20 text-red-400",
            )}>
              <AlertCircle size={18} className="mr-2" />
              <div>
                <div className="text-sm font-medium">{t('risk.status')}</div>
                <div className="text-xs">
                  {riskStatus === 'safe' && t('risk.within')}
                  {riskStatus === 'warning' && t('risk.approaching')}
                  {riskStatus === 'danger' && t('risk.exceeded')}
                </div>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 overflow-auto">
          <header className="bg-white border-b p-4 flex items-center">
            <div className="font-medium">
              {menuItems.find(item => item.path === location.pathname)?.title || 'Trade Compass'}
            </div>
            {!hasCompletedJournal && (
              <Badge className="ml-auto bg-yellow-500">
                {t('journal.complete')}
              </Badge>
            )}
          </header>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
