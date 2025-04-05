
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'pt';

interface TranslationsType {
  [key: string]: {
    en: string;
    pt: string;
  };
}

// All translations for the application
const translations: TranslationsType = {
  // Common
  'common.loading': {
    en: 'Loading...',
    pt: 'Carregando...'
  },
  'common.save': {
    en: 'Save',
    pt: 'Salvar'
  },
  'common.cancel': {
    en: 'Cancel',
    pt: 'Cancelar'
  },
  'common.delete': {
    en: 'Delete',
    pt: 'Excluir'
  },
  'common.edit': {
    en: 'Edit',
    pt: 'Editar'
  },
  'common.required': {
    en: 'Required',
    pt: 'Obrigatório'
  },
  
  // Navigation
  'nav.menu': {
    en: 'Menu',
    pt: 'Menu'
  },
  'nav.dashboard': {
    en: 'Dashboard',
    pt: 'Painel'
  },
  'nav.journal': {
    en: 'Journal',
    pt: 'Diário'
  },
  'nav.trades': {
    en: 'Trades',
    pt: 'Operações'
  },
  'nav.analytics': {
    en: 'Analytics',
    pt: 'Análises'
  },
  'nav.calendar': {
    en: 'Calendar',
    pt: 'Calendário'
  },
  'nav.settings': {
    en: 'Settings',
    pt: 'Configurações'
  },
  'nav.users': {
    en: 'Users',
    pt: 'Usuários'
  },
  
  // Risk status
  'risk.status': {
    en: 'Risk Status',
    pt: 'Status de Risco'
  },
  'risk.within': {
    en: 'Within limits',
    pt: 'Dentro dos limites'
  },
  'risk.approaching': {
    en: 'Approaching limit',
    pt: 'Próximo ao limite'
  },
  'risk.exceeded': {
    en: 'Limit exceeded',
    pt: 'Limite excedido'
  },
  
  // Journal
  'journal.complete': {
    en: 'Complete daily journal',
    pt: 'Complete o diário do dia'
  },
  'journal.title': {
    en: 'Daily Journal',
    pt: 'Diário de Operações'
  },
  'journal.date': {
    en: 'Date',
    pt: 'Data'
  },
  'journal.errorReview': {
    en: 'Error Review Completed',
    pt: 'Revisão de Erros Concluída'
  },
  'journal.dailyComment': {
    en: 'Daily Comment',
    pt: 'Comentário do Dia'
  },
  'journal.goalHit': {
    en: 'Previous Day Goal Hit',
    pt: 'Meta do Dia Anterior Atingida'
  },
  
  // Trade
  'trade.logTitle': {
    en: 'Trade Log',
    pt: 'Registro de Operações'
  },
  'trade.logDescription': {
    en: 'Record and track all your trading activity',
    pt: 'Registre e acompanhe todas as suas atividades de trading'
  },
  'trade.new': {
    en: 'New Trade',
    pt: 'Nova Operação'
  },
  'trade.asset': {
    en: 'Asset',
    pt: 'Ativo'
  },
  'trade.setup': {
    en: 'Setup',
    pt: 'Setup'
  },
  'trade.direction': {
    en: 'Direction',
    pt: 'Direção'
  },
  'trade.trendPosition': {
    en: 'Trend Position',
    pt: 'Posição na Tendência'
  },
  'trade.entryTime': {
    en: 'Entry Time',
    pt: 'Hora de Entrada'
  },
  'trade.exitTime': {
    en: 'Exit Time',
    pt: 'Hora de Saída'
  },
  'trade.result': {
    en: 'Result',
    pt: 'Resultado'
  },
  'trade.leverage': {
    en: 'Leverage',
    pt: 'Alavancagem'
  },
  'trade.notes': {
    en: 'Notes',
    pt: 'Notas'
  },
  'trade.mistake': {
    en: 'Mistake?',
    pt: 'Erro?'
  },
  'trade.mistakeType': {
    en: 'Mistake Type',
    pt: 'Tipo de Erro'
  },
  'trade.model': {
    en: 'Model Trade',
    pt: 'Operação Modelo'
  },
  'trade.searchAsset': {
    en: 'Search assets...',
    pt: 'Buscar ativos...'
  },
  'trade.noAssetsFound': {
    en: 'No assets found',
    pt: 'Nenhum ativo encontrado'
  },
  'trade.list': {
    en: 'Trade List',
    pt: 'Lista de Operações'
  },
  'trade.added': {
    en: 'Trade added',
    pt: 'Operação adicionada'
  },
  'trade.addedDescription': {
    en: 'Your trade has been logged successfully.',
    pt: 'Sua operação foi registrada com sucesso.'
  },
  'trade.updated': {
    en: 'Trade updated',
    pt: 'Operação atualizada'
  },
  'trade.updatedDescription': {
    en: 'Your trade has been updated successfully.',
    pt: 'Sua operação foi atualizada com sucesso.'
  },
  
  // Calculator
  'calculator.title': {
    en: 'Leverage Calculator',
    pt: 'Calculadora de Alavancagem'
  },
  'calculator.stopSize': {
    en: 'Stop Size (%)',
    pt: 'Tamanho do Stop (%)'
  },
  'calculator.riskAmount': {
    en: 'Risk Amount ($)',
    pt: 'Valor de Risco ($)'
  },
  'calculator.entryPrice': {
    en: 'Entry Price ($)',
    pt: 'Preço de Entrada ($)'
  },
  'calculator.calculate': {
    en: 'Calculate',
    pt: 'Calcular'
  },
  'calculator.maxLeverage': {
    en: 'Maximum Leverage',
    pt: 'Alavancagem Máxima'
  },
  'calculator.positionSize': {
    en: 'Position Size',
    pt: 'Tamanho da Posição'
  },
  'calculator.riskRatio': {
    en: 'Risk:Reward Ratio',
    pt: 'Relação Risco:Retorno'
  },
  
  // Auth
  'auth.loginTitle': {
    en: 'Login to Trade Compass',
    pt: 'Entrar no Trade Compass'
  },
  'auth.loginDescription': {
    en: 'Enter your credentials to access your account',
    pt: 'Digite suas credenciais para acessar sua conta'
  },
  'auth.email': {
    en: 'Email',
    pt: 'Email'
  },
  'auth.password': {
    en: 'Password',
    pt: 'Senha'
  },
  'auth.login': {
    en: 'Log In',
    pt: 'Entrar'
  },
  'auth.loginSuccess': {
    en: 'Logged in successfully',
    pt: 'Login realizado com sucesso'
  },
  'auth.loginError': {
    en: 'Login failed',
    pt: 'Falha no login'
  },
  'auth.demo': {
    en: 'Demo credentials:',
    pt: 'Credenciais de demonstração:'
  },
  
  // Users
  'users.title': {
    en: 'User Management',
    pt: 'Gerenciamento de Usuários'
  },
  'users.description': {
    en: 'Manage user accounts and access permissions',
    pt: 'Gerencie contas de usuários e permissões de acesso'
  },
  'users.new': {
    en: 'New User',
    pt: 'Novo Usuário'
  },
  'users.list': {
    en: 'Users',
    pt: 'Usuários'
  },
  'users.name': {
    en: 'Name',
    pt: 'Nome'
  },
  'users.email': {
    en: 'Email',
    pt: 'Email'
  },
  'users.role': {
    en: 'Role',
    pt: 'Função'
  },
  'users.mentor': {
    en: 'Mentor',
    pt: 'Mentor'
  },
  'users.mentored': {
    en: 'Mentored',
    pt: 'Mentorado'
  },
  'users.actions': {
    en: 'Actions',
    pt: 'Ações'
  },
  'users.noUsersFound': {
    en: 'No users found',
    pt: 'Nenhum usuário encontrado'
  },
  'users.updated': {
    en: 'User updated successfully',
    pt: 'Usuário atualizado com sucesso'
  },
  'users.added': {
    en: 'User added successfully',
    pt: 'Usuário adicionado com sucesso'
  },
  'users.deleted': {
    en: 'User deleted successfully',
    pt: 'Usuário excluído com sucesso'
  },
  'users.editUser': {
    en: 'Edit User',
    pt: 'Editar Usuário'
  },
  'users.addUser': {
    en: 'Add User',
    pt: 'Adicionar Usuário'
  },
  'users.saveChanges': {
    en: 'Save Changes',
    pt: 'Salvar Alterações'
  },
  'users.createUser': {
    en: 'Create User',
    pt: 'Criar Usuário'
  },
  'users.selectRole': {
    en: 'Select a role',
    pt: 'Selecione uma função'
  },
  'users.assignMentor': {
    en: 'Assign Mentor',
    pt: 'Atribuir Mentor'
  },
  'users.selectMentor': {
    en: 'Select a mentor',
    pt: 'Selecione um mentor'
  },
  'users.emailNote': {
    en: 'This will be used for login',
    pt: 'Isso será usado para login'
  },
  'users.cannotDeleteSelf': {
    en: 'You cannot delete your own account',
    pt: 'Você não pode excluir sua própria conta'
  },
  'users.search': {
    en: 'Search users...',
    pt: 'Buscar usuários...'
  },
  'users.filterByRole': {
    en: 'Filter by role',
    pt: 'Filtrar por função'
  },
  'users.allRoles': {
    en: 'All roles',
    pt: 'Todas as funções'
  },
  'users.accessDenied': {
    en: 'Access denied. Only mentors can access this page.',
    pt: 'Acesso negado. Apenas mentores podem acessar esta página.'
  }
};

// Context type
type LanguageContextType = {
  t: (key: string) => string;
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
};

// Create the context
const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to get language from localStorage or use browser language
  const getBrowserLanguage = (): Language => {
    const browserLang = navigator.language.substring(0, 2);
    return browserLang === 'pt' ? 'pt' : 'en';
  };
  
  const getInitialLanguage = (): Language => {
    const savedLang = localStorage.getItem('language');
    return (savedLang === 'en' || savedLang === 'pt') 
      ? savedLang 
      : getBrowserLanguage();
  };
  
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage());
  
  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);
  
  // Translation function
  const t = (key: string): string => {
    const translation = translations[key];
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    return translation[currentLanguage] || key;
  };
  
  return (
    <LanguageContext.Provider value={{
      t,
      currentLanguage,
      setLanguage: setCurrentLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
