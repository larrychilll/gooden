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
  const [isExpanded, setIsExpanded] = useState(false);  // State to control the visibility of chapters on mobile

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

  const toggleChapterVisibility = () => {
    setIsExpanded(!isExpanded);  // Toggle the state to show/hide chapters
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div>
      <h1>{book.title}</h1>
      <div>
        {/* Expandable toggle only on mobile */}
        <div className="flex items-center justify-between md:hidden" onClick={toggleChapterVisibility}>
          <h2 className="text-2xl font-bold">Chapters</h2>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>

        {/* Chapters list: hidden by default on mobile, always visible on desktop */}
        <div className={`space-y-4 mt-4 ${isExpanded ? '' : 'hidden'} md:block`}>
          {/* Chapters list */}
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
