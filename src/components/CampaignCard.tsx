import React from 'react';
import { CampaignItem, ScreenId } from '../types';
import { FALLBACK_IMAGE } from '../data/mockData';

interface Props {
  campaign: CampaignItem;
  onNavigate: (screen: ScreenId) => void;
  onSelectForDonation?: (campaignId: string) => void;
}

export const CampaignCard: React.FC<Props> = ({ campaign, onNavigate, onSelectForDonation }) => {
  const percentage = Math.min(100, Math.round((campaign.collectedAmount / campaign.targetAmount) * 100));

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCardClick = () => {
    if (campaign.screenId) {
      onNavigate(campaign.screenId);
    } else {
      onNavigate('campaign_list');
    }
  };

  const handleDonateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectForDonation) {
      onSelectForDonation(campaign.id);
    }
    onNavigate('donasi_global');
  };

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('kesehatan')) return 'medical_services';
    if (category.toLowerCase().includes('air')) return 'water_drop';
    if (category.toLowerCase().includes('pendidikan')) return 'school';
    return 'restaurant';
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-surface-container-lowest rounded-[12px] sm:rounded-[14px] border border-surface-container-highest overflow-hidden flex flex-col group hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer h-full"
    >
      <div className="h-[110px] sm:h-[160px] md:h-[190px] relative w-full overflow-hidden bg-surface-container shrink-0">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={campaign.imageUrl}
          alt={campaign.title}
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-surface-container-lowest/95 backdrop-blur-xs text-primary text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-1 shadow-xs max-w-[85%] truncate">
          <span className="material-symbols-outlined text-[13px] sm:text-[15px] shrink-0">{getCategoryIcon(campaign.category)}</span>
          <span className="truncate">{campaign.category}</span>
        </div>
      </div>

      <div className="p-2.5 sm:p-4 md:p-5 flex flex-col flex-1 justify-between gap-2.5 sm:gap-3.5">
        {/* Title */}
        <h3 
          className="text-xs sm:text-sm md:text-base text-on-surface line-clamp-2 min-h-[32px] sm:min-h-[40px] group-hover:text-primary transition-colors font-bold leading-tight sm:leading-snug" 
          style={{ fontFamily: "'Baloo 2', sans-serif" }}
          title={campaign.title}
        >
          {campaign.title}
        </h3>

        {/* Progress & Target Section */}
        <div className="flex flex-col gap-1 sm:gap-1.5 bg-slate-50/90 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-slate-100">
          <div className="flex items-baseline justify-between gap-1">
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] sm:text-[11px] font-medium text-slate-500 leading-none mb-0.5">Terkumpul</span>
              <span className="text-xs sm:text-sm md:text-base font-bold text-primary truncate leading-tight" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                {formatRupiah(campaign.collectedAmount)}
              </span>
            </div>
            <span className="text-[9px] sm:text-xs font-bold text-[#00296d] bg-[#b2c5ff]/30 px-1.5 py-0.5 rounded-full shrink-0">
              {percentage}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-1.5 sm:h-2 rounded-full overflow-hidden my-0.5">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="text-[9px] sm:text-[11px] text-slate-500 font-medium flex justify-between items-center pt-0.5 gap-1">
            <span className="shrink-0">Target:</span>
            <span className="font-semibold text-slate-700 truncate text-right">{formatRupiah(campaign.targetAmount)}</span>
          </div>
        </div>

        {/* Donatur & Sisa Hari */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1 sm:gap-2 bg-slate-50 p-1.5 sm:px-2.5 sm:py-2 rounded-md sm:rounded-lg border border-slate-100 min-w-0">
            <span className="material-symbols-outlined text-primary text-[14px] sm:text-[17px] shrink-0">group</span>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-slate-800 leading-tight truncate">{campaign.donorsCount}</span>
              <span className="text-[8px] sm:text-[10px] text-slate-500 leading-none truncate">Donatur</span>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 bg-slate-50 p-1.5 sm:px-2.5 sm:py-2 rounded-md sm:rounded-lg border border-slate-100 min-w-0">
            <span className="material-symbols-outlined text-amber-600 text-[14px] sm:text-[17px] shrink-0">schedule</span>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-slate-800 leading-tight truncate">{campaign.daysRemaining}</span>
              <span className="text-[8px] sm:text-[10px] text-slate-500 leading-none truncate">Hari Lagi</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDonateClick}
          className="w-full h-8 sm:h-10 md:h-11 bg-primary hover:bg-primary-container text-white rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99] shrink-0"
          style={{ fontFamily: "'Baloo 2', sans-serif" }}
        >
          <span className="truncate">Donasi Sekarang</span>
        </button>
      </div>
    </div>
  );
};
