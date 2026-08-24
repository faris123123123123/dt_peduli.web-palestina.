import React, { useState, useEffect } from 'react';
import { ScreenId, DonationTransaction } from '../types';

interface Props {
  transaction: DonationTransaction;
  onNavigate: (screen: ScreenId) => void;
  onVerifyPayment: () => void;
}

export const DonasiPaymentScreen: React.FC<Props> = ({ 
  transaction, 
  onNavigate, 
  onVerifyPayment 
}) => {
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showHowToPay, setShowHowToPay] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyAccount = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(transaction.accountNumber.replace(/\D/g, ''));
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  const handleCopyAmount = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(transaction.totalAmount.toString());
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  const handleDownloadQris = () => {
    // Generate a downloadable image from canvas or open image
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 600, 700);

      // Header Banner
      ctx.fillStyle = '#C00000';
      ctx.fillRect(0, 0, 600, 80);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('QRIS - PEMBAYARAN NASIONAL', 300, 52);

      // Merchant Info
      ctx.fillStyle = '#00296D';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('LAZNAS DAARUT TAUHIID PEDULI', 300, 130);

      ctx.fillStyle = '#555555';
      ctx.font = '16px monospace';
      ctx.fillText('NMID: ID1020039201923', 300, 160);

      // QR placeholder simulation in canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(150, 190, 300, 300);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(170, 210, 260, 260);

      // QR blocks
      ctx.fillStyle = '#00296D';
      ctx.fillRect(190, 230, 80, 80);
      ctx.fillRect(330, 230, 80, 80);
      ctx.fillRect(190, 370, 80, 80);
      ctx.fillRect(290, 330, 60, 60);

      ctx.fillStyle = '#F5A417';
      ctx.fillRect(270, 310, 60, 60);

      // Nominal Box
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(50, 520, 500, 90);
      ctx.strokeStyle = '#E2E8F0';
      ctx.strokeRect(50, 520, 500, 90);

      ctx.fillStyle = '#334155';
      ctx.font = '16px sans-serif';
      ctx.fillText('Total Donasi: Rp ' + transaction.totalAmount.toLocaleString('id-ID'), 300, 560);
      ctx.fillStyle = '#64748B';
      ctx.font = '14px sans-serif';
      ctx.fillText(transaction.campaignTitle, 300, 590);

      // Footer
      ctx.fillStyle = '#94A3B8';
      ctx.font = '13px sans-serif';
      ctx.fillText('Dicetak resmi oleh DT Peduli • www.dtpeduli.org', 300, 650);

      const link = document.createElement('a');
      link.download = `QRIS_DTPeduli_${transaction.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }
  };

  const handleConfirmPaid = () => {
    onVerifyPayment();
    onNavigate('bukti_donasi');
  };

  const isQris = transaction.paymentMethod.toLowerCase().includes('qris');

  return (
    <div className="flex-1 mt-[56px] sm:mt-[64px] md:mt-[72px] w-full max-w-[760px] mx-auto px-3.5 sm:px-6 md:px-12 pt-4 sm:pt-6 pb-24 md:pb-20 flex flex-col gap-3.5 sm:gap-5">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('donasi_global')}
          className="text-xs sm:text-sm text-on-surface-variant hover:text-primary flex items-center gap-1 cursor-pointer font-medium"
        >
          <span className="material-symbols-outlined text-[16px] sm:text-[18px]">arrow_back</span>
          <span>Ubah Data Donasi</span>
        </button>
        <span className="text-[11px] sm:text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-full text-slate-700 font-mono border border-slate-200">
          ID: {transaction.id}
        </span>
      </div>

      {/* Countdown Timer Strip */}
      <div className="bg-primary text-white rounded-[12px] p-3 sm:p-4 text-center flex flex-col sm:flex-row items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs text-white/90">
          <span className="material-symbols-outlined text-[18px] text-amber-300">schedule</span>
          <span>Selesaikan pembayaran dalam batas waktu:</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono font-bold text-sm sm:text-base">
          <div className="bg-white/15 px-2 py-0.5 rounded text-white">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <span>:</span>
          <div className="bg-white/15 px-2 py-0.5 rounded text-white">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <span>:</span>
          <div className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded font-bold">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Main Payment Container */}
      <div className="bg-surface-container-lowest border border-surface-container-highest rounded-[14px] p-3.5 sm:p-6 md:p-7 flex flex-col gap-4 sm:gap-6 shadow-2xs">
        
        {/* Campaign Info Summary Box */}
        <div className="bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-[10px] flex justify-between items-center text-xs sm:text-sm">
          <div className="flex flex-col gap-0.5 pr-2">
            <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold">Program Kebaikan</span>
            <span className="font-bold text-primary line-clamp-1">{transaction.campaignTitle}</span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold">Donatur</span>
            <span className="font-bold text-slate-800 block">{transaction.donorName}</span>
          </div>
        </div>

        {/* Dynamic Payment Details: QRIS vs Bank Transfer */}
        {isQris ? (
          <div className="flex flex-col gap-4">
            
            {/* Authentic QRIS Card Component */}
            <div className="bg-white border-2 border-slate-200 rounded-[16px] overflow-hidden shadow-sm flex flex-col">
              
              {/* Official Red QRIS Header */}
              <div className="bg-[#B30000] text-white px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-black text-base sm:text-lg tracking-wider font-sans">QRIS</span>
                  <span className="text-[9px] sm:text-[11px] leading-tight text-white/90 hidden sm:inline-block border-l border-white/30 pl-2">
                    Quick Response Code<br />Indonesian Standard
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold bg-white/20 px-2 py-0.5 rounded tracking-wider uppercase">
                  GPN NASIONAL
                </span>
              </div>

              {/* QR Body */}
              <div className="p-4 sm:p-6 flex flex-col items-center gap-3.5 bg-gradient-to-b from-white to-slate-50/50">
                
                {/* Merchant Name */}
                <div className="text-center flex flex-col items-center">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                    {transaction.accountHolder || 'LAZNAS DAARUT TAUHIID PEDULI'}
                  </h3>
                  <span className="text-[10px] sm:text-xs font-mono text-slate-500 mt-0.5">
                    NMID: ID1020039201923
                  </span>
                </div>

                {/* QR Code Container */}
                <div className="w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] bg-white p-3 rounded-[12px] border-2 border-slate-900 shadow-xs flex items-center justify-center relative group">
                  {transaction.qrisImageUrl ? (
                    <img
                      src={transaction.qrisImageUrl}
                      alt="QRIS Barcode"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full relative flex flex-col items-center justify-center bg-white p-2">
                      {/* Crisp Authentic Vector-style QR Code Simulation */}
                      <div className="w-full h-full border-4 border-slate-900 p-2 flex flex-col justify-between relative bg-white">
                        {/* Top corner squares */}
                        <div className="flex justify-between w-full">
                          <div className="w-9 h-9 border-4 border-slate-900 flex items-center justify-center">
                            <div className="w-4 h-4 bg-slate-900"></div>
                          </div>
                          <div className="w-9 h-9 border-4 border-slate-900 flex items-center justify-center">
                            <div className="w-4 h-4 bg-slate-900"></div>
                          </div>
                        </div>

                        {/* Middle pattern */}
                        <div className="flex items-center justify-center my-auto">
                          <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center border border-primary/30">
                            <span className="text-[10px] font-black text-primary" style={{ fontFamily: "'Baloo 2', sans-serif" }}>dt</span>
                          </div>
                        </div>

                        {/* Bottom corner square & pattern */}
                        <div className="flex justify-between items-end w-full">
                          <div className="w-9 h-9 border-4 border-slate-900 flex items-center justify-center">
                            <div className="w-4 h-4 bg-slate-900"></div>
                          </div>
                          <div className="flex gap-1">
                            <div className="w-2.5 h-2.5 bg-slate-900"></div>
                            <div className="w-2.5 h-2.5 bg-slate-900"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Amount to Pay Banner */}
                <div className="w-full bg-amber-50/80 border border-amber-200 rounded-[10px] p-2.5 sm:p-3 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs text-amber-900 font-semibold">Nominal Pembayaran:</span>
                    <span className="text-base sm:text-xl font-bold text-slate-900 font-mono">
                      Rp {transaction.totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAmount}
                    className="px-2.5 sm:px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-xs font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer shrink-0"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedAmount ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedAmount ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>

                {/* QR Quick Actions for Mobile */}
                <div className="w-full flex flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadQris}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 h-[38px] sm:h-[40px] rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      {downloadSuccess ? 'check_circle' : 'download'}
                    </span>
                    <span>{downloadSuccess ? 'QR Tersimpan' : 'Simpan / Unduh QR'}</span>
                  </button>
                </div>

              </div>

              {/* Supported E-Wallets and Banks Badges */}
              <div className="bg-slate-50 border-t border-slate-100 px-3 py-2 flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-500">
                <span className="font-semibold">Bisa dibayar dengan:</span>
                <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded font-medium text-slate-700">GoPay</span>
                <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded font-medium text-slate-700">OVO</span>
                <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded font-medium text-slate-700">DANA</span>
                <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded font-medium text-slate-700">ShopeePay</span>
                <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded font-medium text-slate-700">BCA</span>
                <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded font-medium text-slate-700">Livin Mandiri</span>
                <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded font-medium text-slate-700">BRImo</span>
                <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded font-medium text-slate-700">BSI Mobile</span>
              </div>
            </div>

            {/* How to Pay Guide (Collapsible) */}
            <div className="border border-slate-200 rounded-[12px] overflow-hidden">
              <button
                type="button"
                onClick={() => setShowHowToPay(!showHowToPay)}
                className="w-full bg-slate-50 hover:bg-slate-100/80 px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-slate-800 cursor-pointer transition"
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">help_outline</span>
                  <span>Petunjuk Pembayaran QRIS</span>
                </div>
                <span className="material-symbols-outlined text-[18px]">
                  {showHowToPay ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {showHowToPay && (
                <div className="p-3.5 bg-white text-xs text-slate-600 flex flex-col gap-2 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                    <p>Buka aplikasi e-Wallet (GoPay, OVO, DANA, ShopeePay) atau Mobile Banking Anda.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                    <p>Pilih menu <strong>Bayar</strong> / <strong>Scan QRIS</strong>, lalu arahkan kamera ke kode QR di atas (atau pilih dari galeri jika mengunduh gambar).</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                    <p>Periksa nama penerima harus <strong>LAZNAS DAARUT TAUHIID PEDULI</strong> dan pastikan nominal tepat <strong>Rp {transaction.totalAmount.toLocaleString('id-ID')}</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</span>
                    <p>Masukkan PIN Anda dan tekan tombol <strong>"Saya Sudah Bayar"</strong> di bawah setelah transaksi selesai.</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="flex flex-col gap-4">
            
            {/* Bank Account Box */}
            <div className="bg-surface-container-low border border-surface-container-highest p-4 rounded-[12px] flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs text-on-surface-variant border-b border-slate-200/60 pb-2">
                <div className="flex items-center gap-2">
                  {transaction.logoUrl && (
                    <img
                      src={transaction.logoUrl}
                      alt={transaction.paymentMethod}
                      className="w-8 h-6 object-contain rounded bg-white p-0.5 border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <span className="font-bold text-slate-800">{transaction.paymentMethod}</span>
                </div>
                <span className="text-primary font-bold text-xs bg-primary/10 px-2 py-0.5 rounded">Verifikasi Otomatis</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg sm:text-2xl text-primary font-bold font-mono">
                  {transaction.accountNumber}
                </span>
                <button
                  onClick={handleCopyAccount}
                  className="px-3 py-1 rounded-full border border-primary text-primary hover:bg-primary-fixed text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedAccount ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedAccount ? 'Tersalin' : 'Salin Rekening'}</span>
                </button>
              </div>
              <span className="text-xs text-on-surface-variant">
                Atas Nama: <strong className="text-slate-800">{transaction.accountHolder}</strong>
              </span>
            </div>

            {/* Total Amount Box */}
            <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-[10px] flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">Jumlah Transfer Wajib Tepat:</span>
                <span className="bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                  TERMASUK KODE UNIK
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg sm:text-2xl text-primary font-bold font-mono">
                  Rp {transaction.totalAmount.toLocaleString('id-ID')}
                </span>
                <button
                  onClick={handleCopyAmount}
                  className="px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedAmount ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedAmount ? 'Tersalin' : 'Salin Jumlah'}</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-600">
                Pastikan nominal transfer tepat hingga 3 digit terakhir (Rp {transaction.uniqueCode}) agar sistem dapat memvalidasi otomatis.
              </span>
            </div>

          </div>
        )}

        {/* Final Confirmation Action */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={handleConfirmPaid}
            className="w-full bg-primary hover:bg-primary-container text-white h-[46px] sm:h-[50px] rounded-full text-sm sm:text-base font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>Saya Sudah Transfer / Bayar</span>
          </button>
        </div>

      </div>
    </div>
  );
};
