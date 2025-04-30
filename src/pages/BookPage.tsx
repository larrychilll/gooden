import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, Chapter } from '../types';
import { getBookBySlug, getChaptersByBookId } from '../services/supabase';
import { BookOpen, ShoppingCart } from 'lucide-react';
import { ChapterList } from '../components/ChapterList';

const BookPage: React.FC = () => {
  const { bookSlug, categorySlug } = useParams<{ bookSlug: string; categorySlug: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

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
            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{book.titleCh}</p>
            <div className="flex items-center text-gray-500 mb-6">
              <BookOpen className="w-5 h-5 mr-2" />
              <span className="text-base">{book.author}</span>
            </div>
            {book.affiliateUrl && (
              <a
                href={book.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-[#FF9000] text-white rounded-lg hover:bg-[#FF7A00]"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Buy Book
              </a>
            )}
          </div>
        </div>
      </div>

      <ChapterList chapters={chapters} />
    </div>
  );
};

export default BookPage;