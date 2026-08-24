import React, { useState } from 'react';
import { ScreenId } from '../types';

interface Props {
  onNavigate: (screen: ScreenId) => void;
}

export const KontakScreen: React.FC<Props> = ({ onNavigate }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Assalamu\'alaikum DT Peduli, saya ingin bertanya seputar donasi/program.')}`, '_blank');
  };

  const handleGoogleMaps = () => {
    window.open('https://maps.google.com/?q=DT+Peduli+Jl.+Gegerkalong+Girang+No.32+Bandung', '_blank');
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent('Pertanyaan Layanan DT Peduli')}`;
  };

  return (
    <main className="flex-1 mt-[64px] md:mt-[72px] w-full max-w-[1200px] mx-auto px-3.5 sm:px-6 md:px-16 pt-4 sm:pt-6 pb-24 md:pb-20 flex flex-col gap-4 sm:gap-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-4 z-50 bg-primary text-white px-3.5 py-2 rounded-full shadow-lg text-xs flex items-center gap-1.5 animate-in fade-in">
          <span className="material-symbols-outlined text-[16px]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <section className="flex flex-col gap-1">
        <h1 
          className="text-lg sm:text-2xl md:text-3xl text-primary font-bold"
          style={{ fontFamily: "'Baloo 2', sans-serif" }}
        >
          Kontak & Kantor Layanan
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-[700px] leading-relaxed">
          Kami siap melayani dan mendengarkan. Hubungi kantor terdekat kami untuk informasi seputar donasi, program kemanusiaan, atau kemitraan.
        </p>
      </section>

      {/* Cards Section: 1 col on mobile, 3 col on lg */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        
        {/* Indonesia Office Card */}
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-4 hover:shadow-md transition-shadow duration-300 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">domain</span>
              <h3 className="text-sm sm:text-base font-bold text-on-surface" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                Indonesia - Kantor Pusat
              </h3>
            </div>
            <span className="text-[10px] font-bold bg-blue-50 text-primary px-2 py-0.5 rounded-full border border-blue-100">
              Head Office
            </span>
          </div>

          <div className="text-xs sm:text-sm text-on-surface-variant flex flex-col gap-1.5 flex-1 leading-relaxed">
            <p className="line-clamp-2 sm:line-clamp-none">
              Jl. Gegerkalong Girang No.32, Isola, Kec. Sukasari, Kota Bandung, Jawa Barat 40153
            </p>
            <p className="font-semibold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">call</span>
              <span>+62 813 1712 1712</span>
            </p>
          </div>

          <div className="mt-auto flex flex-row gap-2 pt-1 border-t border-slate-100">
            <button
              onClick={() => handleWhatsApp('+6281317121712')}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-[36px] sm:h-[40px] rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleGoogleMaps}
              className="flex-1 border border-slate-300 text-slate-700 hover:bg-slate-50 h-[36px] sm:h-[40px] rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">map</span>
              <span>Maps</span>
            </button>
          </div>
        </div>

        {/* Australia Office Card */}
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-4 hover:shadow-md transition-shadow duration-300 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">public</span>
              <h3 className="text-sm sm:text-base font-bold text-on-surface" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                Australia Representative
              </h3>
            </div>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-100">
              Victoria
            </span>
          </div>

          <div className="text-xs sm:text-sm text-on-surface-variant flex flex-col gap-1.5 flex-1 leading-relaxed">
            <p className="line-clamp-2 sm:line-clamp-none">
              57 Lemon Gr Cranbourne West VIC, 3977, Australia
            </p>
            <p className="font-semibold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">call</span>
              <span>+61 466 891 975</span>
            </p>
            <p className="text-[11px] text-slate-500 truncate">australia@dtpeduli.org.au</p>
          </div>

          <div className="mt-auto flex flex-row gap-2 pt-1 border-t border-slate-100">
            <button
              onClick={() => handleWhatsApp('+61466891975')}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-[36px] sm:h-[40px] rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => handleEmail('australia@dtpeduli.org.au')}
              className="flex-1 border border-slate-300 text-slate-700 hover:bg-slate-50 h-[36px] sm:h-[40px] rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">mail</span>
              <span>Email</span>
            </button>
          </div>
        </div>

        {/* Türkiye Office Card */}
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-4 hover:shadow-md transition-shadow duration-300 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">flight_takeoff</span>
              <h3 className="text-sm sm:text-base font-bold text-on-surface" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                Türkiye Representative
              </h3>
            </div>
            <span className="text-[10px] font-bold bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full border border-purple-100">
              İstanbul
            </span>
          </div>

          <div className="text-xs sm:text-sm text-on-surface-variant flex flex-col gap-1.5 flex-1 leading-relaxed">
            <p className="line-clamp-2 sm:line-clamp-none">
              Ritim Istanbul A5 Blok Daire 70, Cevizli, Zuhal Cd., 34846 Maltepe/İstanbul, Türkiye
            </p>
            <p className="font-semibold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">mail</span>
              <span className="truncate">Turkiye@dtpeduli.org</span>
            </p>
          </div>

          <div className="mt-auto flex flex-row gap-2 pt-1 border-t border-slate-100">
            <button
              onClick={() => handleEmail('Turkiye@dtpeduli.org')}
              className="w-full bg-primary hover:bg-primary-container text-white h-[36px] sm:h-[40px] rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">mail</span>
              <span>Kirim Email</span>
            </button>
          </div>
        </div>

      </section>
    </main>
  );
};
