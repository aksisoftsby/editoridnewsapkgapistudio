import React from 'react';
import { Home, LayoutGrid, Search, Bookmark, User } from 'lucide-react';

export type NavTab = 'home' | 'categories' | 'search' | 'saved' | 'profile';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  savedCount,
}) => {
  const navItems = [
    { id: 'home' as NavTab, label: 'Beranda', icon: Home },
    { id: 'categories' as NavTab, label: 'Kategori', icon: LayoutGrid },
    { id: 'search' as NavTab, label: 'Cari', icon: Search },
    { id: 'saved' as NavTab, label: 'Tersimpan', icon: Bookmark, badge: savedCount },
    { id: 'profile' as NavTab, label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1 px-2 safe-bottom transition-colors dark:bg-slate-900/95 dark:border-slate-800">
      <div className="max-w-md md:max-w-2xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px] rounded-xl transition-all ${
                isActive
                  ? 'text-blue-600 font-semibold dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight leading-none">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400 -mb-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
