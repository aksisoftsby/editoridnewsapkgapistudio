import { NewsArticle, Category, ArticleTag, ArticleCategoryItem, Comment, ApiLoadingState } from '../types';
import { INITIAL_ARTICLES, INITIAL_CATEGORIES } from '../data/mockNews';

export const WP_BASE_URL = 'https://editor.id/wp-json/wp/v2';
const STORAGE_KEY_ARTICLES = 'editor_id_cached_articles';
const STORAGE_KEY_CATEGORIES = 'editor_id_cached_categories';

// ==========================================
// Full-Screen Loading Notification Event Bus
// ==========================================
type LoadingListener = (state: ApiLoadingState) => void;
const loadingListeners: Set<LoadingListener> = new Set();
let activeRequestCount = 0;
let currentLoadingState: ApiLoadingState = {
  isLoading: false,
  title: '',
  message: '',
  endpoint: '',
};

export function onApiLoadingChange(listener: LoadingListener): () => void {
  loadingListeners.add(listener);
  // Emit current state immediately to new listener
  listener(currentLoadingState);
  return () => {
    loadingListeners.delete(listener);
  };
}

export function setApiLoading(
  loading: boolean,
  meta?: { title?: string; message?: string; endpoint?: string; isDismissable?: boolean }
) {
  if (loading) {
    activeRequestCount++;
    currentLoadingState = {
      isLoading: true,
      title: meta?.title || 'Memuat Data editor.id',
      message: meta?.message || 'Menghubungkan ke API WordPress...',
      endpoint: meta?.endpoint || '/wp-json/wp/v2/',
      isDismissable: meta?.isDismissable ?? true,
    };
  } else {
    activeRequestCount = Math.max(0, activeRequestCount - 1);
    if (activeRequestCount === 0) {
      currentLoadingState = {
        isLoading: false,
        title: '',
        message: '',
        endpoint: '',
      };
    }
  }

  loadingListeners.forEach((fn) => {
    try {
      fn({ ...currentLoadingState });
    } catch (err) {
      console.error('Error in loading listener:', err);
    }
  });
}

// Force dismiss loader (e.g. user clicked Dismiss button)
export function forceDismissApiLoading() {
  activeRequestCount = 0;
  currentLoadingState = {
    isLoading: false,
    title: '',
    message: '',
    endpoint: '',
  };
  loadingListeners.forEach((fn) => {
    try {
      fn({ ...currentLoadingState });
    } catch (err) {
      console.error(err);
    }
  });
}

