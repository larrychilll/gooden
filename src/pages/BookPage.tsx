import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, Chapter } from '../types';
import { getBookBySlug, getChaptersByBookId } from '../services/supabase';
import { BookOpen, ChevronRight, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';

const BookPage: React.FC = () => {
  const { bookSlug, categorySlug } = useParams<{ bookSlug: string; categorySlug: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChaptersVisible, setIsChaptersVisible] = useState(true);

  const toggleChapters = () => {
    setIsChaptersVisible(!isChaptersVisible);
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{book.titleCh}</p>
            <div className="flex items-center text-gray-500 mb-6">
              <BookOpen className="w-5 h-5 mr-2" />
              <span className="text-base">{book.author}</span>
            </div>
            <div className="bg-green-100 p-4 md:hidden">
              <p className="text-center text-gray-900 font-bold">✅ MOBILE TOGGLE ZONE</p>
            </div>

            {/* Mobile toggle for chapters */}
            <div
              className="md:hidden flex items-center gap-2 py-2 cursor-pointer font-medium text-gray-800 border rounded px-4 mb-4 bg-gray-100"
              onClick={toggleChapters}
            >
              {isChaptersVisible ? (
                <ChevronDown className="h-5 w-5 text-amber-600" />
              ) : (
                <ChevronRight className="h-5 w-5 text-amber-600" />
              )}
              <span>章節摘要</span>
            </div>

            {book.affiliateUrl && (
              <a
                href={book.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-[#FF9000] text-white rounded-lg hover:bg-[#FF7A00] transition-colors duration-200"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Buy Book
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Chapter list block — hidden on mobile unless toggled */}
      <div className={`space-y-4 ${isChaptersVisible ? 'block' : 'hidden'} md:block bg-white rounded-lg shadow-md p-6 transition-all duration-300 ease-in-out`}>
  {/* Add transition classes here */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Chapters</h2>

        {book && (
          <Link
            to={`/category/${categorySlug}/book/${book.slug}/chapter/chapter0`}
            className="block p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100"
            style={{ backgroundColor: '#fff8dc' }}
          >
            <h3 className="text-lg font-medium text-gray-900">
              0. Chapter 0: Special Introduction
            </h3>
            <p className="text-gray-600 text-[18px]">特別篇：前言導讀</p>
          </Link>
        )}

        {chapters.map((chapter) => (
          <Link
            key={chapter.id}
            to={`/category/${categorySlug}/book/${book.slug}/chapter/${chapter.slug}`}
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
  );
};

export default BookPage;
