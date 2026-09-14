export interface ArticleTag {
  id?: number;
  name: string;
  slug?: string;
}

export interface ArticleCategoryItem {
  id: number;
  name: string;
  slug: string;
}

export interface NewsArticle {
  id: string | number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categoryId?: number;
  categorySlug?: string;
  categoryIds?: number[];
  categoriesList?: ArticleCategoryItem[];
  tags?: ArticleTag[];
  tagIds?: number[];
  imageUrl: string;
  imageCaption?: string;
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  publishedAt: string; // ISO or human format
  readTime: string; // e.g. "5 menit baca"
  viewsCount?: number;
  commentsCount?: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  quote?: {
    text: string;
    author: string;
  };
  link?: string;
}

export interface Category {
  id: string | number;
  wpId?: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
  parent?: number;
  color?: string;
  iconName?: string;
}


export interface Comment {
  id: string;
  articleId: string | number;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface PushNotificationItem {
  id: string;
  title: string;
  body: string;
  articleId?: string | number;
  timestamp: string;
  isRead: boolean;
  category: string;
}

export interface UserHistoryItem {
  articleId: string | number;
  title: string;
  category: string;
  imageUrl: string;
  readAt: string;
}

export interface ApiLoadingState {
  isLoading: boolean;
  title: string;
  message: string;
  endpoint?: string;
  isDismissable?: boolean;
}