// ==========================================
// Helper Utilities
// ==========================================
export function decodeHtml(html: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

export function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

// Convert WordPress Post format to NewsArticle format
export function transformWpPost(post: any): NewsArticle {
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const authorInfo = post._embedded?.['author']?.[0];
  const categoryTerms = post._embedded?.['wp:term']?.[0] || [];
  const tagTerms = post._embedded?.['wp:term']?.[1] || [];

  const allCategoryIds: number[] = Array.isArray(post.categories)
    ? post.categories.map((id: any) => Number(id))
    : categoryTerms.map((c: any) => Number(c.id));

  const categoriesList: ArticleCategoryItem[] = categoryTerms.map((c: any) => ({
    id: Number(c.id),
    name: decodeHtml(c.name || ''),
    slug: c.slug || '',
  }));

  // Choose the best primary category:
  // In WordPress, 'headline' (id: 4858) is frequently tagged alongside specific categories like 'kriminal' (10001).
  // Prefer the more specific category for display if available.
  const specificCategory =
    categoriesList.find(
      (c) => c.slug !== 'headline' && c.name.toLowerCase() !== 'headline'
    ) || categoriesList[0];

  const primaryCategory = specificCategory?.name ? decodeHtml(specificCategory.name) : 'Nasional';
  const categoryId = specificCategory?.id || allCategoryIds[0];
  const categorySlug = specificCategory?.slug;

  const tags: ArticleTag[] = tagTerms.map((t: any) => ({
    id: t.id,
    name: decodeHtml(t.name),
    slug: t.slug,
  }));

  const imageUrl =
    featuredMedia?.source_url ||
    featuredMedia?.media_details?.sizes?.large?.source_url ||
    featuredMedia?.media_details?.sizes?.medium_large?.source_url ||
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80';

  const cleanTitle = decodeHtml(post.title?.rendered || 'Berita Terkini');
  const cleanExcerpt = stripHtml(post.excerpt?.rendered || '');

  // Calculate read time approx
  const wordCount = (post.content?.rendered || '').split(/\s+/).length;
  const readTimeMinutes = Math.max(2, Math.ceil(wordCount / 180));

  const postDate = new Date(post.date);
  const formattedDate = !isNaN(postDate.getTime())
    ? postDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Terbaru';

  return {
    id: post.id,
    title: cleanTitle,
    excerpt: cleanExcerpt,
    content: post.content?.rendered || cleanExcerpt,
    category: primaryCategory,
    categoryId: categoryId,
    categorySlug: categorySlug,
    categoryIds: allCategoryIds,
    categoriesList: categoriesList,
    tags: tags.length > 0 ? tags : undefined,
    tagIds: Array.isArray(post.tags) ? post.tags.map((id: any) => Number(id)) : [],
    imageUrl: imageUrl,
    imageCaption: featuredMedia?.caption?.rendered ? stripHtml(featuredMedia.caption.rendered) : undefined,
    author: {
      name: authorInfo?.name || 'Redaksi editor.id',
      avatar:
        authorInfo?.avatar_urls?.['96'] ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      role: 'Jurnalis',
    },
    publishedAt: formattedDate,
    readTime: `${readTimeMinutes} menit baca`,
    viewsCount: Math.floor(Math.random() * 40000) + 10000,
    commentsCount: Array.isArray(post._embedded?.replies?.[0]) ? post._embedded.replies[0].length : 0,
    link: post.link,
  };
}

export function transformWpComment(c: any): Comment {
  const d = new Date(c.date);
  const formattedDate = !isNaN(d.getTime())
    ? d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Baru saja';

  return {
    id: String(c.id),
    articleId: c.post,
    userName: decodeHtml(c.author_name || 'Pembaca editor.id'),
    userAvatar:
      c.author_avatar_urls?.['96'] ||
      c.author_avatar_urls?.['48'] ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    content: stripHtml(c.content?.rendered || ''),
    createdAt: formattedDate,
    likes: Math.floor(Math.random() * 5),
  };
}

export interface FetchArticlesOptions {
  categoryId?: number;
  tagId?: number;
  search?: string;
  page?: number;
  perPage?: number;
  exclude?: number | string;
  loadingTitle?: string;
  loadingMessage?: string;
}

// ==========================================
// Core WordPress REST API Methods
// ==========================================

// 1. Fetch Articles List (Home, Categories, Tags, Search)
export async function fetchArticles(
  options: FetchArticlesOptions = {}
): Promise<{ articles: NewsArticle[]; isFromLiveApi: boolean; totalPages?: number }> {
  const {
    categoryId,
    tagId,
    search,
    page = 1,
    perPage = 18,
    exclude,
    loadingTitle,
    loadingMessage,
  } = options;

  let endpointDesc = '/wp-json/wp/v2/posts';
  if (search) endpointDesc += `?search=${search}`;
  else if (categoryId) endpointDesc += `?categories=${categoryId}`;
  else if (tagId) endpointDesc += `?tags=${tagId}`;

  setApiLoading(true, {
    title: loadingTitle || (search ? 'Mencari Berita di editor.id' : categoryId ? 'Memuat Kategori Berita' : tagId ? 'Memuat Berita Berdasarkan Tag' : 'Memuat Berita editor.id'),
    message: loadingMessage || (search ? `Mencari '${search}' di database server...` : 'Menghubungi https://editor.id/wp-json/wp/v2/posts...'),
    endpoint: endpointDesc,
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const params = new URLSearchParams({
      _embed: 'true',
      per_page: String(perPage),
      page: String(page),
    });

    if (categoryId) params.append('categories', String(categoryId));
    if (tagId) params.append('tags', String(tagId));
    if (search && search.trim()) params.append('search', search.trim());
    if (exclude) params.append('exclude', String(exclude));

    const res = await fetch(`${WP_BASE_URL}/posts?${params.toString()}`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`WordPress API returned ${res.status}`);
    }

    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      const liveArticles = data.map(transformWpPost);
      // Cache general home feed
      if (!categoryId && !tagId && !search && page === 1) {
        try {
          localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(liveArticles));
        } catch {
          // safe to ignore
        }
      }
      return { articles: liveArticles, isFromLiveApi: true, totalPages };
    }
    return { articles: [], isFromLiveApi: true, totalPages };
  } catch (err) {
    console.warn('Gagal fetch live wp-json posts:', err);
    if (categoryId || tagId || search) {
      return { articles: [], isFromLiveApi: false, totalPages: 0 };
    }
  } finally {
    setApiLoading(false);
  }

  // Fallback to cache if available ONLY for default home feed
  if (!categoryId && !tagId && !search && page === 1) {
    try {
      const cached = localStorage.getItem(STORAGE_KEY_ARTICLES);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { articles: parsed, isFromLiveApi: false };
        }
      }
    } catch {}
    return { articles: INITIAL_ARTICLES, isFromLiveApi: false };
  }

  return { articles: [], isFromLiveApi: false, totalPages: 0 };
}

