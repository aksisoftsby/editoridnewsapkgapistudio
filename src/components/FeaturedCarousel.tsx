import React, { useState, useEffect } from 'react';
import { Clock, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import { NewsArticle } from '../types';

interface FeaturedCarouselProps {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  isBookmarked: (id: string | number) => boolean;
  onToggleBookmark: (article: NewsArticle, e: React.MouseEvent) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  articles,
  onSelectArticle,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredItems = articles.slice(0, 4);

  // Auto slide every 6 seconds
  useEffect(() => {
    if (featuredItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredItems.length]);

  if (featuredItems.length === 0) return null;

  const currentArticle = featuredItems[currentIndex];
  const bookmarked = isBookmarked(currentArticle.id);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
  };

  return (
    <div className="relative px-4 pt-3 pb-2">
      <div
        onClick={() => onSelectArticle(currentArticle)}
        className="group relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden cursor-pointer shadow-lg transition-transform duration-300 active:scale-[0.99] border border-slate-200/50 dark:border-slate-800"
      >
        {/* Background Image */}
        <img
          src={currentArticle.imageUrl}
          alt={currentArticle.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="eager"
        />

        {/* Dramatic Gradient Overlay for readable text */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />

        {/* Category Badge & Bookmark Icon */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider bg-blue-600 text-white shadow-md">
            {currentArticle.category}
          </span>

          <button
            onClick={(e) => onToggleBookmark(currentArticle, e)}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              bookmarked
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-black/40 text-white/90 hover:bg-black/60'
            }`}
            aria-label="Simpan Berita"
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content Box */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-xl sm:text-2xl font-bold leading-tight font-sans tracking-tight line-clamp-3 text-white drop-shadow-xs">
            {currentArticle.title}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed drop-shadow-xs font-normal">
            {currentArticle.excerpt}
          </p>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{currentArticle.publishedAt}</span>
              <span>•</span>
              <span>{currentArticle.readTime}</span>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              {featuredItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'w-5 bg-blue-500' : 'w-1.5 bg-white/40'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Arrow slide buttons (visible on hover) */}
        {featuredItems.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 hidden sm:flex"
              aria-label="Artikel Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 hidden sm:flex"
              aria-label="Artikel Selanjutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
