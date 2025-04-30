import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Chapter } from '../types';

interface ChapterListProps {
  chapters: Chapter[];
}

export const ChapterList: React.FC<ChapterListProps> = ({ chapters }) => {
  const { categorySlug, bookSlug } = useParams<{ categorySlug: string; bookSlug: string }>();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-4 bg-white rounded-lg shadow-md p-6">
      <div
        className="md:hidden flex items-center gap-2 py-2 cursor-pointer font-medium text-gray-800"
        onClick={toggleExpand}
      >
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-amber-600" />
        ) : (
          <ChevronRight className="h-5 w-5 text-amber-600" />
        )}
        <span>章節摘要</span>
      </div>

      <div
        className={`space-y-4 ${isExpanded ? 'block' : 'hidden'} md:block transition-all duration-300 ease-in-out`}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Chapters</h2>
        {chapters.map((chapter) => (
          <Link
            key={chapter.id}
            to={`/category/${categorySlug}/book/${bookSlug}/chapter/${chapter.slug}`}
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