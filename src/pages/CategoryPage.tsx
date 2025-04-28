import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categories } from '../data/categories';
import { Book, Chapter } from '../types';
import { getBooks, getChaptersByBookId } from '../services/supabase';
import { Book as BookIcon } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams();
  const category = categories.find(c => c.slug === categorySlug);
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Record<string, Chapter[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!category) return;
      
      try {
        const allBooks = await getBooks();
        const categoryBooks = allBooks.filter(book => book.categoryId === category.id);
        setBooks(categoryBooks);

        const chaptersData: Record<string, Chapter[]> = {};
        await Promise.all(
          categoryBooks.map(async (book) => {
            try {
              const bookChapters = await getChaptersByBookId(book.id);
              chaptersData[book.id] = bookChapters;
            } catch (err) {
              console.error(`Error fetching chapters for book ${book.id}:`, err);
            }
          })
        );
        setChapters(chaptersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [category?.id]);

  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Category not found</h2>
        <p className="text-gray-600 mt-2">Current slug: {categorySlug}</p>
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-700">Available categories:</h3>
          <ul className="mt-2 space-y-1">
            {categories.map(c => (
              <li key={c.id} className="text-gray-600">
                {c.nameEn} (slug: {c.slug})
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Error loading data</h2>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-64 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {books.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">No books found in this category</h2>
        </div>
      ) : (
        books.map((book) => {
          const bookChapters = chapters[book.id] || [];
          const midpoint = Math.ceil(bookChapters.length / 2);
          const column2 = bookChapters.slice(0, midpoint);
          const column3 = bookChapters.slice(midpoint);

          return (
            <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Column 1: Book cover and info */}
                  <div>
                    <div className="aspect-[3/4] overflow-hidden rounded-lg shadow-sm mb-4">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <BookIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{book.title}</h2>
                    <p className="text-lg md:text-xl text-gray-600 mb-2">{book.titleCh}</p>
                    <div className="flex items-center text-gray-500 text-base md:text-lg">
                      <BookIcon className="w-4 h-4 mr-2" />
                      <span>{book.author}</span>
                    </div>
                  </div>

                  {/* Column 2: First half of chapters */}
                  <div className="space-y-2">
                    {column2.map((chapter) => (
                      <Link
                        key={chapter.id}
                        to={`/book/${book.slug}/chapter/${chapter.slug}`}
                        className="block p-3 rounded hover:bg-gray-50 transition-colors duration-200 border border-gray-100"
                      >
                        <h3 className="text-gray-900 font-medium">
                          {chapter.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{chapter.titleCh}</p>
                      </Link>
                    ))}
                  </div>

                  {/* Column 3: Second half of chapters */}
                  <div className="space-y-2">
                    {column3.map((chapter) => (
                      <Link
                        key={chapter.id}
                        to={`/book/${book.slug}/chapter/${chapter.slug}`}
                        className="block p-3 rounded hover:bg-gray-50 transition-colors duration-200 border border-gray-100"
                      >
                        <h3 className="text-gray-900 font-medium">
                          {chapter.title}
                        </h3>
                        <p className="text-gray-600 text-[18px]">{chapter.titleCh}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default CategoryPage;
