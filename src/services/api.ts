import { CampaignItem, NewsItem, DonationTransaction, HeroSettings, FaqItem, PaymentMethodItem } from '../types';
import { CAMPAIGNS_DATA, NEWS_DATA, INITIAL_DONATIONS, DEFAULT_HERO_SETTINGS, DEFAULT_FAQS_DATA, DEFAULT_PAYMENT_METHODS } from '../data/mockData';

const BASE_URL = '/api';

export interface DashboardStats {
  totalCollected: number;
  totalDonationTransactions: number;
  verifiedTransactions: number;
  pendingTransactions: number;
  totalCampaigns: number;
  totalNews: number;
}

export const api = {
  // Stats
  async getStats(): Promise<DashboardStats> {
    try {
      const res = await fetch(`${BASE_URL}/stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return await res.json();
    } catch {
      // Fallback calculation from local data
      const campaigns = Object.values(CAMPAIGNS_DATA);
      const totalCollected = campaigns.reduce((acc, c) => acc + c.collectedAmount, 0);
      return {
        totalCollected,
        totalDonationTransactions: INITIAL_DONATIONS.length,
        verifiedTransactions: INITIAL_DONATIONS.filter(d => d.status === 'VERIFIED').length,
        pendingTransactions: INITIAL_DONATIONS.filter(d => d.status === 'PENDING').length,
        totalCampaigns: campaigns.length,
        totalNews: NEWS_DATA.length
      };
    }
  },

  // Campaigns
  async getCampaigns(): Promise<CampaignItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/campaigns`);
      if (!res.ok) throw new Error('Failed to fetch campaigns');
      return await res.json();
    } catch {
      return Object.values(CAMPAIGNS_DATA);
    }
  },

  async createCampaign(campaign: Partial<CampaignItem>): Promise<CampaignItem> {
    const res = await fetch(`${BASE_URL}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaign),
    });
    if (!res.ok) throw new Error('Failed to create campaign');
    return await res.json();
  },

  async updateCampaign(id: string, campaign: Partial<CampaignItem>): Promise<CampaignItem> {
    const res = await fetch(`${BASE_URL}/campaigns/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaign),
    });
    if (!res.ok) throw new Error('Failed to update campaign');
    return await res.json();
  },

  async deleteCampaign(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/campaigns/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete campaign');
  },

  // Donations
  async getDonations(): Promise<DonationTransaction[]> {
    try {
      const res = await fetch(`${BASE_URL}/donations`);
      if (!res.ok) throw new Error('Failed to fetch donations');
      return await res.json();
    } catch {
      return INITIAL_DONATIONS;
    }
  },

  async createDonation(donation: Partial<DonationTransaction>): Promise<DonationTransaction> {
    const res = await fetch(`${BASE_URL}/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donation),
    });
    if (!res.ok) throw new Error('Failed to create donation');
    return await res.json();
  },

  async updateDonation(id: string, updates: Partial<DonationTransaction>): Promise<DonationTransaction> {
    const res = await fetch(`${BASE_URL}/donations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update donation');
    return await res.json();
  },

  async deleteDonation(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/donations/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete donation');
  },

  // News
  async getNews(): Promise<NewsItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/news`);
      if (!res.ok) throw new Error('Failed to fetch news');
      return await res.json();
    } catch {
      return NEWS_DATA;
    }
  },

  async createNews(news: Partial<NewsItem>): Promise<NewsItem> {
    const res = await fetch(`${BASE_URL}/news`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(news),
    });
    if (!res.ok) throw new Error('Failed to create news');
    return await res.json();
  },

  async updateNews(id: string, news: Partial<NewsItem>): Promise<NewsItem> {
    const res = await fetch(`${BASE_URL}/news/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(news),
    });
    if (!res.ok) throw new Error('Failed to update news');
    return await res.json();
  },

  async deleteNews(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/news/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete news');
  },

  // Admin Auth & Users
  async adminLogin(credentials: { username: string; password: string }): Promise<{ success: boolean; user: any; message?: string }> {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login gagal');
    }
    return data;
  },

  async adminRegister(userData: { username: string; password: string; fullName: string; role?: string; email?: string }): Promise<{ success: boolean; user: any; message?: string }> {
    const res = await fetch(`${BASE_URL}/admin/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Pendaftaran admin gagal');
    }
    return data;
  },

  async adminChangePassword(payload: { username: string; oldPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/admin/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal mengubah password');
    }
    return data;
  },

  async getAdminUsers(): Promise<any[]> {
    try {
      const res = await fetch(`${BASE_URL}/admin/users`);
      if (!res.ok) throw new Error('Failed to fetch admin users');
      return await res.json();
    } catch {
      return [
        { id: 'usr-1', username: 'admin', fullName: 'Administrator Pusat DT Peduli', role: 'Super Admin', email: 'admin@dtpeduli.org', createdAt: '18 Agustus 2026' }
      ];
    }
  },

  async deleteAdminUser(username: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/admin/users/${username}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal menghapus admin');
    }
  },

  // Hero Banner Settings
  async getHeroSettings(): Promise<HeroSettings> {
    try {
      const res = await fetch(`${BASE_URL}/hero`);
      if (!res.ok) throw new Error('Failed to fetch hero settings');
      return await res.json();
    } catch {
      const saved = localStorage.getItem('dt_hero_settings');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
      return DEFAULT_HERO_SETTINGS;
    }
  },

  async updateHeroSettings(settings: Partial<HeroSettings>): Promise<HeroSettings> {
    try {
      const res = await fetch(`${BASE_URL}/hero`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to update hero settings');
      const updated = await res.json();
      localStorage.setItem('dt_hero_settings', JSON.stringify(updated));
      return updated;
    } catch {
      const current = await this.getHeroSettings();
      const merged = { ...current, ...settings };
      localStorage.setItem('dt_hero_settings', JSON.stringify(merged));
      return merged;
    }
  },

  // FAQ Management
  async getFaqs(): Promise<FaqItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/faqs`);
      if (!res.ok) throw new Error('Failed to fetch FAQs');
      return await res.json();
    } catch {
      const saved = localStorage.getItem('dt_faqs_data');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
      return DEFAULT_FAQS_DATA;
    }
  },

  async createFaq(faq: { question: string; answer: string }): Promise<FaqItem> {
    try {
      const res = await fetch(`${BASE_URL}/faqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faq),
      });
      if (!res.ok) throw new Error('Failed to create FAQ');
      const newFaq = await res.json();
      
      const current = await this.getFaqs();
      const updated = [...current, newFaq];
      localStorage.setItem('dt_faqs_data', JSON.stringify(updated));
      return newFaq;
    } catch {
      const current = await this.getFaqs();
      const newFaq: FaqItem = {
        id: 'faq-' + Date.now(),
        question: faq.question,
        answer: faq.answer,
        order: current.length + 1
      };
      const updated = [...current, newFaq];
      localStorage.setItem('dt_faqs_data', JSON.stringify(updated));
      return newFaq;
    }
  },

  async updateFaq(id: string, faq: Partial<FaqItem>): Promise<FaqItem> {
    try {
      const res = await fetch(`${BASE_URL}/faqs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faq),
      });
      if (!res.ok) throw new Error('Failed to update FAQ');
      const updatedFaq = await res.json();

      const current = await this.getFaqs();
      const updated = current.map(f => f.id === id ? { ...f, ...updatedFaq } : f);
      localStorage.setItem('dt_faqs_data', JSON.stringify(updated));
      return updatedFaq;
    } catch {
      const current = await this.getFaqs();
      let updatedItem: any = null;
      const updated = current.map(f => {
        if (f.id === id) {
          updatedItem = { ...f, ...faq };
          return updatedItem;
        }
        return f;
      });
      localStorage.setItem('dt_faqs_data', JSON.stringify(updated));
      return updatedItem;
    }
  },

  async deleteFaq(id: string): Promise<void> {
    try {
      const res = await fetch(`${BASE_URL}/faqs/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete FAQ');
      const current = await this.getFaqs();
      const updated = current.filter(f => f.id !== id);
      localStorage.setItem('dt_faqs_data', JSON.stringify(updated));
    } catch {
      const current = await this.getFaqs();
      const updated = current.filter(f => f.id !== id);
      localStorage.setItem('dt_faqs_data', JSON.stringify(updated));
    }
  },

  async bulkUpdateFaqs(faqs: FaqItem[]): Promise<FaqItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/faqs-bulk`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqs),
      });
      if (!res.ok) throw new Error('Failed to update FAQs in bulk');
      const updated = await res.json();
      localStorage.setItem('dt_faqs_data', JSON.stringify(updated));
      return updated;
    } catch {
      localStorage.setItem('dt_faqs_data', JSON.stringify(faqs));
      return faqs;
    }
  },

  // Payment Methods Management
  async getPaymentMethods(): Promise<PaymentMethodItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/payment-methods`);
      if (!res.ok) throw new Error('Failed to fetch payment methods');
      return await res.json();
    } catch {
      const saved = localStorage.getItem('dt_payment_methods');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
      return DEFAULT_PAYMENT_METHODS;
    }
  },

  async createPaymentMethod(method: Partial<PaymentMethodItem>): Promise<PaymentMethodItem> {
    try {
      const res = await fetch(`${BASE_URL}/payment-methods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(method),
      });
      if (!res.ok) throw new Error('Failed to create payment method');
      const newMethod = await res.json();
      
      const current = await this.getPaymentMethods();
      const updated = [...current, newMethod];
      localStorage.setItem('dt_payment_methods', JSON.stringify(updated));
      return newMethod;
    } catch {
      const current = await this.getPaymentMethods();
      const newMethod: PaymentMethodItem = {
        id: method.id || 'pm-' + Date.now(),
        category: method.category || 'Transfer Bank Konvensional',
        name: method.name || 'Bank Baru',
        accountNumber: method.accountNumber || '',
        accountHolder: method.accountHolder || 'Yayasan DT Peduli',
        logoUrl: method.logoUrl || '',
        qrisImageUrl: method.qrisImageUrl || '',
        nmid: method.nmid || '',
        instructions: method.instructions || '',
        isActive: method.isActive !== undefined ? method.isActive : true,
        order: current.length + 1
      };
      const updated = [...current, newMethod];
      localStorage.setItem('dt_payment_methods', JSON.stringify(updated));
      return newMethod;
    }
  },

  async updatePaymentMethod(id: string, updates: Partial<PaymentMethodItem>): Promise<PaymentMethodItem> {
    try {
      const res = await fetch(`${BASE_URL}/payment-methods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update payment method');
      const updatedItem = await res.json();

      const current = await this.getPaymentMethods();
      const updated = current.map(m => m.id === id ? { ...m, ...updatedItem } : m);
      localStorage.setItem('dt_payment_methods', JSON.stringify(updated));
      return updatedItem;
    } catch {
      const current = await this.getPaymentMethods();
      let updatedItem: any = null;
      const updated = current.map(m => {
        if (m.id === id) {
          updatedItem = { ...m, ...updates };
          return updatedItem;
        }
        return m;
      });
      localStorage.setItem('dt_payment_methods', JSON.stringify(updated));
      return updatedItem;
    }
  },

  async deletePaymentMethod(id: string): Promise<void> {
    try {
      const res = await fetch(`${BASE_URL}/payment-methods/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete payment method');
      const current = await this.getPaymentMethods();
      const updated = current.filter(m => m.id !== id);
      localStorage.setItem('dt_payment_methods', JSON.stringify(updated));
    } catch {
      const current = await this.getPaymentMethods();
      const updated = current.filter(m => m.id !== id);
      localStorage.setItem('dt_payment_methods', JSON.stringify(updated));
    }
  },

  async bulkUpdatePaymentMethods(methods: PaymentMethodItem[]): Promise<PaymentMethodItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/payment-methods-bulk`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(methods),
      });
      if (!res.ok) throw new Error('Failed to update payment methods in bulk');
      const updated = await res.json();
      localStorage.setItem('dt_payment_methods', JSON.stringify(updated));
      return updated;
    } catch {
      localStorage.setItem('dt_payment_methods', JSON.stringify(methods));
      return methods;
    }
  }
};
