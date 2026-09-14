import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, TrendingUp, History, AlertCircle, RefreshCw } from 'lucide-react';
import { NewsArticle } from '../types';
import { ArticleCard } from './ArticleCard';
import { fetchSearchArticles } from '../services/api';

interface SearchViewProps {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  isBookmarked: (id: string | number) => boolean;
  onToggleBookmark: (article: NewsArticle, e: React.MouseEvent) => void;
  onSelectCategory?: (categoryName: string, categoryId?: number, categorySlug?: string) => void;
}

const TRENDING_KEYWORDS = [
  'IKN',
  'Menteri',
  'Rupiah',
  'Pemerintah',
  'Ekonomi',
  'Presiden',
  'Teknologi',
  'Nusantara',
];

export const SearchView: React.FC<SearchViewProps> = ({
  articles,
  onSelectArticle,
  isBookmarked,
  onToggleBookmark,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NewsArticle[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('editor_recent_searches');
      return saved ? JSON.parse(saved) : ['IKN', 'Menteri Keuangan', 'Ekonomi Indonesia'];
    } catch {
      return ['IKN', 'Menteri Keuangan', 'Ekonomi Indonesia'];
    }
  });

  const saveRecentSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
    setRecentSearches(updated);
    try {
      localStorage.setItem('editor_recent_searches', JSON.stringify(updated));
    } catch {}
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('editor_recent_searches');
    } catch {}
  };

  // Perform Live WordPress REST API search
  const executeApiSearch = useCallback(async (searchQuery: string) => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearchingApi(true);
    setHasSearched(true);
    saveRecentSearch(q);

    try {
      const liveResults = await fetchSearchArticles(q, 20);
      if (liveResults && liveResults.length > 0) {
        setSearchResults(liveResults);
      } else {
        // Fallback to local filtering if remote query returned 0
        const localMatches = articles.filter(
          (art) =>
            art.title.toLowerCase().includes(q.toLowerCase()) ||
            art.excerpt.toLowerCase().includes(q.toLowerCase()) ||
            art.category.toLowerCase().includes(q.toLowerCase())
        );
        setSearchResults(localMatches);
      }
    } catch (err) {
      console.warn('Gagal live search:', err);
      // Local fallback
      const localMatches = articles.filter((art) =>
        art.title.toLowerCase().includes(q.toLowerCase())
      );
      setSearchResults(localMatches);
    } finally {
      setIsSearchingApi(false);
    }
  }, [articles]);

  // Debounced search when user types (800ms)
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      executeApiSearch(query);
    }, 700);

    return () => clearTimeout(timer);
  }, [query, executeApiSearch]);

  const handleSelectKeyword = (kw: string) => {
    setQuery(kw);
    executeApiSearch(kw);
  };

  return (
    <div className="pb-24 pt-2 px-4 max-w-2xl mx-auto space-y-4">
      {/* Search Input Box */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              executeApiSearch(query);
            }
          }}
          placeholder="Cari berita live di editor.id (contoh: IKN, Menteri, APBN)..."
          autoFocus
          className="w-full pl-11 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 shadow-2xs transition"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSearchResults([]);
              setHasSearched(false);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2 rounded-full cursor-pointer"
            aria-label="Hapus Pencarian"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Query Active -> Show Results */}
      {query.trim() ? (
        <div>
          <div className="flex items-center justify-between py-1 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Hasil pencarian untuk "{query}" ({searchResults.length})
              </span>
              {isSearchingApi && (
                <span className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Mencari di API...
                </span>
              )}
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Live API</span>
          </div>

          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((art) => (
                <ArticleCard
                  key={art.id}
                  article={art}
                  onSelect={onSelectArticle}
                  isBookmarked={isBookmarked(art.id)}
                  onToggleBookmark={onToggleBookmark}
                  onSelectCategory={onSelectCategory}
                />
              ))}
            </div>
          ) : !isSearchingApi && hasSearched ? (
            <div className="py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
              <AlertCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Tidak ada berita ditemukan untuk "{query}"
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Coba gunakan kata kunci lain seperti "IKN", "Menteri", atau "Ekonomi".
              </p>
            </div>
          ) : null}
        </div>
      ) : (
        /* Empty Query -> Show Recent Searches & Trending Topics */
        <div className="space-y-6 pt-2">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <History className="w-3.5 h-3.5" />
                  <span>Pencarian Terakhir</span>
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-red-500 hover:text-red-600 font-medium cursor-pointer"
                >
                  Hapus Semua
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectKeyword(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/80 text-xs text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Topics */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Topik Sedang Tren di editor.id</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {TRENDING_KEYWORDS.map((kw, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectKeyword(kw)}
                  className="px-3.5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium border border-blue-100 transition dark:bg-blue-950/50 dark:border-blue-900/60 dark:text-blue-300 dark:hover:bg-blue-900/60 cursor-pointer"
                >
                  #{kw}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
