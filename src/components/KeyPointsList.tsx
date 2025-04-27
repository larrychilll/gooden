import React from 'react';
import { useSummary } from '../context/SummaryContext';

const KeyPointsList: React.FC = () => {
  const { currentSummary } = useSummary();

  if (!currentSummary) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-serif font-semibold mb-4 text-gray-800 border-b pb-2">Key Points</h3>
      
      <ul className="space-y-2">
        {currentSummary.keyPoints.map((point, index) => (
          <li 
            key={`point-${index}`}
            className="flex items-start"
          >
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mr-3 flex-shrink-0">
              {index + 1}
            </span>
            <p className="text-gray-700">{point}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeyPointsList;