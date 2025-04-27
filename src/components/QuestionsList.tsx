import React from 'react';
import { useSummary } from '../context/SummaryContext';
import { HelpCircle } from 'lucide-react';

const QuestionsList: React.FC = () => {
  const { currentSummary } = useSummary();

  if (!currentSummary) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-serif font-semibold mb-4 text-gray-800 border-b pb-2">Discussion Questions</h3>
      
      <ul className="space-y-4">
        {currentSummary.questions.map((question, index) => (
          <li 
            key={`question-${index}`}
            className="flex items-start group"
          >
            <HelpCircle className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5 group-hover:text-indigo-800 transition-colors duration-200" />
            <p className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{question}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionsList;