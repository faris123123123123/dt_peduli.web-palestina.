import React, { useState } from 'react';
import { api } from '../services/api';
import { DtPeduliLogo } from '../components/DtPeduliLogo';

interface Props {
  onLoginSuccess: (user: any) => void;
  onBackToPublic: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onLoginSuccess, onBackToPublic }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.adminLogin({
        username: username.trim(),
        password: password
      });

      if (res.success && res.user) {
        onLoginSuccess(res.user);
      }
    } catch (err: any) {
      setError(err.message || 'Login gagal. Periksa username dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background glow effects */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#fcd400]/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Back to Public Web */}
      <button
        onClick={onBackToPublic}
        className="absolute top-6 left-6 text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1.5 bg-slate-900/90 px-3.5 py-2 rounded-full border border-slate-800 hover:bg-slate-800 transition cursor-pointer"
        style={{ fontFamily: "'Baloo 2', sans-serif" }}
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        <span>Kembali ke Website Publik</span>
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-[24px] p-8 shadow-2xl backdrop-blur-md flex flex-col gap-6 relative z-10">
        
        {/* Header Branding */}
        <div className="text-center flex flex-col items-center gap-2">
          <DtPeduliLogo variant="white" size="lg" />
          
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-[#fcd400] text-[#6e5c00] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Akses Terbatas
            </span>
            <span className="text-xs text-slate-400 font-semibold">Staf & Petugas</span>
          </div>

          <h1 className="font-h3 text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            Portal Masuk Administrator
          </h1>
          <p className="text-xs text-slate-400 max-w-xs">
            Halaman ini khusus untuk staf dan pengelola resmi Daarut Tauhiid Peduli.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-950/80 border border-red-800/80 text-red-200 text-xs p-3 rounded-xl flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px] shrink-0 text-red-400">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Username Petugas</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-[18px]">
                person
              </span>
              <input
                type="text"
                required
                autoFocus
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-300">Kata Sandi (Password)</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-slate-400 hover:text-slate-200"
              >
                {showPassword ? 'Sembunyikan' : 'Lihat Password'}
              </button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-[18px]">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-container text-white font-bold h-[46px] rounded-xl flex items-center justify-center gap-2 mt-2 transition-all shadow-md hover:shadow-primary/20 cursor-pointer disabled:opacity-50"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                <span>Memverifikasi Akun...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>Masuk ke Sistem Admin</span>
              </>
            )}
          </button>
        </form>

      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-xs text-slate-500 flex flex-col gap-1">
        <span>© 2026 Lembaga Amil Zakat Nasional Daarut Tauhiid Peduli</span>
        <span>Akses dilindungi protokol autentikasi dan enkripsi data</span>
      </div>
    </div>
  );
};
