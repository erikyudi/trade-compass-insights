
import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageType = 'en-US' | 'pt-BR';

type TranslationsType = {
  [key: string]: {
    [key in LanguageType]: string;
  };
};

// Dictionary of translations
const translations: TranslationsType = {
  // Navigation
  'nav.dashboard': {
    'en-US': 'Dashboard',
    'pt-BR': 'Painel',
  },
  'nav.journal': {
    'en-US': 'Daily Journal',
    'pt-BR': 'Diário',
  },
  'nav.trades': {
    'en-US': 'Trades',
    'pt-BR': 'Operações',
  },
  'nav.analytics': {
    'en-US': 'Analytics',
    'pt-BR': 'Análises',
  },
  'nav.calendar': {
    'en-US': 'Calendar',
    'pt-BR': 'Calendário',
  },
  'nav.settings': {
    'en-US': 'Settings',
    'pt-BR': 'Configurações',
  },
  'nav.users': {
    'en-US': 'Users',
    'pt-BR': 'Usuários',
  },
  'nav.calculator': {
    'en-US': 'Leverage Calculator',
    'pt-BR': 'Calculadora de Alavancagem',
  },
  'nav.login': {
    'en-US': 'Login',
    'pt-BR': 'Entrar',
  },
  'nav.logout': {
    'en-US': 'Logout',
    'pt-BR': 'Sair',
  },

  // Common
  'common.required': {
    'en-US': 'Required',
    'pt-BR': 'Obrigatório',
  },
  'common.save': {
    'en-US': 'Save',
    'pt-BR': 'Salvar',
  },
  'common.cancel': {
    'en-US': 'Cancel',
    'pt-BR': 'Cancelar',
  },
  'common.delete': {
    'en-US': 'Delete',
    'pt-BR': 'Excluir',
  },
  'common.add': {
    'en-US': 'Add',
    'pt-BR': 'Adicionar',
  },
  'common.edit': {
    'en-US': 'Edit',
    'pt-BR': 'Editar',
  },
  'common.search': {
    'en-US': 'Search',
    'pt-BR': 'Buscar',
  },
  'common.filter': {
    'en-US': 'Filter',
    'pt-BR': 'Filtrar',
  },
  'common.create': {
    'en-US': 'Create',
    'pt-BR': 'Criar',
  },
  'common.close': {
    'en-US': 'Close',
    'pt-BR': 'Fechar',
  },

  // Risk Status
  'risk.status': {
    'en-US': 'Risk Status',
    'pt-BR': 'Status de Risco',
  },
  'risk.within': {
    'en-US': 'Within limits',
    'pt-BR': 'Dentro dos limites',
  },
  'risk.approaching': {
    'en-US': 'Approaching limit',
    'pt-BR': 'Próximo ao limite',
  },
  'risk.exceeded': {
    'en-US': 'Exceeded limit',
    'pt-BR': 'Limite excedido',
  },

  // Journal
  'journal.complete': {
    'en-US': 'Complete daily journal',
    'pt-BR': 'Complete o diário',
  },

  // Trade Form
  'trade.new': {
    'en-US': 'Log New Trade',
    'pt-BR': 'Registrar Nova Operação',
  },
  'trade.edit': {
    'en-US': 'Edit Trade',
    'pt-BR': 'Editar Operação',
  },
  'trade.details': {
    'en-US': 'Record the details of your trade',
    'pt-BR': 'Registre os detalhes da sua operação',
  },
  'trade.asset': {
    'en-US': 'Asset',
    'pt-BR': 'Ativo',
  },
  'trade.searchAsset': {
    'en-US': 'Search assets...',
    'pt-BR': 'Buscar ativos...',
  },
  'trade.noAssetsFound': {
    'en-US': 'No assets found',
    'pt-BR': 'Nenhum ativo encontrado',
  },
  'trade.setup': {
    'en-US': 'Setup',
    'pt-BR': 'Setup',
  },
  'trade.direction': {
    'en-US': 'Direction',
    'pt-BR': 'Direção',
  },
  'trade.buy': {
    'en-US': 'Buy',
    'pt-BR': 'Compra',
  },
  'trade.sell': {
    'en-US': 'Sell',
    'pt-BR': 'Venda',
  },
  'trade.trend': {
    'en-US': 'Trend Position',
    'pt-BR': 'Posição de Tendência',
  },
  'trade.withTrend': {
    'en-US': 'With Trend',
    'pt-BR': 'Com a Tendência',
  },
  'trade.againstTrend': {
    'en-US': 'Against Trend',
    'pt-BR': 'Contra a Tendência',
  },
  'trade.entryTime': {
    'en-US': 'Entry Time',
    'pt-BR': 'Horário de Entrada',
  },
  'trade.exitTime': {
    'en-US': 'Exit Time',
    'pt-BR': 'Horário de Saída',
  },
  'trade.financialResult': {
    'en-US': 'Financial Result ($)',
    'pt-BR': 'Resultado Financeiro ($)',
  },
  'trade.profitLoss': {
    'en-US': 'Profit/Loss Percentage (%)',
    'pt-BR': 'Percentual de Lucro/Prejuízo (%)',
  },
  'trade.leverage': {
    'en-US': 'Leverage',
    'pt-BR': 'Alavancagem',
  },
  'trade.notes': {
    'en-US': 'Trade Notes',
    'pt-BR': 'Observações',
  },
  'trade.mistake': {
    'en-US': 'Was this trade a mistake?',
    'pt-BR': 'Esta operação foi um erro?',
  },
  'trade.mistakeDescription': {
    'en-US': 'Mark trades that violated your trading rules or had execution errors',
    'pt-BR': 'Marque operações que violaram suas regras ou tiveram erros de execução',
  },
  'trade.mistakeType': {
    'en-US': 'Type of Mistake',
    'pt-BR': 'Tipo de Erro',
  },
  'trade.modelTrade': {
    'en-US': 'Save as Model Trade',
    'pt-BR': 'Salvar como Operação Modelo',
  },
  'trade.modelDescription': {
    'en-US': 'Mark this as an exemplary trade to reference in the future',
    'pt-BR': 'Marque como uma operação exemplar para referência futura',
  },
  'trade.log': {
    'en-US': 'Log Trade',
    'pt-BR': 'Registrar Operação',
  },
  'trade.update': {
    'en-US': 'Update Trade',
    'pt-BR': 'Atualizar Operação',
  },

  // Settings
  'settings.language': {
    'en-US': 'Language',
    'pt-BR': 'Idioma',
  },
  'settings.riskManagement': {
    'en-US': 'Risk Management',
    'pt-BR': 'Gestão de Risco',
  },
  'settings.tradingSetups': {
    'en-US': 'Trading Setups',
    'pt-BR': 'Setups de Trading',
  },
  'settings.mistakeTypes': {
    'en-US': 'Mistake Types',
    'pt-BR': 'Tipos de Erros',
  },
  'settings.assets': {
    'en-US': 'Assets',
    'pt-BR': 'Ativos',
  },
  'settings.newSetup': {
    'en-US': 'New Setup Name',
    'pt-BR': 'Nome do Novo Setup',
  },
  'settings.addSetup': {
    'en-US': 'Add Setup',
    'pt-BR': 'Adicionar Setup',
  },
  'settings.newMistakeType': {
    'en-US': 'New Mistake Type',
    'pt-BR': 'Novo Tipo de Erro',
  },
  'settings.addMistakeType': {
    'en-US': 'Add Type',
    'pt-BR': 'Adicionar Tipo',
  },
  'settings.newAsset': {
    'en-US': 'New Asset Symbol',
    'pt-BR': 'Novo Símbolo de Ativo',
  },
  'settings.addAsset': {
    'en-US': 'Add Asset',
    'pt-BR': 'Adicionar Ativo',
  },

  // Analytics
  'analytics.title': {
    'en-US': 'Analytics',
    'pt-BR': 'Análises',
  },
  'analytics.description': {
    'en-US': 'Detailed analysis of your trading performance',
    'pt-BR': 'Análise detalhada do seu desempenho',
  },
  'analytics.filter': {
    'en-US': 'Filter',
    'pt-BR': 'Filtrar',
  },
  'analytics.month': {
    'en-US': 'Month',
    'pt-BR': 'Mês',
  },
  'analytics.dateRange': {
    'en-US': 'Date Range',
    'pt-BR': 'Período',
  },
  'analytics.startDate': {
    'en-US': 'Start Date',
    'pt-BR': 'Data Inicial',
  },
  'analytics.endDate': {
    'en-US': 'End Date',
    'pt-BR': 'Data Final',
  },
  'analytics.apply': {
    'en-US': 'Apply',
    'pt-BR': 'Aplicar',
  },
  'analytics.reset': {
    'en-US': 'Reset',
    'pt-BR': 'Resetar',
  },

  // Calculator
  'calculator.title': {
    'en-US': 'Leverage Calculator',
    'pt-BR': 'Calculadora de Alavancagem',
  },
  'calculator.description': {
    'en-US': 'Calculate the maximum leverage for your trade',
    'pt-BR': 'Calcule a alavancagem máxima para sua operação',
  },
  'calculator.stopSize': {
    'en-US': 'Stop Size (%)',
    'pt-BR': 'Tamanho do Stop (%)',
  },
  'calculator.riskAmount': {
    'en-US': 'Risk Amount ($)',
    'pt-BR': 'Valor de Risco ($)',
  },
  'calculator.entryPrice': {
    'en-US': 'Entry Price ($)',
    'pt-BR': 'Preço de Entrada ($)',
  },
  'calculator.calculate': {
    'en-US': 'Calculate',
    'pt-BR': 'Calcular',
  },
  'calculator.maxLeverage': {
    'en-US': 'Maximum Leverage',
    'pt-BR': 'Alavancagem Máxima',
  },
  'calculator.positionSize': {
    'en-US': 'Position Size',
    'pt-BR': 'Tamanho da Posição',
  },

  // User Management
  'users.title': {
    'en-US': 'User Management',
    'pt-BR': 'Gerenciamento de Usuários',
  },
  'users.description': {
    'en-US': 'Manage all users of the platform',
    'pt-BR': 'Gerencie todos os usuários da plataforma',
  },
  'users.list': {
    'en-US': 'User List',
    'pt-BR': 'Lista de Usuários',
  },
  'users.create': {
    'en-US': 'Create User',
    'pt-BR': 'Criar Usuário',
  },
  'users.name': {
    'en-US': 'Name',
    'pt-BR': 'Nome',
  },
  'users.email': {
    'en-US': 'Email',
    'pt-BR': 'Email',
  },
  'users.role': {
    'en-US': 'Role',
    'pt-BR': 'Papel',
  },
  'users.mentor': {
    'en-US': 'Mentor',
    'pt-BR': 'Mentor',
  },
  'users.mentored': {
    'en-US': 'Mentored',
    'pt-BR': 'Mentorado',
  },
  'users.assignMentor': {
    'en-US': 'Assign Mentor',
    'pt-BR': 'Atribuir Mentor',
  },
  'users.viewStatistics': {
    'en-US': 'View Statistics',
    'pt-BR': 'Ver Estatísticas',
  },
  'users.password': {
    'en-US': 'Password',
    'pt-BR': 'Senha',
  },
  'users.confirmPassword': {
    'en-US': 'Confirm Password',
    'pt-BR': 'Confirmar Senha',
  },

  // Login
  'login.title': {
    'en-US': 'Login',
    'pt-BR': 'Login',
  },
  'login.description': {
    'en-US': 'Login to access the platform',
    'pt-BR': 'Entre para acessar a plataforma',
  },
  'login.email': {
    'en-US': 'Email',
    'pt-BR': 'Email',
  },
  'login.password': {
    'en-US': 'Password',
    'pt-BR': 'Senha',
  },
  'login.submit': {
    'en-US': 'Login',
    'pt-BR': 'Entrar',
  },
  'login.error': {
    'en-US': 'Invalid email or password',
    'pt-BR': 'Email ou senha inválidos',
  },
};

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageType>(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    return (savedLanguage as LanguageType) || 'en-US';
  });

  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
