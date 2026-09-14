import React, { useEffect, useState } from 'react';
import { RefreshCw, Globe, Sparkles, X, Wifi } from 'lucide-react';
import { ApiLoadingState } from '../types';
import { forceDismissApiLoading } from '../services/api';

interface FullScreenApiLoaderProps {
  loadingState: ApiLoadingState;
}

export const FullScreenApiLoader: React.FC<FullScreenApiLoaderProps> = ({ loadingState }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!loadingState.isLoading) {
      setElapsedSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [loadingState.isLoading]);

  if (!loadingState.isLoading) return null;

  return (
    <div
      id="fullscreen-wp-loading-overlay"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md text-white animate-in fade-in duration-200"
      role="alertdialog"
      aria-modal="true"
      aria-label="Sedang memuat data dari server editor.id"
    >
      {/* Background radial gradient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/15 rounded-full blur-2xl" />
      </div>

      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900/90 border border-blue-500/30 p-6 sm:p-7 shadow-2xl shadow-blue-950/50 flex flex-col items-center text-center">
        {/* Brand Header Icon with Glowing Radar Rings */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="absolute w-20 h-20 rounded-full bg-blue-500/20 animate-ping opacity-75" />
          <div className="absolute w-16 h-16 rounded-full bg-blue-600/30 animate-pulse" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/40 text-white font-black text-2xl tracking-tighter">
            <span>e<span className="text-blue-200">.</span></span>
          </div>
        </div>

        {/* Brand Tagline */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-[10px] font-bold tracking-wider text-blue-300 uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          WordPress REST API Live
        </div>

        {/* Dynamic Title */}
        <h3 className="text-lg font-black tracking-tight text-white mb-1.5">
          {loadingState.title || 'Memuat Data editor.id'}
        </h3>

        {/* Dynamic Descriptive Message */}
        <p className="text-xs sm:text-sm text-slate-300 mb-4 line-clamp-2 px-2">
          {loadingState.message || 'Sedang mengambil data terbaru dari server...'}
        </p>

        {/* WP-JSON Endpoint Indicator */}
        {loadingState.endpoint && (
          <div className="w-full mb-5 px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-left flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="font-mono text-[11px] text-blue-300 truncate select-all">
              {loadingState.endpoint}
            </span>
          </div>
        )}

        {/* Animated Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-5">
          <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-500 w-full animate-[shimmer_1.5s_infinite_linear]" />
        </div>

        {/* Status indicator row */}
        <div className="w-full flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3 text-blue-400 animate-spin" />
            <span>Sinkronisasi aktif...</span>
          </span>
          <span className="font-mono text-[10px] text-slate-400">{elapsedSeconds}s</span>
        </div>

        {/* Safe dismiss button if loading takes longer than 4s or user wants to proceed */}
        {elapsedSeconds >= 4 && (
          <button
            onClick={() => forceDismissApiLoading()}
            className="mt-5 w-full py-2 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 border border-slate-700 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Tutup Notifikasi & Lanjutkan</span>
          </button>
        )}
      </div>
    </div>
  );
};
