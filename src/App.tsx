import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, Wifi, Battery, Signal, Sparkles, CheckCircle2, RefreshCw, Tag, Layers, X, ArrowDown } from 'lucide-react';
import { NewsArticle, Category, Comment, PushNotificationItem, UserHistoryItem, ApiLoadingState } from './types';
import { INITIAL_ARTICLES, INITIAL_CATEGORIES, INITIAL_COMMENTS, INITIAL_NOTIFICATIONS } from './data/mockNews';
import {
  fetchArticles,
  fetchCategories,
  fetchArticlesByCategory,
  fetchArticlesByTag,
  fetchArticleById,
  fetchComments,
  onApiLoadingChange,
} from './services/api';
import { useOnlineStatus } from './hooks/useOnlineStatus';

// Components
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetail } from './components/ArticleDetail';
import { CategoriesView } from './components/CategoriesView';
import { SearchView } from './components/SearchView';
import { BookmarksView } from './components/BookmarksView';
import { ProfileView } from './components/ProfileView';
import { ShareModal } from './components/ShareModal';
import { CommentsModal } from './components/CommentsModal';
import { NotificationModal } from './components/NotificationModal';
import { GitHubBuildModal } from './components/GitHubBuildModal';
import { OfflineBanner } from './components/OfflineBanner';
import { FullScreenApiLoader } from './components/FullScreenApiLoader';

