export type AdminRole = 'Super Admin' | 'Admin Keuangan' | 'Admin Redaksi & Media' | 'Admin Program';

export type AdminTab = 'campaigns' | 'donations' | 'news' | 'home' | 'payments' | 'accounts';

export type AdminAction =
  | 'manage_campaigns'
  | 'manage_news'
  | 'manage_home'
  | 'manage_donations'
  | 'manage_payments'
  | 'manage_accounts';

const ROLE_ALIASES: Record<string, AdminRole> = {
  'Super Admin': 'Super Admin',
  'Admin Keuangan': 'Admin Keuangan',
  'Admin Redaksi & Media': 'Admin Redaksi & Media',
  'Admin Program': 'Admin Redaksi & Media',
};

export const normalizeAdminRole = (role?: string): AdminRole => {
  return ROLE_ALIASES[role || ''] || 'Admin Redaksi & Media';
};

const TAB_ACCESS: Record<AdminRole, AdminTab[]> = {
  'Super Admin': ['donations', 'campaigns', 'news', 'home', 'payments', 'accounts'],
  'Admin Keuangan': ['donations', 'payments'],
  'Admin Redaksi & Media': ['campaigns', 'news', 'home'],
  'Admin Program': ['campaigns', 'news', 'home'],
};

const ACTION_ACCESS: Record<AdminRole, AdminAction[]> = {
  'Super Admin': [
    'manage_campaigns',
    'manage_news',
    'manage_home',
    'manage_donations',
    'manage_payments',
    'manage_accounts',
  ],
  'Admin Keuangan': ['manage_donations', 'manage_payments'],
  'Admin Redaksi & Media': ['manage_campaigns', 'manage_news', 'manage_home'],
  'Admin Program': ['manage_campaigns', 'manage_news', 'manage_home'],
};

export const getAccessibleTabs = (role?: string): AdminTab[] => {
  return TAB_ACCESS[normalizeAdminRole(role)];
};

export const canAccessTab = (role: string | undefined, tab: AdminTab): boolean => {
  return getAccessibleTabs(role).includes(tab);
};

export const canPerformAction = (role: string | undefined, action: AdminAction): boolean => {
  return ACTION_ACCESS[normalizeAdminRole(role)].includes(action);
};

export const getDefaultAdminTab = (role?: string): AdminTab => {
  return getAccessibleTabs(role)[0];
};
