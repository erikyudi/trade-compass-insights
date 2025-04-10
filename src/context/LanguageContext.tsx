
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  t: (key: string) => string;
  changeLanguage: (lang: string) => void;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
}

const defaultTranslations = {
  en: {
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.create': 'Create',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.journal': 'Journal',
    'nav.trades': 'Trades',
    'nav.analytics': 'Analytics',
    'nav.calendar': 'Calendar',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    'nav.users': 'Users',
    
    // Login Page
    'login.title': 'Welcome back',
    'login.description': 'Enter your credentials to access your account',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.submit': 'Sign in',
    'login.loggingIn': 'Signing in...',
    'login.forgotPassword': 'Forgot password?',
    'login.resetPassword': 'Reset your password',
    'login.resetInstructions': 'Enter your email address below and we will send you a link to reset your password.',
    'login.sendResetLink': 'Send reset link',
    'login.sending': 'Sending...',
    'login.backToLogin': 'Back to login',
    'login.success': 'Login successful',
    'login.failed': 'Login failed',
    'login.tryAgain': 'Please check your credentials and try again',
    'login.resetSent': 'Reset link sent',
    'login.checkEmail': 'Please check your email for the reset link',
    'login.resetFailed': 'Failed to send reset link',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.description': 'Your trading performance at a glance',
    'dashboard.todayTrading': 'Today\'s Trading',
    'dashboard.recentTrades': 'Recent Trades',
    'dashboard.profitTarget': 'Daily Profit Target',
    'dashboard.settings': 'Settings',
    
    // Journal
    'journal.title': 'Trading Journal',
    'journal.description': 'Record your daily trading thoughts and analysis',
    'journal.new': 'New Journal Entry',
    'journal.today': 'Today',
    'journal.list': 'Journal Entries',
    'journal.date': 'Date',
    'journal.dailyComment': 'Daily Comment',
    'journal.errorReview': 'Error Review',
    'journal.goalSet': 'Goal Set',
    'journal.goalAchieved': 'Goal Achieved',
    'journal.actions': 'Actions',
    'journal.view': 'View',
    'journal.edit': 'Edit',
    'journal.completed': 'Completed',
    'journal.notCompleted': 'Not Completed',
    'journal.noEntries': 'No journal entries found',
    'journal.save': 'Save Journal',
    'journal.saving': 'Saving...',
    'journal.saved': 'Journal saved',
    'journal.entryFor': 'Journal Entry for',
    'journal.dailyCommentLabel': 'Daily Comment',
    'journal.dailyCommentPlaceholder': 'What did you learn today? What went well? What could be improved?',
    'journal.performErrorReview': 'Perform an error review for today\'s trading',
    'journal.previousDayGoal': 'Did you achieve yesterday\'s goal?',
    'journal.yes': 'Yes',
    'journal.no': 'No',
    'journal.notApplicable': 'N/A (No goal was set)',
    'journal.tomorrowGoal': 'Tomorrow\'s Goal',
    'journal.tomorrowGoalPlaceholder': 'What is your trading goal for tomorrow?',
    'journal.updated': 'Journal updated',
    'journal.titleNew': 'New Journal Entry',
    'journal.descriptionNew': 'Record your thoughts and analysis for today',
    'journal.titleEdit': 'Edit Journal Entry',
    'journal.descriptionEdit': 'Update your trading journal entry',
    
    // Trades
    'trade.logTitle': 'Trade Log',
    'trade.logDescription': 'Record and track all your trades',
    'trade.new': 'New Trade',
    'trade.edit': 'Edit Trade',
    'trade.newDescription': 'Record details of your trade',
    'trade.editDescription': 'Update details of your trade',
    'trade.list': 'Trades',
    'trade.listDescription': 'Review all your recorded trades',
    'trade.date': 'Date',
    'trade.asset': 'Asset',
    'trade.setup': 'Setup',
    'trade.direction': 'Direction',
    'trade.trend': 'Trend',
    'trade.pnl': 'P/L',
    'trade.leverage': 'Leverage',
    'trade.buy': 'Buy',
    'trade.sell': 'Sell',
    'trade.withTrend': 'With Trend',
    'trade.againstTrend': 'Against Trend',
    'trade.neutralTrend': 'Neutral',
    'trade.profitLoss': 'Profit/Loss',
    'trade.profitLossPercentage': 'P/L %',
    'trade.profitLossDescription': 'Profit or loss in dollars',
    'trade.profitLossAmountDescription': 'Profit or loss in dollars',
    'trade.leverageDescription': 'Trading leverage used (1x or higher)',
    'trade.notes': 'Trade Notes',
    'trade.notesPlaceholder': 'Write any additional notes about this trade...',
    'trade.isMistake': 'Mistake Trade',
    'trade.isMistakeDescription': 'Mark if this trade violated your trading rules',
    'trade.mistakeType': 'Mistake Type',
    'trade.entryTime': 'Entry Time',
    'trade.exitTime': 'Exit Time',
    'trade.exitTimeOptional': 'Exit time (optional)',
    'trade.trendPosition': 'Trend Position',
    'trade.selectDate': 'Select date and time',
    'trade.clear': 'Clear',
    'trade.selectSetup': 'Select setup',
    'trade.selectDirection': 'Select direction',
    'trade.selectTrend': 'Select trend position',
    'trade.selectMistakeType': 'Select mistake type',
    'trade.search': 'Search trades...',
    'trade.filterBySetup': 'Filter by setup',
    'trade.filterByDirection': 'Filter by direction',
    'trade.allSetups': 'All Setups',
    'trade.allDirections': 'All Directions',
    'trade.noTradesFound': 'No trades found',
    'trade.confirmDelete': 'Delete Trade',
    'trade.deleteWarning': 'Are you sure you want to delete this trade? This cannot be undone.',
    'trade.noJournal': 'No journal entry for today',
    'trade.createJournalFirst': 'Please create a journal entry for today before adding trades',
    'trade.added': 'Trade added',
    'trade.addedDescription': 'Your trade has been successfully recorded',
    'trade.updated': 'Trade updated',
    'trade.updatedDescription': 'Your trade has been successfully updated',
    'trade.deleted': 'Trade deleted',
    'trade.deletedDescription': 'Your trade has been permanently removed',
    'trade.riskManager': 'Risk Manager',
    
    // Analytics
    'analytics.title': 'Analytics',
    'analytics.description': 'Analyze your trading performance and metrics',
    'analytics.filter': 'Date Filter',
    'analytics.month': 'Month',
    'analytics.dateRange': 'Date Range',
    'analytics.apply': 'Apply Filter',
    'analytics.reset': 'Reset',
    'analytics.profitHistory': 'Profit History',
    'analytics.setupPerformance': 'Setup Performance',
    'analytics.timeOfDay': 'Time of Day',
    'analytics.winRate': 'Win Rate',
    'analytics.profitLoss': 'Profit/Loss',
    'analytics.averageTrade': 'Avg Trade',
    'analytics.tradeCount': 'Trade Count',
    'analytics.startDate': 'Start Date',
    'analytics.endDate': 'End Date',
    'analytics.traderDetails': 'Trader Details',
    
    // Leverage Calculator
    'calculator.title': 'Leverage Calculator',
    'calculator.description': 'Calculate your position size and risk',
    'calculator.accountSize': 'Account Size',
    'calculator.riskPercentage': 'Risk Percentage',
    'calculator.entryPrice': 'Entry Price',
    'calculator.stopLoss': 'Stop Loss',
    'calculator.positionSize': 'Position Size',
    'calculator.leverageNeeded': 'Leverage Needed',
    'calculator.riskAmount': 'Risk Amount',
    'calculator.calculate': 'Calculate',
    'calculator.results': 'Results',
    
    // Settings
    'settings.title': 'Settings',
    'settings.description': 'Manage your trading preferences and configurations',
    'settings.assets': 'Assets',
    'settings.setups': 'Trading Setups',
    'settings.mistakes': 'Mistake Types',
    'settings.riskManagement': 'Risk Management',
    'settings.initialCapital': 'Initial Capital',
    'settings.dailyTarget': 'Daily Profit Target (%)',
    'settings.dailyRiskLimit': 'Daily Risk Limit',
    'settings.saveSettings': 'Save Settings',
    'settings.saved': 'Settings saved',
    'settings.language': 'Language',
    'settings.selectLanguage': 'Select language',
    
    // Users
    'users.title': 'Users',
    'users.description': 'Manage system users and permissions',
    'users.list': 'User List',
    'users.new': 'New User',
    'users.name': 'Name',
    'users.email': 'Email',
    'users.role': 'Role',
    'users.mentor': 'Mentor',
    'users.actions': 'Actions',
    'users.admin': 'Admin',
    'users.mentored': 'Mentored',
    'users.search': 'Search users...',
    'users.filterByRole': 'Filter by role',
    'users.allRoles': 'All Roles',
    'users.noUsersFound': 'No users found',
    'users.added': 'User added',
    'users.updated': 'User updated',
    'users.deleted': 'User deleted',
    'users.notAuthorized': 'Not authorized',
    'users.cannotDeleteSelf': 'Cannot delete your own account',
    'users.personalInfo': 'Personal Information',
    'users.nameLabel': 'Full Name',
    'users.emailLabel': 'Email Address',
    'users.emailNote': 'User will use this email to log in',
    'users.roleAssignment': 'Role Assignment',
    'users.mentorAssignment': 'Mentor Assignment',
    'users.selectMentor': 'Select a mentor',
    'users.password': 'Password',
    'users.passwordNote': 'Leave blank to keep current password',
    'users.saveChanges': 'Save Changes',
    'users.accessDenied': 'Access Denied',
    'users.analyticsFor': 'Analytics for',
    'users.analyticsDescription': 'Trading performance and metrics for this user',
    'users.editUser': 'Edit User',
    'users.addUser': 'Add User',
    'users.selectRole': 'Select role',
    'users.assignMentor': 'Assign Mentor',
    'users.createUser': 'Create User',
  },
  pt: {
    // Common
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Excluir',
    'common.create': 'Criar',
    
    // Navigation
    'nav.dashboard': 'Painel',
    'nav.journal': 'Diário',
    'nav.trades': 'Operações',
    'nav.analytics': 'Análises',
    'nav.calendar': 'Calendário',
    'nav.settings': 'Configurações',
    'nav.logout': 'Sair',
    'nav.users': 'Usuários',
    
    // Login Page
    'login.title': 'Bem-vindo de volta',
    'login.description': 'Digite suas credenciais para acessar sua conta',
    'login.email': 'E-mail',
    'login.password': 'Senha',
    'login.submit': 'Entrar',
    'login.loggingIn': 'Entrando...',
    'login.forgotPassword': 'Esqueceu a senha?',
    'login.resetPassword': 'Redefinir sua senha',
    'login.resetInstructions': 'Digite seu endereço de e-mail abaixo e enviaremos um link para redefinir sua senha.',
    'login.sendResetLink': 'Enviar link de redefinição',
    'login.sending': 'Enviando...',
    'login.backToLogin': 'Voltar ao login',
    'login.success': 'Login bem-sucedido',
    'login.failed': 'Falha no login',
    'login.tryAgain': 'Verifique suas credenciais e tente novamente',
    'login.resetSent': 'Link de redefinição enviado',
    'login.checkEmail': 'Verifique seu e-mail para o link de redefinição',
    'login.resetFailed': 'Falha ao enviar link de redefinição',
    
    // Dashboard
    'dashboard.title': 'Painel',
    'dashboard.description': 'Seu desempenho de trading em um relance',
    'dashboard.todayTrading': 'Operações de Hoje',
    'dashboard.recentTrades': 'Operações Recentes',
    'dashboard.profitTarget': 'Meta de Lucro Diário',
    'dashboard.settings': 'Configurações',
    
    // Journal
    'journal.title': 'Diário de Trading',
    'journal.description': 'Registre seus pensamentos e análises diárias de trading',
    'journal.new': 'Nova Entrada de Diário',
    'journal.today': 'Hoje',
    'journal.list': 'Entradas do Diário',
    'journal.date': 'Data',
    'journal.dailyComment': 'Comentário Diário',
    'journal.errorReview': 'Revisão de Erros',
    'journal.goalSet': 'Meta Definida',
    'journal.goalAchieved': 'Meta Alcançada',
    'journal.actions': 'Ações',
    'journal.view': 'Visualizar',
    'journal.edit': 'Editar',
    'journal.completed': 'Concluído',
    'journal.notCompleted': 'Não Concluído',
    'journal.noEntries': 'Nenhuma entrada de diário encontrada',
    'journal.save': 'Salvar Diário',
    'journal.saving': 'Salvando...',
    'journal.saved': 'Diário salvo',
    'journal.entryFor': 'Entrada de Diário para',
    'journal.dailyCommentLabel': 'Comentário Diário',
    'journal.dailyCommentPlaceholder': 'O que você aprendeu hoje? O que foi bem? O que poderia ser melhorado?',
    'journal.performErrorReview': 'Realizar uma revisão de erros para as operações de hoje',
    'journal.previousDayGoal': 'Você alcançou a meta de ontem?',
    'journal.yes': 'Sim',
    'journal.no': 'Não',
    'journal.notApplicable': 'N/A (Nenhuma meta foi definida)',
    'journal.tomorrowGoal': 'Meta para Amanhã',
    'journal.tomorrowGoalPlaceholder': 'Qual é a sua meta de trading para amanhã?',
    'journal.updated': 'Diário atualizado',
    'journal.titleNew': 'Nova Entrada de Diário',
    'journal.descriptionNew': 'Registre seus pensamentos e análises para hoje',
    'journal.titleEdit': 'Editar Entrada de Diário',
    'journal.descriptionEdit': 'Atualizar entrada do diário de trading',
    
    // Trades
    'trade.logTitle': 'Registro de Operações',
    'trade.logDescription': 'Registre e acompanhe todas as suas operações',
    'trade.new': 'Nova Operação',
    'trade.edit': 'Editar Operação',
    'trade.newDescription': 'Registre detalhes da sua operação',
    'trade.editDescription': 'Atualize detalhes da sua operação',
    'trade.list': 'Operações',
    'trade.listDescription': 'Revise todas as suas operações registradas',
    'trade.date': 'Data',
    'trade.asset': 'Ativo',
    'trade.setup': 'Setup',
    'trade.direction': 'Direção',
    'trade.trend': 'Tendência',
    'trade.pnl': 'L/P',
    'trade.leverage': 'Alavancagem',
    'trade.buy': 'Compra',
    'trade.sell': 'Venda',
    'trade.withTrend': 'Com Tendência',
    'trade.againstTrend': 'Contra Tendência',
    'trade.neutralTrend': 'Neutro',
    'trade.profitLoss': 'Lucro/Perda',
    'trade.profitLossPercentage': 'L/P %',
    'trade.profitLossDescription': 'Lucro ou perda em dólares',
    'trade.profitLossAmountDescription': 'Lucro ou perda em dólares',
    'trade.leverageDescription': 'Alavancagem de trading utilizada (1x ou maior)',
    'trade.notes': 'Notas da Operação',
    'trade.notesPlaceholder': 'Escreva quaisquer notas adicionais sobre esta operação...',
    'trade.isMistake': 'Operação com Erro',
    'trade.isMistakeDescription': 'Marque se esta operação violou suas regras de trading',
    'trade.mistakeType': 'Tipo de Erro',
    'trade.entryTime': 'Hora de Entrada',
    'trade.exitTime': 'Hora de Saída',
    'trade.exitTimeOptional': 'Hora de saída (opcional)',
    'trade.trendPosition': 'Posição na Tendência',
    'trade.selectDate': 'Selecione data e hora',
    'trade.clear': 'Limpar',
    'trade.selectSetup': 'Selecione o setup',
    'trade.selectDirection': 'Selecione a direção',
    'trade.selectTrend': 'Selecione a posição na tendência',
    'trade.selectMistakeType': 'Selecione o tipo de erro',
    'trade.search': 'Buscar operações...',
    'trade.filterBySetup': 'Filtrar por setup',
    'trade.filterByDirection': 'Filtrar por direção',
    'trade.allSetups': 'Todos os Setups',
    'trade.allDirections': 'Todas as Direções',
    'trade.noTradesFound': 'Nenhuma operação encontrada',
    'trade.confirmDelete': 'Excluir Operação',
    'trade.deleteWarning': 'Tem certeza que deseja excluir esta operação? Esta ação não pode ser desfeita.',
    'trade.noJournal': 'Sem entrada de diário para hoje',
    'trade.createJournalFirst': 'Por favor, crie uma entrada de diário para hoje antes de adicionar operações',
    'trade.added': 'Operação adicionada',
    'trade.addedDescription': 'Sua operação foi registrada com sucesso',
    'trade.updated': 'Operação atualizada',
    'trade.updatedDescription': 'Sua operação foi atualizada com sucesso',
    'trade.deleted': 'Operação excluída',
    'trade.deletedDescription': 'Sua operação foi removida permanentemente',
    'trade.riskManager': 'Gerenciador de Risco',
    
    // Analytics
    'analytics.title': 'Análises',
    'analytics.description': 'Analise seu desempenho e métricas de trading',
    'analytics.filter': 'Filtro de Data',
    'analytics.month': 'Mês',
    'analytics.dateRange': 'Intervalo de Datas',
    'analytics.apply': 'Aplicar Filtro',
    'analytics.reset': 'Resetar',
    'analytics.profitHistory': 'Histórico de Lucros',
    'analytics.setupPerformance': 'Desempenho por Setup',
    'analytics.timeOfDay': 'Hora do Dia',
    'analytics.winRate': 'Taxa de Acerto',
    'analytics.profitLoss': 'Lucro/Perda',
    'analytics.averageTrade': 'Média por Operação',
    'analytics.tradeCount': 'Nº de Operações',
    'analytics.startDate': 'Data Inicial',
    'analytics.endDate': 'Data Final',
    'analytics.traderDetails': 'Detalhes do Trader',
    
    // Leverage Calculator
    'calculator.title': 'Calculadora de Alavancagem',
    'calculator.description': 'Calcule seu tamanho de posição e risco',
    'calculator.accountSize': 'Tamanho da Conta',
    'calculator.riskPercentage': 'Percentual de Risco',
    'calculator.entryPrice': 'Preço de Entrada',
    'calculator.stopLoss': 'Stop Loss',
    'calculator.positionSize': 'Tamanho da Posição',
    'calculator.leverageNeeded': 'Alavancagem Necessária',
    'calculator.riskAmount': 'Quantidade em Risco',
    'calculator.calculate': 'Calcular',
    'calculator.results': 'Resultados',
    
    // Settings
    'settings.title': 'Configurações',
    'settings.description': 'Gerencie suas preferências e configurações de trading',
    'settings.assets': 'Ativos',
    'settings.setups': 'Setups de Trading',
    'settings.mistakes': 'Tipos de Erros',
    'settings.riskManagement': 'Gerenciamento de Risco',
    'settings.initialCapital': 'Capital Inicial',
    'settings.dailyTarget': 'Meta de Lucro Diário (%)',
    'settings.dailyRiskLimit': 'Limite de Risco Diário',
    'settings.saveSettings': 'Salvar Configurações',
    'settings.saved': 'Configurações salvas',
    'settings.language': 'Idioma',
    'settings.selectLanguage': 'Selecione o idioma',
    
    // Users
    'users.title': 'Usuários',
    'users.description': 'Gerencie usuários e permissões do sistema',
    'users.list': 'Lista de Usuários',
    'users.new': 'Novo Usuário',
    'users.name': 'Nome',
    'users.email': 'E-mail',
    'users.role': 'Função',
    'users.mentor': 'Mentor',
    'users.actions': 'Ações',
    'users.admin': 'Administrador',
    'users.mentored': 'Mentorado',
    'users.search': 'Buscar usuários...',
    'users.filterByRole': 'Filtrar por função',
    'users.allRoles': 'Todas as Funções',
    'users.noUsersFound': 'Nenhum usuário encontrado',
    'users.added': 'Usuário adicionado',
    'users.updated': 'Usuário atualizado',
    'users.deleted': 'Usuário excluído',
    'users.notAuthorized': 'Não autorizado',
    'users.cannotDeleteSelf': 'Não é possível excluir sua própria conta',
    'users.personalInfo': 'Informações Pessoais',
    'users.nameLabel': 'Nome Completo',
    'users.emailLabel': 'Endereço de E-mail',
    'users.emailNote': 'O usuário usará este e-mail para fazer login',
    'users.roleAssignment': 'Atribuição de Função',
    'users.mentorAssignment': 'Atribuição de Mentor',
    'users.selectMentor': 'Selecione um mentor',
    'users.password': 'Senha',
    'users.passwordNote': 'Deixe em branco para manter a senha atual',
    'users.saveChanges': 'Salvar Alterações',
    'users.accessDenied': 'Acesso Negado',
    'users.analyticsFor': 'Análises para',
    'users.analyticsDescription': 'Desempenho e métricas de trading para este usuário',
    'users.editUser': 'Editar Usuário',
    'users.addUser': 'Adicionar Usuário',
    'users.selectRole': 'Selecione a função',
    'users.assignMentor': 'Atribuir Mentor',
    'users.createUser': 'Criar Usuário',
  }
};

// Create context
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  t: () => '',
  changeLanguage: () => {},
  currentLanguage: 'en',
  setLanguage: () => {},
});

// Language Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');
  
  // Translate function
  const t = (key: string): string => {
    const translations = defaultTranslations[language as keyof typeof defaultTranslations];
    return translations[key as keyof typeof translations] || key;
  };
  
  // Change language function
  const changeLanguage = (lang: string) => {
    if (defaultTranslations[lang as keyof typeof defaultTranslations]) {
      setLanguage(lang);
    }
  };
  
  return (
    <LanguageContext.Provider value={{ 
      language, 
      t, 
      changeLanguage,
      currentLanguage: language,
      setLanguage: changeLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
