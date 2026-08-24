/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId, DonationTransaction } from './types';
import { CAMPAIGNS_DATA } from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { KontakScreen } from './screens/KontakScreen';
import { BeritaScreen } from './screens/BeritaScreen';
import { TentangKamiScreen } from './screens/TentangKamiScreen';
import { CampaignDetailScreen } from './screens/CampaignDetailScreen';
import { DonasiScreen } from './screens/DonasiScreen';
import { CampaignListScreen } from './screens/CampaignListScreen';
import { DonasiPaymentScreen } from './screens/DonasiPaymentScreen';
import { BuktiDonasiScreen } from './screens/BuktiDonasiScreen';

// Isolated Admin Portal System
import { AdminPortal } from './admin/AdminPortal';

export default function App() {
  // Screen 1: Home - DT Peduli Prototype Fixed (Global Nav) is the initial screen
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      return 'admin';
    }
    return 'home_global';
  });
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('yatim');

  // Active or most recent transaction
  const [activeTransaction, setActiveTransaction] = useState<DonationTransaction>({
    id: 'DTP-84920145',
    campaignTitle: 'Bantuan untuk Anak Yatim Palestina',
    campaignId: 'yatim',
    donorName: 'Hamba Allah',
    donorEmail: 'donatur@dtpeduli.org',
    donorPhone: '0812-3456-7890',
    isAnonymous: true,
    amount: 250000,
    uniqueCode: 342,
    totalAmount: 250342,
    paymentMethod: 'Bank Syariah Indonesia (BSI)',
    accountNumber: '700.123.4567',
    accountHolder: 'Yayasan Daarut Tauhiid Peduli',
    prayer: 'Semoga Allah merahmati dan melindungi anak-anak yatim di Gaza.',
    createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    status: 'PENDING',
    expiredAt: '23:59:59 WIB Hari Ini'
  });

  // Listen to hash changes and staff keyboard shortcuts (e.g. Alt+A or Ctrl+Shift+A)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentScreen('admin');
      } else if (currentScreen === 'admin') {
        setCurrentScreen('home_global');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.altKey && (e.key === 'A' || e.key === 'a'))) {
        e.preventDefault();
        setCurrentScreen((prev) => (prev === 'admin' ? 'home_global' : 'admin'));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentScreen]);

  // Scroll to top when changing screens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentScreen === 'admin') {
      window.location.hash = 'admin';
    } else if (window.location.hash === '#admin') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [currentScreen]);

  const handleNavigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
  };

  const handleSelectCampaignForDonation = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
  };

  const handleSubmitDonation = (tx: DonationTransaction) => {
    setActiveTransaction(tx);
  };

  const handleVerifyPayment = () => {
    setActiveTransaction((prev) => ({
      ...prev,
      status: 'VERIFIED',
    }));
  };

  // Render the current screen according to the 14-screen spec
  const renderScreen = () => {
    switch (currentScreen) {
      // 1. Home - DT Peduli Prototype Fixed (Global Nav) — Initial Screen
      case 'home_global':
        return (
          <HomeScreen
            isFixedVariant={false}
            onNavigate={handleNavigate}
            onSelectCampaignForDonation={handleSelectCampaignForDonation}
          />
        );

      // 2. Kontak Kami - DT Peduli Consolidated Master UI
      case 'kontak':
        return <KontakScreen onNavigate={handleNavigate} />;

      // 3. Berita - DT Peduli Prototype Fixed (Global Nav)
      case 'berita_global':
        return (
          <BeritaScreen
            isFixedVariant={false}
            onNavigate={handleNavigate}
            onSelectCampaignForDonation={handleSelectCampaignForDonation}
          />
        );

      // 4. Tentang Kami - DT Peduli Prototype Fixed
      case 'tentang':
        return <TentangKamiScreen onNavigate={handleNavigate} />;

      // 5. Bantuan untuk Anak Yatim Palestina - DT Peduli Master Sync
      case 'detail_yatim':
        return (
          <CampaignDetailScreen
            campaign={CAMPAIGNS_DATA.yatim}
            screenTitle="Bantuan untuk Anak Yatim Palestina - DT Peduli Master Sync"
            onNavigate={handleNavigate}
            onSelectForDonation={handleSelectCampaignForDonation}
          />
        );

      // 6. Home - DT Peduli Prototype Fixed
      case 'home_fixed':
        return (
          <HomeScreen
            isFixedVariant={true}
            onNavigate={handleNavigate}
            onSelectCampaignForDonation={handleSelectCampaignForDonation}
          />
        );

      // 7. Detail Campaign - Pendidikan untuk Anak-Anak Palestina (Master Sync)
      case 'detail_pendidikan':
        return (
          <CampaignDetailScreen
            campaign={CAMPAIGNS_DATA.pendidikan}
            screenTitle="Detail Campaign - Pendidikan untuk Anak-Anak Palestina (Master Sync)"
            onNavigate={handleNavigate}
            onSelectForDonation={handleSelectCampaignForDonation}
          />
        );

      // 8. Donasi - DT Peduli Prototype Fixed (Global Nav)
      case 'donasi_global':
        return (
          <DonasiScreen
            selectedCampaignId={selectedCampaignId}
            onNavigate={handleNavigate}
            onSubmitDonation={handleSubmitDonation}
          />
        );

      // 9. Detail Campaign - Bantuan Kebutuhan Dasar Palestina (Master Sync)
      case 'detail_dasar':
        return (
          <CampaignDetailScreen
            campaign={CAMPAIGNS_DATA.dasar}
            screenTitle="Detail Campaign - Bantuan Kebutuhan Dasar Palestina (Master Sync)"
            onNavigate={handleNavigate}
            onSelectForDonation={handleSelectCampaignForDonation}
          />
        );

      // 10. Berita - DT Peduli Prototype Fixed
      case 'berita_fixed':
        return (
          <BeritaScreen
            isFixedVariant={true}
            onNavigate={handleNavigate}
            onSelectCampaignForDonation={handleSelectCampaignForDonation}
          />
        );

      // 11. Detail Campaign - Air Bersih untuk Warga Gaza (Master Sync)
      case 'detail_air':
        return (
          <CampaignDetailScreen
            campaign={CAMPAIGNS_DATA.air}
            screenTitle="Detail Campaign - Air Bersih untuk Warga Gaza (Master Sync)"
            onNavigate={handleNavigate}
            onSelectForDonation={handleSelectCampaignForDonation}
          />
        );

      // 12. Campaign - DT Peduli Prototype Fixed
      case 'campaign_list':
        return (
          <CampaignListScreen
            onNavigate={handleNavigate}
            onSelectForDonation={handleSelectCampaignForDonation}
          />
        );

      // 13. Bukti Donasi - DT Peduli Master UI Consistency
      case 'bukti_donasi':
        return (
          <BuktiDonasiScreen
            transaction={activeTransaction}
            onNavigate={handleNavigate}
          />
        );

      // 14. Donasi - DT Peduli Consolidated Master UI (Payment)
      case 'donasi_payment':
        return (
          <DonasiPaymentScreen
            transaction={activeTransaction}
            onNavigate={handleNavigate}
            onVerifyPayment={handleVerifyPayment}
          />
        );

      default:
        return (
          <HomeScreen
            isFixedVariant={false}
            onNavigate={handleNavigate}
            onSelectCampaignForDonation={handleSelectCampaignForDonation}
          />
        );
    }
  };

  // If viewing admin portal, provide completely isolated and protected Admin Portal system
  if (currentScreen === 'admin') {
    return (
      <AdminPortal
        onBackToPublic={() => handleNavigate('home_global')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
      {/* 1. Global DT Peduli Topmost Header Navigation */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
      />

      {/* 2. Main Multi-screen Content Container */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Global Institutional Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
