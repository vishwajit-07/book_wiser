import React from 'react';
import { Link } from 'react-router-dom';

const COVER_CLASS = {
  Fiction: 'cover-fiction',
  Dystopian: 'cover-dystopian',
  Science: 'cover-science',
  'Sci-Fi': 'cover-sci-fi',
  Fantasy: 'cover-fantasy',
  History: 'cover-history',
  Romance: 'cover-romance',
  Mystery: 'cover-mystery',
  Biography: 'cover-biography',
  'Non-Fiction': 'cover-science',
  Other: 'cover-default',
};

export default function BookCard({ book, onDelete }) {
  const coverClass = COVER_CLASS[book.genre] || 'cover-default';

  return (
    <div className="group relative bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

      <div className={`aspect-[3/4] overflow-hidden relative ${coverClass}`}>

        {book.imageUrl ? (
          <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-md text-center">
            <span className="material-symbols-outlined text-white/20 text-[80px] mb-2">menu_book</span>
            <p className="text-white/60 font-outfit font-bold text-lg leading-tight line-clamp-2 px-4">
              {book.title}
            </p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-base right-base flex gap-xs translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Link
            to={`/edit-book/${book.id}`}
            className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-on-surface hover:text-primary transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </Link>
          <button
            onClick={() => onDelete(book.id)}
            className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-on-surface hover:text-error transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      </div>

      <div className="p-md flex flex-col gap-base">
        <h3 className="font-outfit text-lg text-on-surface line-clamp-2 leading-tight font-semibold">
          {book.title}
        </h3>
        <div className="flex flex-col gap-2 text-on-surface-variant">

          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-primary/70">person</span>
            <span className="font-inter text-body-sm">{book.author}</span>
          </div>

          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-outline">category</span>
              <span className="font-inter text-body-sm">{book.genre}</span>
            </div>
            <div className="flex items-center gap-1 text-outline">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              <span className="font-inter text-[12px]">{book.year}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
