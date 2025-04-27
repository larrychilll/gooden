import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, Chapter, ChapterContent } from '../types';
import { getBookBySlug, getChaptersByBookId, getChapterContent } from '../services/supabase';
import { ChevronLeft, ChevronRight, BookOpen, ShoppingCart, Loader2 } from 'lucide-react';

interface ChapterData {
  book: Book | null;
  chapter: Chapter | null;
  content: ChapterContent | null;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
}

const ChapterPage: React.FC = () => {
  const { bookSlug, chapterSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ChapterData>({
    book: null,
    chapter: null,
    content: null,
    prevChapter: null,
    nextChapter: null
  });

  useEffect(() => {
    async function fetchData() {
      if (!bookSlug || !chapterSlug) return;
      
      try {
        setLoading(true);
        setError(null);

        const book = await getBookBySlug(bookSlug);
        if (!book) throw new Error('Book not found');

        const chapters = await getChaptersByBookId(book.id);
        const chapter = chapters.find(c => c.slug === chapterSlug);
        if (!chapter) throw new Error('Chapter not found');

        const chapterIndex = chapters.findIndex(c => c.id === chapter.id);
        const prevChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
        const nextChapter = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;

        const content = await getChapterContent(chapter.id);

        setData({ book, chapter, content, prevChapter, nextChapter });
      } catch (err) {
        console.error('Error loading chapter:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chapter');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [bookSlug, chapterSlug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !data.book || !data.chapter) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {error || 'Chapter not found'}
        </h2>
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-800"
        >
          Return to homepage
        </Link>
      </div>
    );
  }

  const { book, chapter, content, prevChapter, nextChapter } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-3 space-y-8">
          {/* Book and Chapter Navigation */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Link 
                    to={`/book/${book.slug}`}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    <span className="text-sm">Back to Book</span>
                  </Link>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-600">
                    Chapter {chapter.order}
                  </span>
                </div>
                {book.affiliateUrl && (
                  <a
                    href={book.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-[#FF9000] text-white rounded-lg hover:bg-[#FF7A00] transition-colors duration-200"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Book
                  </a>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{book.titleCh}</p>
              <h2 className="text-2xl font-semibold text-gray-800">
                {chapter.title}
              </h2>
              <p className="text-gray-600">{chapter.titleCh}</p>
            </div>
          </div>

          {/* Content */}
          {content ? (
            <div className="space-y-8">
              {/* Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Summary</h3>
                <div className="space-y-6">
                  <p className="text-gray-800 text-[18px] whitespace-pre-wrap">{content.summary_en}</p>
                  <p className="text-gray-600 text-[18px] whitespace-pre-wrap">{content.summary_ch}</p>
                </div>
              </div>

              {/* Key Points */}
              {content.key_points && content.key_points.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Points</h3>
                  <div className="space-y-6">
                    {content.key_points.map((point, index) => (
                      <div key={index} className="border-l-4 border-indigo-500 pl-4">
                        <p className="text-gray-800 text-[18px] whitespace-pre-wrap">{point.en}</p>
                        <p className="text-gray-600 text-[18px] mt-1 whitespace-pre-wrap">{point.ch}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vocabulary */}
              {content.vocabulary && content.vocabulary.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Vocabulary</h3>
                  <div className="space-y-6">
                    {content.vocabulary.map((item, index) => (
                      <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                        <h4 className="font-medium text-gray-900">
                          {item.word} <span className="text-gray-600">({item.translation})</span>
                        </h4>
                        {item.context && (
                          <div className="mt-2 space-y-2">
                            <p className="text-gray-800 text-[16px] whitespace-pre-wrap">{item.context.en}</p>
                            <p className="text-gray-600 text-[16px] whitespace-pre-wrap">{item.context.ch}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">No content available for this chapter yet.</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            {prevChapter ? (
              <Link
                to={`/book/${book.slug}/chapter/${prevChapter.slug}`}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                <span>Previous Chapter</span>
              </Link>
            ) : (
              <div />
            )}
            
            {nextChapter && (
              <Link
                to={`/book/${book.slug}/chapter/${nextChapter.slug}`}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <span>Next Chapter</span>
                <ChevronRight className="w-5 h-5 ml-1" />
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-400">
            Advertisement
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;
