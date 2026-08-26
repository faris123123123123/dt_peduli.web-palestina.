import React from 'react';
import { ScreenId } from '../types';
import { DtPeduliLogo } from './DtPeduliLogo';

interface Props {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const Header: React.FC<Props> = ({ currentScreen, onNavigate }) => {
  const isHome = currentScreen === 'home_global' || currentScreen === 'home_fixed';
  const isCampaign = currentScreen === 'campaign_list' || currentScreen.startsWith('detail_');
  const isBerita = currentScreen === 'berita_global' || currentScreen === 'berita_fixed';
  const isTentang = currentScreen === 'tentang';
  const isKontak = currentScreen === 'kontak';
  const isDonasi = currentScreen === 'donasi_global' || currentScreen === 'donasi_payment' || currentScreen === 'bukti_donasi';

  // 5 Clean destinations for mobile navigation (Icon-only, strictly no scrolling)
  const mobileNavItems = [
    { id: 'home_global' as ScreenId, title: 'Beranda', icon: 'home', isActive: isHome },
    { id: 'campaign_list' as ScreenId, title: 'Program Donasi', icon: 'volunteer_activism', isActive: isCampaign },
    { id: 'donasi_global' as ScreenId, title: 'Donasi Cepat', icon: 'favorite', isActive: isDonasi, isSpecial: true },
    { id: 'berita_global' as ScreenId, title: 'Kabar & Berita', icon: 'newspaper', isActive: isBerita },
    { id: 'kontak' as ScreenId, title: 'Kontak & Info', icon: 'call', isActive: isKontak || isTentang },
  ];

  return (
    <>
      {/* 1. Topmost Sticky Header for Desktop, Tablet & Mobile */}
      <header className="bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant fixed top-0 left-0 w-full z-40 flex items-center justify-between px-3.5 sm:px-6 md:px-16 h-[56px] sm:h-[64px] md:h-[72px] transition-all duration-200 shadow-2xs">
        <div className="flex items-center gap-4 md:gap-8 w-full max-w-[1200px] mx-auto justify-between">
          
          {/* Authentic Brand Logo */}
          <button
            onClick={() => onNavigate('home_global')}
            className="flex items-center focus:outline-hidden cursor-pointer group transition-transform duration-200 active:scale-95"
            aria-label="DT Peduli Beranda"
          >
            <DtPeduliLogo size="responsive" />
          </button>

          {/* Navigation Links (Desktop & Tablet Web) */}
          <nav className="hidden md:flex gap-7 lg:gap-8 flex-1 justify-center items-center">
            <button
              onClick={() => onNavigate('home_global')}
              className={`text-sm transition-colors cursor-pointer font-medium ${
                isHome
                  ? 'text-primary font-bold'
                  : 'text-slate-600 hover:text-primary'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('campaign_list')}
              className={`text-sm transition-colors cursor-pointer font-medium ${
                isCampaign
                  ? 'text-primary font-bold'
                  : 'text-slate-600 hover:text-primary'
              }`}
            >
              Campaign
            </button>
            <button
              onClick={() => onNavigate('berita_global')}
              className={`text-sm transition-colors cursor-pointer font-medium ${
                isBerita
                  ? 'text-primary font-bold'
                  : 'text-slate-600 hover:text-primary'
              }`}
            >
              Berita
            </button>
            <button
              onClick={() => onNavigate('tentang')}
              className={`text-sm transition-colors cursor-pointer font-medium ${
                isTentang
                  ? 'text-primary font-bold'
                  : 'text-slate-600 hover:text-primary'
              }`}
            >
              Tentang Kami
            </button>
            <button
              onClick={() => onNavigate('kontak')}
              className={`text-sm transition-colors cursor-pointer font-medium ${
                isKontak
                  ? 'text-primary font-bold'
                  : 'text-slate-600 hover:text-primary'
              }`}
            >
              Kontak Kami
            </button>
          </nav>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('donasi_global')}
              className="bg-primary hover:bg-primary-container text-white h-[36px] sm:h-[42px] px-3.5 sm:px-6 rounded-full flex items-center gap-1.5 font-bold transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer text-xs sm:text-sm active:scale-95"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span>Donasi Sekarang</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. Mobile Bottom Navigation Bar (Icon-Only, Zero Horizontal Scroll, 100% Fit) */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.09)] px-2 py-1.5"
        aria-label="Navigasi Mobile"
      >
        <div className="grid grid-cols-5 items-center justify-items-center w-full max-w-md mx-auto">
          {mobileNavItems.map((item) => {
            if (item.isSpecial) {
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={item.title}
                  aria-label={item.title}
                  className="flex items-center justify-center -mt-3.5 cursor-pointer group active:scale-90 transition-transform duration-150"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
                    item.isActive 
                      ? 'bg-amber-500 text-white ring-4 ring-amber-100 scale-105' 
                      : 'bg-primary text-white hover:bg-primary-container ring-2 ring-white shadow-primary/20'
                  }`}>
                    <span className="material-symbols-outlined text-[24px]">
                      {item.icon}
                    </span>
                  </div>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={item.title}
                aria-label={item.title}
                className="w-full flex flex-col items-center justify-center py-1 cursor-pointer group active:scale-90 transition-transform duration-150 relative"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  item.isActive
                    ? 'bg-primary/10 text-primary font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-primary hover:bg-slate-100/70'
                }`}>
                  <span className={`material-symbols-outlined text-[22px] transition-transform duration-200 ${
                    item.isActive ? 'scale-110 text-primary' : ''
                  }`}>
                    {item.icon}
                  </span>
                </div>
                {item.isActive && (
                  <span className="w-1.5 h-1.5 bg-primary rounded-full absolute bottom-0.5 animate-in fade-in zoom-in"></span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

