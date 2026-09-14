import React from 'react';
import { Search, Bell, Moon, Sun, Smartphone, Laptop, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onSearchClick: () => void;
  onNotificationClick: () => void;
  unreadCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isDeviceFrameActive: boolean;
  onToggleDeviceFrame: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchClick,
  onNotificationClick,
  unreadCount,
  darkMode,
  onToggleDarkMode,
  isDeviceFrameActive,
  onToggleDeviceFrame,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 transition-colors duration-200 dark:bg-slate-900/95 dark:border-slate-800">
      <div className="flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black tracking-tight text-slate-900 font-sans dark:text-white">
              editor<span className="text-blue-600 dark:text-blue-500">.id</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
              News
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium tracking-tight -mt-0.5 dark:text-slate-400">
            Berita Indonesia, Lebih Dalam
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Refresh Live API */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              title="Sinkronkan Berita dari editor.id"
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-800"
              aria-label="Refresh Berita"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          )}

          {/* Device Frame View Toggle (for desktop / tablet view testing) */}
          <button
            onClick={onToggleDeviceFrame}
            title={isDeviceFrameActive ? 'Tampilan Layar Penuh' : 'Tampilan Frame Android'}
            className="hidden md:flex p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-800"
            aria-label="Toggle Mode Tampilan"
          >
            {isDeviceFrameActive ? (
              <Laptop className="w-5 h-5" />
            ) : (
              <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            className="p-2 text-slate-600 hover:text-amber-600 hover:bg-slate-100 rounded-full transition-colors dark:text-slate-300 dark:hover:text-amber-400 dark:hover:bg-slate-800"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Quick Search */}
          <button
            onClick={onSearchClick}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-800"
            aria-label="Cari Berita"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notification Bell with Badge */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-800"
            aria-label="Notifikasi Berita"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
