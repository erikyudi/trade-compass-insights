
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import JournalPage from "@/pages/JournalPage";
import JournalViewPage from "@/pages/JournalViewPage";
import JournalEditPage from "@/pages/JournalEditPage";
import TradesPage from "@/pages/TradesPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import CalendarPage from "@/pages/CalendarPage";
import SettingsPage from "@/pages/SettingsPage";
import LoginPage from "@/pages/LoginPage";
import UsersPage from "@/pages/UsersPage";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                
                <Route path="/" element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<DashboardPage />} />
                  <Route path="journal" element={<JournalPage />} />
                  <Route path="journal/:id/view" element={<JournalViewPage />} />
                  <Route path="journal/:id/edit" element={<JournalEditPage />} />
                  <Route path="trades" element={<TradesPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="calendar" element={<CalendarPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="users" element={<UsersPage />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
