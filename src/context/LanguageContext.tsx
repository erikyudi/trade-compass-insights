
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define language types
export type Language = "en-US" | "pt-BR";

// Define the context type
type LanguageContextType = {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Set up translations
const translations: Record<Language, Record<string, string>> = {
  "en-US": {
    "app.title": "MyTradingMind",
    "nav.dashboard": "Dashboard",
    "nav.journal": "Journal",
    "nav.trades": "Trades",
    "nav.analytics": "Analytics",
    "nav.calendar": "Calendar",
    "nav.settings": "Settings",
    "nav.users": "Users",
    "nav.menu": "Menu",
    
    "common.required": "Required",
    "common.add": "Added successfully",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.save": "Save",
    
    "risk.status": "Risk Status",
    "risk.within": "Within limit",
    "risk.approaching": "Approaching limit",
    "risk.exceeded": "Limit exceeded",
    
    "journal.complete": "Complete daily journal",
    
    "settings.language": "Language",
    "settings.riskManagement": "Risk Management",
    "settings.tradingSetups": "Trading Setups",
    "settings.mistakeTypes": "Mistake Types",
    "settings.assets": "Assets",
    "settings.newSetup": "New Setup",
    "settings.addSetup": "Add Setup",
    "settings.newMistakeType": "New Mistake Type",
    "settings.addMistakeType": "Add Mistake Type",
    "settings.newAsset": "New Asset",
    "settings.addAsset": "Add Asset",
    
    "trade.logTitle": "Trade Log",
    "trade.logDescription": "Record and track all your trading activity",
    "trade.new": "New Trade",
    "trade.list": "Trade List",
    "trade.added": "Trade Added",
    "trade.addedDescription": "Your trade has been recorded successfully.",
    "trade.updated": "Trade Updated",
    "trade.updatedDescription": "Your trade has been updated successfully.",
    "trade.againstTrend": "Against Trend",
    "trade.financialResult": "Financial Result",
    "trade.profitLoss": "Profit/Loss",
    "trade.mistakeDescription": "Mistake Description",
    "trade.modelTrade": "Model Trade",
    "trade.modelDescription": "Model Description",
    
    "calculator.title": "Leverage Calculator",
    
    "analytics.title": "Analytics",
    
    "users.title": "User Management",
    "users.description": "Manage mentored traders and other mentors",
    "users.new": "New User",
    "users.list": "User List",
    "users.search": "Search by name or email",
    "users.filterByRole": "Filter by role",
    "users.allRoles": "All roles",
    "users.mentor": "Mentor",
    "users.mentored": "Mentored",
    "users.name": "Name",
    "users.email": "Email",
    "users.role": "Role",
    "users.mentor": "Mentor",
    "users.actions": "Actions",
    "users.updated": "User Updated",
    "users.added": "User Added",
    "users.deleted": "User Deleted",
    "users.cannotDeleteSelf": "You cannot delete your own account",
    "users.noUsersFound": "No users found",
    "users.accessDenied": "Access denied. Only mentors can view this page."
  },
  "pt-BR": {
    "app.title": "MyTradingMind",
    "nav.dashboard": "Painel",
    "nav.journal": "Diário",
    "nav.trades": "Operações",
    "nav.analytics": "Análises",
    "nav.calendar": "Calendário",
    "nav.settings": "Configurações",
    "nav.users": "Usuários",
    "nav.menu": "Menu",
    
    "common.required": "Obrigatório",
    "common.add": "Adicionado com sucesso",
    "common.cancel": "Cancelar",
    "common.delete": "Excluir",
    "common.save": "Salvar",
    
    "risk.status": "Status de Risco",
    "risk.within": "Dentro do limite",
    "risk.approaching": "Próximo ao limite",
    "risk.exceeded": "Limite excedido",
    
    "journal.complete": "Complete o diário diário",
    
    "settings.language": "Idioma",
    "settings.riskManagement": "Gestão de Risco",
    "settings.tradingSetups": "Setups de Trading",
    "settings.mistakeTypes": "Tipos de Erros",
    "settings.assets": "Ativos",
    "settings.newSetup": "Novo Setup",
    "settings.addSetup": "Adicionar Setup",
    "settings.newMistakeType": "Novo Tipo de Erro",
    "settings.addMistakeType": "Adicionar Tipo de Erro",
    "settings.newAsset": "Novo Ativo",
    "settings.addAsset": "Adicionar Ativo",
    
    "trade.logTitle": "Registro de Operações",
    "trade.logDescription": "Registre e acompanhe todas as suas atividades de trading",
    "trade.new": "Nova Operação",
    "trade.list": "Lista de Operações",
    "trade.added": "Operação Adicionada",
    "trade.addedDescription": "Sua operação foi registrada com sucesso.",
    "trade.updated": "Operação Atualizada",
    "trade.updatedDescription": "Sua operação foi atualizada com sucesso.",
    "trade.againstTrend": "Contra Tendência",
    "trade.financialResult": "Resultado Financeiro",
    "trade.profitLoss": "Lucro/Prejuízo",
    "trade.mistakeDescription": "Descrição do Erro",
    "trade.modelTrade": "Operação Modelo",
    "trade.modelDescription": "Descrição do Modelo",
    
    "calculator.title": "Calculadora de Alavancagem",
    
    "analytics.title": "Análises",
    
    "users.title": "Gerenciamento de Usuários",
    "users.description": "Gerencie traders mentorados e outros mentores",
    "users.new": "Novo Usuário",
    "users.list": "Lista de Usuários",
    "users.search": "Buscar por nome ou email",
    "users.filterByRole": "Filtrar por função",
    "users.allRoles": "Todas as funções",
    "users.mentor": "Mentor",
    "users.mentored": "Mentorado",
    "users.name": "Nome",
    "users.email": "Email",
    "users.role": "Função",
    "users.mentor": "Mentor",
    "users.actions": "Ações",
    "users.updated": "Usuário Atualizado",
    "users.added": "Usuário Adicionado",
    "users.deleted": "Usuário Excluído",
    "users.cannotDeleteSelf": "Você não pode excluir sua própria conta",
    "users.noUsersFound": "Nenhum usuário encontrado",
    "users.accessDenied": "Acesso negado. Apenas mentores podem visualizar esta página."
  }
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en-US");

  // Function to get translations
  const t = (key: string): string => {
    return translations[currentLanguage][key] || key;
  };

  // Function to change language
  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};
