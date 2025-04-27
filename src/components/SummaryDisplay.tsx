import React, { useState } from 'react';
import { useSummary } from '../context/SummaryContext';
import { Clipboard, CheckCircle2 } from 'lucide-react';

interface SummaryDisplayProps {
  language: string;
  text: string;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ language, text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6 relative group">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-serif font-semibold text-gray-800 border-b pb-2">
          {language} Summary
        </h3>
        <button 
          onClick={handleCopy}
          className="text-gray-400 hover:text-indigo-600 transition-colors duration-200 p-1"
          aria-label={`Copy ${language} summary`}
        >
          {copied ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Clipboard className="h-5 w-5" />
          )}
        </button>
      </div>
      
      <div className="prose max-w-none text-gray-700">
        <p>{text}</p>
      </div>
    </div>
  );
};

const SummaryTabs: React.FC = () => {
  const { currentSummary } = useSummary();
  const [activeTab, setActiveTab] = useState('language1');

  if (!currentSummary) return null;

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'language1'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('language1')}
        >
          {currentSummary.language1}
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'language2'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('language2')}
        >
          {currentSummary.language2}
        </button>
      </div>

      <div className={`transition-opacity duration-300 ${activeTab === 'language1' ? 'block' : 'hidden'}`}>
        <SummaryDisplay 
          language={currentSummary.language1} 
          text={currentSummary.summaryText1}
        />
      </div>
      <div className={`transition-opacity duration-300 ${activeTab === 'language2' ? 'block' : 'hidden'}`}>
        <SummaryDisplay 
          language={currentSummary.language2} 
          text={currentSummary.summaryText2}
        />
      </div>
    </div>
  );
};

export default SummaryTabs;