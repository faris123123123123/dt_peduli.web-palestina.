import React, { useState, useEffect } from 'react';
import { ScreenId, DonationTransaction, PaymentMethodItem } from '../types';
import { CAMPAIGNS_DATA, NOMINAL_OPTIONS, DEFAULT_PAYMENT_METHODS, FALLBACK_IMAGE } from '../data/mockData';
import { api } from '../services/api';

interface Props {
  selectedCampaignId?: string;
  onNavigate: (screen: ScreenId) => void;
  onSubmitDonation: (tx: DonationTransaction) => void;
}

export const DonasiScreen: React.FC<Props> = ({ 
  selectedCampaignId = 'yatim', 
  onNavigate, 
  onSubmitDonation 
}) => {
  const [targetCampaign, setTargetCampaign] = useState<string>(selectedCampaignId);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodItem[]>(DEFAULT_PAYMENT_METHODS);
  const [campaignsList, setCampaignsList] = useState<Record<string, any>>(CAMPAIGNS_DATA);

  useEffect(() => {
    if (selectedCampaignId) {
      setTargetCampaign(selectedCampaignId);
    }
  }, [selectedCampaignId]);

  useEffect(() => {
    api.getPaymentMethods().then((methods) => {
      if (methods && methods.length > 0) {
        setPaymentMethods(methods);
        const activeMethods = methods.filter(m => m.isActive !== false);
        if (activeMethods.length > 0 && !activeMethods.some(m => m.id === selectedMethod)) {
          setSelectedMethod(activeMethods[0].id);
        }
      }
    }).catch(() => {});

    api.getCampaigns().then((camps) => {
      if (camps && Array.isArray(camps) && camps.length > 0) {
        const campMap: Record<string, any> = {};
        camps.forEach((c) => {
          campMap[c.id] = c;
        });
        setCampaignsList(campMap);
      }
    }).catch(() => {});
  }, []);

  const [nominal, setNominal] = useState<number>(100000);
  const [customNominal, setCustomNominal] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  
  const [donorName, setDonorName] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [prayer, setPrayer] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('qris');

  const currentCampaign = campaignsList[targetCampaign] || campaignsList.yatim || CAMPAIGNS_DATA.yatim;
  const activePaymentMethods = paymentMethods.filter(m => m.isActive !== false);

  const handleSelectPreset = (amount: number) => {
    setNominal(amount);
    setIsCustom(false);
    setCustomNominal('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomNominal(val);
    if (val) {
      setNominal(Number(val));
      setIsCustom(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nominal || nominal < 10000) {
      alert('Minimal donasi adalah Rp 10.000');
      return;
    }

    const uniqueCode = Math.floor(100 + Math.random() * 899);
    const chosenMethod = activePaymentMethods.find(m => m.id === selectedMethod) || activePaymentMethods[0] || paymentMethods[0];
    const isQris = chosenMethod.id.toLowerCase().includes('qris') || chosenMethod.name.toLowerCase().includes('qris');

    const transaction: DonationTransaction = {
      id: 'DTP-' + Date.now().toString().slice(-8),
      campaignTitle: currentCampaign.title,
      campaignId: currentCampaign.id,
      donorName: isAnonymous ? 'Hamba Allah' : (donorName || 'Sahabat DT Peduli'),
      donorEmail: donorEmail || 'donatur@dtpeduli.org',
      donorPhone: donorPhone || '081234567890',
      isAnonymous: isAnonymous,
      amount: nominal,
      uniqueCode: isQris ? 0 : uniqueCode,
      totalAmount: isQris ? nominal : nominal + uniqueCode,
      paymentMethod: chosenMethod.name,
      accountNumber: chosenMethod.accountNumber || (isQris ? 'QRIS-DTP-01' : '700.123.4567'),
      accountHolder: chosenMethod.accountHolder || 'LAZNAS DT Peduli',
      logoUrl: chosenMethod.logoUrl,
      qrisImageUrl: chosenMethod.qrisImageUrl,
      prayer: prayer,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING',
      expiredAt: '23:59:59 WIB Hari Ini'
    };

    onSubmitDonation(transaction);
    api.createDonation(transaction).catch(err => console.log('Backend sync:', err));
    onNavigate('donasi_payment');
  };

  return (
    <div className="flex-1 mt-[64px] md:mt-[72px] w-full max-w-[900px] mx-auto px-3.5 sm:px-6 md:px-16 pt-4 sm:pt-6 pb-16 md:pb-20 flex flex-col gap-4 sm:gap-6">
      {/* Header Banner */}
      <div className="text-center flex flex-col gap-1 sm:gap-2">
        <span className="bg-primary-fixed text-primary text-[10px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-bold self-center">
          Portal Donasi & Sedekah
        </span>
        <h1 className="text-lg sm:text-2xl md:text-3xl text-primary font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
          Tunaikan Donasi Kebaikan
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto leading-relaxed">
          Salurkan sedekah terbaik Anda. Seluruh transaksi dijamin amanah, transparan, dan terverifikasi otomatis.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6 shadow-xs">
        
        {/* Step 1: Program */}
        <div className="flex flex-col gap-2.5 sm:gap-3">
          <label className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide">
            1. Pilih Program Kebaikan
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {Object.values(campaignsList).slice(0, 6).map((c: any) => (
              <div
                key={c.id}
                onClick={() => setTargetCampaign(c.id)}
                className={`p-2.5 sm:p-3 rounded-[8px] border transition cursor-pointer flex items-center gap-2.5 sm:gap-3 ${
                  targetCampaign === c.id
                    ? 'border-primary bg-primary-fixed/20 shadow-xs'
                    : 'border-surface-container-highest hover:border-outline-variant bg-surface-container-lowest'
                }`}
              >
                <img
                  src={c.imageUrl}
                  alt={c.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-[6px] object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-on-surface line-clamp-1">{c.title}</p>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant">{c.category}</p>
                </div>
                {targetCampaign === c.id && (
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-primary shrink-0">check_circle</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Nominal */}
        <div className="flex flex-col gap-2.5 sm:gap-3 pt-3 sm:pt-4 border-t border-surface-container-highest">
          <div className="flex justify-between items-center">
            <label className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide">
              2. Pilih Nominal Donasi
            </label>
            <span className="text-[10px] sm:text-xs text-on-surface-variant">Min. Rp 10.000</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {NOMINAL_OPTIONS.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handleSelectPreset(amount)}
                className={`py-2 sm:py-2.5 px-3 rounded-full text-xs sm:text-sm font-bold transition text-center border cursor-pointer ${
                  nominal === amount && !isCustom
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-surface-container-low text-on-surface border-surface-container-highest hover:bg-surface-container'
                }`}
              >
                Rp {amount.toLocaleString('id-ID')}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1 mt-1">
            <label className="text-[11px] sm:text-xs text-on-surface-variant">Atau masukkan nominal lainnya:</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2 sm:top-2.5 font-bold text-xs sm:text-sm text-on-surface-variant">Rp</span>
              <input
                type="text"
                value={customNominal}
                onChange={handleCustomChange}
                placeholder="Contoh: 750000"
                className="w-full pl-10 pr-3 py-1.5 sm:py-2 rounded-full border border-outline-variant font-bold text-xs sm:text-sm bg-surface-container-lowest focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Payment Method */}
        <div className="flex flex-col gap-2.5 sm:gap-3 pt-3 sm:pt-4 border-t border-surface-container-highest">
          <label className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide">
            3. Pilih Metode Pembayaran
          </label>

          <div className="flex flex-col gap-1.5 sm:gap-2">
            {activePaymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-2.5 sm:p-3.5 rounded-[10px] sm:rounded-[12px] border transition cursor-pointer flex items-center justify-between ${
                  selectedMethod === method.id
                    ? 'border-primary bg-primary-fixed/20 shadow-xs'
                    : 'border-surface-container-highest hover:border-outline-variant bg-surface-container-lowest'
                }`}
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {method.logoUrl ? (
                    <div className="w-10 h-8 sm:w-12 sm:h-9 rounded-lg bg-white border border-slate-200 p-0.5 sm:p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                      <img
                        src={method.logoUrl}
                        alt={method.name}
                        className="max-h-full max-w-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-8 sm:w-12 sm:h-9 rounded-lg bg-surface-container flex items-center justify-center font-bold text-[10px] sm:text-xs text-primary shrink-0">
                      {method.code || method.name.slice(0, 3).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-on-surface truncate">{method.name}</p>
                    <p className="text-[10px] sm:text-xs text-on-surface-variant">{method.category}</p>
                  </div>
                </div>
                {selectedMethod === method.id && (
                  <span className="material-symbols-outlined text-[20px] sm:text-[22px] text-primary shrink-0">check_circle</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 4: Donor Identity */}
        <div className="flex flex-col gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-surface-container-highest">
          <label className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide">
            4. Data Donatur & Doa
          </label>

          <div className="flex flex-col gap-2.5 sm:gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs sm:text-sm font-medium text-on-surface">Nama Lengkap</label>
              <input
                type="text"
                value={donorName}
                disabled={isAnonymous}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder={isAnonymous ? 'Hamba Allah (Nama disembunyikan)' : 'Nama Anda'}
                className="border border-outline-variant rounded-[8px] px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-surface-container-lowest focus:border-primary focus:outline-hidden disabled:bg-surface-container-low"
              />
            </div>

            <label className="flex items-center gap-2 text-xs sm:text-sm text-on-surface cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-outline-variant text-primary focus:ring-primary"
              />
              <span>Sembunyikan nama saya (Hamba Allah)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs sm:text-sm font-medium text-on-surface">No. WhatsApp / HP *</label>
                <input
                  type="tel"
                  required
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="08123456789"
                  className="border border-outline-variant rounded-[8px] px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-surface-container-lowest focus:border-primary focus:outline-hidden"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs sm:text-sm font-medium text-on-surface">Email</label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="email@domain.com"
                  className="border border-outline-variant rounded-[8px] px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-surface-container-lowest focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs sm:text-sm font-medium text-on-surface">Sertakan Doa / Pesan Kebaikan (Opsional)</label>
              <textarea
                rows={2}
                value={prayer}
                onChange={(e) => setPrayer(e.target.value)}
                placeholder="Tuliskan doa untuk saudara kita..."
                className="border border-outline-variant rounded-[8px] px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-surface-container-lowest focus:border-primary focus:outline-hidden"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-surface-container-highest bg-surface-container-low p-3 sm:p-4 rounded-[8px]">
          <div>
            <span className="text-[11px] sm:text-xs text-on-surface-variant block">Total Donasi Anda:</span>
            <span className="text-lg sm:text-xl md:text-2xl text-primary font-bold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              Rp {nominal.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-primary hover:bg-primary-container text-white h-[42px] sm:h-[46px] px-6 sm:px-8 rounded-full text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            Lanjut Pembayaran
          </button>
        </div>

      </form>
    </div>
  );
};
