import React, { useState, useEffect } from 'react';
import { ScreenId, CampaignItem } from '../types';
import { CAMPAIGNS_DATA, DEFAULT_CATEGORY_SETTINGS } from '../data/mockData';
import { CampaignCard } from '../components/CampaignCard';
import { api } from '../services/api';

interface Props {
  onNavigate: (screen: ScreenId) => void;
  onSelectForDonation: (campaignId: string) => void;
}

export const CampaignListScreen: React.FC<Props> = ({ onNavigate, onSelectForDonation }) => {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(Object.values(CAMPAIGNS_DATA));
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORY_SETTINGS.campaigns);

  useEffect(() => {
    api.getCampaigns().then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setCampaigns(data);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    api.getCategorySettings().then((settings) => setCategories(settings.campaigns)).catch(() => {});
  }, []);

  const allCampaigns = campaigns;

  const filteredCampaigns = allCampaigns.filter((camp) => {
    const matchCat = selectedCategory === 'Semua' || 
      camp.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      camp.title.toLowerCase().includes(selectedCategory.toLowerCase());
    
    const matchSearch = camp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCat && matchSearch;
  });

  return (
    <div className="flex-1 mt-[64px] md:mt-[72px] w-full max-w-[1200px] mx-auto px-3.5 sm:px-6 md:px-16 pt-4 sm:pt-6 pb-16 md:pb-20 flex flex-col gap-4 sm:gap-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-1">
        <h1 className="text-lg sm:text-2xl md:text-3xl text-primary font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
          Program Kemanusiaan & Donasi
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
          Pilih program kebaikan untuk disalurkan ke saudara-saudara kita yang membutuhkan di Gaza dan pelosok Nusantara.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] p-2.5 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-4 shadow-2xs">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm transition whitespace-nowrap cursor-pointer shrink-0 font-medium ${
                selectedCategory === cat
                  ? 'bg-primary text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari program donasi..."
            className="w-full pl-8 pr-3 py-1.5 sm:py-2 rounded-full border border-slate-200 text-xs sm:text-sm bg-surface-container-lowest focus:border-primary focus:outline-hidden"
          />
          <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-slate-400 absolute left-2.5 top-2 sm:top-2.5">
            search
          </span>
        </div>
      </div>

      {/* Grid of campaigns - 2 columns on mobile, 3 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
        {filteredCampaigns.map((camp) => (
          <CampaignCard
            key={camp.id}
            campaign={camp}
            onNavigate={onNavigate}
            onSelectForDonation={onSelectForDonation}
          />
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] p-8 sm:p-12 text-center flex flex-col items-center gap-2">
          <p className="text-xs sm:text-sm text-on-surface-variant">Tidak ada program yang sesuai dengan pencarian Anda.</p>
          <button
            onClick={() => {
              setSelectedCategory('Semua');
              setSearchQuery('');
            }}
            className="text-primary text-xs sm:text-sm font-bold hover:underline cursor-pointer"
          >
            Tampilkan Semua Program
          </button>
        </div>
      )}
    </div>
  );
};
