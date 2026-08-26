import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

interface Props {
  variant?: 'default' | 'white' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'responsive';
  className?: string;
  showTagline?: boolean;
}

export const DtPeduliLogo: React.FC<Props> = ({
  variant = 'default',
  size = 'responsive',
  className = '',
  showTagline = false,
}) => {
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    let mounted = true;
    api.getBrandingSettings().then((settings) => {
      if (mounted) setLogoUrl(settings.logoUrl || '');
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Brand Colors matching DT Peduli visual identity
  const amberColor = '#F5A417'; // Authentic golden yellow/amber for "dt"
  const blueColor = variant === 'white' ? '#FFFFFF' : '#234FA2'; // Deep royal blue for "peduli" (or white on dark backgrounds)

  // Height & Text Scale mappings
  const sizeConfig = {
    xs: { text: 'text-[18px]', tracking: '-tracking-[0.03em]' },
    sm: { text: 'text-[21px]', tracking: '-tracking-[0.03em]' },
    md: { text: 'text-[26px]', tracking: '-tracking-[0.03em]' },
    lg: { text: 'text-[32px]', tracking: '-tracking-[0.03em]' },
    xl: { text: 'text-[40px]', tracking: '-tracking-[0.03em]' },
    responsive: { text: 'text-[22px] sm:text-[26px] md:text-[30px]', tracking: '-tracking-[0.03em]' },
  };

  const cfg = sizeConfig[size] || sizeConfig.responsive;

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="DT Peduli"
        className={`w-auto object-contain ${size === 'responsive' ? 'h-7 sm:h-8 md:h-9' : 'h-8' } ${className}`}
        referrerPolicy="no-referrer"
        onError={() => setLogoUrl('')}
      />
    );
  }

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className={`flex items-baseline font-black leading-none ${cfg.tracking}`}>
        {/* Styled DT Peduli Wordmark */}
        <span
          className={`${cfg.text} font-black font-sans`}
          style={{
            color: amberColor,
            fontFamily: "'Baloo 2', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
            fontWeight: 800,
            letterSpacing: '-0.04em',
          }}
        >
          dt
        </span>
        <span
          className={`${cfg.text} font-black font-sans ml-[1.5px]`}
          style={{
            color: blueColor,
            fontFamily: "'Baloo 2', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
            fontWeight: 800,
            letterSpacing: '-0.03em',
          }}
        >
          peduli
        </span>
      </div>
      {showTagline && (
        <span 
          className="text-[9px] uppercase tracking-wider font-bold opacity-80 mt-0.5"
          style={{ color: variant === 'white' ? '#FFFFFF' : '#234FA2' }}
        >
          Lembaga Amil Zakat Nasional
        </span>
      )}
    </div>
  );
};
