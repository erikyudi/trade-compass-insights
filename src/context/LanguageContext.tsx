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
    "nav.journalEntries": "Journal Entries",
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
    "common.edit": "Edit",
    "common.view": "View",
    "common.back": "Back",
    "common.reset": "Reset",
    
    "risk.status": "Risk Status",
    "risk.within": "Within limit",
    "risk.approaching": "Approaching limit",
    "risk.exceeded": "Limit exceeded",
    
    "journal.complete": "Complete daily journal",
    "journal.entries": "Journal Entries",
    "journal.entriesDescription": "View and manage your trading journal entries",
    "journal.viewEntry": "View Journal Entry",
    "journal.editEntry": "Edit Journal Entry",
    "journal.date": "Date",
    "journal.errorReview": "Error Review",
    "journal.goalHit": "Goal Hit",
    "journal.comment": "Comments",
    "journal.actions": "Actions",
    "journal.entryFor": "Journal Entry for",
    "journal.noEntries": "No journal entries found",
    "journal.errorReviewCompleted": "Error review completed",
    "journal.dailyComment": "Daily Comment",
    "journal.previousDayGoalHit": "Previous Day Goal Hit",
    "journal.yes": "Yes",
    "journal.no": "No",
    "journal.na": "Not Applicable",
    "journal.saved": "Journal Saved",
    "journal.updated": "Journal Updated",
    
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
    "trade.asset": "Asset",
    "trade.setup": "Setup",
    "trade.direction": "Direction",
    "trade.entryTime": "Entry Time",
    "trade.leverage": "Leverage",
    
    "calculator.title": "Leverage Calculator",
    "calculator.description": "Calculate the optimal leverage based on your risk parameters",
    "calculator.stopType": "Stop Loss Type",
    "calculator.percentage": "Percentage (%)",
    "calculator.dollar": "Dollar Value ($)",
    "calculator.stopPercentage": "Stop Size (%)",
    "calculator.stopDollar": "Stop Size ($)",
    "calculator.marginAmount": "Margin Amount ($)",
    "calculator.riskPercentage": "Risk Percentage (%)",
    "calculator.entryPrice": "Entry Price ($)",
    "calculator.calculate": "Calculate",
    "calculator.results": "Calculation Results",
    "calculator.suggestedLeverage": "Suggested Leverage",
    "calculator.positionSize": "Position Size",
    
    "analytics.title": "Analytics",
    "analytics.month": "Month",
    "analytics.dataRange": "Date Range",
    "analytics.profitLoss": "Profit/Loss",
    "analytics.tradeCount": "Number of Trades",
    "analytics.winRate": "Win Rate",
    "analytics.averageTrade": "Average Trade",
    
    "journal.dailyTitle": "Daily Trading Journal",
    "journal.complete": "Complete daily journal",
    "journal.entries": "Journal Entries",
    "journal.entriesDescription": "View and manage your trading journal entries",
    "journal.viewEntry": "View Journal Entry",
    "journal.editEntry": "Edit Journal Entry",
    "journal.date": "Date",
    "journal.errorReview": "Error Review",
    "journal.goalHit": "Goal Hit",
    "journal.comment": "Comments",
    "journal.actions": "Actions",
    "journal.entryFor": "Journal Entry for",
    "journal.noEntries": "No journal entries found",
    "journal.errorReviewCompleted": "Error review completed",
    "journal.dailyComment": "Daily Comment",
    "journal.previousDayGoalHit": "Previous Day Goal Hit",
    "journal.yes": "Yes",
    "journal.no": "No",
    "journal.na": "Not Applicable",
    "journal.saved": "Journal Saved",
    "journal.updated": "Journal Updated",
    
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
    "users.actions": "Actions",
    "users.updated": "User Updated",
    "users.added": "User Added",
    "users.deleted": "User Deleted",
    "users.cannotDeleteSelf": "You cannot delete your own account",
    "users.noUsersFound": "No users found",
    "users.accessDenied": "Access denied. Only mentors can view this page.",
    
    "settings.language": "Language",
    "login.title": "Login",
    "login.email": "Email",
    "login.password": "Password",
    "login.submit": "Sign In",
    "login.rememberMe": "Remember me",
    "login.forgotPassword": "Forgot password?",
    "login.noAccount": "Don't have an account?",
    "login.signUp": "Sign up",
    "login.switchLanguage": "Switch to Portuguese"
  },
  "pt-BR": {
    "app.title": "MyTradingMind",
    "nav.dashboard": "Painel",
    "nav.journal": "Diário",
    "nav.journalEntries": "Entradas do Diário",
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
    "common.edit": "Editar",
    "common.view": "Visualizar",
    "common.back": "Voltar",
    "common.reset": "Resetar",
    
    "risk.status": "Status de Risco",
    "risk.within": "Dentro do limite",
    "risk.approaching": "Próximo ao limite",
    "risk.exceeded": "Limite excedido",
    
    "journal.complete": "Complete o diário diário",
    "journal.entries": "Entradas do Diário",
    "journal.entriesDescription": "Visualize e gerencie suas entradas do diário de trading",
    "journal.viewEntry": "Visualizar Entrada do Diário",
    "journal.editEntry": "Editar Entrada do Diário",
    "journal.date": "Data",
    "journal.errorReview": "Revisão de Erros",
    "journal.goalHit": "Meta Atingida",
    "journal.comment": "Comentários",
    "journal.actions": "Ações",
    "journal.entryFor": "Entrada do Diário para",
    "journal.noEntries": "Nenhuma entrada do diário encontrada",
    "journal.errorReviewCompleted": "Revisão de erros concluída",
    "journal.dailyComment": "Comentário Diário",
    "journal.previousDayGoalHit": "Meta do Dia Anterior Atingida",
    "journal.yes": "Sim",
    "journal.no": "Não",
    "journal.na": "Não Aplicável",
    "journal.saved": "Diário Salvo",
    "journal.updated": "Diário Atualizado",
    
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
    "trade.asset": "Ativo",
    "trade.setup": "Setup",
    "trade.direction": "Direção",
    "trade.entryTime": "Hora de Entrada",
    "trade.leverage": "Alavancagem",
    
    "calculator.title": "Calculadora de Alavancagem",
    "calculator.description": "Calcule a alavancagem ideal com base em seus parâmetros de risco",
    "calculator.stopType": "Tipo de Stop Loss",
    "calculator.percentage": "Porcentagem (%)",
    "calculator.dollar": "Valor em Dólar ($)",
    "calculator.stopPercentage": "Tamanho do Stop (%)",
    "calculator.stopDollar": "Tamanho do Stop ($)",
    "calculator.marginAmount": "Valor da Margem ($)",
    "calculator.riskPercentage": "Porcentagem de Risco (%)",
    "calculator.entryPrice": "Preço de Entrada ($)",
    "calculator.calculate": "Calcular",
    "calculator.results": "Resultados do Cálculo",
    "calculator.suggestedLeverage": "Alavancagem Sugerida",
    "calculator.positionSize": "Tamanho da Posição",
    
    "analytics.title": "Análises",
    "analytics.month": "Mês",
    "analytics.dataRange": "Intervalo de Datas",
    "analytics.profitLoss": "Lucro/Prejuízo",
    "analytics.tradeCount": "Número de Operações",
    "analytics.winRate": "Taxa de Acerto",
    "analytics.averageTrade": "Média por Operação",
    
    "journal.dailyTitle": "Diário de Trading Diário",
    "journal.complete": "Complete o diário diário",
    "journal.entries": "Entradas do Diário",
    "journal.entriesDescription": "Visualize e gerencie suas entradas do diário de trading",
    "journal.viewEntry": "Visualizar Entrada do Diário",
    "journal.editEntry": "Editar Entrada do Diário",
    "journal.date": "Data",
    "journal.errorReview": "Revisão de Erros",
    "journal.goalHit": "Meta Atingida",
    "journal.comment": "Comentários",
    "journal.actions": "Ações",
    "journal.entryFor": "Entrada do Diário para",
    "journal.noEntries": "Nenhuma entrada do diário encontrada",
    "journal.errorReviewCompleted": "Revisão de erros concluída",
    "journal.dailyComment": "Comentário Diário",
    "journal.previousDayGoalHit": "Meta do Dia Anterior Atingida",
    "journal.yes": "Sim",
    "journal.no": "Não",
    "journal.na": "Não Aplicável",
    "journal.saved": "Diário Salvo",
    "journal.updated": "Diário Atualizado",
    
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
    "users.actions": "Ações",
    "users.updated": "Usuário Atualizado",
    "users.added": "Usuário Adicionado",
    "users.deleted": "Usuário Excluído",
    "users.cannotDeleteSelf": "Você não pode excluir sua própria conta",
    "users.noUsersFound": "Nenhum usuário encontrado",
    "users.accessDenied": "Acesso negado. Apenas mentores podem visualizar esta página.",
    
    "settings.language": "Idioma",
    "login.title": "Login",
    "login.email": "Email",
    "login.password": "Senha",
    "login.submit": "Entrar",
    "login.rememberMe": "Lembrar-me",
    "login.forgotPassword": "Esqueceu a senha?",
    "login.noAccount": "Não tem uma conta?",
    "login.signUp": "Cadastre-se",
    "login.switchLanguage": "Mudar para Inglês"
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
