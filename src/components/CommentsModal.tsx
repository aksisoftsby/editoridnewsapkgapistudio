import React, { useState } from 'react';
import { X, MessageSquare, ThumbsUp, Send } from 'lucide-react';
import { Comment, NewsArticle } from '../types';

interface CommentsModalProps {
  article: NewsArticle | null;
  comments: Comment[];
  onClose: () => void;
  onAddComment: (articleId: string | number, text: string, name: string) => void;
  onLikeComment: (commentId: string) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  article,
  comments,
  onClose,
  onAddComment,
  onLikeComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');

  if (!article) return null;

  const articleComments = comments.filter((c) => c.articleId === article.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(article.id, commentText.trim(), authorName.trim() || 'Pembaca editor.id');
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Komentar ({articleComments.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {articleComments.length > 0 ? (
            articleComments.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={c.userAvatar}
                      alt={c.userName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {c.userName}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {c.createdAt}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onLikeComment(c.id)}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold">{c.likes}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-9">
                  {c.content}
                </p>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              Belum ada komentar. Jadilah yang pertama berkomentar!
            </div>
          )}
        </div>

        {/* Add Comment Box */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-900">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Nama Anda (opsional)"
            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Tulis pendapat Anda tentang berita ini..."
              className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1 transition shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
