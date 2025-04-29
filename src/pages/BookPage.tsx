import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, Chapter } from '../types';
import { getBookBySlug, getChaptersByBookId } from '../services/supabase';
// Make sure both chevrons are imported if you use them
import { ChevronDown, ChevronRight } from 'lucide-react';

const BookPage: React.FC = () => {
  const { bookSlug } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  // We still use state to control expansion on mobile
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

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
        {/* Header Section - Now includes the toggle logic */}
        <div
          // Make the header clickable only on mobile (screens < md)
          // Apply cursor-pointer only on mobile
          className="flex justify-between items-center mb-6 md:mb-6 cursor-pointer md:cursor-default"
          onClick={() => {
            // We only want the toggle behaviour on mobile.
            // We can check window width, but relying on CSS for display is often cleaner.
            // Let's toggle state and let CSS handle visual cues/list display.
            // Check if screen is smaller than typical 'md' breakpoint (e.g., 768px) before toggling
             if (window.innerWidth < 768) { // Adjust 768 if your 'md' breakpoint is different
                setIsMobileExpanded(!isMobileExpanded);
             }
             // Note: A resize listener might be needed for robust edge cases, but this covers initial load/clicks.
          }}
          // Add accessibility attributes for screen readers on mobile
          role="button" // Role identifies it as interactive
          aria-expanded={isMobileExpanded} // Communicates state
          aria-controls="chapter-list-content" // Links button to the content it controls
        >
          <h2 className="text-2xl font-bold text-gray-900">
            Chapters
          </h2>
          {/* Chevron Down/Up Icon - ONLY visible and interactive on mobile */}
          <ChevronDown
            className={`w-6 h-6 text-gray-600 md:hidden transform transition-transform ${
              isMobileExpanded ? 'rotate-180' : 'rotate-0'
            }`}
            // Prevent icon from stealing click event if needed, though usually fine
             style={{ pointerEvents: 'none' }}
          />
           {/* Optional: You could show a static ChevronRight on desktop if desired */}
           {/* <ChevronRight className="w-5 h-5 text-gray-400 hidden md:block" /> */}
        </div>

        {/* Chapter List Content - Conditionally displayed */}
        {/*
          - Mobile (< md): Hidden if isMobileExpanded is false, shown if true.
          - Desktop (>= md): Always shown (md:block overrides hidden).
         */}
        <div
           id="chapter-list-content" // ID for aria-controls
           className={`
            space-y-4
            ${isMobileExpanded ? 'block' : 'hidden'} // Base state for mobile
            md:block // Force block display on medium screens and up
          `}
        >
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
              {/* Keep the right chevron for navigating to a chapter */}
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookPage;