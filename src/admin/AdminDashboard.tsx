import React, { useState, useEffect } from 'react';
import { CampaignItem, NewsItem, DonationTransaction, HeroSettings, FaqItem, PaymentMethodItem } from '../types';
import { api, DashboardStats } from '../services/api';
import { FALLBACK_IMAGE, DEFAULT_HERO_SETTINGS, DEFAULT_FAQS_DATA, DEFAULT_PAYMENT_METHODS } from '../data/mockData';
import { ImageUploadInput } from '../components/ImageUploadInput';
import { DtPeduliLogo } from '../components/DtPeduliLogo';

interface Props {
  currentUser: {
    id: string;
    username: string;
    fullName: string;
    role: string;
    email: string;
    createdAt?: string;
  };
  onLogout: () => void;
  onBackToPublic: () => void;
  onRefreshPublicData?: () => void;
}

type AdminTab = 'campaigns' | 'donations' | 'news' | 'accounts' | 'hero' | 'faqs' | 'payments';

export const AdminDashboard: React.FC<Props> = ({
  currentUser,
  onLogout,
  onBackToPublic,
  onRefreshPublicData
}) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('campaigns');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [donations, setDonations] = useState<DonationTransaction[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(DEFAULT_HERO_SETTINGS);
  const [faqs, setFaqs] = useState<FaqItem[]>(DEFAULT_FAQS_DATA);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodItem[]>(DEFAULT_PAYMENT_METHODS);
  const [savingHero, setSavingHero] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Search & Filters
  const [campaignSearch, setCampaignSearch] = useState('');
  const [donationSearch, setDonationSearch] = useState('');
  const [donationFilterStatus, setDonationFilterStatus] = useState<string>('ALL');
  const [newsSearch, setNewsSearch] = useState('');
  const [faqSearch, setFaqSearch] = useState('');
  const [paymentSearch, setPaymentSearch] = useState('');

  // Modals state
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Partial<CampaignItem> | null>(null);

  const [showDonationModal, setShowDonationModal] = useState(false);
  const [newDonationForm, setNewDonationForm] = useState<Partial<DonationTransaction>>({
    campaignId: 'yatim',
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    isAnonymous: false,
    amount: 100000,
    paymentMethod: 'QRIS (GoPay, OVO, ShopeePay)',
    status: 'VERIFIED',
    prayer: ''
  });

  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);

  // FAQ Modal state
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Partial<FaqItem> | null>(null);

  // Payment Method Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Partial<PaymentMethodItem> | null>(null);

  // Account Management Modals
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [changePasswordForm, setChangePasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [createAccountForm, setCreateAccountForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'Admin Program',
    email: ''
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, campsData, donData, newsData, usersData, heroData, faqsData, paymentsData] = await Promise.all([
        api.getStats(),
        api.getCampaigns(),
        api.getDonations(),
        api.getNews(),
        api.getAdminUsers(),
        api.getHeroSettings(),
        api.getFaqs(),
        api.getPaymentMethods()
      ]);
      setStats(statsData);
      setCampaigns(campsData);
      setDonations(donData);
      setNews(newsData);
      setAdminUsers(usersData);
      if (heroData) {
        setHeroSettings(heroData);
      }
      if (faqsData && Array.isArray(faqsData)) {
        setFaqs(faqsData);
      }
      if (paymentsData && Array.isArray(paymentsData)) {
        setPaymentMethods(paymentsData);
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat data dari server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHeroSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHero(true);
    try {
      const updated = await api.updateHeroSettings(heroSettings);
      setHeroSettings(updated);
      if (onRefreshPublicData) onRefreshPublicData();
      showToast('Banner Hero Beranda berhasil disimpan dan diperbarui!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan banner hero', 'error');
    } finally {
      setSavingHero(false);
    }
  };

  // --- FAQ ACTIONS ---
  const handleOpenCreateFaq = () => {
    setEditingFaq({
      question: '',
      answer: '',
      order: faqs.length + 1
    });
    setShowFaqModal(true);
  };

  const handleOpenEditFaq = (faq: FaqItem) => {
    setEditingFaq({ ...faq });
    setShowFaqModal(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !editingFaq.question || !editingFaq.answer) {
      showToast('Pertanyaan dan jawaban wajib diisi', 'error');
      return;
    }

    try {
      if (editingFaq.id && faqs.some(f => f.id === editingFaq.id)) {
        await api.updateFaq(editingFaq.id, editingFaq);
        showToast('FAQ berhasil diperbarui!');
      } else {
        await api.createFaq({
          question: editingFaq.question,
          answer: editingFaq.answer
        });
        showToast('FAQ baru berhasil ditambahkan!');
      }
      setShowFaqModal(false);
      setEditingFaq(null);
      await loadData();
      if (onRefreshPublicData) onRefreshPublicData();
    } catch {
      showToast('Gagal menyimpan FAQ', 'error');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pertanyaan FAQ ini?')) {
      try {
        await api.deleteFaq(id);
        showToast('FAQ berhasil dihapus');
        await loadData();
        if (onRefreshPublicData) onRefreshPublicData();
      } catch {
        showToast('Gagal menghapus FAQ', 'error');
      }
    }
  };

  const handleMoveFaq = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === faqs.length - 1)) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...faqs];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // Update order numbers
    const withUpdatedOrder = reordered.map((item, idx) => ({ ...item, order: idx + 1 }));
    setFaqs(withUpdatedOrder);

    try {
      await api.bulkUpdateFaqs(withUpdatedOrder);
      showToast('Urutan FAQ berhasil diperbarui', 'success');
      if (onRefreshPublicData) onRefreshPublicData();
    } catch {
      showToast('Gagal memperbarui urutan FAQ', 'error');
    }
  };

  // --- PAYMENT METHOD ACTIONS ---
  const handleOpenCreatePayment = () => {
    setEditingPayment({
      category: 'Transfer Bank Syariah',
      name: '',
      code: '',
      accountNumber: '',
      accountHolder: 'Yayasan Daarut Tauhiid Peduli',
      logoUrl: '',
      qrisImageUrl: '',
      nmid: 'ID1020039201923',
      instructions: 'Transfer sesuai nominal yang tertera.',
      isActive: true,
      order: paymentMethods.length + 1
    });
    setShowPaymentModal(true);
  };

  const handleOpenEditPayment = (item: PaymentMethodItem) => {
    setEditingPayment({ ...item });
    setShowPaymentModal(true);
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment || !editingPayment.name) {
      showToast('Nama metode pembayaran atau bank wajib diisi', 'error');
      return;
    }

    try {
      if (editingPayment.id && paymentMethods.some(p => p.id === editingPayment.id)) {
        await api.updatePaymentMethod(editingPayment.id, editingPayment);
        showToast('Metode pembayaran berhasil diperbarui!');
      } else {
        await api.createPaymentMethod(editingPayment);
        showToast('Metode pembayaran baru berhasil ditambahkan!');
      }
      setShowPaymentModal(false);
      setEditingPayment(null);
      await loadData();
      if (onRefreshPublicData) onRefreshPublicData();
    } catch {
      showToast('Gagal menyimpan metode pembayaran', 'error');
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus metode pembayaran ini?')) {
      try {
        await api.deletePaymentMethod(id);
        showToast('Metode pembayaran berhasil dihapus');
        await loadData();
        if (onRefreshPublicData) onRefreshPublicData();
      } catch {
        showToast('Gagal menghapus metode pembayaran', 'error');
      }
    }
  };

  const handleTogglePaymentActive = async (item: PaymentMethodItem) => {
    try {
      const updated = { ...item, isActive: !item.isActive };
      await api.updatePaymentMethod(item.id, updated);
      showToast(`${item.name} status diubah menjadi ${!item.isActive ? 'Aktif' : 'Non-aktif'}`);
      await loadData();
      if (onRefreshPublicData) onRefreshPublicData();
    } catch {
      showToast('Gagal mengubah status metode pembayaran', 'error');
    }
  };

  const handleMovePayment = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === paymentMethods.length - 1)) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...paymentMethods];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const withUpdatedOrder = reordered.map((item, idx) => ({ ...item, order: idx + 1 }));
    setPaymentMethods(withUpdatedOrder);

    try {
      await api.bulkUpdatePaymentMethods(withUpdatedOrder);
      showToast('Urutan metode pembayaran berhasil disimpan', 'success');
      if (onRefreshPublicData) onRefreshPublicData();
    } catch {
      showToast('Gagal memperbarui urutan metode pembayaran', 'error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // --- EXPORT & DOWNLOAD HANDLERS ---
  const handleExportDonationsCSV = () => {
    if (donations.length === 0) {
      showToast('Tidak ada data transaksi donasi untuk diunduh', 'error');
      return;
    }

    const headers = ['ID Transaksi', 'Tanggal', 'Nama Donatur', 'Anonim', 'Email', 'No. WA', 'Program Campaign', 'Nominal Pokok', 'Kode Unik', 'Total Donasi', 'Metode Pembayaran', 'Status', 'Doa/Pesan'];
    const rows = donations.map((d) => [
      `"${d.id}"`,
      `"${d.createdAt}"`,
      `"${d.donorName}"`,
      d.isAnonymous ? '"Ya"' : '"Tidak"',
      `"${d.donorEmail || '-'}"`,
      `"${d.donorPhone || '-'}"`,
      `"${d.campaignTitle.replace(/"/g, '""')}"`,
      d.amount,
      d.uniqueCode || 0,
      d.totalAmount || d.amount,
      `"${d.paymentMethod}"`,
      `"${d.status}"`,
      `"${(d.prayer || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Donasi_DTPeduli_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('File laporan transaksi donasi (.CSV) berhasil diunduh!');
  };

  const handleExportCampaignsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(campaigns, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = `Data_Campaign_DTPeduli_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('File backup data campaign (.JSON) berhasil diunduh!');
  };

  // --- PASSWORD & ACCOUNT HANDLERS ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
      showToast('Konfirmasi kata sandi baru tidak cocok', 'error');
      return;
    }
    if (changePasswordForm.newPassword.length < 6) {
      showToast('Kata sandi baru minimal 6 karakter', 'error');
      return;
    }

    try {
      await api.adminChangePassword({
        username: currentUser.username,
        oldPassword: changePasswordForm.oldPassword,
        newPassword: changePasswordForm.newPassword
      });
      showToast('Password berhasil diubah!');
      setShowChangePasswordModal(false);
      setChangePasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showToast(err.message || 'Gagal mengubah password', 'error');
    }
  };

  const handleCreateAdminAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createAccountForm.password !== createAccountForm.confirmPassword) {
      showToast('Konfirmasi password tidak cocok', 'error');
      return;
    }
    if (createAccountForm.password.length < 6) {
      showToast('Password minimal 6 karakter', 'error');
      return;
    }

    try {
      await api.adminRegister({
        username: createAccountForm.username,
        password: createAccountForm.password,
        fullName: createAccountForm.fullName,
        role: createAccountForm.role,
        email: createAccountForm.email
      });
      showToast(`Akun admin ${createAccountForm.username} berhasil dibuat!`);
      setShowCreateAccountModal(false);
      setCreateAccountForm({
        username: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        role: 'Admin Program',
        email: ''
      });
      await loadData();
    } catch (err: any) {
      showToast(err.message || 'Gagal membuat akun admin baru', 'error');
    }
  };

  const handleDeleteAdminAccount = async (username: string) => {
    if (username === currentUser.username) {
      showToast('Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.', 'error');
      return;
    }

    if (window.confirm(`Yakin ingin menghapus akun admin "${username}"?`)) {
      try {
        await api.deleteAdminUser(username);
        showToast(`Akun admin ${username} berhasil dihapus.`);
        await loadData();
      } catch (err: any) {
        showToast(err.message || 'Gagal menghapus admin', 'error');
      }
    }
  };

  // --- CAMPAIGN ACTIONS ---
  const handleOpenCreateCampaign = () => {
    setEditingCampaign({
      title: '',
      category: 'Kemanusiaan',
      targetAmount: 100000000,
      collectedAmount: 0,
      daysRemaining: 30,
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
      organizer: 'DT Peduli Kemanusiaan',
      verified: true,
      location: 'Gaza & Palestina',
      description: '',
      story: ['']
    });
    setShowCampaignModal(true);
  };

  const handleOpenEditCampaign = (camp: CampaignItem) => {
    setEditingCampaign({ ...camp });
    setShowCampaignModal(true);
  };

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign || !editingCampaign.title) {
      showToast('Judul campaign wajib diisi', 'error');
      return;
    }

    try {
      if (editingCampaign.id && campaigns.some(c => c.id === editingCampaign.id)) {
        await api.updateCampaign(editingCampaign.id, editingCampaign);
        showToast('Campaign berhasil diperbarui!');
      } else {
        await api.createCampaign(editingCampaign);
        showToast('Campaign baru berhasil ditambahkan!');
      }
      setShowCampaignModal(false);
      setEditingCampaign(null);
      await loadData();
      if (onRefreshPublicData) onRefreshPublicData();
    } catch {
      showToast('Gagal menyimpan campaign', 'error');
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus campaign ini?')) {
      try {
        await api.deleteCampaign(id);
        showToast('Campaign berhasil dihapus');
        await loadData();
        if (onRefreshPublicData) onRefreshPublicData();
      } catch {
        showToast('Gagal menghapus campaign', 'error');
      }
    }
  };

  // --- DONATION ACTIONS ---
  const handleSaveDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonationForm.amount || newDonationForm.amount <= 0) {
      showToast('Nominal donasi harus lebih dari 0', 'error');
      return;
    }

    const selectedCamp = campaigns.find(c => c.id === newDonationForm.campaignId);

    try {
      await api.createDonation({
        ...newDonationForm,
        campaignTitle: selectedCamp ? selectedCamp.title : 'Donasi Umum DT Peduli',
        donorName: newDonationForm.isAnonymous ? 'Hamba Allah' : (newDonationForm.donorName || 'Sahabat DT Peduli'),
      });
      showToast('Data donasi berhasil diinput!');
      setShowDonationModal(false);
      setNewDonationForm({
        campaignId: campaigns[0]?.id || 'yatim',
        donorName: '',
        donorEmail: '',
        donorPhone: '',
        isAnonymous: false,
        amount: 100000,
        paymentMethod: 'QRIS (GoPay, OVO, ShopeePay)',
        status: 'VERIFIED',
        prayer: ''
      });
      await loadData();
      if (onRefreshPublicData) onRefreshPublicData();
    } catch {
      showToast('Gagal menginput donasi', 'error');
    }
  };

  const handleToggleDonationStatus = async (donation: DonationTransaction) => {
    const nextStatus = donation.status === 'VERIFIED' ? 'PENDING' : 'VERIFIED';
    try {
      await api.updateDonation(donation.id, { status: nextStatus });
      showToast(`Status donasi #${donation.id} diubah menjadi ${nextStatus}`);
      await loadData();
      if (onRefreshPublicData) onRefreshPublicData();
    } catch {
      showToast('Gagal mengubah status donasi', 'error');
    }
  };

  const handleDeleteDonation = async (id: string) => {
    if (window.confirm('Hapus riwayat transaksi donasi ini?')) {
      try {
        await api.deleteDonation(id);
        showToast('Transaksi donasi dihapus');
        await loadData();
        if (onRefreshPublicData) onRefreshPublicData();
      } catch {
        showToast('Gagal menghapus transaksi', 'error');
      }
    }
  };

  // --- NEWS ACTIONS ---
  const handleOpenCreateNews = () => {
    setEditingNews({
      title: '',
      category: 'Kemanusiaan',
      author: 'Tim Media DT Peduli',
      readTime: '3 menit baca',
      imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
      summary: '',
      content: [''],
      tags: ['Kemanusiaan', 'Gaza']
    });
    setShowNewsModal(true);
  };

  const handleOpenEditNews = (article: NewsItem) => {
    setEditingNews({ ...article });
    setShowNewsModal(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews || !editingNews.title) {
      showToast('Judul berita wajib diisi', 'error');
      return;
    }

    try {
      if (editingNews.id && news.some(n => n.id === editingNews.id)) {
        await api.updateNews(editingNews.id, editingNews);
        showToast('Berita berhasil diperbarui!');
      } else {
        await api.createNews(editingNews);
        showToast('Berita baru berhasil diterbitkan!');
      }
      setShowNewsModal(false);
      setEditingNews(null);
      await loadData();
      if (onRefreshPublicData) onRefreshPublicData();
    } catch {
      showToast('Gagal menyimpan berita', 'error');
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus berita ini?')) {
      try {
        await api.deleteNews(id);
        showToast('Berita berhasil dihapus');
        await loadData();
        if (onRefreshPublicData) onRefreshPublicData();
      } catch {
        showToast('Gagal menghapus berita', 'error');
      }
    }
  };

  // Filtering
  const filteredCampaigns = campaigns.filter(c =>
    c.title.toLowerCase().includes(campaignSearch.toLowerCase()) ||
    c.category.toLowerCase().includes(campaignSearch.toLowerCase())
  );

  const filteredDonations = donations.filter(d => {
    const matchSearch =
      d.id.toLowerCase().includes(donationSearch.toLowerCase()) ||
      d.donorName.toLowerCase().includes(donationSearch.toLowerCase()) ||
      d.campaignTitle.toLowerCase().includes(donationSearch.toLowerCase());
    const matchStatus = donationFilterStatus === 'ALL' || d.status === donationFilterStatus;
    return matchSearch && matchStatus;
  });

  const filteredNews = news.filter(n =>
    n.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
    n.category.toLowerCase().includes(newsSearch.toLowerCase())
  );

  const filteredFaqs = faqs.filter(f =>
    f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const filteredPaymentMethods = paymentMethods.filter(p =>
    p.name.toLowerCase().includes(paymentSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(paymentSearch.toLowerCase()) ||
    (p.accountNumber && p.accountNumber.toLowerCase().includes(paymentSearch.toLowerCase())) ||
    (p.code && p.code.toLowerCase().includes(paymentSearch.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col select-none">
      {/* Toast Alert */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-white transition-all ${
            notification.type === 'success' ? 'bg-green-700' : 'bg-red-700'
          }`}
          style={{ fontFamily: "'Baloo 2', sans-serif" }}
        >
          <span className="material-symbols-outlined text-[20px]">
            {notification.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span className="font-bold text-sm">{notification.message}</span>
        </div>
      )}

      {/* Admin Professional Modern Topbar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 flex justify-between items-center gap-4">
          
          {/* Brand Logo & System Label */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={onBackToPublic}
              className="flex items-center focus:outline-hidden cursor-pointer"
              title="Kunjungi Halaman Depan"
            >
              <DtPeduliLogo size="sm" />
            </button>

            <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 hidden sm:inline" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                Admin Portal
              </span>
              <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                {currentUser.role}
              </span>
            </div>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2.5 pr-2 border-r border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-primary flex items-center justify-center font-bold text-xs">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-tight">{currentUser.fullName}</span>
                <span className="text-[10px] text-slate-400">@{currentUser.username}</span>
              </div>
            </div>

            <button
              onClick={() => setShowChangePasswordModal(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 transition cursor-pointer"
              title="Ubah Password"
            >
              <span className="material-symbols-outlined text-[16px]">lock_reset</span>
              <span className="hidden md:inline">Ubah Password</span>
            </button>

            <button
              onClick={onBackToPublic}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 transition cursor-pointer"
              title="Kunjungi Website Publik"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span className="hidden md:inline">Lihat Web Publik</span>
            </button>

            <button
              onClick={onLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-200 flex items-center gap-1.5 transition cursor-pointer"
              title="Keluar dari Admin Portal"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span className="hidden md:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Left Sidebar & Right Content */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-6 py-5 flex flex-col md:flex-row gap-5 items-start">
        
        {/* LEFT SIDEBAR NAVIGATION (COMPACT & SLIM) */}
        <aside className="w-full md:w-52 lg:w-56 shrink-0 flex flex-col gap-3 md:sticky md:top-20">
          
          {/* Main Navigation Card */}
          <div className="bg-white border border-slate-200/90 rounded-[14px] p-2 shadow-2xs flex flex-col gap-1 w-full">
            <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Navigasi Admin
            </div>

            <button
              onClick={() => setCurrentTab('campaigns')}
              className={`w-full px-2.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                currentTab === 'campaigns'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span className={`material-symbols-outlined text-[18px] shrink-0 ${currentTab === 'campaigns' ? 'text-secondary' : 'text-primary'}`}>
                campaign
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-bold leading-tight truncate">1. Kelola Campaign</div>
                <div className={`text-[10px] font-normal truncate ${currentTab === 'campaigns' ? 'text-white/80' : 'text-slate-400'}`}>
                  {campaigns.length} Program
                </div>
              </div>
            </button>

            <button
              onClick={() => setCurrentTab('donations')}
              className={`w-full px-2.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                currentTab === 'donations'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span className={`material-symbols-outlined text-[18px] shrink-0 ${currentTab === 'donations' ? 'text-secondary' : 'text-primary'}`}>
                payments
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-bold leading-tight truncate">2. Data Donasi</div>
                <div className={`text-[10px] font-normal truncate ${currentTab === 'donations' ? 'text-white/80' : 'text-slate-400'}`}>
                  {donations.length} Transaksi
                </div>
              </div>
            </button>

            <button
              onClick={() => setCurrentTab('news')}
              className={`w-full px-2.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                currentTab === 'news'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span className={`material-symbols-outlined text-[18px] shrink-0 ${currentTab === 'news' ? 'text-secondary' : 'text-primary'}`}>
                article
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-bold leading-tight truncate">3. Kelola Berita</div>
                <div className={`text-[10px] font-normal truncate ${currentTab === 'news' ? 'text-white/80' : 'text-slate-400'}`}>
                  {news.length} Berita
                </div>
              </div>
            </button>

            <button
              onClick={() => setCurrentTab('accounts')}
              className={`w-full px-2.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                currentTab === 'accounts'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span className={`material-symbols-outlined text-[18px] shrink-0 ${currentTab === 'accounts' ? 'text-secondary' : 'text-primary'}`}>
                manage_accounts
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-bold leading-tight truncate">4. Akun Admin</div>
                <div className={`text-[10px] font-normal truncate ${currentTab === 'accounts' ? 'text-white/80' : 'text-slate-400'}`}>
                  {adminUsers.length} Petugas
                </div>
              </div>
            </button>

            <div className="my-1 border-t border-slate-100"></div>

            <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Konten & Pembayaran
            </div>

            <button
              onClick={() => setCurrentTab('hero')}
              className={`w-full px-2.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                currentTab === 'hero'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span className={`material-symbols-outlined text-[18px] shrink-0 ${currentTab === 'hero' ? 'text-secondary' : 'text-primary'}`}>
                image
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-bold leading-tight truncate">5. Banner Beranda</div>
                <div className={`text-[10px] font-normal truncate ${currentTab === 'hero' ? 'text-white/80' : 'text-slate-400'}`}>
                  Foto & Hero
                </div>
              </div>
            </button>

            <button
              onClick={() => setCurrentTab('faqs')}
              className={`w-full px-2.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                currentTab === 'faqs'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span className={`material-symbols-outlined text-[18px] shrink-0 ${currentTab === 'faqs' ? 'text-secondary' : 'text-primary'}`}>
                quiz
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-bold leading-tight truncate">6. FAQ Beranda</div>
                <div className={`text-[10px] font-normal truncate ${currentTab === 'faqs' ? 'text-white/80' : 'text-slate-400'}`}>
                  {faqs.length} Tanya Jawab
                </div>
              </div>
            </button>

            <button
              onClick={() => setCurrentTab('payments')}
              className={`w-full px-2.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                currentTab === 'payments'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span className={`material-symbols-outlined text-[18px] shrink-0 ${currentTab === 'payments' ? 'text-secondary' : 'text-primary'}`}>
                account_balance
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-bold leading-tight truncate">7. Rekening & QRIS</div>
                <div className={`text-[10px] font-normal truncate ${currentTab === 'payments' ? 'text-white/80' : 'text-slate-400'}`}>
                  {paymentMethods.length} Metode Bayar
                </div>
              </div>
            </button>

            <div className="my-1.5 border-t border-slate-100"></div>

            <button
              onClick={onBackToPublic}
              className="w-full px-2.5 py-2 rounded-xl text-primary hover:bg-primary/10 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              <span className="truncate">Kunjungi Web Publik</span>
            </button>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 w-full flex flex-col gap-6">
          
          {/* Overview Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-white border border-slate-200 rounded-[14px] p-4 shadow-xs flex flex-col gap-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-caption text-[11px] font-bold uppercase">Total Donasi Terkumpul</span>
                <span className="material-symbols-outlined text-primary text-[18px]">account_balance_wallet</span>
              </div>
              <div className="font-h3 text-xl font-bold text-primary truncate" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                {stats ? formatRupiah(stats.totalCollected) : '...'}
              </div>
              <span className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                Real-time Sync
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-[14px] p-4 shadow-xs flex flex-col gap-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-caption text-[11px] font-bold uppercase">Total Transaksi</span>
                <span className="material-symbols-outlined text-primary text-[18px]">receipt_long</span>
              </div>
              <div className="font-h3 text-xl font-bold text-slate-800" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                {stats ? stats.totalDonationTransactions : 0} Transaksi
              </div>
              <span className="text-[11px] text-slate-500 truncate">
                {stats?.verifiedTransactions || 0} Terverifikasi · {stats?.pendingTransactions || 0} Menunggu
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-[14px] p-4 shadow-xs flex flex-col gap-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-caption text-[11px] font-bold uppercase">Program Campaign</span>
                <span className="material-symbols-outlined text-primary text-[18px]">volunteer_activism</span>
              </div>
              <div className="font-h3 text-xl font-bold text-slate-800" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                {stats ? stats.totalCampaigns : 0} Program
              </div>
              <span className="text-[11px] text-slate-500">Katalog Program Aktif</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-[14px] p-4 shadow-xs flex flex-col gap-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-caption text-[11px] font-bold uppercase">FAQ & Bantuan</span>
                <span className="material-symbols-outlined text-primary text-[18px]">quiz</span>
              </div>
              <div className="font-h3 text-xl font-bold text-slate-800" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                {faqs.length} Pertanyaan
              </div>
              <span className="text-[11px] text-slate-500">Tampil di Beranda</span>
            </div>
          </div>

          {/* TAB 1: CAMPAIGNS */}
          {currentTab === 'campaigns' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Cari judul campaign atau kategori..."
                  value={campaignSearch}
                  onChange={(e) => setCampaignSearch(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCampaignsJSON}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 h-[44px] px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  title="Unduh file backup data campaign"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Unduh Data Campaign (.JSON)</span>
                </button>
                <button
                  onClick={handleOpenCreateCampaign}
                  className="bg-primary hover:bg-primary-container text-white h-[44px] px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
                  style={{ fontFamily: "'Baloo 2', sans-serif" }}
                >
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  <span>+ Tambah Campaign Baru</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredCampaigns.map((camp) => {
                const pct = Math.min(100, Math.round((camp.collectedAmount / (camp.targetAmount || 1)) * 100));
                return (
                  <div
                    key={camp.id}
                    className="bg-white border border-slate-200 rounded-[14px] p-5 shadow-xs flex flex-col gap-4 hover:border-primary/40 transition-all"
                  >
                    <div className="flex gap-4 items-start">
                      <img
                        src={camp.imageUrl}
                        alt={camp.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100"
                      />
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-primary-fixed text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
                            {camp.category}
                          </span>
                          {camp.verified && (
                            <span className="text-xs text-green-700 font-bold flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[14px]">verified</span>
                              Terverifikasi
                            </span>
                          )}
                        </div>
                        <h3 className="font-h4 text-sm font-bold text-slate-900 line-clamp-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                          {camp.title}
                        </h3>
                        <span className="text-xs text-slate-500">ID: {camp.id} · {camp.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 bg-slate-50 p-3 rounded-xl">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-600">Terkumpul: <b className="text-primary">{formatRupiah(camp.collectedAmount)}</b></span>
                        <span className="text-slate-800">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Target: {formatRupiah(camp.targetAmount)}</span>
                        <span>{camp.donorsCount} Donatur · Sisa {camp.daysRemaining} hari</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleOpenEditCampaign(camp)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(camp.id)}
                        className="text-red-600 hover:bg-red-50 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: DONATIONS */}
        {currentTab === 'donations' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Cari ID transaksi, nama donatur, program..."
                    value={donationSearch}
                    onChange={(e) => setDonationSearch(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <select
                  value={donationFilterStatus}
                  onChange={(e) => setDonationFilterStatus(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary font-semibold text-slate-700"
                >
                  <option value="ALL">Semua Status Donasi</option>
                  <option value="VERIFIED">Terverifikasi (VERIFIED)</option>
                  <option value="PENDING">Menunggu Pembayaran (PENDING)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportDonationsCSV}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white h-[44px] px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  title="Unduh laporan transaksi donasi ke format CSV/Excel"
                >
                  <span className="material-symbols-outlined text-[18px]">file_download</span>
                  <span>Unduh Laporan Donasi (.CSV / Excel)</span>
                </button>
                <button
                  onClick={() => setShowDonationModal(true)}
                  className="bg-primary hover:bg-primary-container text-white h-[44px] px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
                  style={{ fontFamily: "'Baloo 2', sans-serif" }}
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  <span>+ Input Donasi Manual</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-xs uppercase">
                    <tr>
                      <th className="py-3.5 px-4">ID Transaksi & Tanggal</th>
                      <th className="py-3.5 px-4">Nama Donatur</th>
                      <th className="py-3.5 px-4">Program Campaign</th>
                      <th className="py-3.5 px-4">Nominal</th>
                      <th className="py-3.5 px-4">Metode Bayar</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDonations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500">
                          Tidak ada data transaksi donasi yang sesuai.
                        </td>
                      </tr>
                    ) : (
                      filteredDonations.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-bold text-primary text-xs">{d.id}</div>
                            <div className="text-[11px] text-slate-500">{d.createdAt}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-800">{d.donorName}</div>
                            {d.isAnonymous && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">Anonim</span>}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800 line-clamp-1 max-w-[200px]">{d.campaignTitle}</div>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap font-bold text-primary">
                            {formatRupiah(d.totalAmount || d.amount)}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600">
                            {d.paymentMethod}
                          </td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleToggleDonationStatus(d)}
                              className={`text-xs px-3 py-1 rounded-full font-bold cursor-pointer transition-colors ${
                                d.status === 'VERIFIED'
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              }`}
                            >
                              {d.status === 'VERIFIED' ? '✓ Terverifikasi' : '⏳ Menunggu'}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteDonation(d.id)}
                              className="p-1.5 rounded hover:bg-red-50 text-red-600 transition cursor-pointer"
                              title="Hapus Transaksi"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NEWS */}
        {currentTab === 'news' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Cari judul artikel berita atau kategori..."
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <button
                onClick={handleOpenCreateNews}
                className="bg-primary hover:bg-primary-container text-white h-[44px] px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                <span className="material-symbols-outlined text-[20px]">edit_document</span>
                <span>+ Tulis Berita Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredNews.map((article) => (
                <div
                  key={article.id}
                  className="bg-white border border-slate-200 rounded-[14px] p-5 shadow-xs flex flex-col gap-3 hover:border-primary/40 transition-all"
                >
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                    className="w-full h-40 rounded-xl object-cover bg-slate-100"
                  />
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="bg-primary-fixed text-primary font-bold px-2.5 py-0.5 rounded-full">
                      {article.category}
                    </span>
                    <span>{article.date}</span>
                  </div>
                  <h3 className="font-h4 text-sm font-bold text-slate-900 line-clamp-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{article.summary}</p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                    <span className="text-[11px] text-slate-500">Oleh: {article.author}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditNews(article)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg cursor-pointer transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNews(article.id)}
                        className="text-red-600 hover:bg-red-50 text-xs font-bold px-2 py-1 rounded-lg cursor-pointer transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ACCOUNTS */}
        {currentTab === 'accounts' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[14px] border border-slate-200 shadow-xs">
              <div className="flex flex-col gap-1">
                <h3 className="font-h3 text-h3 text-slate-900 font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  Manajemen Akun & Keamanan Akses
                </h3>
                <p className="text-xs text-slate-500">
                  Kelola staf yang memiliki hak akses dashboard, ganti kata sandi admin, dan buat akun baru.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setShowChangePasswordModal(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 h-[40px] px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                  <span>Ganti Password Saya</span>
                </button>

                <button
                  onClick={() => setShowCreateAccountModal(true)}
                  className="bg-primary hover:bg-primary-container text-white h-[40px] px-5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  style={{ fontFamily: "'Baloo 2', sans-serif" }}
                >
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  <span>+ Buat Akun Admin Baru</span>
                </button>
              </div>
            </div>

            {/* List */}
            <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800">Daftar Administrator Terdaftar ({adminUsers.length})</span>
                <span className="text-xs text-slate-500">Akses Database Aktif</span>
              </div>

              <div className="divide-y divide-slate-100">
                {adminUsers.map((user) => {
                  const isCurrent = user.username === currentUser.username;
                  return (
                    <div key={user.id} className="p-4.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-base">
                          {user.fullName ? user.fullName.charAt(0) : 'A'}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{user.fullName}</span>
                            <span className="text-xs text-slate-500">(@{user.username})</span>
                            {isCurrent && (
                              <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Akun Anda Saat Ini
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                            <span className="text-primary font-semibold">{user.role}</span>
                            <span>·</span>
                            <span>{user.email}</span>
                            <span>·</span>
                            <span>Dibuat: {user.createdAt || '18 Agustus 2026'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {isCurrent ? (
                          <button
                            onClick={() => setShowChangePasswordModal(true)}
                            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                          >
                            Ubah Password
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDeleteAdminAccount(user.username)}
                            className="text-xs text-red-600 hover:bg-red-50 font-bold px-3 py-1.5 rounded-lg border border-red-200 transition cursor-pointer flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                            <span>Hapus Akun</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: HERO BANNER MANAGEMENT */}
        {currentTab === 'hero' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-[16px] p-6 shadow-xs flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-h3 text-xl font-bold text-slate-900" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                    Pengaturan Banner Hero Beranda
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ubah foto banner utama halaman depan website DT Peduli. Perubahan langsung tersinkronisasi ke pengunjung.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setHeroSettings(DEFAULT_HERO_SETTINGS);
                      showToast('Nilai formulir dikembalikan ke default. Klik Simpan untuk menerapkan.', 'success');
                    }}
                    className="text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                    <span>Reset Default</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveHeroSettings}
                    disabled={savingHero}
                    className="bg-primary hover:bg-primary-container text-white px-5 py-2 rounded-xl font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    style={{ fontFamily: "'Baloo 2', sans-serif" }}
                  >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>{savingHero ? 'Menyimpan...' : 'Simpan Banner Hero'}</span>
                  </button>
                </div>
              </div>

              {/* Live Preview Section */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">visibility</span>
                    Pratinjau Langsung (Live Preview)
                  </span>
                  <span className="text-[11px] text-slate-400">Tampilan persis seperti yang dilihat pengunjung</span>
                </div>

                <div className="w-full h-[260px] sm:h-[340px] md:h-[400px] rounded-[18px] overflow-hidden relative shadow-md bg-slate-950 border border-slate-200 group">
                  <img
                    src={heroSettings.imageUrl || DEFAULT_HERO_SETTINGS.imageUrl}
                    alt="Preview Hero Banner"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6 md:p-8">
                    <div className="flex flex-col gap-1 max-w-xl">
                      {heroSettings.badgeText && (
                        <span className="inline-flex items-center gap-1 bg-[#fcd400] text-[#00296d] font-bold text-[11px] px-3 py-0.5 rounded-full uppercase tracking-wider self-start shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00296d]"></span>
                          {heroSettings.badgeText}
                        </span>
                      )}
                      <h4 className="text-xl sm:text-2xl md:text-3xl text-white font-bold drop-shadow-md leading-tight mt-1" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                        {heroSettings.captionTitle || 'Bersama Membangun Harapan, Menebar Manfaat'}
                      </h4>
                      {heroSettings.captionSubtitle && (
                        <p className="text-xs sm:text-sm text-slate-200 drop-shadow-sm line-clamp-2 mt-0.5">
                          {heroSettings.captionSubtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form & Presets Grid */}
              <form onSubmit={handleSaveHeroSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                {/* Form Controls */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <ImageUploadInput
                    label="Upload Foto Banner Hero"
                    value={heroSettings.imageUrl}
                    onChange={(url) => setHeroSettings({ ...heroSettings, imageUrl: url })}
                    required
                    aspectRatio="banner"
                    helperText="Pilih file foto dari perangkat atau paste link gambar untuk banner utama beranda"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-800">Teks Badge / Kategori</label>
                      <input
                        type="text"
                        placeholder="Contoh: Aksi Kemanusiaan DT Peduli"
                        value={heroSettings.badgeText || ''}
                        onChange={(e) => setHeroSettings({ ...heroSettings, badgeText: e.target.value })}
                        className="border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-800">Judul Utama Banner</label>
                      <input
                        type="text"
                        placeholder="Contoh: Bersama Membangun Harapan"
                        value={heroSettings.captionTitle || ''}
                        onChange={(e) => setHeroSettings({ ...heroSettings, captionTitle: e.target.value })}
                        className="border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-800">Subjudul / Deskripsi Singkat</label>
                    <textarea
                      rows={2}
                      placeholder="Tuliskan keterangan singkat atau pesan kemanusiaan..."
                      value={heroSettings.captionSubtitle || ''}
                      onChange={(e) => setHeroSettings({ ...heroSettings, captionSubtitle: e.target.value })}
                      className="border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={savingHero}
                      className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
                      style={{ fontFamily: "'Baloo 2', sans-serif" }}
                    >
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span>{savingHero ? 'Menyimpan...' : 'Simpan & Terapkan Banner'}</span>
                    </button>
                  </div>
                </div>

                {/* Preset Galeri Pilihan Cepat */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <span className="material-symbols-outlined text-[#fcd400] text-[18px]">photo_library</span>
                    <span>Pilihan Cepat Foto Tema Kemanusiaan:</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Klik salah satu foto di bawah untuk langsung memilihnya:</p>

                  <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[320px] pr-1">
                    {[
                      {
                        title: 'Penyaluran Bantuan Lapangan Gaza',
                        url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=85',
                        badge: 'Relawan Gaza'
                      },
                      {
                        title: 'Senyum Anak-Anak & Yatim Palestina',
                        url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1600&q=85',
                        badge: 'Santunan Anak Yatim'
                      },
                      {
                        title: 'Distribusi Truk Tangki Air Bersih',
                        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1600&q=85',
                        badge: 'Air Bersih & Sanitasi'
                      },
                      {
                        title: 'Layanan Medis & RS Darurat',
                        url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1600&q=85',
                        badge: 'Medis & Obat-obatan'
                      },
                      {
                        title: 'Aksi Gotong Royong Relawan Kemanusiaan',
                        url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=85',
                        badge: 'Pemberdayaan Umat'
                      }
                    ].map((item, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setHeroSettings({
                            ...heroSettings,
                            imageUrl: item.url,
                            badgeText: item.badge
                          });
                          showToast(`Foto '${item.title}' dipilih`, 'success');
                        }}
                        className={`flex items-center gap-3 p-2 rounded-lg border text-left transition cursor-pointer ${
                          heroSettings.imageUrl === item.url
                            ? 'bg-primary/10 border-primary shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-14 h-11 rounded-md object-cover flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-xs text-slate-800 truncate">{item.title}</span>
                          <span className="text-[10px] text-primary font-medium">{item.badge}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 6: FAQ MANAGEMENT */}
        {currentTab === 'faqs' && (
          <div className="flex flex-col gap-6">
            {/* Header and Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-5 rounded-[16px] border border-slate-200 shadow-xs">
              <div className="flex flex-col">
                <h2 className="font-h3 text-xl font-bold text-slate-800" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  Kelola Tanya Jawab (FAQ) Beranda
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftar pertanyaan dan jawaban bantuan yang ditampilkan langsung pada section FAQ di halaman Beranda.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Cari FAQ..."
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary transition"
                  />
                </div>

                <button
                  onClick={handleOpenCreateFaq}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer whitespace-nowrap"
                  style={{ fontFamily: "'Baloo 2', sans-serif" }}
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Tambah FAQ Baru</span>
                </button>
              </div>
            </div>

            {/* Main FAQ List */}
            <div className="flex flex-col gap-4">
              {filteredFaqs.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-[16px] p-12 text-center flex flex-col items-center justify-center gap-3 shadow-xs">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-[32px]">quiz</span>
                  </div>
                  <h3 className="font-bold text-slate-700 text-sm">Tidak ada data FAQ yang ditemukan</h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    {faqSearch ? `Tidak ada FAQ dengan kata kunci "${faqSearch}"` : 'Belum ada pertanyaan FAQ yang ditambahkan.'}
                  </p>
                  <button
                    onClick={handleOpenCreateFaq}
                    className="mt-2 bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    Tambah Pertanyaan Pertama
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredFaqs.map((faq, index) => (
                    <div
                      key={faq.id}
                      className="bg-white border border-slate-200 hover:border-slate-300 rounded-[14px] p-4 sm:p-5 shadow-xs transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      {/* Left: Reorder & Number & Question Content */}
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        {/* Order controls */}
                        <div className="flex sm:flex-col items-center gap-1 shrink-0 bg-slate-50 border border-slate-200 p-1 rounded-lg">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveFaq(index, 'up')}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="Pindah ke Atas"
                          >
                            <span className="material-symbols-outlined text-[16px]">keyboard_arrow_up</span>
                          </button>
                          <span className="text-[11px] font-bold text-primary px-1">
                            #{faq.order || index + 1}
                          </span>
                          <button
                            type="button"
                            disabled={index === faqs.length - 1}
                            onClick={() => handleMoveFaq(index, 'down')}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="Pindah ke Bawah"
                          >
                            <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
                          </button>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col min-w-0 flex-1">
                          <h4 className="font-bold text-sm text-slate-800 leading-snug flex items-center gap-2">
                            <span>{faq.question}</span>
                          </h4>
                          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleOpenEditFaq(faq)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 transition cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFaq(faq.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-200 flex items-center gap-1 transition cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live FAQ Preview Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-[16px] p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">visibility</span>
                <h3 className="font-bold text-sm text-slate-800" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  Pratinjau Live FAQ di Halaman Beranda
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Berikut adalah tampilan accordion bantuan yang dapat diklik oleh pengunjung website:
              </p>
              
              <div className="space-y-2.5 max-w-3xl">
                {faqs.map((f) => (
                  <details key={f.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                    <summary className="flex justify-between items-center p-4 cursor-pointer font-bold text-slate-800 text-xs hover:text-primary transition list-none">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] flex items-center justify-center font-bold shrink-0">
                          ?
                        </span>
                        <span>{f.question}</span>
                      </span>
                      <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform text-[18px] shrink-0">
                        expand_more
                      </span>
                    </summary>
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/50">
                      {f.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PAYMENT METHODS & REKENING / QRIS */}
        {currentTab === 'payments' && (
          <div className="flex flex-col gap-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Cari nama bank, rekening, atau kategori..."
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="button"
                onClick={handleOpenCreatePayment}
                className="bg-primary hover:bg-primary-container text-white h-[44px] px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                <span>+ Tambah Rekening / Metode</span>
              </button>
            </div>

            {/* Payment Methods List Cards */}
            <div className="bg-white border border-slate-200 rounded-[16px] p-5 md:p-6 shadow-xs flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-h3 text-base md:text-lg font-bold text-slate-900" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                    Daftar Metode Pembayaran ({filteredPaymentMethods.length})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Atur rekening bank, logo instansi, kode QRIS, dan panduan transfer untuk donatur.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>{paymentMethods.filter(p => p.isActive).length} Aktif</span>
                  <span className="text-slate-300">·</span>
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                  <span>{paymentMethods.filter(p => !p.isActive).length} Non-aktif</span>
                </div>
              </div>

              {filteredPaymentMethods.length === 0 ? (
                <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-[48px]">account_balance</span>
                  <span className="text-sm font-semibold">Tidak ada metode pembayaran yang cocok</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPaymentMethods.map((method, index) => {
                    const isQris = method.category.includes('QRIS') || method.code?.toUpperCase().includes('QRIS');
                    return (
                      <div
                        key={method.id}
                        className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between gap-4 transition shadow-xs ${
                          method.isActive
                            ? 'bg-white border-slate-200 hover:border-primary/50'
                            : 'bg-slate-50/80 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Logo or Icon */}
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-2xs">
                              {method.logoUrl ? (
                                <img
                                  src={method.logoUrl}
                                  alt={method.name}
                                  className="w-full h-full object-contain"
                                  referrerPolicy="no-referrer"
                                />
                              ) : isQris ? (
                                <span className="material-symbols-outlined text-primary text-[28px]">qr_code_2</span>
                              ) : (
                                <span className="material-symbols-outlined text-primary text-[28px]">account_balance</span>
                              )}
                            </div>

                            <div className="flex flex-col min-w-0">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {method.category}
                              </span>
                              <h4 className="font-bold text-slate-800 text-sm truncate" title={method.name}>
                                {method.name}
                              </h4>
                              {method.code && (
                                <span className="text-[11px] font-semibold text-primary">
                                  Kode: {method.code}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Order & Active Status */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMovePayment(index, 'up')}
                              disabled={index === 0}
                              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                              title="Pindah ke Atas"
                            >
                              <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMovePayment(index, 'down')}
                              disabled={index === paymentMethods.length - 1}
                              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                              title="Pindah ke Bawah"
                            >
                              <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                            </button>
                          </div>
                        </div>

                        {/* Account Details or QRIS Info */}
                        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col gap-1.5 text-xs">
                          {isQris ? (
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <span className="text-slate-500 font-medium">NMID:</span>{' '}
                                <span className="font-mono font-bold text-slate-800">{method.nmid || 'ID1020039201923'}</span>
                              </div>
                              {method.qrisImageUrl && (
                                <div className="w-9 h-9 rounded-md border border-slate-200 overflow-hidden shrink-0 bg-white p-0.5" title="Foto QR Code Terpasang">
                                  <img
                                    src={method.qrisImageUrl}
                                    alt="QRIS Preview"
                                    className="w-full h-full object-contain"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500">Nomor Rekening:</span>
                                <span className="font-mono font-bold text-primary text-sm">{method.accountNumber || '-'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500">Atas Nama:</span>
                                <span className="font-semibold text-slate-700">{method.accountHolder || 'Yayasan DT Peduli'}</span>
                              </div>
                            </>
                          )}
                          {method.instructions && (
                            <p className="text-[11px] text-slate-500 italic mt-0.5 line-clamp-1">
                              "{method.instructions}"
                            </p>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => handleTogglePaymentActive(method)}
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                              method.isActive
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${method.isActive ? 'bg-green-600' : 'bg-slate-500'}`}></span>
                            <span>{method.isActive ? 'Aktif' : 'Non-aktif'}</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditPayment(method)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 transition cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[15px]">edit</span>
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePayment(method.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-red-200 flex items-center gap-1 transition cursor-pointer"
                              title="Hapus metode ini"
                            >
                              <span className="material-symbols-outlined text-[15px]">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Preview Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-[16px] p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">info</span>
                <span>Informasi Integrasi Pembayaran</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap logo bank dan kode QRIS yang Anda upload akan langsung tampil secara interaktif pada form donasi donatur publik serta halaman instruksi transfer pembayaran secara instan.
              </p>
            </div>
          </div>
        )}

        </main>
      </div>

      {/* MODAL: CHANGE PASSWORD */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] max-w-md w-full p-6 flex flex-col gap-5 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">lock_reset</span>
                <h3 className="font-h4 text-base font-bold text-slate-900" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  Ubah Password Akun ({currentUser.username})
                </h3>
              </div>
              <button onClick={() => setShowChangePasswordModal(false)} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Password Lama *</label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan password lama"
                  value={changePasswordForm.oldPassword}
                  onChange={(e) => setChangePasswordForm({ ...changePasswordForm, oldPassword: e.target.value })}
                  className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Password Baru * (Min. 6 Karakter)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Masukkan password baru"
                  value={changePasswordForm.newPassword}
                  onChange={(e) => setChangePasswordForm({ ...changePasswordForm, newPassword: e.target.value })}
                  className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Konfirmasi Password Baru *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Ketik ulang password baru"
                  value={changePasswordForm.confirmPassword}
                  onChange={(e) => setChangePasswordForm({ ...changePasswordForm, confirmPassword: e.target.value })}
                  className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white hover:bg-primary-container px-5 py-2 rounded-xl font-bold text-xs shadow cursor-pointer"
                >
                  Simpan Password Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW ADMIN ACCOUNT */}
      {showCreateAccountModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] max-w-lg w-full p-6 flex flex-col gap-5 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">person_add</span>
                <h3 className="font-h4 text-base font-bold text-slate-900" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  Buat Akun Administrator Baru
                </h3>
              </div>
              <button onClick={() => setShowCreateAccountModal(false)} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateAdminAccount} className="flex flex-col gap-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: staf_program"
                    value={createAccountForm.username}
                    onChange={(e) => setCreateAccountForm({ ...createAccountForm, username: e.target.value })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Peran / Jabatan</label>
                  <select
                    value={createAccountForm.role}
                    onChange={(e) => setCreateAccountForm({ ...createAccountForm, role: e.target.value })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary font-medium"
                  >
                    <option value="Admin Program">Admin Program</option>
                    <option value="Admin Keuangan">Admin Keuangan</option>
                    <option value="Admin Redaksi & Media">Admin Redaksi & Media</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Nama Lengkap Petugas *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Farhan"
                  value={createAccountForm.fullName}
                  onChange={(e) => setCreateAccountForm({ ...createAccountForm, fullName: e.target.value })}
                  className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Email Petugas</label>
                <input
                  type="email"
                  placeholder="petugas@dtpeduli.org"
                  value={createAccountForm.email}
                  onChange={(e) => setCreateAccountForm({ ...createAccountForm, email: e.target.value })}
                  className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Password * (Min. 6 Karakter)</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Password"
                    value={createAccountForm.password}
                    onChange={(e) => setCreateAccountForm({ ...createAccountForm, password: e.target.value })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Konfirmasi Password *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Ulangi password"
                    value={createAccountForm.confirmPassword}
                    onChange={(e) => setCreateAccountForm({ ...createAccountForm, confirmPassword: e.target.value })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateAccountModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white hover:bg-primary-container px-5 py-2 rounded-xl font-bold text-xs shadow cursor-pointer"
                >
                  Daftarkan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CAMPAIGN CREATE/EDIT */}
      {showCampaignModal && editingCampaign && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[16px] max-w-2xl w-full p-6 md:p-8 flex flex-col gap-6 shadow-2xl my-8 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <h3 className="font-h3 text-h3 text-primary font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                {editingCampaign.id ? 'Edit Data Campaign' : 'Tambah Campaign Baru'}
              </h3>
              <button onClick={() => setShowCampaignModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="flex flex-col gap-4 text-sm max-h-[70vh] overflow-y-auto pr-2">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800">Judul Program Campaign *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bantuan Medis & Pangan untuk Gaza"
                  value={editingCampaign.title || ''}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, title: e.target.value })}
                  className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Kategori</label>
                  <select
                    value={editingCampaign.category || 'Kemanusiaan'}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, category: e.target.value })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                  >
                    <option value="Kemanusiaan">Kemanusiaan</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Zakat">Zakat & Infaq</option>
                    <option value="Wakaf">Wakaf</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Lokasi Penyaluran</label>
                  <input
                    type="text"
                    placeholder="Contoh: Gaza & Deir al-Balah, Palestina"
                    value={editingCampaign.location || ''}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, location: e.target.value })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Target Donasi (Rp) *</label>
                  <input
                    type="number"
                    required
                    min={100000}
                    value={editingCampaign.targetAmount || 100000000}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, targetAmount: Number(e.target.value) })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary font-bold text-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Dana Terkumpul (Rp)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingCampaign.collectedAmount || 0}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, collectedAmount: Number(e.target.value) })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Sisa Hari</label>
                  <input
                    type="number"
                    min={1}
                    value={editingCampaign.daysRemaining || 30}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, daysRemaining: Number(e.target.value) })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <ImageUploadInput
                label="Foto Sampul Campaign"
                value={editingCampaign.imageUrl || ''}
                onChange={(url) => setEditingCampaign({ ...editingCampaign, imageUrl: url })}
                aspectRatio="video"
                helperText="Upload file foto sampul dari perangkat atau masukkan tautan URL"
              />

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan program yang muncul di kartu..."
                  value={editingCampaign.description || ''}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, description: e.target.value })}
                  className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white hover:bg-primary-container px-6 py-2 rounded-xl font-bold shadow cursor-pointer"
                  style={{ fontFamily: "'Baloo 2', sans-serif" }}
                >
                  Simpan Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INPUT DONATION MANUAL */}
      {showDonationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[16px] max-w-lg w-full p-6 md:p-8 flex flex-col gap-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <h3 className="font-h3 text-h3 text-primary font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                Input Donasi Baru
              </h3>
              <button onClick={() => setShowDonationModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveDonation} className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800">Pilih Program Campaign *</label>
                <select
                  required
                  value={newDonationForm.campaignId}
                  onChange={(e) => setNewDonationForm({ ...newDonationForm, campaignId: e.target.value })}
                  className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Nominal Donasi (Rp) *</label>
                  <input
                    type="number"
                    required
                    min={10000}
                    step={5000}
                    value={newDonationForm.amount || 100000}
                    onChange={(e) => setNewDonationForm({ ...newDonationForm, amount: Number(e.target.value) })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary font-bold text-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Status Pembayaran</label>
                  <select
                    value={newDonationForm.status || 'VERIFIED'}
                    onChange={(e) => setNewDonationForm({ ...newDonationForm, status: e.target.value as any })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary font-bold"
                  >
                    <option value="VERIFIED">VERIFIED (Terima Kasih)</option>
                    <option value="PENDING">PENDING (Menunggu)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-800">Nama Donatur</label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newDonationForm.isAnonymous}
                      onChange={(e) => setNewDonationForm({ ...newDonationForm, isAnonymous: e.target.checked })}
                    />
                    <span>Sembunyikan Nama (Hamba Allah)</span>
                  </label>
                </div>
                {!newDonationForm.isAnonymous && (
                  <input
                    type="text"
                    placeholder="Nama lengkap donatur"
                    value={newDonationForm.donorName || ''}
                    onChange={(e) => setNewDonationForm({ ...newDonationForm, donorName: e.target.value })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Email Donatur</label>
                  <input
                    type="email"
                    placeholder="email@domain.com"
                    value={newDonationForm.donorEmail || ''}
                    onChange={(e) => setNewDonationForm({ ...newDonationForm, donorEmail: e.target.value })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">No. WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="081234567890"
                    value={newDonationForm.donorPhone || ''}
                    onChange={(e) => setNewDonationForm({ ...newDonationForm, donorPhone: e.target.value })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800">Metode Pembayaran</label>
                <select
                  value={newDonationForm.paymentMethod || 'QRIS (GoPay, OVO, ShopeePay)'}
                  onChange={(e) => setNewDonationForm({ ...newDonationForm, paymentMethod: e.target.value })}
                  className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                >
                  <option value="QRIS (GoPay, OVO, ShopeePay)">QRIS (GoPay, OVO, ShopeePay)</option>
                  <option value="Bank Syariah Indonesia (BSI)">Bank Syariah Indonesia (BSI)</option>
                  <option value="Bank Central Asia (BCA)">Bank Central Asia (BCA)</option>
                  <option value="Bank Mandiri">Bank Mandiri</option>
                  <option value="Bank Rakyat Indonesia (BRI)">Bank Rakyat Indonesia (BRI)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDonationModal(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white hover:bg-primary-container px-6 py-2 rounded-xl font-bold shadow cursor-pointer"
                  style={{ fontFamily: "'Baloo 2', sans-serif" }}
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEWS CREATE/EDIT */}
      {showNewsModal && editingNews && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[16px] max-w-2xl w-full p-6 md:p-8 flex flex-col gap-6 shadow-2xl my-8 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <h3 className="font-h3 text-h3 text-primary font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                {editingNews.id ? 'Edit Berita & Edukasi' : 'Tulis Berita Baru'}
              </h3>
              <button onClick={() => setShowNewsModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="flex flex-col gap-4 text-sm max-h-[70vh] overflow-y-auto pr-2">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800">Judul Berita *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Distribusi Paket Pangan DT Peduli di Deir al-Balah"
                  value={editingNews.title || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Kategori</label>
                  <input
                    type="text"
                    value={editingNews.category || 'Kemanusiaan'}
                    onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Penulis</label>
                  <input
                    type="text"
                    value={editingNews.author || 'Tim Media DT Peduli'}
                    onChange={(e) => setEditingNews({ ...editingNews, author: e.target.value })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Estimasi Waktu Baca</label>
                  <input
                    type="text"
                    value={editingNews.readTime || '3 menit baca'}
                    onChange={(e) => setEditingNews({ ...editingNews, readTime: e.target.value })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <ImageUploadInput
                label="Foto / Gambar Sampul Berita"
                value={editingNews.imageUrl || ''}
                onChange={(url) => setEditingNews({ ...editingNews, imageUrl: url })}
                aspectRatio="video"
                helperText="Upload file gambar dokumentasi/berita dari perangkat atau masukkan URL"
              />

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800">Ringkasan Berita</label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan singkat 1-2 kalimat..."
                  value={editingNews.summary || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                  className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800">Isi Berita Lengkap</label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan isi berita di sini..."
                  value={Array.isArray(editingNews.content) ? editingNews.content.join('\n\n') : (editingNews.content || '')}
                  onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value.split('\n\n').filter(Boolean) })}
                  className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewsModal(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white hover:bg-primary-container px-6 py-2 rounded-xl font-bold shadow cursor-pointer"
                  style={{ fontFamily: "'Baloo 2', sans-serif" }}
                >
                  Simpan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: FAQ CREATE/EDIT */}
      {showFaqModal && editingFaq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[16px] max-w-xl w-full p-6 md:p-8 flex flex-col gap-6 shadow-2xl my-8 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">quiz</span>
                <h3 className="font-h3 text-h3 text-primary font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  {editingFaq.id ? 'Edit Pertanyaan FAQ' : 'Tambah FAQ Baru'}
                </h3>
              </div>
              <button onClick={() => setShowFaqModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800">Pertanyaan FAQ *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bagaimana cara memastikan donasi saya telah diterima?"
                  value={editingFaq.question || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="border border-slate-300 rounded-xl p-3 focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800">Jawaban Lengkap *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tuliskan jawaban yang jelas dan informatif untuk donatur..."
                  value={editingFaq.answer || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="border border-slate-300 rounded-xl p-3 focus:outline-none focus:border-primary text-sm leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white hover:bg-primary/90 px-6 py-2.5 rounded-xl font-bold shadow cursor-pointer transition"
                  style={{ fontFamily: "'Baloo 2', sans-serif" }}
                >
                  {editingFaq.id ? 'Simpan Perubahan' : 'Terbitkan FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PAYMENT METHOD CREATE/EDIT */}
      {showPaymentModal && editingPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[16px] max-w-2xl w-full p-6 md:p-8 flex flex-col gap-6 shadow-2xl my-8 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-[24px]">account_balance</span>
                <h3 className="font-h3 text-h3 text-primary font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  {editingPayment.id ? 'Edit Metode Pembayaran' : 'Tambah Metode Pembayaran Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="flex flex-col gap-5 text-sm max-h-[75vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Kategori Metode *</label>
                  <select
                    required
                    value={editingPayment.category || 'Transfer Bank Syariah'}
                    onChange={(e) => setEditingPayment({ ...editingPayment, category: e.target.value })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary text-sm font-semibold"
                  >
                    <option value="Transfer Bank Syariah">Transfer Bank Syariah</option>
                    <option value="Transfer Bank Konvensional">Transfer Bank Konvensional</option>
                    <option value="Instant / E-Wallet & QRIS">Instant / E-Wallet & QRIS</option>
                    <option value="Virtual Account">Virtual Account</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Nama Bank / Metode *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bank Syariah Indonesia (BSI)"
                    value={editingPayment.name || ''}
                    onChange={(e) => setEditingPayment({ ...editingPayment, name: e.target.value })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Kode Singkat</label>
                  <input
                    type="text"
                    placeholder="Contoh: BSI / BCA / QRIS"
                    value={editingPayment.code || ''}
                    onChange={(e) => setEditingPayment({ ...editingPayment, code: e.target.value.toUpperCase() })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary font-mono text-sm uppercase"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="font-bold text-slate-800">Nomor Rekening / No. Akun</label>
                  <input
                    type="text"
                    placeholder="Contoh: 700.1234.567"
                    value={editingPayment.accountNumber || ''}
                    onChange={(e) => setEditingPayment({ ...editingPayment, accountNumber: e.target.value })}
                    className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary font-mono text-sm text-primary font-bold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800">Atas Nama Pemilik Rekening</label>
                <input
                  type="text"
                  placeholder="Contoh: Yayasan Daarut Tauhiid Peduli"
                  value={editingPayment.accountHolder || ''}
                  onChange={(e) => setEditingPayment({ ...editingPayment, accountHolder: e.target.value })}
                  className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary text-sm"
                />
              </div>

              {/* Upload Logo Bank / E-Wallet */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 flex flex-col gap-3">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                  <span className="material-symbols-outlined text-primary text-[18px]">image</span>
                  <span>Logo Bank / Penyedia Pembayaran</span>
                </div>
                <ImageUploadInput
                  label="Upload File Logo Bank / Logo QRIS"
                  value={editingPayment.logoUrl || ''}
                  onChange={(url) => setEditingPayment({ ...editingPayment, logoUrl: url })}
                  aspectRatio="square"
                  helperText="Upload gambar logo (PNG transparan/JPG) atau paste tautan gambar"
                />
              </div>

              {/* QRIS Specific Fields */}
              {(editingPayment.category?.includes('QRIS') || editingPayment.code?.toUpperCase().includes('QRIS') || editingPayment.name?.toUpperCase().includes('QRIS')) && (
                <div className="border-2 border-primary/20 bg-primary/5 rounded-2xl p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-primary text-xs">
                      <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                      <span>Konfigurasi Khusus QRIS Dinamis / Statis</span>
                    </div>
                    <span className="text-[10px] bg-primary text-white font-bold px-2 py-0.5 rounded-md">
                      QRIS Merchant
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-800 text-xs">Nomor Merchant ID (NMID)</label>
                    <input
                      type="text"
                      placeholder="Contoh: ID1020039201923"
                      value={editingPayment.nmid || ''}
                      onChange={(e) => setEditingPayment({ ...editingPayment, nmid: e.target.value })}
                      className="border border-slate-300 rounded-xl p-2.5 bg-white focus:outline-none focus:border-primary font-mono text-xs"
                    />
                  </div>

                  <ImageUploadInput
                    label="Upload File Foto QR Code QRIS"
                    value={editingPayment.qrisImageUrl || ''}
                    onChange={(url) => setEditingPayment({ ...editingPayment, qrisImageUrl: url })}
                    aspectRatio="square"
                    helperText="Upload barcode QRIS resmi dari Bank / Payment Gateway"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800">Petunjuk Transfer / Instruksi Donatur</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Transfer sesuai 3 digit kode unik agar donasi terverifikasi otomatis."
                  value={editingPayment.instructions || ''}
                  onChange={(e) => setEditingPayment({ ...editingPayment, instructions: e.target.value })}
                  className="border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-primary text-sm leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="isActivePayment"
                  checked={editingPayment.isActive !== false}
                  onChange={(e) => setEditingPayment({ ...editingPayment, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary cursor-pointer"
                />
                <label htmlFor="isActivePayment" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Aktifkan Metode Pembayaran ini (Tampil di form donasi publik)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white hover:bg-primary-container px-6 py-2 rounded-xl font-bold shadow cursor-pointer transition"
                  style={{ fontFamily: "'Baloo 2', sans-serif" }}
                >
                  Simpan Metode Pembayaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
