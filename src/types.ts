export type ScreenId =
  | 'home_global'          // 1. Home - DT Peduli Prototype Fixed (Global Nav) — Initial Screen
  | 'kontak'               // 2. Kontak Kami - DT Peduli Consolidated Master UI
  | 'berita_global'        // 3. Berita - DT Peduli Prototype Fixed (Global Nav)
  | 'tentang'              // 4. Tentang Kami - DT Peduli Prototype Fixed
  | 'detail_yatim'         // 5. Bantuan untuk Anak Yatim Palestina - DT Peduli Master Sync
  | 'home_fixed'           // 6. Home - DT Peduli Prototype Fixed
  | 'detail_pendidikan'    // 7. Detail Campaign - Pendidikan untuk Anak-Anak Palestina (Master Sync)
  | 'donasi_global'        // 8. Donasi - DT Peduli Prototype Fixed (Global Nav)
  | 'detail_dasar'         // 9. Detail Campaign - Bantuan Kebutuhan Dasar Palestina (Master Sync)
  | 'berita_fixed'         // 10. Berita - DT Peduli Prototype Fixed
  | 'detail_air'           // 11. Detail Campaign - Air Bersih untuk Warga Gaza (Master Sync)
  | 'campaign_list'        // 12. Campaign - DT Peduli Prototype Fixed
  | 'bukti_donasi'         // 13. Bukti Donasi - DT Peduli Master UI Consistency
  | 'donasi_payment'       // 14. Donasi - DT Peduli Consolidated Master UI (Payment)
  | 'admin';               // 15. Admin Panel (Manajemen Campaign, Donasi & Berita)

export interface ScreenMeta {
  id: ScreenId;
  number: number;
  title: string;
  badge: string;
  category: 'Home' | 'Program/Campaign' | 'Donasi & Pembayaran' | 'Informasi & Berita';
}

export interface CampaignItem {
  id: string;
  screenId?: ScreenId;
  title: string;
  category: string;
  collectedAmount: number;
  targetAmount: number;
  donorsCount: number;
  daysRemaining: number;
  imageUrl: string;
  organizer: string;
  verified: boolean;
  location: string;
  description: string;
  story: string[];
  updates: Array<{
    date: string;
    title: string;
    description: string;
    imageUrl?: string;
  }>;
  recentDonors: Array<{
    name: string;
    amount: number;
    timeAgo: string;
    isAnonymous?: boolean;
    prayer?: string;
  }>;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  imageUrl: string;
  summary: string;
  content: string[];
  tags: string[];
}

export interface DonationTransaction {
  id: string;
  campaignTitle: string;
  campaignId: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  isAnonymous: boolean;
  amount: number;
  uniqueCode: number;
  totalAmount: number;
  paymentMethod: string;
  accountNumber: string;
  accountHolder: string;
  logoUrl?: string;
  qrisImageUrl?: string;
  prayer?: string;
  createdAt: string;
  status: 'PENDING' | 'VERIFIED' | 'FAILED';
  expiredAt: string;
}

export interface HeroSettings {
  imageUrl: string;
  badgeText?: string;
  captionTitle?: string;
  captionSubtitle?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface PaymentMethodItem {
  id: string;
  category: string;
  name: string;
  code?: string;
  accountNumber?: string;
  accountHolder?: string;
  logoUrl?: string;
  qrisImageUrl?: string;
  nmid?: string;
  instructions?: string;
  isActive: boolean;
  order?: number;
  icon?: string;
}
