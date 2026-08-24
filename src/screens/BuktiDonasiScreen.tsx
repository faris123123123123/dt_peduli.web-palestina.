import React from 'react';
import { ScreenId, DonationTransaction } from '../types';
import { DtPeduliLogo } from '../components/DtPeduliLogo';

interface Props {
  transaction: DonationTransaction;
  onNavigate: (screen: ScreenId) => void;
}

export const BuktiDonasiScreen: React.FC<Props> = ({ transaction, onNavigate }) => {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    const receiptContent = `
============================================================
              YAYASAN DAARUT TAUHIID PEDULI
      TANDA TERIMA DONASI DIGITAL RESMI (E-RECEIPT)
       SK Kemenag RI No. 257/2022 | www.dtpeduli.org
============================================================

Nomor Tanda Terima : ${transaction.id}
Tanggal Transaksi  : ${transaction.createdAt}
Status Pembayaran  : LUNAS / TERVERIFIKASI

------------------------------------------------------------
RINCIAN DONATUR & PROGRAM
------------------------------------------------------------
Nama Donatur       : ${transaction.donorName}
No. WhatsApp       : ${transaction.donorPhone || '-'}
Email              : ${transaction.donorEmail || '-'}
Program Kebaikan   : ${transaction.campaignTitle}
Metode Pembayaran  : ${transaction.paymentMethod}

------------------------------------------------------------
RINCIAN NOMINAL
------------------------------------------------------------
Nominal Pokok      : ${formatRupiah(transaction.amount)}
Kode Unik          : ${formatRupiah(transaction.uniqueCode || 0)}
TOTAL DITERIMA     : ${formatRupiah(transaction.totalAmount || transaction.amount)}

Doa & Pesan        : "${transaction.prayer || 'Semoga berkah dan bermanfaat bagi umat.'}"

============================================================
Jazakumullah Khairan Katsiran atas kebaikan dan kepedulian Anda.
Semoga Allah SWT membalas dengan pahala berlipat ganda,
keberkahan rizki, dan kesehatan lahir batin. Aamiin.

Customer Care DT Peduli: 0812-3456-7890 | care@dtpeduli.org
============================================================
`;
    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bukti_Donasi_${transaction.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShareWa = () => {
    const text = `Alhamdulillah, saya telah berdonasi melalui DT Peduli untuk "${transaction.campaignTitle}" sebesar ${formatRupiah(transaction.totalAmount)}. Mari bersama tebarkan manfaat: https://dtpeduli.org`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex-1 mt-[64px] md:mt-[72px] w-full max-w-[700px] mx-auto px-4 md:px-16 pt-8 pb-20 flex flex-col gap-6">
      
      {/* Top Banner */}
      <div className="text-center flex flex-col items-center gap-2">
        <div className="w-14 h-14 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[36px]">verified</span>
        </div>
        <h1 className="font-h2-mobile md:font-h2 text-h2-mobile md:text-h2 text-primary font-bold">
          Donasi Anda Berhasil Terverifikasi
        </h1>
        <p className="font-body text-body text-on-surface-variant max-w-md">
          Jazakumullah khairan katsiran. Amanah donasi Anda telah kami terima dan akan disalurkan dengan penuh tanggung jawab.
        </p>
      </div>

      {/* Official Receipt Card */}
      <div className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] shadow-xs overflow-hidden">
        
        {/* Receipt Header */}
        <div className="bg-primary-container text-on-primary p-6 flex justify-between items-center">
          <div className="flex items-center">
            <DtPeduliLogo variant="white" size="md" />
          </div>

          <span className="bg-primary/40 border border-primary-fixed-dim/30 text-tertiary-fixed font-body-sm-label px-3 py-1 rounded-full font-bold uppercase text-xs">
            STATUS: TERVERIFIKASI
          </span>
        </div>

        {/* Receipt Body */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center pb-3 border-b border-surface-container-highest font-caption">
            <div>
              <span className="text-on-surface-variant block">Nomor Tanda Terima</span>
              <span className="font-bold text-primary font-mono text-sm">{transaction.id}</span>
            </div>
            <div className="text-right">
              <span className="text-on-surface-variant block">Tanggal Transaksi</span>
              <span className="font-semibold text-on-surface">{transaction.createdAt}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 font-body-sm-label">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Nama Donatur</span>
              <span className="font-bold text-on-surface">{transaction.donorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Program Kebaikan</span>
              <span className="font-bold text-on-surface text-right max-w-xs">{transaction.campaignTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Metode Pembayaran</span>
              <span className="font-semibold text-on-surface">{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Nominal Donasi</span>
              <span className="font-semibold text-on-surface">{formatRupiah(transaction.amount)}</span>
            </div>
            {transaction.uniqueCode > 0 && (
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Kode Unik</span>
                <span className="font-semibold text-on-surface">{formatRupiah(transaction.uniqueCode)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-surface-container-highest bg-surface-container-low p-3 rounded-[8px]">
              <span className="font-bold text-primary">Total Donasi Diterima</span>
              <span className="font-h3 text-h3 text-primary font-bold">{formatRupiah(transaction.totalAmount)}</span>
            </div>
          </div>

          {transaction.prayer && (
            <div className="bg-surface-container-low p-3 rounded-[8px] flex flex-col gap-1">
              <span className="font-caption text-primary font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">favorite</span>
                Doa & Pesan Donatur:
              </span>
              <p className="font-caption text-on-surface-variant italic">&quot;{transaction.prayer}&quot;</p>
            </div>
          )}

          <div className="pt-3 border-t border-surface-container-highest flex justify-between items-center font-caption text-on-surface-variant">
            <span>Lembaga Amil Zakat Nasional DT Peduli • SK Kemenag RI No. 257/2022</span>
            <span className="material-symbols-outlined text-[24px] text-primary">qr_code_2</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-surface-container-low p-4 border-t border-surface-container-highest flex flex-wrap justify-between items-center gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownloadReceipt}
              className="px-4 py-1.5 rounded-full bg-primary hover:bg-primary-container text-white font-body-sm-label font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Unduh File Kuitansi</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface font-body-sm-label font-bold flex items-center gap-1 hover:bg-surface-container transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={handleShareWa}
              className="px-4 py-1.5 rounded-full bg-emerald-700 text-white font-body-sm-label font-bold flex items-center gap-1 hover:bg-emerald-800 transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              <span>Bagikan WhatsApp</span>
            </button>
          </div>

          <button
            onClick={() => onNavigate('home_global')}
            className="px-4 py-1.5 rounded-full bg-surface-container-highest text-on-surface font-body-sm-label font-bold hover:bg-outline-variant transition cursor-pointer"
          >
            Beranda
          </button>
        </div>

      </div>
    </div>
  );
};
