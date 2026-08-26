import React, { useState, useEffect } from 'react';
import { ScreenId, NewsItem } from '../types';
import { NEWS_DATA, FALLBACK_IMAGE, DEFAULT_CATEGORY_SETTINGS } from '../data/mockData';
import { api } from '../services/api';

interface Props {
  isFixedVariant?: boolean;
  onNavigate: (screen: ScreenId) => void;
  onSelectCampaignForDonation?: (campaignId: string) => void;
}

export const BeritaScreen: React.FC<Props> = ({ onNavigate }) => {
  const [newsList, setNewsList] = useState<NewsItem[]>(NEWS_DATA);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORY_SETTINGS.news);

  useEffect(() => {
    api.getNews().then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setNewsList(data);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    api.getCategorySettings().then((settings) => setCategories(settings.news)).catch(() => {});
  }, []);

  const filteredNews = newsList.filter((news) => {
    if (activeCategory === 'Semua') return true;
    return news.category === activeCategory || news.tags?.includes(activeCategory);
  });

  return (
    <div className="flex-1 mt-[64px] md:mt-[72px] w-full max-w-[1200px] mx-auto px-3.5 sm:px-6 md:px-16 pt-4 sm:pt-6 pb-24 md:pb-20 flex flex-col gap-4 sm:gap-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-1">
        <h1 
          className="text-lg sm:text-2xl md:text-3xl text-primary font-bold"
          style={{ fontFamily: "'Baloo 2', sans-serif" }}
        >
          Kabar & Berita Kemanusiaan
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
          Informasi terkini penyaluran bantuan, kondisi saudara di Palestina, dan kabar program DT Peduli dari lapangan.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm transition whitespace-nowrap cursor-pointer shrink-0 font-medium ${
              activeCategory === cat
                ? 'bg-primary text-white font-bold shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: 2 columns on mobile, 3 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
        {filteredNews.map((news) => (
          <div
            key={news.id}
            onClick={() => setSelectedNews(news)}
            className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] sm:rounded-[14px] overflow-hidden flex flex-col hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group shadow-2xs h-full"
          >
            <div className="h-[110px] sm:h-[160px] md:h-[190px] relative w-full overflow-hidden bg-surface-container shrink-0">
              <img
                src={news.imageUrl}
                alt={news.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-surface-container-lowest/95 backdrop-blur-xs text-primary text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-1 shadow-xs max-w-[85%] truncate">
                <span className="material-symbols-outlined text-[13px] sm:text-[15px] shrink-0">newspaper</span>
                <span className="truncate">{news.category}</span>
              </div>
            </div>

            <div className="p-2.5 sm:p-4 md:p-5 flex flex-col flex-1 justify-between gap-2 sm:gap-3">
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 font-medium">
                  <span className="truncate">{news.date}</span>
                  <span className="hidden sm:inline text-slate-400">• {news.author}</span>
                </div>
                
                <h3 
                  className="text-xs sm:text-sm md:text-base text-on-surface line-clamp-2 min-h-[32px] sm:min-h-[40px] group-hover:text-primary transition-colors font-bold leading-tight sm:leading-snug"
                  style={{ fontFamily: "'Baloo 2', sans-serif" }}
                  title={news.title}
                >
                  {news.title}
                </h3>

                <p className="text-[11px] sm:text-xs text-on-surface-variant line-clamp-2 leading-relaxed hidden sm:block">
                  {news.summary}
                </p>
              </div>

              <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-primary text-[11px] sm:text-xs font-bold">
                <span>Baca Berita</span>
                <span className="material-symbols-outlined text-[15px] sm:text-[17px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] p-8 sm:p-12 text-center flex flex-col items-center gap-2">
          <p className="text-xs sm:text-sm text-on-surface-variant">Tidak ada berita yang sesuai dengan kategori ini.</p>
          <button
            onClick={() => setActiveCategory('Semua')}
            className="text-primary text-xs sm:text-sm font-bold hover:underline cursor-pointer"
          >
            Tampilkan Semua Berita
          </button>
        </div>
      )}

      {/* Modal Detail Berita - Mobile Optimized */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-t-[20px] sm:rounded-[16px] max-w-[760px] w-full max-h-[85vh] overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-5 shadow-2xl relative">
            <div className="flex items-center justify-between sticky top-0 bg-surface-container-lowest pb-2 border-b border-slate-100 z-10">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-on-surface-variant truncate">
                <span className="bg-primary-fixed text-primary px-2.5 py-0.5 rounded-full font-bold">
                  {selectedNews.category}
                </span>
                <span>•</span>
                <span className="truncate">{selectedNews.date}</span>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <h2 
              className="text-base sm:text-xl md:text-2xl text-primary font-bold leading-snug"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              {selectedNews.title}
            </h2>

            <div className="h-40 sm:h-64 md:h-72 w-full rounded-[10px] overflow-hidden bg-surface-container shrink-0">
              <img
                src={selectedNews.imageUrl}
                alt={selectedNews.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-xs sm:text-sm text-on-surface-variant flex flex-col gap-3 leading-relaxed">
              <p className="font-semibold text-on-surface text-xs sm:text-base bg-slate-50 p-2.5 sm:p-3 rounded-lg border border-slate-100">
                {selectedNews.summary}
              </p>
              {selectedNews.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="pt-3 border-t border-surface-container-highest flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-4 sm:px-6 py-2 rounded-full bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-200 cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setSelectedNews(null);
                  onNavigate('donasi_global');
                }}
                className="px-4 sm:px-6 py-2 rounded-full bg-primary hover:bg-primary-container text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                style={{ fontFamily: "'Baloo 2', sans-serif" }}
              >
                <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
                <span>Salurkan Bantuan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
