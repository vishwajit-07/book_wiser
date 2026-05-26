import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBook, fetchBookById, updateBook } from '../api/booksApi';
import { uploadImageToCloudinary } from '../api/cloudinaryApi';
import toast from 'react-hot-toast';

const GENRE_OPTIONS = [
  'Fiction', 'Non-Fiction', 'Dystopian', 'Science', 'Sci-Fi',
  'Fantasy', 'History', 'Romance', 'Mystery', 'Biography', 'Other'
];
function validateForm(values) {
  const errors = {};
  if (!values.title?.trim()) errors.title = 'Title is required';
  if (!values.author?.trim()) errors.author = 'Author is required';
  if (!values.genre?.trim()) errors.genre = 'Genre is required';
  if (!values.year || isNaN(values.year)) {
    errors.year = 'Enter a valid year';
  }
  return errors;
}

export default function BookAction() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);
  const [values, setValues] = useState({ title: '', author: '', genre: '', year: '', imageUrl: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusText, setStatusText] = useState('');
  useEffect(() => {
    if (isEditMode) {
      async function loadBook() {
        try {
          const res = await fetchBookById(id);
          const bookData = { ...res.data, year: String(res.data.year) };
          setValues(bookData);
          if (bookData.imageUrl) {
            setImagePreview(bookData.imageUrl);
          }
        } catch (error) {
          toast.error('Could not load the book.');
          navigate('/');
        } finally {
          setIsLoading(false);
        }
      }
      loadBook();
    }
  }, [id, isEditMode, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelection = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm(values);
    setErrors(formErrors);

    setTouched({ title: true, author: true, genre: true, year: true });

    if (Object.keys(formErrors).length > 0) return;

    setIsSubmitting(true);
    let finalImageUrl = values.imageUrl;

    try {
      if (imageFile) {
        setStatusText('Uploading Image...');
        finalImageUrl = await uploadImageToCloudinary(imageFile);
      }

      const finalBookData = {
        title: values.title.trim(),
        author: values.author.trim(),
        genre: values.genre.trim(),
        year: Number(values.year),
        imageUrl: finalImageUrl,
      };

      setStatusText('Saving Book...');
      if (isEditMode) {
        await updateBook(id, finalBookData);
        toast.success(`Book updated successfully!`);
      } else {
        await createBook(finalBookData);
        toast.success(`Book added successfully!`);
      }

      navigate('/');

    } catch (error) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
      setStatusText('');
    }
  };

  const titleText = isEditMode ? 'Edit Book' : 'Add New Book';
  const subtitleText = isEditMode ? 'Update the details below.' : 'Enter the details for the new book.';
  const buttonText = isEditMode ? 'Update Book' : 'Save Book';

  const getInputClasses = (fieldName) => {
    const hasError = touched[fieldName] && errors[fieldName];
    return `w-full px-4 py-2.5 bg-background border rounded-lg font-inter text-body-md focus:outline-none focus:ring-2 transition-all ${hasError ? 'border-error focus:ring-error/30' : 'border-outline-variant/50 focus:ring-primary-container focus:border-transparent'
      }`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-on-background/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-screen overflow-y-auto bg-surface-container-lowest rounded-xl modal-shadow border border-white/20 glass-effect animate-scaleIn my-8">

        <div className="sticky top-0 bg-surface-container-lowest/80 backdrop-blur z-10 px-gutter pt-gutter pb-sm flex justify-between items-start border-b border-outline-variant/20">
          <div>
            <h2 className="font-outfit text-headline-md font-semibold">{titleText}</h2>
            <p className="font-inter text-body-sm text-on-surface-variant mt-1">{subtitleText}</p>
          </div>
          <button onClick={() => navigate('/')} className="p-1 rounded-full hover:bg-surface-container-high/50 text-outline transition-all cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-gutter py-sm pb-gutter mt-4">

          {isLoading ? (
            <p className="text-center text-on-surface-variant">Loading book details...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-md">

              <div className="space-y-xs">
                <label className="font-inter text-label-md block">Cover Image</label>
                <div className="flex items-center gap-md">

                  <div className="w-20 h-28 shrink-0 bg-surface-variant/30 rounded-lg border border-outline-variant/50 overflow-hidden flex items-center justify-center text-outline">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-[32px]">image</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <label htmlFor="cover-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 rounded-lg font-inter text-label-md cursor-pointer transition-all active:scale-95">
                      <span className="material-symbols-outlined text-[18px]">upload</span>
                      Choose Image
                    </label>
                    <input id="cover-upload" type="file" accept="image/*" onChange={handleImageSelection} className="hidden" />
                    <p className="font-inter text-[12px] text-on-surface-variant mt-2">
                      Upload an image via Cloudinary.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-xs">
                <label htmlFor="title" className="font-inter text-label-md block">Title</label>
                <input
                  id="title" name="title" type="text" placeholder="e.g. The Great Gatsby"
                  value={values.title} onChange={handleInputChange}
                  onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
                  className={getInputClasses('title')}
                />
                {touched.title && errors.title && <p className="text-[12px] text-error mt-1">{errors.title}</p>}
              </div>

              <div className="space-y-xs">
                <label htmlFor="author" className="font-inter text-label-md block">Author</label>
                <input
                  id="author" name="author" type="text" placeholder="e.g. F. Scott Fitzgerald"
                  value={values.author} onChange={handleInputChange}
                  onBlur={() => setTouched(prev => ({ ...prev, author: true }))}
                  className={getInputClasses('author')}
                />
                {touched.author && errors.author && <p className="text-[12px] text-error mt-1">{errors.author}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">

                <div className="space-y-xs">
                  <label htmlFor="genre" className="font-inter text-label-md block">Genre</label>
                  <div className="relative">
                    <select
                      id="genre" name="genre"
                      value={values.genre} onChange={handleInputChange}
                      onBlur={() => setTouched(prev => ({ ...prev, genre: true }))}
                      className={`${getInputClasses('genre')} appearance-none cursor-pointer pr-10`}
                    >
                      <option value="">Select Genre</option>
                      {GENRE_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
                  </div>
                  {touched.genre && errors.genre && <p className="text-[12px] text-error mt-1">{errors.genre}</p>}
                </div>

                <div className="space-y-xs">
                  <label htmlFor="year" className="font-inter text-label-md block">Year</label>
                  <input
                    id="year" name="year" type="number" placeholder="YYYY"
                    value={values.year} onChange={handleInputChange}
                    onBlur={() => setTouched(prev => ({ ...prev, year: true }))}
                    className={getInputClasses('year')}
                  />
                  {touched.year && errors.year && <p className="text-[12px] text-error mt-1">{errors.year}</p>}
                </div>

              </div>

              <div className="flex justify-end items-center gap-md pt-base border-t border-outline-variant/20 mt-4">
                <button type="button" onClick={() => navigate('/')} className="px-6 py-2 rounded-lg font-inter text-on-surface-variant hover:bg-surface-container-high/50 transition-all cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-on-background text-surface px-8 py-2.5 rounded-lg font-inter hover:bg-primary-container hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-50 cursor-pointer">
                  {isSubmitting ? statusText : buttonText}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