// 2. Fetch Single Post Details by ID
export async function fetchArticleById(id: string | number): Promise<NewsArticle | null> {
  const endpoint = `/wp-json/wp/v2/posts/${id}`;
  setApiLoading(true, {
    title: 'Memuat Isi Lengkap Artikel',
    message: `Mengambil data artikel #${id} dari editor.id...`,
    endpoint,
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${WP_BASE_URL}/posts/${id}?_embed=true`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return transformWpPost(data);
    }
  } catch (err) {
    console.warn(`Gagal fetch single post #${id}:`, err);
  } finally {
    setApiLoading(false);
  }

  return null;
}

// 3. Fetch Related Articles by Category
export async function fetchArticlesByCategory(
  categoryId: number,
  perPage = 15,
  categoryName?: string
): Promise<NewsArticle[]> {
  const result = await fetchArticles({
    categoryId,
    perPage,
    loadingTitle: `Kategori ${categoryName || `#${categoryId}`}`,
    loadingMessage: `Menghubungkan ke server untuk kanal ${categoryName || categoryId}...`,
  });
  return result.articles;
}

// 4. Fetch Articles by Tag ID
export async function fetchArticlesByTag(
  tagId: number,
  perPage = 15,
  tagName?: string
): Promise<NewsArticle[]> {
  const result = await fetchArticles({
    tagId,
    perPage,
    loadingTitle: `Topik #${tagName || tagId}`,
    loadingMessage: `Mengambil berita dengan tag #${tagName || tagId} dari editor.id...`,
  });
  return result.articles;
}

// 5. Live Search API
export async function fetchSearchArticles(
  searchQuery: string,
  perPage = 20
): Promise<NewsArticle[]> {
  if (!searchQuery.trim()) return [];
  const result = await fetchArticles({
    search: searchQuery.trim(),
    perPage,
    loadingTitle: 'Pencarian Berita',
    loadingMessage: `Mencari berita "${searchQuery}" di server editor.id...`,
  });
  return result.articles;
}

// 6. Fetch Categories (100 categories)
export async function fetchCategories(): Promise<Category[]> {
  const endpoint = '/wp-json/wp/v2/categories?per_page=100';
  setApiLoading(true, {
    title: 'Sinkronisasi Kanal Kategori',
    message: 'Memuat seluruh kategori resmi dari server editor.id...',
    endpoint,
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${WP_BASE_URL}/categories?per_page=100`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const sortedCats = [...data].sort((a: any, b: any) => (b.count || 0) - (a.count || 0));

        const wpCats: Category[] = sortedCats.map((c: any) => ({
          id: c.id,
          wpId: c.id,
          name: decodeHtml(c.name || ''),
          slug: c.slug,
          count: c.count,
          parent: c.parent,
          description: c.description || '',
          iconName: c.slug || 'indeks',
        }));

        const finalCategories = [
          { id: 'all', name: 'Semua', slug: 'all', count: 25000, iconName: 'indeks' },
          ...wpCats,
        ];

        try {
          localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(finalCategories));
        } catch {}

        return finalCategories;
      }
    }
  } catch (err) {
    console.warn('Gagal fetch live categories:', err);
  } finally {
    setApiLoading(false);
  }

  // Fallback cache
  try {
    const cached = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  return INITIAL_CATEGORIES;
}

// 7. Fetch Comments for an Article
export async function fetchComments(postId: string | number): Promise<Comment[]> {
  const endpoint = `/wp-json/wp/v2/comments?post=${postId}&per_page=50`;
  setApiLoading(true, {
    title: 'Memuat Komentar',
    message: 'Mengambil tanggapan pembaca dari server editor.id...',
    endpoint,
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${WP_BASE_URL}/comments?post=${postId}&per_page=50`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map(transformWpComment);
      }
    }
  } catch (err) {
    console.warn(`Gagal fetch comments for post #${postId}:`, err);
  } finally {
    setApiLoading(false);
  }

  return [];
}
