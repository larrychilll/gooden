import React from 'react';
import { BookOpen, Calendar } from 'lucide-react';
import { useSummary } from '../context/SummaryContext';

const SummaryHistory: React.FC = () => {
  const { summaries, viewSummary, currentSummary } = useSummary();

  if (summaries.length === 0) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-serif font-semibold mb-4 text-gray-800 border-b pb-2">History</h3>
      
      <ul className="divide-y divide-gray-200">
        {summaries.map((summary, index) => (
          <li 
            key={`history-${index}`}
            className={`py-3 hover:bg-gray-50 transition-all duration-200 cursor-pointer ${
              currentSummary === summary ? 'bg-blue-50 border-l-4 border-blue-500 pl-2' : ''
            }`}
            onClick={() => viewSummary(index)}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-start space-x-2">
                <BookOpen className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">{summary.bookTitle}</h4>
                  <p className="text-sm text-gray-600">{summary.chapterName}</p>
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500 mt-1 sm:mt-0">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(summary.dateGenerated)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SummaryHistory;