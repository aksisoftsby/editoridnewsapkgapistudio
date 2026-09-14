import React, { useState, useMemo } from 'react';
import { ChevronRight, ArrowRight, CheckCircle2, Flame, Layers, Search, Sparkles } from 'lucide-react';
import { NewsArticle, Category } from '../types';
import { getCategorySvgIcon } from './CategoryIcons';

interface CategoriesViewProps {
  categories: Category[];
  popularArticles: NewsArticle[];
  onSelectCategory: (categoryName: string, categoryId?: number, categorySlug?: string) => void;
  onSelectArticle: (article: NewsArticle) => void;
  onSubscribeNewsletter: (email: string) => void;
}

type CategoryTab = 'all' | 'utama' | 'lifestyle' | 'daerah';

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  popularArticles,
  onSelectCategory,
  onSelectArticle,
  onSubscribeNewsletter,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    onSubscribeNewsletter(emailInput);
    setSubscribed(true);
    setTimeout(() => {
      setEmailInput('');
      setSubscribed(false);
    }, 4000);
  };

  // Filter and prioritize categories according to active tab
  const displayedCategories = useMemo(() => {
    // Exclude 'all' dummy pill from grid since it's in the banner
    let list = categories.filter((c) => c.slug !== 'all' && c.slug !== 'terkini');

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
      );
    }

    if (activeTab === 'utama') {
      const mainKeywords = [
        'headline',
        'nasional',
        'hukum',
        'politik',
        'bisnis',
        'regional',
        'nusantara',
        'sepak-bola',
        'internasional',
        'iptek',
        'pendidikan',
        'trending-topik',
        'berita-pilihan',
        'presiden-jokowi',
      ];
      return list.filter((c) => mainKeywords.some((k) => c.slug.includes(k)));
    }

    if (activeTab === 'lifestyle') {
      const lifeKeywords = [
        'gaya-hidup',
        'medika',
        'kesehatan',
        'otomotif',
        'musik',
        'film',
        'cafe',
        'kuliner',
        'masak',
        'infotainment',
        'sport',
        'keluarga',
        'jalan-jalan',
      ];
      return list.filter((c) => lifeKeywords.some((k) => c.slug.includes(k)));
    }

    if (activeTab === 'daerah') {
      const regionKeywords = [
        'jawa',
        'papua',
        'sumbar',
        'sumsel',
        'sumut',
        'sulut',
        'borneo',
        'kalimantan',
        'tangsel',
        'megapolitan',
        'kepala-daerah',
      ];
      return list.filter((c) => regionKeywords.some((k) => c.slug.includes(k)));
    }

    return list;
  }, [categories, activeTab, searchQuery]);

  return (
    <div className="pb-24 pt-2 px-4 max-w-2xl mx-auto space-y-6">
      {/* Top Banner Card: Kanal Informasi editor.id */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white p-6 shadow-lg">
        {/* Decorative background art */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
            <path d="M20 50 Q 80 20 150 60 T 180 140" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="60" cy="80" r="16" stroke="white" strokeWidth="1.5" />
            <circle cx="140" cy="120" r="24" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Katalog Resmi editor.id
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
            Kategori & Kanal <br />
            Informasi Terpercaya
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-blue-100 max-w-sm leading-relaxed">
            Terhubung langsung dengan {categories.length} kanal kategori resmi editor.id dari seluruh nusantara.
          </p>

          <button
            onClick={() => onSelectCategory('Semua', undefined, 'all')}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-800 hover:bg-blue-50 text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer"
          >
            <span>Semua Berita</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Category Search & Filter Tabs */}
      <div className="space-y-3">
        {/* Search input for categories */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kategori (contoh: Kriminal, Hukum, Politik, Bisnis)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        {!searchQuery && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              Semua ({categories.filter((c) => c.slug !== 'all').length})
            </button>
            <button
              onClick={() => setActiveTab('utama')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'utama'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              Berita Utama
            </button>
            <button
              onClick={() => setActiveTab('lifestyle')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'lifestyle'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              Gaya Hidup & Ragam
            </button>
            <button
              onClick={() => setActiveTab('daerah')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'daerah'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              Kanal Daerah
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Category Grid matching exact output json API */}
      <div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {displayedCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                onSelectCategory(
                  cat.name,
                  typeof cat.id === 'number' ? cat.id : cat.wpId,
                  cat.slug
                )
              }
              className="group flex flex-col items-center justify-between p-3 rounded-2xl bg-white hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 transition-all active:scale-95 shadow-2xs dark:bg-slate-900 dark:border-slate-800 dark:hover:border-blue-900 dark:hover:bg-blue-950/30 text-center min-h-[105px] cursor-pointer"
            >
              {/* Custom SVG Icon corresponding to API output */}
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all dark:bg-blue-950/60 dark:text-blue-400 dark:group-hover:bg-blue-600 dark:group-hover:text-white shadow-2xs">
                {getCategorySvgIcon(cat.slug || cat.name, 'w-6 h-6')}
              </div>

              {/* Exact Category Text from WordPress JSON API */}
              <div className="mt-2 w-full">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400 line-clamp-2 leading-tight block">
                  {cat.name}
                </span>

                {/* Exact Article Count from WordPress JSON API */}
                {typeof cat.count === 'number' && (
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 mt-0.5 block">
                    {cat.count > 1000
                      ? `${(cat.count / 1000).toFixed(1)}rb berita`
                      : `${cat.count} berita`}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {displayedCategories.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-xs">
            Tidak ada kategori yang cocok dengan pencarian "{searchQuery}".
          </div>
        )}
      </div>

      {/* Berita Populer Ranked List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Berita Populer
            </h3>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 dark:text-blue-400"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {popularArticles.slice(0, 5).map((art, idx) => (
            <div
              key={art.id}
              onClick={() => onSelectArticle(art)}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 cursor-pointer transition active:scale-[0.99] dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700 shadow-2xs"
            >
              {/* Ranking Number */}
              <div className="w-6 shrink-0 text-center">
                <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                  {idx + 1}
                </span>
              </div>

              {/* Thumbnail */}
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
                referrerPolicy="no-referrer"
              />

              {/* Title & View Count */}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                  {art.category}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug dark:text-slate-100 mt-0.5">
                  {art.title}
                </h4>
                <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-400">
                  {art.viewsCount ? `${Math.round(art.viewsCount / 1000)} ribu dibaca` : '120 ribu dibaca'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter & Push Alerts Subscription Card */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 dark:bg-slate-900/60 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Dapatkan Berita Terkini di <span className="text-blue-600 dark:text-blue-400">editor.id</span>
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Berlangganan newsletter kami dan jangan lewatkan berita penting setiap hari.
        </p>

        {subscribed ? (
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Terima kasih! Anda telah terdaftar untuk menerima berita pilihan.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="mt-3.5 flex gap-2">
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Masukkan email Anda"
              className="flex-1 px-3.5 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs active:scale-95 shrink-0"
            >
              Berlangganan
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
