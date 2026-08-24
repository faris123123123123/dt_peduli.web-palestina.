import React, { useState, useEffect } from 'react';
import { ScreenId, HeroSettings, FaqItem, CampaignItem } from '../types';
import { CAMPAIGNS_DATA, FALLBACK_IMAGE, DEFAULT_HERO_SETTINGS, DEFAULT_FAQS_DATA } from '../data/mockData';
import { CampaignCard } from '../components/CampaignCard';
import { api } from '../services/api';

interface Props {
  isFixedVariant?: boolean;
  onNavigate: (screen: ScreenId) => void;
  onSelectCampaignForDonation: (campaignId: string) => void;
}

export const HomeScreen: React.FC<Props> = ({ isFixedVariant = false, onNavigate, onSelectCampaignForDonation }) => {
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(DEFAULT_HERO_SETTINGS);
  const [faqs, setFaqs] = useState<FaqItem[]>(DEFAULT_FAQS_DATA);
  const [campaignsList, setCampaignsList] = useState<CampaignItem[]>([
    CAMPAIGNS_DATA.yatim,
    CAMPAIGNS_DATA.air,
    CAMPAIGNS_DATA.dasar,
  ]);

  useEffect(() => {
    api.getHeroSettings().then((data) => {
      if (data && data.imageUrl) {
        setHeroSettings(data);
      }
    }).catch(() => {});

    api.getFaqs().then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setFaqs(data);
      }
    }).catch(() => {});

    api.getCampaigns().then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setCampaignsList(data.slice(0, 3));
      }
    }).catch(() => {});
  }, []);

  const featuredCampaigns = campaignsList;

  return (
    <main className="flex-1 mt-[64px] md:mt-[72px] w-full max-w-[1200px] mx-auto px-3.5 sm:px-6 md:px-16 pt-4 sm:pt-6 pb-16 md:pb-20 flex flex-col gap-8 sm:gap-12 md:gap-16">
      {/* Enlarged Hero Banner - Full Visual Focus */}
      <section className="w-full relative group">
        <div className="w-full h-[260px] sm:h-[380px] md:h-[480px] lg:h-[540px] rounded-[14px] sm:rounded-[18px] md:rounded-[24px] overflow-hidden relative shadow-md bg-slate-900 border border-surface-container-highest">
          <img
            src={heroSettings.imageUrl || DEFAULT_HERO_SETTINGS.imageUrl}
            alt="DT Peduli Hero Banner"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
            className="w-full h-full object-cover object-center transform group-hover:scale-[1.015] transition-transform duration-700 ease-out"
          />

          {/* Elegant bottom gradient overlay with quick action buttons */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-3.5 sm:p-6 md:p-10 pointer-events-none">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4 pointer-events-auto">
              <div className="flex flex-col gap-0.5 sm:gap-1 max-w-xl">
                {heroSettings.badgeText && (
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-[#fcd400] text-[#00296d] font-bold text-[10px] sm:text-xs px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider self-start shadow-xs" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00296d]"></span>
                    {heroSettings.badgeText}
                  </span>
                )}
                <h1 
                  className="text-base sm:text-2xl md:text-3xl lg:text-4xl text-white font-bold drop-shadow-md leading-tight mt-0.5"
                  style={{ fontFamily: "'Baloo 2', sans-serif" }}
                >
                  {heroSettings.captionTitle || 'Bersama Membangun Harapan, Menebar Manfaat'}
                </h1>
                {heroSettings.captionSubtitle && (
                  <p className="text-[11px] sm:text-xs md:text-sm text-slate-200 drop-shadow-sm line-clamp-1 sm:line-clamp-2 mt-0.5 max-w-lg">
                    {heroSettings.captionSubtitle}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => onNavigate('donasi_global')}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center bg-[#fcd400] hover:bg-[#ffe16d] text-[#00296d] h-[38px] sm:h-[46px] md:h-[50px] px-4 sm:px-6 md:px-8 rounded-full font-bold text-xs sm:text-sm md:text-base transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer gap-1.5"
                  style={{ fontFamily: "'Baloo 2', sans-serif" }}
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[20px]">volunteer_activism</span>
                  <span className="truncate">Donasi Sekarang</span>
                </button>
                <button
                  onClick={() => onNavigate('campaign_list')}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center bg-white/90 hover:bg-white text-slate-900 backdrop-blur-xs h-[38px] sm:h-[46px] md:h-[50px] px-3.5 sm:px-5 md:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 cursor-pointer truncate"
                  style={{ fontFamily: "'Baloo 2', sans-serif" }}
                >
                  <span>Pilih Program</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] p-4 sm:p-6 md:p-8 shadow-xs flex flex-col md:flex-row justify-around items-center gap-3 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-outline-variant">
        <div className="text-center w-full py-1.5 md:py-0">
          <h3 className="text-xl sm:text-2xl md:text-3xl text-primary font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Rp8,5 M+</h3>
          <p className="text-[11px] sm:text-xs text-on-surface-variant mt-0.5">Donasi Terkumpul · 2026</p>
        </div>
        <div className="text-center w-full py-1.5 md:py-0">
          <h3 className="text-xl sm:text-2xl md:text-3xl text-primary font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>849.876</h3>
          <p className="text-[11px] sm:text-xs text-on-surface-variant mt-0.5">Penerima Manfaat · 2025</p>
        </div>
        <div className="text-center w-full py-1.5 md:py-0">
          <h3 className="text-xl sm:text-2xl md:text-3xl text-primary font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>132.828</h3>
          <p className="text-[11px] sm:text-xs text-on-surface-variant mt-0.5">Penerima Manfaat RPN · 2026</p>
        </div>
      </section>

      {/* Campaign Section */}
      <section className="flex flex-col gap-4 sm:gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-xl md:text-2xl text-on-surface font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Campaign Pilihan</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block">Salurkan kebaikan bagi saudara kita yang membutuhkan</p>
          </div>
          <button
            onClick={() => onNavigate('campaign_list')}
            className="text-primary text-xs sm:text-sm flex items-center gap-1 hover:underline cursor-pointer font-bold"
          >
            <span>Lihat Semua</span>
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">arrow_forward</span>
          </button>
        </div>

        {/* Compact 2-column grid on mobile, 3-column on desktop to avoid excessive scrolling */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
          {featuredCampaigns.map((camp) => (
            <CampaignCard
              key={camp.id}
              campaign={camp}
              onNavigate={onNavigate}
              onSelectForDonation={onSelectCampaignForDonation}
            />
          ))}
        </div>
      </section>

      {/* Dampak Kebaikan Section */}
      <section className="flex flex-col gap-4 sm:gap-6 bg-gradient-to-br from-[#00296d]/5 via-slate-50 to-[#00296d]/10 border border-[#b2c5ff]/30 p-4 sm:p-6 md:p-8 rounded-[14px] sm:rounded-[16px]">
        <div className="text-center flex flex-col gap-1 max-w-xl mx-auto">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary">Transparansi & Akuntabilitas</span>
          <h2 className="text-base sm:text-xl md:text-2xl text-primary font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            Dampak Kebaikan Nyata
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-slate-600 leading-snug">Amanah sedekah, infak, dan zakat Anda disalurkan secara profesional, tepat sasaran, dan terdokumentasi.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mt-1">
          <div className="bg-white border border-slate-200/80 p-3 sm:p-4 rounded-xl flex flex-col items-center text-center gap-1 shadow-2xs hover:border-primary/40 transition">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px] sm:text-[24px]">group</span>
            </div>
            <span className="font-bold text-sm sm:text-lg md:text-xl text-slate-900" style={{ fontFamily: "'Baloo 2', sans-serif" }}>849.876</span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-none">Penerima Manfaat</span>
          </div>

          <div className="bg-white border border-slate-200/80 p-3 sm:p-4 rounded-xl flex flex-col items-center text-center gap-1 shadow-2xs hover:border-primary/40 transition">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px] sm:text-[24px]">inventory_2</span>
            </div>
            <span className="font-bold text-sm sm:text-lg md:text-xl text-slate-900" style={{ fontFamily: "'Baloo 2', sans-serif" }}>1.250+</span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-none">Paket Bantuan</span>
          </div>

          <div className="bg-white border border-slate-200/80 p-3 sm:p-4 rounded-xl flex flex-col items-center text-center gap-1 shadow-2xs hover:border-primary/40 transition">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px] sm:text-[24px]">volunteer_activism</span>
            </div>
            <span className="font-bold text-sm sm:text-lg md:text-xl text-slate-900" style={{ fontFamily: "'Baloo 2', sans-serif" }}>350+</span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-none">Relawan Lapangan</span>
          </div>

          <div className="bg-white border border-slate-200/80 p-3 sm:p-4 rounded-xl flex flex-col items-center text-center gap-1 shadow-2xs hover:border-primary/40 transition">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px] sm:text-[24px]">handshake</span>
            </div>
            <span className="font-bold text-sm sm:text-lg md:text-xl text-slate-900" style={{ fontFamily: "'Baloo 2', sans-serif" }}>25+</span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-none">Program Kemanusiaan</span>
          </div>
        </div>
      </section>

      {/* Flagship Story: Aksi Nyata Ukhuwah di Gaza */}
      <section className="bg-white border border-slate-200 rounded-[14px] sm:rounded-[16px] p-4 sm:p-6 md:p-10 shadow-xs flex flex-col md:flex-row items-center gap-5 sm:gap-8 md:gap-12">
        <div className="flex-1 w-full relative group">
          <div className="w-full h-[180px] sm:h-[260px] md:h-[340px] rounded-[12px] overflow-hidden bg-slate-100 shadow-xs">
            <img
              alt="Aksi Nyata Ukhuwah DT Peduli di Gaza"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
              }}
            />
          </div>
          {/* Badge over photo */}
          <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 bg-primary/95 backdrop-blur-xs text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Penyaluran Tahap 2 Berjalan</span>
          </div>
          <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 bg-slate-900/85 backdrop-blur-xs text-slate-200 text-[10px] sm:text-[11px] p-2 sm:p-2.5 rounded-lg flex items-center justify-between">
            <span className="flex items-center gap-1 truncate">
              <span className="material-symbols-outlined text-[13px] sm:text-[14px] text-amber-400 shrink-0">location_on</span>
              <span className="truncate">Deir al-Balah, Gaza Tengah</span>
            </span>
            <span className="text-slate-400 shrink-0 text-[9px] sm:text-[11px]">Mitra Lapangan DT Peduli</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3 sm:gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-100 text-amber-900 border border-amber-300/60 font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wide">
              Aksi Nyata Ukhuwah
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Kabar Penyaluran Lapangan</span>
          </div>

          <h2 className="text-base sm:text-xl md:text-2xl text-primary font-bold leading-snug" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            Hangatnya Ukhuwah Indonesia untuk Saudara di Gaza
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed">
            Memasuki tahap lanjutan pendistribusian darurat, relawan mitra DT Peduli terus bergerak menyalurkan ribuan paket daging segar, tangki air bersih, serta paket medis darurat bagi para pengungsi di kamp Deir al-Balah.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-0.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 bg-slate-50 p-1.5 sm:p-2 rounded-lg border border-slate-100">
              <span className="material-symbols-outlined text-emerald-600 text-[15px] sm:text-[16px] shrink-0">check_circle</span>
              <span className="truncate">1.500+ Paket Daging Segar</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 bg-slate-50 p-1.5 sm:p-2 rounded-lg border border-slate-100">
              <span className="material-symbols-outlined text-emerald-600 text-[15px] sm:text-[16px] shrink-0">check_circle</span>
              <span className="truncate">10 Tangki Pasokan Air Bersih</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 bg-slate-50 p-1.5 sm:p-2 rounded-lg border border-slate-100">
              <span className="material-symbols-outlined text-emerald-600 text-[15px] sm:text-[16px] shrink-0">check_circle</span>
              <span className="truncate">Dukungan Dapur Umum Harian</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 bg-slate-50 p-1.5 sm:p-2 rounded-lg border border-slate-100">
              <span className="material-symbols-outlined text-emerald-600 text-[15px] sm:text-[16px] shrink-0">check_circle</span>
              <span className="truncate">Layanan Medis Pertama</span>
            </div>
          </div>

          <div className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => onNavigate('donasi_global')}
              className="bg-primary hover:bg-primary-container text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">volunteer_activism</span>
              <span>Kirim Bantuan</span>
            </button>
            <button
              onClick={() => onNavigate('berita_global')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold text-[11px] sm:text-xs flex items-center gap-1 transition cursor-pointer"
            >
              <span>Baca Cerita</span>
              <span className="material-symbols-outlined text-[15px] sm:text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Why DT Peduli Section */}
      <section className="flex flex-col gap-4 sm:gap-6 text-center">
        <h2 className="text-base sm:text-xl md:text-2xl text-primary font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
          Mengapa Berdonasi melalui DT Peduli?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
          <div className="bg-surface-container-lowest border border-surface-container-highest p-3.5 sm:p-6 rounded-[12px] flex flex-col items-center gap-2 sm:gap-3 shadow-2xs">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]">visibility</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-on-surface">Transparan</h4>
          </div>
          <div className="bg-surface-container-lowest border border-surface-container-highest p-3.5 sm:p-6 rounded-[12px] flex flex-col items-center gap-2 sm:gap-3 shadow-2xs">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]">verified_user</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-on-surface">Aman</h4>
          </div>
          <div className="bg-surface-container-lowest border border-surface-container-highest p-3.5 sm:p-6 rounded-[12px] flex flex-col items-center gap-2 sm:gap-3 shadow-2xs">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]">my_location</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-on-surface">Tepat Sasaran</h4>
          </div>
          <div className="bg-surface-container-lowest border border-surface-container-highest p-3.5 sm:p-6 rounded-[12px] flex flex-col items-center gap-2 sm:gap-3 shadow-2xs">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]">trending_up</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-on-surface">Terukur</h4>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="flex flex-col gap-4 sm:gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-base sm:text-xl md:text-2xl text-primary font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Berita Terkini</h2>
          <button
            onClick={() => onNavigate('berita_global')}
            className="text-primary font-bold text-xs sm:text-sm hover:underline cursor-pointer"
          >
            Lihat Semua
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
          {/* News Card 1 */}
          <div
            onClick={() => onNavigate('berita_global')}
            className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] p-3.5 sm:p-4 flex flex-col gap-2 hover:border-primary-fixed-dim transition-colors cursor-pointer group shadow-2xs"
          >
            <span className="text-on-surface-variant text-[11px]">12 Agustus 2026</span>
            <h4 className="text-xs sm:text-sm md:text-base text-on-surface group-hover:text-primary-container transition-colors line-clamp-2 font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              PBB: Genosida di Gaza Terus Berlangsung Tanpa Henti
            </h4>
            <p className="text-[11px] sm:text-xs text-on-surface-variant line-clamp-2">
              Para pelapor khusus PBB menyatakan serangan militer masih merenggut ratusan nyawa warga Palestina meski ada klaim gencatan senjata.
            </p>
          </div>
          {/* News Card 2 */}
          <div
            onClick={() => onNavigate('berita_global')}
            className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] p-3.5 sm:p-4 flex flex-col gap-2 hover:border-primary-fixed-dim transition-colors cursor-pointer group shadow-2xs"
          >
            <span className="text-on-surface-variant text-[11px]">10 Agustus 2026</span>
            <h4 className="text-xs sm:text-sm md:text-base text-on-surface group-hover:text-primary-container transition-colors line-clamp-2 font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              UNICEF: 300 Anak Tewas di Gaza Pasca Gencatan Senjata
            </h4>
            <p className="text-[11px] sm:text-xs text-on-surface-variant line-clamp-2">
              UNICEF menyerukan perlindungan bagi anak-anak di Jalur Gaza di tengah serangan yang terus berlanjut.
            </p>
          </div>
          {/* News Card 3 */}
          <div
            onClick={() => onNavigate('berita_global')}
            className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] p-3.5 sm:p-4 flex flex-col gap-2 hover:border-primary-fixed-dim transition-colors cursor-pointer group shadow-2xs"
          >
            <span className="text-on-surface-variant text-[11px]">08 Agustus 2026</span>
            <h4 className="text-xs sm:text-sm md:text-base text-on-surface group-hover:text-primary-container transition-colors line-clamp-2 font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              Krisis Pangan di Gaza Semakin Mengkhawatirkan
            </h4>
            <p className="text-[11px] sm:text-xs text-on-surface-variant line-clamp-2">
              Ahli PBB memperingatkan bahwa bantuan pangan terhambat masuk ke Gaza, memperburuk kondisi warga sipil.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="flex flex-col gap-4 sm:gap-6 max-w-[800px] mx-auto w-full">
        <h2 className="text-base sm:text-xl md:text-2xl text-primary text-center font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
          Pertanyaan yang Sering Diajukan
        </h2>
        <div className="flex flex-col border border-surface-container-highest rounded-[12px] overflow-hidden bg-surface-container-lowest shadow-xs divide-y divide-surface-container-highest">
          {faqs.map((faq, index) => (
            <details key={faq.id || index} className="group" defaultOpen={index === 0}>
              <summary className="flex justify-between items-center p-3.5 sm:p-5 text-xs sm:text-sm font-bold text-on-surface cursor-pointer list-none group-open:text-primary transition-colors hover:bg-surface-container-low gap-2">
                <span>{faq.question}</span>
                <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180 text-primary text-[20px] shrink-0">expand_more</span>
              </summary>
              <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
          {faqs.length === 0 && (
            <div className="p-6 text-center text-xs text-on-surface-variant">
              Belum ada FAQ yang ditampilkan.
            </div>
          )}
        </div>
        <div className="text-center text-xs sm:text-sm text-on-surface-variant mt-1">
          Masih punya pertanyaan?{' '}
          <button onClick={() => onNavigate('kontak')} className="text-primary font-bold hover:underline cursor-pointer">
            Hubungi Kami
          </button>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="w-full bg-primary-container py-8 sm:py-12 md:py-16 px-4 sm:px-8 md:px-12 rounded-[14px] sm:rounded-[16px] shadow-md relative overflow-hidden">
        {/* Background decorative accent */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#fcd400]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-primary-fixed/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 relative z-10">
          <div className="flex-1 text-center md:text-left flex flex-col gap-1.5 sm:gap-2">
            <span className="bg-[#fcd400] text-[#6e5c00] text-[10px] sm:text-xs font-bold px-3 py-0.5 sm:py-1 rounded-full self-center md:self-start uppercase tracking-wider">
              Aksi Nyata Ukhuwah
            </span>
            <h2 
              className="text-lg sm:text-2xl md:text-3xl text-on-primary font-bold leading-tight"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              Siap Menjadi Bagian dari Kebaikan?
            </h2>
            <p className="text-xs sm:text-sm text-tertiary-fixed max-w-lg opacity-95 leading-relaxed">
              Bergabunglah bersama ratusan ribu donatur lainnya untuk mengalirkan harapan dan bantuan nyata bagi saudara kita di Palestina & pelosok negeri.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onNavigate('donasi_global')}
              className="w-full sm:w-auto bg-[#fcd400] text-[#6e5c00] hover:bg-[#ffe16d] h-[44px] sm:h-[50px] px-6 sm:px-8 rounded-full font-bold text-xs sm:text-sm md:text-base transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[22px]">favorite</span>
              <span>Mulai Donasi Sekarang</span>
            </button>

            <button
              onClick={() => onNavigate('campaign_list')}
              className="w-full sm:w-auto bg-primary/60 border border-tertiary-fixed-dim/40 text-on-primary hover:bg-primary h-[44px] sm:h-[50px] px-5 sm:px-6 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span className="material-symbols-outlined text-[18px]">explore</span>
              <span>Lihat Semua Program</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
