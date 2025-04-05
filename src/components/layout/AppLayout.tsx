
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
import Logo from '@/components/branding/Logo';

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
      <div className="min-h-screen flex w-full bg-black text-gray-200">
        <Sidebar className="bg-gray-900 text-gray-300 border-r border-gray-800" collapsible="none">
          <SidebarHeader className="py-6">
            <div className="px-6 flex items-center justify-center">
              <Logo size="md" />
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
                            location.pathname === item.path 
                              ? "bg-orange-500/20 text-orange-400" 
                              : "hover:bg-gray-800 hover:text-orange-300"
                          )}
                        >
                          <item.icon className="mr-2" size={18} />
                          <span>{item.title}</span>
                          
                          {item.path === '/journal' && !hasCompletedJournal && (
                            <Badge className="ml-auto bg-orange-500">{t('common.required')}</Badge>
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
              riskStatus === 'safe' && "bg-green-900/20 text-green-400",
              riskStatus === 'warning' && "bg-yellow-900/20 text-yellow-400",
              riskStatus === 'danger' && "bg-red-900/20 text-red-400",
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
            
            <div className="flex items-center justify-between border-t border-gray-800 pt-4">
              <div>
                <div className="font-medium">{user?.name}</div>
                <div className="text-xs text-gray-400">{user?.email}</div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-orange-400">
                <LogOut size={16} />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 overflow-auto">
          <header className="bg-gray-900 border-b border-gray-800 p-4 flex items-center">
            <div className="font-medium">
              {menuItems.find(item => item.path === location.pathname)?.title || 'MyTradingMind'}
            </div>
            {!hasCompletedJournal && (
              <Badge className="ml-auto bg-orange-500">
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
