import React, { useState } from 'react';
import { CampaignItem, ScreenId } from '../types';
import { FALLBACK_IMAGE } from '../data/mockData';

interface Props {
  campaign: CampaignItem;
  screenTitle?: string;
  onNavigate: (screen: ScreenId) => void;
  onSelectForDonation: (campaignId: string) => void;
}

export const CampaignDetailScreen: React.FC<Props> = ({ 
  campaign, 
  onNavigate, 
  onSelectForDonation 
}) => {
  const [activeTab, setActiveTab] = useState<'cerita' | 'kabar' | 'doa'>('cerita');
  const [copied, setCopied] = useState(false);

  const percentage = Math.min(100, Math.round((campaign.collectedAmount / campaign.targetAmount) * 100));

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleDonateNow = () => {
    onSelectForDonation(campaign.id);
    onNavigate('donasi_global');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 mt-[64px] md:mt-[72px] w-full max-w-[1200px] mx-auto px-3.5 sm:px-6 md:px-16 pt-4 sm:pt-6 pb-16 md:pb-20 flex flex-col gap-4 sm:gap-6">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => onNavigate('campaign_list')}
          className="inline-flex items-center gap-1 text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer truncate"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[20px] shrink-0">arrow_back</span>
          <span className="truncate">Kembali</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="bg-primary-fixed text-primary text-[10px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-bold">
            {campaign.category}
          </span>
          <button
            onClick={handleShare}
            className="h-[32px] sm:h-[36px] px-2.5 sm:px-3 rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface text-[11px] sm:text-xs flex items-center gap-1 hover:bg-surface-container transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px] sm:text-[16px]">share</span>
            <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
        
        {/* Left Column: Image, Title, Tabs */}
        <div className="lg:col-span-8 flex flex-col gap-4 sm:gap-6">
          
          {/* Main Media & Header */}
          <div className="bg-surface-container-lowest rounded-[12px] border border-surface-container-highest overflow-hidden shadow-xs">
            <div className="h-[220px] sm:h-[320px] md:h-[400px] w-full relative overflow-hidden bg-surface-container">
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2 text-on-surface-variant text-[11px] sm:text-xs flex-wrap">
                <span className="material-symbols-outlined text-[14px] sm:text-[16px] text-primary">location_on</span>
                <span>{campaign.location}</span>
                <span>•</span>
                <span>Penyelenggara: <strong>{campaign.organizer}</strong></span>
              </div>

              <h1 className="text-base sm:text-xl md:text-2xl text-primary font-bold leading-snug" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                {campaign.title}
              </h1>

              {/* Progress Summary in Card */}
              <div className="bg-slate-50 border border-slate-200/80 p-3.5 sm:p-5 rounded-[12px] flex flex-col gap-2.5 sm:gap-3">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs text-slate-500 font-medium">Dana Terkumpul</span>
                    <span className="text-base sm:text-xl md:text-2xl font-bold text-primary" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                      {formatRupiah(campaign.collectedAmount)}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#00296d] bg-[#b2c5ff]/30 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shrink-0">
                    {percentage}% Terkumpul
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-2 sm:h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-[10px] sm:text-xs text-slate-600 font-medium pt-0.5">
                  <span>Target: <b className="text-slate-800">{formatRupiah(campaign.targetAmount)}</b></span>
                </div>

                {/* 2-Column Stats Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2 border-t border-slate-200/70">
                  <div className="flex items-center gap-1.5 sm:gap-2.5 bg-white p-2 sm:p-2.5 rounded-lg border border-slate-100 shadow-2xs">
                    <span className="material-symbols-outlined text-primary text-[18px] sm:text-[22px] shrink-0">group</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-slate-800 text-xs sm:text-sm truncate">{campaign.donorsCount}</span>
                      <span className="text-[9px] sm:text-[11px] text-slate-500 font-medium truncate">Donatur</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2.5 bg-white p-2 sm:p-2.5 rounded-lg border border-slate-100 shadow-2xs">
                    <span className="material-symbols-outlined text-amber-600 text-[18px] sm:text-[22px] shrink-0">schedule</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-slate-800 text-xs sm:text-sm truncate">{campaign.daysRemaining}</span>
                      <span className="text-[9px] sm:text-[11px] text-slate-500 font-medium truncate">Hari Tersisa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Tabs */}
          <div className="bg-surface-container-lowest rounded-[12px] border border-surface-container-highest shadow-xs overflow-hidden">
            <div className="flex border-b border-surface-container-highest">
              <button
                onClick={() => setActiveTab('cerita')}
                className={`flex-1 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'cerita'
                    ? 'border-primary text-primary bg-primary-fixed/20'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Cerita
              </button>
              <button
                onClick={() => setActiveTab('kabar')}
                className={`flex-1 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'kabar'
                    ? 'border-primary text-primary bg-primary-fixed/20'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Kabar ({campaign.updates.length})
              </button>
              <button
                onClick={() => setActiveTab('doa')}
                className={`flex-1 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'doa'
                    ? 'border-primary text-primary bg-primary-fixed/20'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Doa ({campaign.recentDonors.length})
              </button>
            </div>

            <div className="p-4 sm:p-6 md:p-8">
              {activeTab === 'cerita' && (
                <div className="flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm md:text-base text-on-surface-variant leading-relaxed">
                  <p className="font-semibold text-on-surface text-sm sm:text-base">
                    {campaign.description}
                  </p>
                  {campaign.story.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}

              {activeTab === 'kabar' && (
                <div className="flex flex-col gap-4 sm:gap-6">
                  {campaign.updates.map((update, idx) => (
                    <div key={idx} className="flex flex-col gap-2 sm:gap-3 pb-4 sm:pb-6 border-b border-surface-container-highest last:border-0 last:pb-0">
                      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px] sm:text-[16px] text-primary">event_available</span>
                        <span>{update.date}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm md:text-base font-bold text-on-surface" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{update.title}</h4>
                      <p className="text-xs sm:text-sm text-on-surface-variant">{update.description}</p>
                      {update.imageUrl && (
                        <div className="h-36 sm:h-48 rounded-[8px] overflow-hidden mt-1.5 bg-surface-container">
                          <img
                            src={update.imageUrl}
                            alt={update.title}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'doa' && (
                <div className="flex flex-col gap-3 sm:gap-4">
                  {campaign.recentDonors.map((donor, idx) => (
                    <div key={idx} className="p-3 sm:p-4 rounded-[8px] bg-surface-container-low border border-surface-container-highest flex flex-col gap-1.5 sm:gap-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-xs">
                            {donor.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-on-surface">{donor.name}</p>
                            <p className="text-[10px] sm:text-[11px] text-on-surface-variant">{donor.timeAgo}</p>
                          </div>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-primary">{formatRupiah(donor.amount)}</span>
                      </div>
                      {donor.prayer && (
                        <p className="text-[11px] sm:text-xs text-on-surface italic bg-surface-container-lowest p-2 rounded-[6px] border border-surface-container-highest">
                          &quot;{donor.prayer}&quot;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Donation Card */}
        <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
          <div className="bg-surface-container-lowest rounded-[12px] border border-surface-container-highest p-4 sm:p-6 shadow-xs flex flex-col gap-3.5 sm:gap-5 sticky top-[90px]">
            <h3 className="text-base sm:text-lg text-primary font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              Salurkan Donasi Anda
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Bantuan Anda sangat berarti bagi kelangsungan hidup anak-anak dan keluarga yang membutuhkan.
            </p>

            <button
              onClick={handleDonateNow}
              className="w-full bg-primary-container text-on-primary h-[44px] sm:h-[48px] rounded-full text-xs sm:text-sm font-bold hover:bg-primary transition-all duration-200 shadow-xs hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span>Donasi Sekarang</span>
            </button>

            <div className="border-t border-surface-container-highest pt-3 flex flex-col gap-2 text-[11px] sm:text-xs text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-primary shrink-0">verified</span>
                <span>Lembaga Resmi Berizin Kemenag RI</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-primary shrink-0">lock</span>
                <span>Pembayaran Aman & Terenkripsi</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-primary shrink-0">receipt_long</span>
                <span>Kuitansi Donasi Sah Otomatis</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
