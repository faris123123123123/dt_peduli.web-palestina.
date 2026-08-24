import React from 'react';
import { ScreenId } from '../types';
import { FALLBACK_IMAGE } from '../data/mockData';

interface Props {
  onNavigate: (screen: ScreenId) => void;
}

export const TentangKamiScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="flex-1 mt-[64px] md:mt-[72px] w-full max-w-[1200px] mx-auto px-3.5 sm:px-6 md:px-16 pt-4 sm:pt-6 pb-24 md:pb-20 flex flex-col gap-4 sm:gap-8">
      {/* Hero Tentang Kami */}
      <section className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] sm:rounded-[16px] p-4 sm:p-6 md:p-8 flex flex-col md:flex-row gap-4 sm:gap-8 items-center shadow-2xs">
        <div className="flex-1 flex flex-col gap-2 sm:gap-3.5 order-2 md:order-1">
          <span className="bg-primary-fixed text-primary text-[10px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-bold self-start">
            Lembaga Amil Zakat Nasional
          </span>
          <h1 
            className="text-lg sm:text-2xl md:text-3xl text-primary font-bold leading-snug"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            Membangun Kemandirian, Mengalirkan Keberkahan
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            LAZNAS Daarut Tauhiid Peduli (DT Peduli) berkhidmat mengelola zakat, infak, sedekah, dan donasi kemanusiaan secara amanah, profesional, dan akuntabel untuk mengangkat martabat kaum dhuafa.
          </p>
        </div>
        <div className="flex-1 w-full rounded-[10px] sm:rounded-[12px] overflow-hidden border border-slate-100 shadow-2xs h-[140px] sm:h-[220px] md:h-[300px] bg-surface-container order-1 md:order-2 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80"
            alt="DT Peduli Relawan"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Visi & Misi - Compact Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] p-3.5 sm:p-6 shadow-2xs flex flex-col gap-2 sm:gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px] sm:text-[22px]">flag</span>
            </div>
            <h2 className="text-sm sm:text-lg text-primary font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              Visi DT Peduli
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Menjadi Lembaga Filantropi & Donasi terpercaya, profesional, dan mandiri yang berfokus pada pembangunan karakter dan pemberdayaan umat berkelanjutan.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] p-3.5 sm:p-6 shadow-2xs flex flex-col gap-2 sm:gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px] sm:text-[22px]">task_alt</span>
            </div>
            <h2 className="text-sm sm:text-lg text-primary font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              Misi DT Peduli
            </h2>
          </div>
          <ul className="text-xs sm:text-sm text-on-surface-variant flex flex-col gap-1 sm:gap-1.5 list-disc list-inside leading-relaxed">
            <li>Menumbuhkan kesadaran berzakat, infak, dan sedekah di masyarakat.</li>
            <li>Pendayagunaan dana donasi berbasis dakwah & kemandirian.</li>
            <li>Tata kelola kelembagaan transparan, modern, dan patuh syariah.</li>
          </ul>
        </div>
      </section>

      {/* Nilai Baku - Compact 2x2 Grid on Mobile, 4-col on Desktop */}
      <section className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-100 p-3.5 sm:p-6 md:p-8 rounded-[12px] sm:rounded-[16px] flex flex-col gap-3 sm:gap-5">
        <div className="text-left sm:text-center flex flex-col gap-0.5">
          <h2 
            className="text-base sm:text-xl md:text-2xl text-primary font-bold"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            Nilai Karakter BAKU (Baik & Kuat)
          </h2>
          <p className="text-[11px] sm:text-xs text-on-surface-variant max-w-xl sm:mx-auto">
            Fondasi kultur Daarut Tauhiid yang menjadi nafas pengabdian seluruh amil DT Peduli.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <div className="bg-white p-2.5 sm:p-4 rounded-[10px] sm:rounded-[12px] flex flex-col gap-1 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">favorite</span>
              <h4 className="text-xs sm:text-sm font-bold truncate">Ikhlas</h4>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-600 leading-snug line-clamp-2">
              Bekerja semata-mata mengharap ridha Allah SWT tanpa pamrih.
            </p>
          </div>

          <div className="bg-white p-2.5 sm:p-4 rounded-[10px] sm:rounded-[12px] flex flex-col gap-1 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">verified_user</span>
              <h4 className="text-xs sm:text-sm font-bold truncate">Jujur & Amanah</h4>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-600 leading-snug line-clamp-2">
              Menjaga rupiah titipan donatur dengan transparansi mutlak.
            </p>
          </div>

          <div className="bg-white p-2.5 sm:p-4 rounded-[10px] sm:rounded-[12px] flex flex-col gap-1 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-1.5 text-amber-700">
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">diversity_1</span>
              <h4 className="text-xs sm:text-sm font-bold truncate">Tawadhu</h4>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-600 leading-snug line-clamp-2">
              Rendah hati melayani muzakki dan mustahik sepenuh hati.
            </p>
          </div>

          <div className="bg-white p-2.5 sm:p-4 rounded-[10px] sm:rounded-[12px] flex flex-col gap-1 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-1.5 text-blue-700">
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">bolt</span>
              <h4 className="text-xs sm:text-sm font-bold truncate">Disiplin & Tangguh</h4>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-600 leading-snug line-clamp-2">
              Cekatan, profesional, dan pantang menyerah di aksi kemanusiaan.
            </p>
          </div>
        </div>
      </section>

      {/* Legalitas & Akreditasi */}
      <section className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] p-3.5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-6 shadow-2xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-primary font-bold text-xs sm:text-sm">
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">verified</span>
            <span>Legalitas & Akuntabilitas Terjamin</span>
          </div>
          <p className="text-[11px] sm:text-xs text-on-surface-variant leading-relaxed">
            SK Kemenag RI No. 257/2022 • Opini Audit Keuangan Wajar Tanpa Pengecualian (WTP) 16 Tahun Berturut-turut.
          </p>
        </div>
        <button
          onClick={() => onNavigate('donasi_global')}
          className="w-full md:w-auto bg-primary hover:bg-primary-container text-white h-[38px] sm:h-[42px] px-5 rounded-full text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          style={{ fontFamily: "'Baloo 2', sans-serif" }}
        >
          <span className="material-symbols-outlined text-[16px]">favorite</span>
          <span>Donasi Sekarang</span>
        </button>
      </section>
    </div>
  );
};
