import React from 'react';
import { ScreenId } from '../types';
import { DtPeduliLogo } from './DtPeduliLogo';

interface Props {
  onNavigate: (screen: ScreenId) => void;
}

export const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="bg-primary-container text-on-primary w-full py-12 px-4 md:px-16 mt-auto">
      <div className="max-w-[1200px] mx-auto flex flex-col md:grid md:grid-cols-4 gap-8">
        
        {/* Column 1: Brand & Desc */}
        <div className="flex flex-col gap-4 col-span-1 md:col-span-1">
          <div className="flex items-center">
            <DtPeduliLogo variant="white" size="lg" />
          </div>
          <p className="font-body text-body text-tertiary-fixed opacity-90 leading-relaxed">
            Lembaga Amil Zakat Nasional yang berdedikasi untuk pemberdayaan umat melalui pengelolaan zakat, infak, sedekah, dan donasi kemanusiaan.
          </p>
        </div>

        {/* Column 2: Links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-h4 text-h4 text-on-primary mb-1">Jelajahi</h4>
          <button
            onClick={() => onNavigate('tentang')}
            className="text-left font-body text-body text-surface-container-lowest opacity-80 hover:text-secondary-fixed transition-colors cursor-pointer"
          >
            Tentang Kami
          </button>
          <button
            onClick={() => onNavigate('campaign_list')}
            className="text-left font-body text-body text-secondary-container font-bold hover:text-secondary-fixed transition-colors cursor-pointer"
          >
            Program
          </button>
          <button
            onClick={() => onNavigate('berita_global')}
            className="text-left font-body text-body text-surface-container-lowest opacity-80 hover:text-secondary-fixed transition-colors cursor-pointer"
          >
            Berita
          </button>
        </div>

        {/* Column 3: Contact */}
        <div className="flex flex-col gap-3">
          <h4 className="font-h4 text-h4 text-on-primary mb-1">Hubungi Kami</h4>
          <div className="flex items-start gap-2 text-surface-container-lowest opacity-80 font-body text-body">
            <span className="material-symbols-outlined text-[20px]">location_on</span>
            <span>Jl. Gegerkalong Girang No.67, Bandung</span>
          </div>
          <div className="flex items-center gap-2 text-surface-container-lowest opacity-80 font-body text-body mt-1">
            <span className="material-symbols-outlined text-[20px]">mail</span>
            <span>info@dtpeduli.org</span>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-[1200px] mx-auto mt-12 pt-6 border-t border-primary-fixed-dim/30 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <span className="font-body-sm-label text-body-sm-label text-tertiary-fixed opacity-70">
            © 2026 DT Peduli. All Rights Reserved. Lembaga Amil Zakat Nasional.
          </span>
        </div>

        <div className="flex gap-4 items-center">
          <button onClick={() => onNavigate('home_global')} className="text-tertiary-fixed opacity-70 hover:text-secondary-fixed transition-colors" title="Website">
            <span className="material-symbols-outlined">language</span>
          </button>
          <button onClick={() => onNavigate('kontak')} className="text-tertiary-fixed opacity-70 hover:text-secondary-fixed transition-colors" title="Hubungi Kami">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
