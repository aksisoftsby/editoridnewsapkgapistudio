import React from 'react';
import {
  User,
  History,
  Trash2,
  Moon,
  Sun,
  Bell,
  HardDrive,
  Github,
  ChevronRight,
  Clock,
  BookOpen,
  Bookmark,
  Sparkles,
  Download,
} from 'lucide-react';
import { UserHistoryItem, NewsArticle } from '../types';

interface ProfileViewProps {
  readingHistory: UserHistoryItem[];
  savedCount: number;
  onSelectArticleById: (id: string | number) => void;
  onClearHistory: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  onTestNotification: () => void;
  onOpenGitHubModal: () => void;
  onClearOfflineCache: () => void;
  allArticles: NewsArticle[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  readingHistory,
  savedCount,
  onSelectArticleById,
  onClearHistory,
  darkMode,
  onToggleDarkMode,
  notificationsEnabled,
  onToggleNotifications,
  onTestNotification,
  onOpenGitHubModal,
  onClearOfflineCache,
  allArticles,
}) => {
  // Reading statistics
  const totalReadCount = readingHistory.length;
  const estimatedReadTimeMinutes = totalReadCount * 4;

  return (
    <div className="pb-24 pt-2 px-4 max-w-2xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-5 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
              <User className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-white ring-2 ring-white dark:ring-slate-900" title="Online">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                Pembaca editor.id
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                Member Demo
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              Akses Berita Terpercaya Bebas Iklan
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-5 grid grid-cols-3 gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 mb-0.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span className="text-base font-extrabold">{totalReadCount}</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Artikel Dibaca
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
              <Bookmark className="w-3.5 h-3.5" />
              <span className="text-base font-extrabold">{savedCount}</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Tersimpan
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 mb-0.5">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-base font-extrabold">{estimatedReadTimeMinutes}m</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Waktu Baca
            </span>
          </div>
        </div>
      </div>

      {/* GitHub Android Build Banner */}
      <div
        onClick={onOpenGitHubModal}
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 shadow-md cursor-pointer hover:shadow-lg transition active:scale-[0.99] border border-slate-700"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Build Android APK via GitHub</h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Demo Tanpa Sign
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Konfigurasi GitHub Actions & Capacitor APK gratis
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition" />
        </div>
      </div>

      {/* Riwayat Bacaan Section */}
      <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Riwayat Bacaan Terakhir
            </h3>
          </div>
          {readingHistory.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan</span>
            </button>
          )}
        </div>

        {readingHistory.length > 0 ? (
          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {readingHistory.slice(0, 6).map((item, idx) => (
              <div
                key={idx}
                onClick={() => onSelectArticleById(item.articleId)}
                className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl px-2 cursor-pointer transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1 leading-snug">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {item.readAt}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
            Belum ada artikel yang dibaca. Mulai membaca dari beranda!
          </div>
        )}
      </div>

      {/* App Settings & Preferences */}
      <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-xs dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Pengaturan Aplikasi
        </h3>

        {/* Dark Mode Switch */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-500">
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Mode Gelap (Dark Mode)
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Nyaman untuk membaca di malam hari
              </div>
            </div>
          </div>

          <button
            onClick={onToggleDarkMode}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              darkMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Push Notification Switch */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Notifikasi Push Berita
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Dapatkan breaking news terkini
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTestNotification}
              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-[10px] font-bold border border-blue-200 dark:bg-blue-950/60 dark:border-blue-900 dark:text-blue-400"
            >
              Tes Notif
            </button>
            <button
              onClick={onToggleNotifications}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                notificationsEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Offline Cache Storage */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Penyimpanan Offline (Cache)
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {allArticles.length} artikel tersimpan di memori lokal
              </div>
            </div>
          </div>

          <button
            onClick={onClearOfflineCache}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold transition dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Bersihkan
          </button>
        </div>
      </div>

      {/* App Version & Credits */}
      <div className="text-center text-xs text-slate-400 space-y-1">
        <p className="font-bold text-slate-600 dark:text-slate-400">
          editor.id News Android App v1.0.0
        </p>
        <p>API WordPress: editor.id/wp-json • Bebas Sign untuk Demo</p>
      </div>
    </div>
  );
};
