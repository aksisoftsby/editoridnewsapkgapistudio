import React, { useState } from 'react';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { NewsArticle } from '../types';
import { ArticleCard } from './ArticleCard';

interface BookmarksViewProps {
  savedArticles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  onToggleBookmark: (article: NewsArticle, e: React.MouseEvent) => void;
  onClearAll: () => void;
  onExploreClick: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  savedArticles,
  onSelectArticle,
  onToggleBookmark,
  onClearAll,
  onExploreClick,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(savedArticles.map((a) => a.category)))];

  const filteredArticles =
    selectedCategory === 'all'
      ? savedArticles
      : savedArticles.filter((a) => a.category === selectedCategory);

  return (
    <div className="pb-24 pt-2 px-4 max-w-2xl mx-auto space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Berita Tersimpan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {savedArticles.length} artikel tersimpan dan siap dibaca offline
          </p>
        </div>

        {savedArticles.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Semua</span>
          </button>
        )}
      </div>

      {/* Category Pills if more than 1 category */}
      {categories.length > 2 && (
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
              }`}
            >
              {cat === 'all' ? 'Semua' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Articles List */}
      {filteredArticles.length > 0 ? (
        <div className="space-y-3">
          {filteredArticles.map((art) => (
            <ArticleCard
              key={art.id}
              article={art}
              onSelect={onSelectArticle}
              isBookmarked={true}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-2xs">
          <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Belum ada berita tersimpan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
            Simpan artikel favorit Anda untuk dibaca kapan saja, bahkan saat tidak terhubung ke internet.
          </p>
          <button
            onClick={onExploreClick}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
          >
            <span>Jelajahi Berita</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
