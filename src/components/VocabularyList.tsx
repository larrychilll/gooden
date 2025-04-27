import React, { useState } from 'react';
import { useSummary } from '../context/SummaryContext';

const VocabularyList: React.FC = () => {
  const { currentSummary } = useSummary();
  const [expandedTerms, setExpandedTerms] = useState<Record<string, boolean>>({});

  if (!currentSummary) return null;

  const toggleTerm = (term: string) => {
    setExpandedTerms(prev => ({
      ...prev,
      [term]: !prev[term]
    }));
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-serif font-semibold mb-4 text-gray-800 border-b pb-2">Advanced Vocabulary</h3>
      
      <ul className="divide-y divide-gray-200">
        {currentSummary.advancedVocabulary.map((item, index) => (
          <li 
            key={`vocab-${index}`} 
            className="py-3 transition-all duration-200 hover:bg-gray-50 cursor-pointer"
            onClick={() => toggleTerm(item.term)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-indigo-700">{item.term}</span>
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-700">
                  {item.language}
                </span>
              </div>
              <span className="text-gray-400 text-sm">
                {expandedTerms[item.term] ? '−' : '+'}
              </span>
            </div>
            
            {expandedTerms[item.term] && (
              <div className="mt-2 text-gray-600 text-sm pl-2 border-l-2 border-indigo-200">
                {item.definition}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VocabularyList;