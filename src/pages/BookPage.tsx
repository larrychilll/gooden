import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, Chapter } from '../types';
import { getBookBySlug, getChaptersByBookId } from '../services/supabase';
import { ChevronDown, ChevronRight } from 'lucide-react'; // Keep imports

const BookPage: React.FC = () => {
  const { bookSlug } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  // State to control visibility of the actual chapter list
  const [isExpanded, setIsExpanded] = useState(false); // Start collapsed

  useEffect(() => {
    // ... fetchData logic remains the same ...
    async function fetchData() {
      if (!bookSlug) return;
      setLoading(true); // Ensure loading state is reset on slug change
      try {
        const bookData = await getBookBySlug(bookSlug);
        setBook(bookData);

        if (bookData) {
          const chaptersData = await getChaptersByBookId(bookData.id);
          setChapters(chaptersData.sort((a, b) => a.order - b.order));
        } else {
          setChapters([]); // Clear chapters if book not found
        }
      } catch (error) {
        console.error('Error fetching book data:', error);
        setChapters([]); // Clear chapters on error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [bookSlug]);

  // --- Loading and Not Found states remain the same ---
  if (loading) {
    // ... loading skeleton ...
    return <div>Loading...</div>; // Placeholder
  }

  if (!book) {
    // ... book not found ...
    return <div>Book not found</div>; // Placeholder
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* --- Book Details Section remains the same --- */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* ... book cover, title, author, description ... */}
      </div>

      {/* --- Chapters Section --- */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* No H2 needed for the toggle element itself if desired */}
        {/* <h2 className="text-2xl font-bold text-gray-900 mb-6">Chapters</h2> */}

        {/* --- Step 1: Hardcoded Toggle Trigger (Always Visible for now) --- */}
        <div
          onClick={() => {
            console.log("Toggle clicked! New state will be:", !isExpanded);
            setIsExpanded(!isExpanded);
          }}
          className="flex justify-between items-center p-4 bg-gray-100 rounded-md cursor-pointer mb-4 border border-blue-300"
          role="button"
          aria-expanded={isExpanded}
          aria-controls="real-chapter-list"
        >
          <span className="font-semibold text-blue-700">
             {/* Change text based on state */}
             {isExpanded ? 'Collapse Chapter List' : 'Expand Chapter List'}
          </span>
          {/* Basic Chevron - Rotates based on state */}
          <ChevronDown
            className={`w-5 h-5 text-blue-700 transform transition-transform ${
              isExpanded ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </div>
        {/* --- End Hardcoded Toggle Trigger --- */}


        {/* --- Step 2: Actual Chapter List (Visibility controlled ONLY by state) --- */}
        {/* Removed md:block for this test */}
        <div
          id="real-chapter-list"
          className={`
            space-y-4 border-t pt-4
            ${isExpanded ? 'block' : 'hidden'} {/* ONLY depends on isExpanded state */}
          `}
        >
           <h2 className="text-2xl font-bold text-gray-900 mb-4">Chapters</h2> {/* Moved H2 here */}

          {chapters.length > 0 ? (
             chapters.map((chapter) => (
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
             ))
           ) : (
              <p className="text-gray-500">No chapters available for this book.</p>
           )}
        </div>
        {/* --- End Actual Chapter List --- */}

      </div>
    </div>
  );
};

export default BookPage;