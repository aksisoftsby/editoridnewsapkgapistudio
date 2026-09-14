import React from 'react';
import { Bookmark, Clock } from 'lucide-react';
import { NewsArticle } from '../types';

interface ArticleCardProps {
  article: NewsArticle;
  onSelect: (article: NewsArticle) => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle, e: React.MouseEvent) => void;
  onSelectCategory?: (categoryName: string, categoryId?: number, categorySlug?: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelect,
  isBookmarked,
  onToggleBookmark,
  onSelectCategory,
}) => {
  return (
    <article
      onClick={() => onSelect(article)}
      className="group flex gap-3.5 p-3.5 bg-white rounded-xl border border-slate-100 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer active:scale-[0.99] dark:bg-slate-900 dark:border-slate-800/80 dark:hover:border-slate-700"
    >
      {/* Thumbnail Left */}
      <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>

      {/* Content Right */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          {/* Category Tag */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectCategory) {
                  onSelectCategory(article.category, article.categoryId, article.categorySlug);
                }
              }}
              className="text-[11px] font-extrabold uppercase tracking-wide text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300"
              title={`Filter berdasarkan kategori ${article.category}`}
            >
              {article.category}
            </button>
            <button
              onClick={(e) => onToggleBookmark(article, e)}
              className="p-1 text-slate-400 hover:text-blue-600 transition-colors dark:text-slate-500 dark:hover:text-blue-400"
              aria-label={isBookmarked ? 'Hapus dari Tersimpan' : 'Simpan Berita'}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? 'fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400' : ''}`}
              />
            </button>
          </div>

          {/* Headline Title */}
          <h3 className="mt-1 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{article.publishedAt}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </article>
  );
};
