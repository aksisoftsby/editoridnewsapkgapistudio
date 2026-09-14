import React from 'react';
import { WifiOff, CheckCircle } from 'lucide-react';

interface OfflineBannerProps {
  isOffline: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOffline }) => {
  if (!isOffline) return null;

  return (
    <div className="sticky top-[53px] z-20 bg-amber-500 text-slate-950 px-4 py-2 flex items-center justify-between text-xs font-semibold shadow-md animate-in slide-in-from-top duration-200">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
        <span>Mode Offline Aktif — Anda tetap dapat membaca artikel yang telah tersimpan.</span>
      </div>
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/10">Cache Lokal</span>
    </div>
  );
};
