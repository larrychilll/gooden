import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ChapterType } from '../types';

interface ChapterListProps {
  chapters: ChapterType[];
}

export const ChapterList: React.FC<ChapterListProps> = ({ chapters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    console.log("✅ ChapterList mounted — screen width:", window.innerWidth);
  }, []);

  const toggleExpand = () => {
    console.log("🔁 Toggle clicked");
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="border border-green-300 p-4">
      <div
        className="md:hidden flex items-center gap-2 py-2 cursor-pointer font-medium bg-yellow-100 border border-red-500"
        onClick={toggleExpand}
      >
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-amber-600" />
        ) : (
          <ChevronRight className="h-5 w-5 text-amber-600" />
        )}
        <span>Chapter List (Toggle)</span>
      </div>

      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3 ${
          isExpanded ? 'block' : 'hidden md:grid'
        } transition-all duration-300`}
      >
        {chapters.map((chapter) => (
          <div key={chapter.id} className="border-b border-gray-200 pb-3">
            <div className="font-medium">
              {chapter.number}. {chapter.title}
            </div>
            {chapter.translatedTitle && (
              <div className="text-gray-600 text-sm">{chapter.translatedTitle}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