export default function App() {
  const isOnline = useOnlineStatus();

  // Primary navigation & view states
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('all');

  // Global full-screen loading state for all wp-json operations
  const [apiLoadingState, setApiLoadingState] = useState<ApiLoadingState>({
    isLoading: false,
    title: '',
    message: '',
    endpoint: '',
  });

  useEffect(() => {
    const unsubscribe = onApiLoadingChange((state) => {
      setApiLoadingState(state);
    });
    return unsubscribe;
  }, []);

  // Active filter by category or tag (e.g., when clicking category or tags in ArticleDetail)
  const [activeFilter, setActiveFilter] = useState<{
    type: 'category' | 'tag';
    id?: number | string;
    name: string;
    slug?: string;
  } | null>(null);
  const [isLoadingFilter, setIsLoadingFilter] = useState(false);

  // App Data states
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_ARTICLES);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiveFromWp, setIsLiveFromWp] = useState(false);

  // Pagination states for loading more articles
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);

  // Bookmarks (Tersimpan)
  const [bookmarks, setBookmarks] = useState<(string | number)[]>(() => {
    try {
      const saved = localStorage.getItem('editor_id_bookmarks');
      return saved ? JSON.parse(saved) : [1, 3];
    } catch {
      return [1, 3];
    }
  });

  // Reading History (Riwayat Bacaan)
  const [readingHistory, setReadingHistory] = useState<UserHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('editor_id_history');
      return saved
        ? JSON.parse(saved)
        : [
            {
              articleId: 1,
              title: 'Pemerintah Resmikan Ibu Kota Nusantara Tahap Pertama',
              category: 'Nasional',
              imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80',
              readAt: 'Hari ini, 09:15',
            },
            {
              articleId: 3,
              title: 'Rupiah Menguat ke Rp15.420 per Dolar AS',
              category: 'Ekonomi',
              imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=400&q=80',
              readAt: 'Kemarin, 16:40',
            },
          ];
    } catch {
      return [];
    }
  });

  // Comments
  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem('editor_id_comments');
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  // Push Notifications
  const [notifications, setNotifications] = useState<PushNotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('editor_id_notifs');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Active Toast Notification Banner
  const [toastMessage, setToastMessage] = useState<{ title: string; body: string } | null>(null);

  // Theme & Layout preferences
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('editor_id_dark_mode');
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Desktop Android Frame preview toggle (defaults to true on wide screens for authentic mobile feel)
  const [isDeviceFrameActive, setIsDeviceFrameActive] = useState<boolean>(true);

  // Modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTargetArticle, setShareTargetArticle] = useState<NewsArticle | null>(null);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [commentsTargetArticle, setCommentsTargetArticle] = useState<NewsArticle | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  // Apply Dark Mode class to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('editor_id_dark_mode', JSON.stringify(darkMode));
    } catch {}
  }, [darkMode]);

  // Persist Bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('editor_id_bookmarks', JSON.stringify(bookmarks));
    } catch {}
  }, [bookmarks]);

  // Persist Reading History
  useEffect(() => {
    try {
      localStorage.setItem('editor_id_history', JSON.stringify(readingHistory));
    } catch {}
  }, [readingHistory]);

  // Persist Comments
  useEffect(() => {
    try {
      localStorage.setItem('editor_id_comments', JSON.stringify(comments));
    } catch {}
  }, [comments]);

  // Persist Notifications
  useEffect(() => {
    try {
      localStorage.setItem('editor_id_notifs', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  // Load articles from editor.id WordPress API on startup
  const loadContent = async () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    try {
      const [artResult, catResult] = await Promise.all([fetchArticles(), fetchCategories()]);
      setArticles(artResult.articles);
      setIsLiveFromWp(artResult.isFromLiveApi);
      if (catResult && catResult.length > 0) {
        setCategories(catResult);
      }
    } catch (e) {
      console.warn('Gagal memuat API live, menggunakan data tersimpan:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  // Record article read to history and fetch fresh post details from WP REST API
  const handleSelectArticle = async (article: NewsArticle) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Add to history if not duplicate
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const dateStr = `Hari ini, ${timeStr}`;

    const newHistoryItem: UserHistoryItem = {
      articleId: article.id,
      title: article.title,
      category: article.category,
      imageUrl: article.imageUrl,
      readAt: dateStr,
    };

    setReadingHistory((prev) => [
      newHistoryItem,
      ...prev.filter((h) => h.articleId !== article.id),
    ].slice(0, 30));

    // If numeric WP ID, fetch full single post from /wp-json/wp/v2/posts/:id
    if (typeof article.id === 'number' || !isNaN(Number(article.id))) {
      try {
        const fullPost = await fetchArticleById(article.id);
        if (fullPost) {
          setSelectedArticle(fullPost);
          setArticles((prev) => prev.map((a) => (a.id === fullPost.id ? fullPost : a)));
        }
      } catch (e) {
        console.warn('Gagal fetch single post dari API:', e);
      }
    }
  };

  const handleSelectArticleById = (id: string | number) => {
    const found = articles.find((a) => a.id === id) || INITIAL_ARTICLES.find((a) => a.id === id);
    if (found) {
      handleSelectArticle(found);
    }
  };

  // Load more articles from WordPress REST API (Pagination)
  const handleLoadMore = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    try {
      const activeCatId =
        activeFilter?.type === 'category' && typeof activeFilter.id === 'number'
          ? activeFilter.id
          : undefined;
      const activeTagId =
        activeFilter?.type === 'tag' && typeof activeFilter.id === 'number'
          ? activeFilter.id
          : undefined;

      const result = await fetchArticles({
        page: nextPage,
        perPage: 15,
        categoryId: activeCatId,
        tagId: activeTagId,
        loadingTitle: 'Memuat Halaman Selanjutnya',
        loadingMessage: `Mengambil berita halaman ke-${nextPage} dari server editor.id...`,
      });

      if (result.articles.length > 0) {
        setArticles((prev) => {
          const incomingIds = new Set(result.articles.map((a) => a.id));
          return [...prev, ...result.articles.filter((a) => !incomingIds.has(a.id))];
        });
        setCurrentPage(nextPage);
        if (result.totalPages && nextPage >= result.totalPages) {
          setHasMorePages(false);
        }
      } else {
        setHasMorePages(false);
      }
    } catch (err) {
      console.warn('Gagal memuat halaman lanjutan:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Bookmark toggle
  const isBookmarked = (id: string | number) => bookmarks.includes(id);

  const handleToggleBookmark = (article: NewsArticle, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const id = article.id;
    if (bookmarks.includes(id)) {
      setBookmarks((prev) => prev.filter((b) => b !== id));
    } else {
      setBookmarks((prev) => [id, ...prev]);
    }
  };

  // Open modals
  const handleOpenShare = (article: NewsArticle) => {
    setShareTargetArticle(article);
    setIsShareModalOpen(true);
  };

  const handleOpenComments = async (article: NewsArticle) => {
    setCommentsTargetArticle(article);
    setIsCommentsModalOpen(true);
    // Fetch live comments from WordPress REST API
    try {
      const liveComments = await fetchComments(article.id);
      if (liveComments && liveComments.length > 0) {
        setComments((prev) => {
          const incomingIds = new Set(liveComments.map((c) => c.id));
          return [...liveComments, ...prev.filter((c) => !incomingIds.has(c.id))];
        });
      }
    } catch (err) {
      console.warn('Gagal fetch live comments:', err);
    }
  };

  // Add Comment
  const handleAddComment = (articleId: string | number, text: string, name: string) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      articleId,
      userName: name,
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      content: text,
      createdAt: 'Baru saja',
      likes: 0,
    };
    setComments((prev) => [newComment, ...prev]);
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  // Trigger simulated push notification
  const handleTriggerTestPush = () => {
    const randomArt = articles[Math.floor(Math.random() * articles.length)] || articles[0];
    const newNotif: PushNotificationItem = {
      id: `notif-${Date.now()}`,
      title: `⚡ BREAKING NEWS: ${randomArt.category.toUpperCase()}`,
      body: randomArt.title,
      articleId: randomArt.id,
      timestamp: 'Baru saja',
      isRead: false,
      category: randomArt.category,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // Show toast
    setToastMessage({ title: newNotif.title, body: newNotif.body });
    setTimeout(() => setToastMessage(null), 5000);

    // Browser Notification API if permitted
    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification(newNotif.title, {
          body: newNotif.body,
          icon: '/icon.svg',
        });
      } catch {}
    }
  };

  const handleRequestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          setNotificationsEnabled(true);
          handleTriggerTestPush();
        }
      } catch {}
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleSelectNotification = (notif: PushNotificationItem) => {
    if (notif.articleId) {
      handleSelectArticleById(notif.articleId);
    }
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    setIsNotificationModalOpen(false);
  };

  // Handle Category selection (from ArticleDetail, ArticleCard, CategoriesView, etc.)
  const handleSelectCategory = async (categoryName: string, categoryId?: number, categorySlug?: string) => {
    setSelectedArticle(null);
    setCurrentTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const found = categories.find(
      (c) =>
        (categoryId && (c.id === categoryId || c.wpId === categoryId)) ||
        (categorySlug && c.slug === categorySlug) ||
        c.name.toLowerCase() === categoryName.toLowerCase()
    );

    const finalCatId = categoryId || (typeof found?.id === 'number' ? found.id : found?.wpId);
    const finalSlug = categorySlug || found?.slug || categoryName.toLowerCase();
    const finalName = found?.name || categoryName;

    setActiveCategorySlug(finalSlug);
    setActiveFilter({
      type: 'category',
      id: finalCatId,
      name: finalName,
      slug: finalSlug,
    });

    if (finalCatId && typeof finalCatId === 'number') {
      setIsLoadingFilter(true);
      try {
        const catArticles = await fetchArticlesByCategory(finalCatId);
        if (catArticles && catArticles.length > 0) {
          setArticles((prev) => {
            const incomingIds = new Set(catArticles.map((a) => a.id));
            return [...catArticles, ...prev.filter((p) => !incomingIds.has(p.id))];
          });
        }
      } catch (err) {
        console.warn('Gagal memuat artikel kategori live:', err);
      } finally {
        setIsLoadingFilter(false);
      }
    }
  };

  // Handle Tag selection (from ArticleDetail tags or search)
  const handleSelectTag = async (tag: { id?: number; name: string; slug?: string }) => {
    setSelectedArticle(null);
    setCurrentTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const cleanName = tag.name.replace(/^#/, '').trim();
    const cleanSlug = tag.slug || cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    setActiveCategorySlug('all');
    setActiveFilter({
      type: 'tag',
      id: tag.id,
      name: cleanName,
      slug: cleanSlug,
    });

    if (tag.id) {
      setIsLoadingFilter(true);
      try {
        const tagArticles = await fetchArticlesByTag(tag.id);
        if (tagArticles && tagArticles.length > 0) {
          setArticles((prev) => {
            const incomingIds = new Set(tagArticles.map((a) => a.id));
            return [...tagArticles, ...prev.filter((p) => !incomingIds.has(p.id))];
          });
        }
      } catch (err) {
        console.warn('Gagal memuat artikel tag live:', err);
      } finally {
        setIsLoadingFilter(false);
      }
    }
  };

  const handleClearFilter = () => {
    setActiveFilter(null);
    setActiveCategorySlug('all');
  };

  // Filter articles based on active filter (category or tag) in Home
  const filteredHomeArticles = useMemo(() => {
    // 1. If activeFilter is active (explicit Category or Tag click)
    if (activeFilter) {
      if (activeFilter.type === 'category') {
        const catId = activeFilter.id ? Number(activeFilter.id) : undefined;
        const catName = activeFilter.name.toLowerCase();
        const catSlug = (activeFilter.slug || '').toLowerCase();

        return articles.filter((a) => {
          // Check by numeric category ID
          if (catId) {
            if (a.categoryId === catId) return true;
            if (a.categoryIds && a.categoryIds.includes(catId)) return true;
            if (a.categoriesList && a.categoriesList.some((c) => c.id === catId)) return true;
          }
          // Check by category slug
          if (catSlug) {
            if (a.categorySlug && a.categorySlug.toLowerCase() === catSlug) return true;
            if (a.categoriesList && a.categoriesList.some((c) => c.slug.toLowerCase() === catSlug)) return true;
          }
          // Check by category name
          const artCat = a.category.toLowerCase();
          if (artCat === catSlug || artCat === catName) return true;
          if (a.categoriesList && a.categoriesList.some((c) => c.name.toLowerCase() === catName)) return true;
          if (artCat.replace(/[^a-z0-9]/g, '') === catSlug.replace(/[^a-z0-9]/g, '')) return true;

          return false;
        });
      }

      if (activeFilter.type === 'tag') {
        const tagId = activeFilter.id ? Number(activeFilter.id) : undefined;
        const tagName = activeFilter.name.toLowerCase();
        const tagSlug = (activeFilter.slug || '').toLowerCase();

        return articles.filter((a) => {
          // Check by tagId
          if (tagId && a.tagIds && a.tagIds.includes(tagId)) return true;
          if (tagId && a.tags && a.tags.some((t) => t.id === tagId)) return true;

          // Check by tag name or slug in article.tags
          if (
            a.tags &&
            a.tags.some(
              (t) =>
                t.name.toLowerCase() === tagName ||
                (t.slug && t.slug.toLowerCase() === tagSlug)
            )
          ) {
            return true;
          }

          // Text match in title, excerpt, or category
          const fullText = `${a.title} ${a.excerpt} ${a.category}`.toLowerCase();
          return fullText.includes(tagName) || (tagSlug && fullText.includes(tagSlug));
        });
      }
    }

    // 2. Default category tab pill
    if (activeCategorySlug === 'all' || activeCategorySlug === 'terkini') {
      return articles;
    }
    const matchedCategory = categories.find(
      (c) => c.slug === activeCategorySlug || String(c.id) === String(activeCategorySlug)
    );
    const catName = matchedCategory ? matchedCategory.name.toLowerCase() : '';
    const catSlug = activeCategorySlug.toLowerCase();
    const catId =
      matchedCategory && typeof matchedCategory.id === 'number'
        ? matchedCategory.id
        : matchedCategory?.wpId;

    return articles.filter((a) => {
      if (catId) {
        if (a.categoryId === catId) return true;
        if (a.categoryIds && a.categoryIds.includes(catId)) return true;
        if (a.categoriesList && a.categoriesList.some((c) => c.id === catId)) return true;
      }
      if (catSlug) {
        if (a.categorySlug && a.categorySlug.toLowerCase() === catSlug) return true;
        if (a.categoriesList && a.categoriesList.some((c) => c.slug.toLowerCase() === catSlug)) return true;
      }
      const artCat = a.category.toLowerCase();
      return (
        artCat === catSlug ||
        (catName && artCat === catName) ||
        artCat.replace(/[^a-z0-9]/g, '') === catSlug.replace(/[^a-z0-9]/g, '')
      );
    });
  }, [articles, activeCategorySlug, activeFilter, categories]);

  // Saved articles list
  const savedArticlesList = useMemo(() => {
    return articles.filter((a) => bookmarks.includes(a.id));
  }, [articles, bookmarks]);

  // Popular articles (sorted or flagged)
  const popularArticles = useMemo(() => {
    const popular = articles.filter((a) => a.isPopular);
    return popular.length >= 5 ? popular : articles.slice(0, 5);
  }, [articles]);

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  // Clear offline cache
  const handleClearOfflineCache = () => {
    try {
      localStorage.removeItem('editor_id_cached_articles');
      alert('Cache offline artikel berhasil dibersihkan.');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col items-center justify-start p-0 md:p-6 transition-colors duration-200">
      {/* Full-Screen Live WordPress REST API Loading Notification */}
      <FullScreenApiLoader loadingState={apiLoadingState} />

      {/* Outer wrapper: Phone Frame container on desktop, full-width on mobile */}
      <div
        className={`w-full transition-all duration-300 ${
          isDeviceFrameActive
            ? 'max-w-md bg-white dark:bg-slate-950 md:rounded-[44px] md:shadow-2xl md:ring-1 md:ring-slate-300/80 dark:md:ring-slate-800 md:overflow-hidden relative min-h-screen md:min-h-[844px]'
            : 'max-w-4xl bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 min-h-screen'
        }`}
      >
        {/* Simulated Android Status Bar (Shown in mobile phone frame mode on desktop) */}
        {isDeviceFrameActive && (
          <div className="hidden md:flex items-center justify-between px-6 pt-3 pb-1 text-slate-900 dark:text-white text-xs font-semibold select-none bg-white dark:bg-slate-900 z-40 border-b border-slate-50 dark:border-slate-800/40">
            <span>9:41</span>
            {/* Center camera notch / punch hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 dark:bg-black ring-2 ring-slate-200 dark:ring-slate-800" />
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* In-App Toast Notification for Breaking News */}
        {toastMessage && (
          <div
            onClick={() => setIsNotificationModalOpen(true)}
            className="fixed top-4 left-4 right-4 max-w-sm mx-auto z-50 p-3.5 rounded-2xl bg-slate-900/95 text-white shadow-xl border border-slate-700 backdrop-blur-md cursor-pointer animate-in slide-in-from-top duration-300"
          >
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold truncate text-blue-300">{toastMessage.title}</h4>
                <p className="text-xs text-slate-200 line-clamp-2 mt-0.5">{toastMessage.body}</p>
              </div>
            </div>
          </div>
        )}

        {/* Offline Banner Indicator */}
        <OfflineBanner isOffline={!isOnline} />

        {/* VIEW ROUTING */}
        {selectedArticle ? (
          /* Screen 2: Detail Artikel */
          <ArticleDetail
            article={selectedArticle}
            onBack={() => setSelectedArticle(null)}
            isBookmarked={isBookmarked(selectedArticle.id)}
            onToggleBookmark={handleToggleBookmark}
            onOpenShare={handleOpenShare}
            onOpenComments={handleOpenComments}
            onSelectRelated={(related) => handleSelectArticle(related)}
            allArticles={articles}
            onSelectCategory={handleSelectCategory}
            onSelectTag={handleSelectTag}
          />
        ) : (
          /* Main Tab Views */
          <div>
            {/* Main App Header */}
            <Header
              onSearchClick={() => setCurrentTab('search')}
              onNotificationClick={() => setIsNotificationModalOpen(true)}
              unreadCount={unreadNotifCount}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
              isDeviceFrameActive={isDeviceFrameActive}
              onToggleDeviceFrame={() => setIsDeviceFrameActive(!isDeviceFrameActive)}
              onRefresh={loadContent}
              isRefreshing={isRefreshing}
            />

            {/* TAB 1: BERANDA (Home) */}
            {currentTab === 'home' && (
              <div className="pb-24">
                {/* Horizontal Category Navigation Pills (as in Screen 1) */}
                <div className="px-4 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xs">
                  {categories.map((cat) => {
                    const isActive =
                      (activeFilter?.type === 'category' &&
                        (activeFilter.slug === cat.slug ||
                          (activeFilter.id &&
                            (cat.id === activeFilter.id || cat.wpId === activeFilter.id)))) ||
                      (!activeFilter && activeCategorySlug === cat.slug);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          if (cat.slug === 'all' || cat.slug === 'terkini') {
                            handleClearFilter();
                          } else {
                            handleSelectCategory(
                              cat.name,
                              typeof cat.id === 'number' ? cat.id : cat.wpId,
                              cat.slug
                            );
                          }
                        }}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>

                {/* Active Filter Notification Bar (Category / Tag) */}
                {activeFilter && (
                  <div className="mx-4 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/90 dark:border-blue-900/60 shadow-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        {activeFilter.type === 'category' ? (
                          <Layers className="w-4 h-4" />
                        ) : (
                          <Tag className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            {activeFilter.type === 'category'
                              ? 'Filter Berita Kategori'
                              : 'Filter Berita Tag'}
                          </span>
                          {isLoadingFilter && (
                            <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />
                          )}
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {activeFilter.type === 'tag'
                            ? `#${activeFilter.name}`
                            : activeFilter.name}
                          <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1.5">
                            ({filteredHomeArticles.length} berita)
                          </span>
                        </h4>
                      </div>
                    </div>
                    <button
                      onClick={handleClearFilter}
                      className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 text-xs font-bold transition active:scale-95 shadow-2xs cursor-pointer"
                      title="Hapus Filter"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                )}

                {/* Hero Featured Article Carousel: ONLY on general home feed when no category/tag filter is active */}
                {!activeFilter && (activeCategorySlug === 'all' || activeCategorySlug === 'terkini') && (
                  <FeaturedCarousel
                    articles={filteredHomeArticles}
                    onSelectArticle={handleSelectArticle}
                    isBookmarked={isBookmarked}
                    onToggleBookmark={handleToggleBookmark}
                  />
                )}

                {/* "Berita Terkini" Header Section */}
                <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {activeFilter
                        ? activeFilter.type === 'tag'
                          ? `Berita Terkait #${activeFilter.name}`
                          : `Berita Kategori ${activeFilter.name}`
                        : 'Berita Terkini'}
                    </h3>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      ({filteredHomeArticles.length} berita)
                    </span>
                    {isLiveFromWp && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live editor.id
                      </span>
                    )}
                  </div>

                  {activeFilter ? (
                    <button
                      onClick={handleClearFilter}
                      className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentTab('categories')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 dark:text-blue-400 cursor-pointer"
                    >
                      <span>Lihat Semua</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* News Article Feed List */}
                <div className="px-4 space-y-3">
                  {isLoadingFilter && (
                    <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                      <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                      <span className="text-xs font-medium">Memuat berita kategori...</span>
                    </div>
                  )}

                  {!isLoadingFilter && filteredHomeArticles.length === 0 && (
                    <div className="py-12 px-6 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs">
                      <Layers className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Belum ada berita di kategori ini
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                        Kanal ini belum memiliki artikel terbaru di server editor.id.
                      </p>
                      <button
                        onClick={handleClearFilter}
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Kembali ke Semua Berita
                      </button>
                    </div>
                  )}

                  {(!activeFilter && (activeCategorySlug === 'all' || activeCategorySlug === 'terkini')
                    ? filteredHomeArticles.slice(1)
                    : filteredHomeArticles
                  ).map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onSelect={handleSelectArticle}
                      isBookmarked={isBookmarked(article.id)}
                      onToggleBookmark={handleToggleBookmark}
                      onSelectCategory={handleSelectCategory}
                    />
                  ))}
                </div>

                {/* Pagination: Load More Articles from WordPress API */}
                {hasMorePages && (
                  <div className="px-4 pt-3">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition active:scale-[0.99] cursor-pointer disabled:opacity-50"
                    >
                      {isLoadingMore ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                          <span>Menghubungi /wp-json/wp/v2/posts...</span>
                        </>
                      ) : (
                        <>
                          <ArrowDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span>Muat Lebih Banyak Berita dari editor.id</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* "Lebih Banyak Perspektif" Bottom Card (as in Screen 1) */}
                <div className="px-4 pt-5">
                  <div
                    onClick={() => setCurrentTab('categories')}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-100 via-blue-50 to-indigo-100 dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/40 p-4 border border-blue-200/80 dark:border-blue-900/60 cursor-pointer shadow-2xs hover:shadow-xs transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="max-w-[80%]">
                        <h4 className="text-xs sm:text-sm font-black text-blue-950 dark:text-blue-200">
                          Lebih Banyak Perspektif untuk Indonesia yang Lebih Baik
                        </h4>
                        <p className="text-[11px] text-blue-700/80 dark:text-blue-300/80 mt-0.5">
                          Jelajahi {categories.length > 2 ? `${categories.length} kanal kategori` : 'seluruh kategori'} terpercaya dari editor.id
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform shrink-0">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: KATEGORI (Categories & Explore - Screen 3) */}
            {currentTab === 'categories' && (
              <CategoriesView
                categories={categories}
                popularArticles={popularArticles}
                onSelectCategory={handleSelectCategory}
                onSelectArticle={handleSelectArticle}
                onSubscribeNewsletter={(email) => {
                  handleTriggerTestPush();
                }}
              />
            )}

            {/* TAB 3: CARI (Fast Search) */}
            {currentTab === 'search' && (
              <SearchView
                articles={articles}
                onSelectArticle={handleSelectArticle}
                isBookmarked={isBookmarked}
                onToggleBookmark={handleToggleBookmark}
                onSelectCategory={handleSelectCategory}
              />
            )}

            {/* TAB 4: TERSIMPAN (Bookmarks) */}
            {currentTab === 'saved' && (
              <BookmarksView
                savedArticles={savedArticlesList}
                onSelectArticle={handleSelectArticle}
                onToggleBookmark={handleToggleBookmark}
                onClearAll={() => setBookmarks([])}
                onExploreClick={() => setCurrentTab('home')}
              />
            )}

            {/* TAB 5: PROFIL (User Profile, History & Settings) */}
            {currentTab === 'profile' && (
              <ProfileView
                readingHistory={readingHistory}
                savedCount={bookmarks.length}
                onSelectArticleById={handleSelectArticleById}
                onClearHistory={() => setReadingHistory([])}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
                notificationsEnabled={notificationsEnabled}
                onToggleNotifications={() => setNotificationsEnabled(!notificationsEnabled)}
                onTestNotification={handleTriggerTestPush}
                onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
                onClearOfflineCache={handleClearOfflineCache}
                allArticles={articles}
              />
            )}

            {/* Android 5-Tab Bottom Navigation Bar */}
            <BottomNav
              currentTab={currentTab}
              onTabChange={(tab) => {
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              savedCount={bookmarks.length}
            />
          </div>
        )}
      </div>

      {/* MODALS */}
      {/* 1. Share Modal */}
      <ShareModal
        article={shareTargetArticle}
        onClose={() => {
          setIsShareModalOpen(false);
          setShareTargetArticle(null);
        }}
      />

      {/* 2. Comments Modal */}
      <CommentsModal
        article={commentsTargetArticle}
        comments={comments}
        onClose={() => {
          setIsCommentsModalOpen(false);
          setCommentsTargetArticle(null);
        }}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
      />

      {/* 3. Notification Drawer */}
      {isNotificationModalOpen && (
        <NotificationModal
          notifications={notifications}
          onClose={() => setIsNotificationModalOpen(false)}
          onMarkAllRead={handleMarkAllNotificationsRead}
          onSelectNotification={handleSelectNotification}
          onTriggerTestPush={handleTriggerTestPush}
          notificationsEnabled={notificationsEnabled}
          onRequestBrowserPermission={handleRequestBrowserPermission}
        />
      )}

      {/* 4. GitHub Android Build Modal */}
      <GitHubBuildModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
    </div>
  );
}
