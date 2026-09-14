import React from 'react';
import { X, Bell, CheckCheck, Sparkles, Flame, Clock } from 'lucide-react';
import { PushNotificationItem } from '../types';

interface NotificationModalProps {
  notifications: PushNotificationItem[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onSelectNotification: (notif: PushNotificationItem) => void;
  onTriggerTestPush: () => void;
  notificationsEnabled: boolean;
  onRequestBrowserPermission: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  notifications,
  onClose,
  onMarkAllRead,
  onSelectNotification,
  onTriggerTestPush,
  notificationsEnabled,
  onRequestBrowserPermission,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Notifikasi Berita</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                    {unreadCount} baru
                  </span>
                )}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Controls Bar */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
          <button
            onClick={onTriggerTestPush}
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kirim Notifikasi Push Demo</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tandai Dibaca</span>
            </button>
          )}
        </div>

        {/* Browser Permission Prompt if not enabled */}
        {!notificationsEnabled && typeof window !== 'undefined' && 'Notification' in window && (
          <div className="p-3 mx-4 my-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between text-xs">
            <div className="text-slate-700 dark:text-slate-300">
              Aktifkan push alert sistem browser / Android
            </div>
            <button
              onClick={onRequestBrowserPermission}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shrink-0 transition"
            >
              Izinkan
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onSelectNotification(n)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer active:scale-[0.99] ${
                  n.isRead
                    ? 'bg-white hover:bg-slate-50 border-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800/40'
                    : 'bg-blue-50/40 hover:bg-blue-50/70 border-blue-200/80 dark:bg-blue-950/20 dark:border-blue-900/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-600 text-white">
                      {n.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {n.timestamp}
                    </span>
                  </div>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
                  )}
                </div>

                <h4 className="mt-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {n.title}
                </h4>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {n.body}
                </p>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              Tidak ada notifikasi baru.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
