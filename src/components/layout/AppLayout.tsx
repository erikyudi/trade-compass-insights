
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
  AlertCircle,
  Users,
  LogOut
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const { hasDailyJournal, getDailyRiskStatus } = useAppContext();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  
  const commonMenuItems = [
    { title: t('nav.dashboard'), path: '/', icon: Home },
    { title: t('nav.journal'), path: '/journal', icon: BookText },
    { title: t('nav.trades'), path: '/trades', icon: TrendingUp },
    { title: t('nav.analytics'), path: '/analytics', icon: BarChart3 },
    { title: t('nav.calendar'), path: '/calendar', icon: Calendar },
    { title: t('nav.settings'), path: '/settings', icon: Settings }
  ];
  
  // Add user management for mentors
  const menuItems = user?.role === 'mentor' 
    ? [...commonMenuItems, { title: t('nav.users'), path: '/users', icon: Users }]
    : commonMenuItems;

  const riskStatus = getDailyRiskStatus();
  const hasCompletedJournal = hasDailyJournal();

  const handleLogout = () => {
    logout();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-900 text-white">
        <Sidebar className="bg-slate-800 text-slate-100 border-r border-slate-700" collapsible="none">
          <SidebarHeader className="py-6">
            <div className="text-xl font-bold px-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span>Trade Compass</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{t('nav.menu')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild>
                        <Link 
                          to={item.path}
                          className={cn(
                            "flex items-center",
                            location.pathname === item.path && "bg-slate-700"
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
          <SidebarFooter className="p-6 space-y-4">
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
            
            <div className="flex items-center justify-between border-t border-slate-700 pt-4">
              <div>
                <div className="font-medium">{user?.name}</div>
                <div className="text-xs text-slate-400">{user?.email}</div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut size={16} />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 overflow-auto">
          <header className="bg-slate-800 border-b border-slate-700 p-4 flex items-center">
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
