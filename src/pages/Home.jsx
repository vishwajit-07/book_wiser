import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchBooks, deleteBook } from '../api/booksApi';
import BookCard from '../components/BookCard';
import toast from 'react-hot-toast';

function SearchBar({ search, onSearchChange, genre, onGenreChange, genres }) {
  return (
    <section className="flex flex-col gap-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div className="relative w-full md:w-[480px]">
          <span className="material-symbols-outlined absolute left-base top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            type="text"
            placeholder="Search title, author, or ISBN..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-11 pl-10 pr-md bg-surface-container-low border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container text-body-md font-inter transition-all outline-none"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-sm items-center">
        <span className="text-label-sm font-inter text-outline uppercase font-bold tracking-widest mr-base">Filter:</span>
        <button
          onClick={() => onGenreChange('')}
          className={`px-md py-xs rounded-lg border font-inter text-label-md transition-all cursor-pointer ${
            genre === '' ? 'border-primary-container bg-primary-container/10 text-primary' : 'border-outline-variant bg-transparent text-on-surface-variant hover:border-primary-container hover:text-primary hover:bg-surface-container'
          }`}
        >
          All
        </button>
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => onGenreChange(g)}
            className={`px-md py-xs rounded-lg border font-inter text-label-md transition-all cursor-pointer ${
              genre === g ? 'border-primary-container bg-primary-container/10 text-primary' : 'border-outline-variant bg-transparent text-on-surface-variant hover:border-primary-container hover:text-primary hover:bg-surface-container'
            }`}
          >
            {g}
          </button>
        ))}
      </div>
    </section>
  );
}

function Loader({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden animate-pulse">
          <div className="aspect-[3/4] bg-surface-variant/40" />
          <div className="p-md flex flex-col gap-base">
            <div className="h-6 bg-surface-variant/60 rounded w-3/4" />
            <div className="h-4 bg-surface-variant/40 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ConfirmModal({ bookTitle, onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-on-background/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-xl modal-shadow border border-white/20 glass-effect animate-scaleIn">
        <div className="px-gutter pt-gutter pb-sm flex justify-between items-start">
          <div>
            <h2 className="font-outfit text-headline-md text-on-background font-semibold">Delete Book?</h2>
            <p className="font-inter text-body-sm text-on-surface-variant mt-1">
              Are you sure you want to delete <strong className="text-on-surface">"{bookTitle}"</strong>? This action cannot be undone.
            </p>
          </div>
          <button onClick={onCancel} disabled={isDeleting} className="p-1 rounded-full hover:bg-surface-container-high/50 text-outline transition-all cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex justify-center py-md">
          <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center">
            <span className="material-symbols-outlined text-error text-[32px]">warning</span>
          </div>
        </div>
        <div className="px-gutter py-gutter flex justify-end items-center gap-md">
          <button onClick={onCancel} disabled={isDeleting} className="px-6 py-2 rounded-lg font-inter text-label-md text-on-surface-variant hover:bg-surface-container-high/50 transition-all cursor-pointer">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isDeleting} className="bg-error text-on-error px-8 py-2.5 rounded-lg font-inter text-label-md hover:bg-error/90 active:scale-95 transition-all shadow-md disabled:opacity-50 cursor-pointer">
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchBooks();
      setBooks(res.data);
    } catch {
      setError('Failed to load books. Please make sure JSON Server is running on port 3000.');
      toast.error('Could not fetch books.');
    } finally {
      setLoading(false);
    }
  };

  const genres = useMemo(() => {
    const set = new Set(books.map((b) => b.genre).filter(Boolean));
    return Array.from(set).sort();
  }, [books]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return books.filter((b) => {
      const matchesSearch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      const matchesGenre = !genreFilter || b.genre === genreFilter;
      return matchesSearch && matchesGenre;
    });
  }, [books, search, genreFilter]);

  const handleDeleteClick = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    if (book) setDeleteTarget(book);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteBook(deleteTarget.id);
      setBooks((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      toast.success(`"${deleteTarget.title}" deleted.`);
    } catch {
      toast.error('Delete failed. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-lg">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-sm md:gap-md">
        <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant/20 flex flex-col">
          <span className="text-label-sm font-inter text-outline uppercase font-bold tracking-tighter">Total Titles</span>
          <span className="font-outfit text-headline-md font-bold">{loading ? '—' : books.length}</span>
        </div>
        <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant/20 flex flex-col">
          <span className="text-label-sm font-inter text-outline uppercase font-bold tracking-tighter">Genres</span>
          <span className="font-outfit text-headline-md font-bold">{loading ? '—' : genres.length}</span>
        </div>
        <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant/20 flex flex-col">
          <span className="text-label-sm font-inter text-outline uppercase font-bold tracking-tighter">Filtered</span>
          <span className="font-outfit text-headline-md font-bold">{loading ? '—' : filtered.length}</span>
        </div>
        <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant/20 flex flex-col">
          <span className="text-label-sm font-inter text-outline uppercase font-bold tracking-tighter">New Arrivals</span>
          <span className="font-outfit text-headline-md font-bold text-primary">+{loading ? '—' : Math.min(books.length, 3)}</span>
        </div>
      </section>

      <section className="flex flex-col gap-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <SearchBar search={search} onSearchChange={setSearch} genre={genreFilter} onGenreChange={setGenreFilter} genres={genres} />
          <Link to="/add-book" className="hidden lg:flex h-11 px-md bg-on-background text-white rounded-lg items-center gap-base hover:bg-primary-container hover:shadow-lg active:scale-95 transition-all shrink-0">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 600" }}>add</span>
            <span className="font-inter text-label-md">Add Book</span>
          </Link>
        </div>
      </section>

      {error && (
        <div className="bg-error-container border border-error/20 rounded-xl p-md flex items-start gap-sm animate-slideUp">
          <span className="material-symbols-outlined text-error">error</span>
          <div>
            <p className="font-inter text-body-sm text-on-error-container font-medium">{error}</p>
            <button onClick={loadBooks} className="mt-2 font-inter text-body-sm text-primary hover:underline font-medium cursor-pointer">Retry</button>
          </div>
        </div>
      )}

      {loading && <Loader count={8} />}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-xl space-y-md animate-slideUp">
          <span className="material-symbols-outlined text-[80px] text-outline/30">library_books</span>
          {books.length === 0 ? (
            <>
              <p className="font-outfit text-headline-sm text-on-surface-variant">Your library is empty</p>
              <Link to="/add-book" className="inline-flex items-center gap-base bg-primary text-on-primary font-inter text-label-md px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all">
                <span className="material-symbols-outlined text-sm">add</span> Add your first book
              </Link>
            </>
          ) : (
            <p className="font-outfit text-headline-sm text-on-surface-variant">No books match your search</p>
          )}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} onDelete={handleDeleteClick} />
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal bookTitle={deleteTarget.title} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} isDeleting={isDeleting} />
      )}
    </div>
  );
}
