import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, Chapter } from '../types';
import { fetchBooks } from '../data/books';  // Fetch books dynamically from Supabase
import { fetchChapters } from '../data/chapters';  // Fetch chapters dynamically from Supabase
import { BookOpen, ChevronRight, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';

const BookPage: React.FC = () => {
  const { bookSlug } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!bookSlug) return;
      try {
        // Fetch the book details dynamically
        const booksData = await fetchBooks();
        const selectedBook = booksData.find((b) => b.slug === bookSlug);
        setBook(selectedBook);

        if (selectedBook) {
          // Fetch chapters based on the book_id dynamically
          const chaptersData = await fetchChapters(selectedBook.id);
          setChapters(chaptersData.sort((a, b) => a.order - b.order));  // Sort chapters by order
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [bookSlug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!book) {
    return <div>Book not found</div>;
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
              <BookOpen className="w-5 h-5 mr-2" />
              <span className="text-base">{book.author}</span>
            </div>
            <p className="text-gray-700 mb-6">{book.description}</p>
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

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Chapters</h2>

        {/* Mobile toggle visibility using checkbox */}
        <div className="md:hidden">
          <input type="checkbox" id="toggleChapters" className="hidden peer" />
          <label
            htmlFor="toggleChapters"
            className="text-blue-500 cursor-pointer flex items-center justify-between mb-4"
          >
            <span className="text-lg">Show Chapters</span>
            <ChevronDown className="w-5 h-5 text-gray-500 peer-checked:hidden" />
            <ChevronUp className="w-5 h-5 text-gray-500 peer-checked:block hidden" />
          </label>
        </div>

        {/* Chapters list */}
        <div className="space-y-4 mt-4">
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