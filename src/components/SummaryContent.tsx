import React from 'react';
import { useSummary } from '../context/SummaryContext';
import SummaryTabs from './SummaryDisplay';
import KeyPointsList from './KeyPointsList';
import VocabularyList from './VocabularyList';
import QuestionsList from './QuestionsList';

const SummaryContent: React.FC = () => {
  const { currentSummary, isLoading } = useSummary();

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentSummary) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-8 text-center">
        <h3 className="text-xl font-medium text-gray-700 mb-2">No Summary Generated Yet</h3>
        <p className="text-gray-500">
          Enter a book title and chapter name to generate a bilingual summary.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-serif font-semibold mb-2 text-gray-800">
          {currentSummary.bookTitle}
        </h2>
        <h3 className="text-lg text-gray-600 mb-2">
          {currentSummary.chapterName}
        </h3>
      </div>
      
      <SummaryTabs />
      <KeyPointsList />
      <VocabularyList />
      <QuestionsList />
    </div>
  );
};

export default SummaryContent;