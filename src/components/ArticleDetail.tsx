import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  Share2,
  Type,
  Bookmark,
  MessageSquare,
  Quote,
  Clock,
  Calendar,
  Check,
  ExternalLink,
  Flame,
  Tag,
  ArrowRight,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import DOMPurify from 'dompurify';
import { NewsArticle } from '../types';

interface ArticleDetailProps {
  article: NewsArticle;
  onBack: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onOpenShare: (article: NewsArticle) => void;
  onOpenComments: (article: NewsArticle) => void;
  onSelectRelated: (article: NewsArticle) => void;
  allArticles: NewsArticle[];
  onSelectCategory?: (categoryName: string, categoryId?: number, categorySlug?: string) => void;
  onSelectTag?: (tag: { id?: number; name: string; slug?: string }) => void;
}

export type TextSize = 'sm' | 'base' | 'lg';

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  onBack,
  isBookmarked,
  onToggleBookmark,
  onOpenShare,
  onOpenComments,
  onSelectRelated,
  allArticles,
  onSelectCategory,
  onSelectTag,
}) => {
  const [textSize, setTextSize] = useState<TextSize>('base');
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);

  // Find multiple related articles (same category or others, excluding current)
  const relatedArticles = useMemo(() => {
    const sameCat = allArticles.filter(
      (a) => a.id !== article.id && a.category.toLowerCase() === article.category.toLowerCase()
    );
    const otherCat = allArticles.filter(
      (a) => a.id !== article.id && a.category.toLowerCase() !== article.category.toLowerCase()
    );
    return [...sameCat, ...otherCat].slice(0, 5);
  }, [allArticles, article]);

  // Trending / Popular articles (excluding current)
  const popularArticles = useMemo(() => {
    const popular = allArticles.filter((a) => a.id !== article.id && a.isPopular);
    const fallback = allArticles.filter((a) => a.id !== article.id);
    const combined = [...popular, ...fallback];
    return combined
      .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))
      .slice(0, 4);
  }, [allArticles, article]);

  // Next article
  const nextArticle = useMemo(() => {
    const currentIndex = allArticles.findIndex((a) => a.id === article.id);
    if (currentIndex >= 0 && currentIndex < allArticles.length - 1) {
      return allArticles[currentIndex + 1];
    }
    return allArticles.find((a) => a.id !== article.id) || null;
  }, [allArticles, article]);

  const getTextClass = () => {
    switch (textSize) {
      case 'sm':
        return 'text-sm leading-relaxed';
      case 'lg':
        return 'text-lg leading-loose';
      case 'base':
      default:
        return 'text-base leading-relaxed';
    }
  };

  // Process and sanitize content: checks if it contains WordPress HTML or plain text
  const renderedContentHtml = useMemo(() => {
    if (!article.content) return '';

    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(article.content);

    let rawHtml = article.content;
    if (!hasHtmlTags) {
      // Plain text or markdown paragraphs: parse bold, italics, quotes and wrap in <p>
      const paragraphs = article.content.split('\n\n').filter(Boolean);
      rawHtml = paragraphs
        .map((para) => {
          let formatted = para
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
          if (formatted.startsWith('>')) {
            return `<blockquote>${formatted.replace(/^>\s*/, '')}</blockquote>`;
          }
          return `<p>${formatted}</p>`;
        })
        .join('');
    }

    return DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: { html: true },
      ADD_TAGS: ['iframe', 'figure', 'figcaption'],
      ADD_ATTR: ['target', 'referrerpolicy', 'loading', 'allowfullscreen', 'frameborder'],
    });
  }, [article.content]);

  return (
    <div className="min-h-screen bg-white pb-24 dark:bg-slate-950 transition-colors">
      {/* Top Sticky App Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-2.5 flex items-center justify-between dark:bg-slate-900/95 dark:border-slate-800">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1.5 text-slate-700 hover:text-blue-600 rounded-full hover:bg-slate-100 transition dark:text-slate-200 dark:hover:bg-slate-800"
          aria-label="Kembali ke Beranda"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Centered Brand */}
        <div className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
          editor<span className="text-blue-600 dark:text-blue-400">.id</span>
        </div>

        {/* Font Size & Share */}
        <div className="flex items-center gap-1">
          {/* Font Size Adjuster */}
          <div className="relative">
            <button
              onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
              className="p-2 text-slate-700 hover:text-blue-600 rounded-full hover:bg-slate-100 transition dark:text-slate-200 dark:hover:bg-slate-800 font-bold text-xs flex items-center"
              title="Ubah Ukuran Huruf"
              aria-label="Ukuran Huruf"
            >
              <Type className="w-4 h-4 mr-0.5" />
              <span>A</span>
            </button>

            {showFontSizeMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50 text-xs">
                <div className="font-semibold text-slate-500 dark:text-slate-400 px-2 py-1">
                  Ukuran Huruf
                </div>
                <button
                  onClick={() => {
                    setTextSize('sm');
                    setShowFontSizeMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg ${
                    textSize === 'sm' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>Kecil (14px)</span>
                  {textSize === 'sm' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setTextSize('base');
                    setShowFontSizeMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg ${
                    textSize === 'base' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>Normal (16px)</span>
                  {textSize === 'base' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setTextSize('lg');
                    setShowFontSizeMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg ${
                    textSize === 'lg' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>Besar (18px)</span>
                  {textSize === 'lg' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => onOpenShare(article)}
            className="p-2 text-slate-700 hover:text-blue-600 rounded-full hover:bg-slate-100 transition dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Bagikan Berita"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Article Header & Meta */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        {/* Category Pill - Clickable to see related category news */}
        <div>
          <button
            onClick={() =>
              onSelectCategory &&
              onSelectCategory(article.category, article.categoryId, article.categorySlug)
            }
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-xs transition group cursor-pointer"
            title={`Lihat semua berita kategori ${article.category}`}
          >
            <span>{article.category}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform opacity-80" />
          </button>
        </div>

        {/* Main Headline */}
        <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight dark:text-white">
          {article.title}
        </h1>

        {/* Subtitle / Excerpt Lead */}
        {article.excerpt && (
          <p className="mt-3 text-base text-slate-600 leading-relaxed font-normal dark:text-slate-300">
            {article.excerpt}
          </p>
        )}

        {/* Author & Timestamp Row */}
        <div className="mt-5 flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-950"
          />
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {article.author.name}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <Calendar className="w-3 h-3" />
              <span>{article.publishedAt}</span>
              <span>•</span>
              <Clock className="w-3 h-3" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>

        {/* Hero Featured Image with Caption */}
        <div className="mt-5 rounded-2xl overflow-hidden shadow-sm bg-slate-100 dark:bg-slate-800">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-64 sm:h-80 md:h-96 object-cover"
            referrerPolicy="no-referrer"
          />
          {article.imageCaption && (
            <p className="p-3 text-xs text-slate-500 italic bg-slate-50 border-t border-slate-100 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-400">
              {article.imageCaption}
            </p>
          )}
        </div>

        {/* Article Body Content */}
        <div className={`mt-6 text-slate-800 dark:text-slate-200 ${getTextClass()}`}>
          {/* Quote Highlight */}
          {article.quote && (
            <div className="my-6 relative pl-5 border-l-4 border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 py-4 pr-4 rounded-r-xl">
              <Quote className="w-8 h-8 text-blue-500/40 absolute top-2 right-3" />
              <p className="italic font-medium text-slate-800 dark:text-slate-200">
                "{article.quote.text}"
              </p>
              <p className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                — {article.quote.author}
              </p>
            </div>
          )}

          {/* Render Body */}
          <div
            className="article-html-body font-serif space-y-4"
            dangerouslySetInnerHTML={{ __html: renderedContentHtml }}
          />

          {/* Original Source Link if available */}
          {article.link && (
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Sumber: {article.link}</span>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
              >
                <span>Buka di Browser</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Topik & Tag Terkait */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Tag className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Tag & Topik Terkait (Klik untuk berita serupa)</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags && article.tags.length > 0
              ? article.tags.map((tag) => {
                  const cleanName = tag.name.replace(/^#/, '');
                  return (
                    <button
                      key={tag.id || tag.slug || tag.name}
                      onClick={() => onSelectTag && onSelectTag(tag)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-900 border border-blue-200 dark:bg-blue-950/60 dark:hover:bg-blue-900/80 dark:text-blue-300 dark:border-blue-800 transition active:scale-95 cursor-pointer shadow-2xs group"
                      title={`Lihat berita dengan tag #${cleanName}`}
                    >
                      <span className="text-blue-400 dark:text-blue-500 group-hover:text-blue-600">#</span>
                      <span>{cleanName}</span>
                    </button>
                  );
                })
              : [
                  article.category,
                  'editor.id',
                  'BeritaTerkini',
                  'IndonesiaMaju',
                  'FokusHariIni',
                ].map((tagName, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectTag && onSelectTag({ name: tagName })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-blue-950/60 dark:text-slate-300 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 hover:border-blue-200 transition active:scale-95 cursor-pointer shadow-2xs group"
                    title={`Lihat berita dengan topik #${tagName}`}
                  >
                    <span className="text-slate-400 group-hover:text-blue-500">#</span>
                    <span>{tagName}</span>
                  </button>
                ))}
          </div>
        </div>

        {/* Artikel Berikutnya (Next Article Preview Banner) */}
        {nextArticle && (
          <div className="mt-6">
            <div
              onClick={() => onSelectRelated(nextArticle)}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-md cursor-pointer hover:shadow-lg transition active:scale-[0.99]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1 mb-1">
                    <ChevronRight className="w-3.5 h-3.5" />
                    Artikel Selanjutnya
                  </span>
                  <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:underline">
                    {nextArticle.title}
                  </h4>
                  <span className="text-[11px] text-blue-100 mt-1 inline-block">
                    {nextArticle.category} • {nextArticle.readTime}
                  </span>
                </div>
                <img
                  src={nextArticle.imageUrl}
                  alt={nextArticle.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border-2 border-white/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* "Baca Juga: Berita Terkait" (Multiple Related Articles) */}
        {relatedArticles.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Baca Juga ({relatedArticles.length} Referensi)
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">
                Topik {article.category}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedArticles.map((relArt) => (
                <div
                  key={relArt.id}
                  onClick={() => onSelectRelated(relArt)}
                  className="group flex gap-3 p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 cursor-pointer transition active:scale-[0.99] dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800/80"
                >
                  <img
                    src={relArt.imageUrl}
                    alt={relArt.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400">
                        {relArt.category}
                      </span>
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2 leading-snug dark:text-white dark:group-hover:text-blue-400 mt-0.5">
                        {relArt.title}
                      </h5>
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {relArt.readTime} • {relArt.publishedAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* "Berita Terpopuler" (Trending Recommendations Ranking 1-4) */}
        {popularArticles.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Berita Terpopuler Hari Ini
                </h4>
              </div>
              <span className="text-[11px] text-blue-600 font-semibold dark:text-blue-400">
                Paling Banyak Dibaca
              </span>
            </div>

            <div className="space-y-2.5">
              {popularArticles.map((popArt, idx) => (
                <div
                  key={popArt.id}
                  onClick={() => onSelectRelated(popArt)}
                  className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 cursor-pointer transition active:scale-[0.99] dark:hover:bg-slate-900 dark:hover:border-slate-800"
                >
                  <div className="w-7 text-center shrink-0">
                    <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                      {idx + 1}
                    </span>
                  </div>
                  <img
                    src={popArt.imageUrl}
                    alt={popArt.title}
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2 leading-snug dark:text-slate-100 dark:group-hover:text-blue-400">
                      {popArt.title}
                    </h5>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{popArt.category}</span>
                      <span>•</span>
                      <span>{popArt.viewsCount ? `${Math.round(popArt.viewsCount / 1000)} ribu dibaca` : '95 ribu dibaca'}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 safe-bottom dark:bg-slate-900/95 dark:border-slate-800">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {/* Simpan / Bookmark Toggle */}
          <button
            onClick={() => onToggleBookmark(article)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              isBookmarked
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            <span>{isBookmarked ? 'Tersimpan' : 'Simpan'}</span>
          </button>

          {/* Komentar Counter */}
          <button
            onClick={() => onOpenComments(article)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{article.commentsCount || 124}</span>
          </button>

          {/* Bagikan */}
          <button
            onClick={() => onOpenShare(article)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Bagikan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
