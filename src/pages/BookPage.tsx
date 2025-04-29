import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, Chapter } from '../types';
import { getBookBySlug, getChaptersByBookId } from '../services/supabase';
import { ChevronDown, ChevronRight } from 'lucide-react';

const BookPage: React.FC = () => {
  const { bookSlug } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!bookSlug) return;
      try {
        const bookData = await getBookBySlug(bookSlug);
        setBook(bookData);

        if (bookData) {
          const chaptersData = await getChaptersByBookId(bookData.id);
          setChapters(chaptersData.sort((a, b) => a.order - b.order));
        }
      } catch (error) {
        console.error('Error fetching book data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [bookSlug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="aspect-[2/3] bg-gray-200"></div>
            </div>
            <div className="p-6 md:w-2/3 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Book not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <div className="aspect-[2/3] overflow-hidden">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="p-6 md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {book.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{book.titleCh}</p>
            <div className="flex items-center text-gray-500 mb-6">
              <span className="text-base">{book.author}</span>
            </div>
            
            {/* Chevron Icon Below Author */}
            <div className="md:hidden flex justify-center mb-6">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-700 hover:text-[#FF9000] transition-colors duration-200"
                aria-label="Toggle chapters"
              >
                <ChevronDown
                  className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            <p className="text-gray-700 mb-6">{book.description}</p>
          </div>
        </div>
      </div>

      {/* Chapter List */}
      <div className="mt-4">
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <Link
              key={chapter.id}
              to={`/book/${book.slug}/chapter/${chapter.slug}`}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {chapter.order}. {chapter.title}
                </h3>
                <p className="text-gray-600 text-[18px]">{chapter.titleCh}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookPage;
