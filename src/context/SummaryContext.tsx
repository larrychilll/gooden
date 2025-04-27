import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Summary, SummaryFormData } from '../types';
import { generateSummary } from '../services/api';

interface SummaryContextType {
  summaries: Summary[];
  currentSummary: Summary | null;
  isLoading: boolean;
  error: string | null;
  generateNewSummary: (formData: SummaryFormData) => Promise<void>;
  viewSummary: (index: number) => void;
}

const SummaryContext = createContext<SummaryContextType | undefined>(undefined);

export const useSummary = () => {
  const context = useContext(SummaryContext);
  if (!context) {
    throw new Error('useSummary must be used within a SummaryProvider');
  }
  return context;
};

interface SummaryProviderProps {
  children: ReactNode;
}

export const SummaryProvider: React.FC<SummaryProviderProps> = ({ children }) => {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [currentSummary, setCurrentSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateNewSummary = async (formData: SummaryFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newSummary = await generateSummary(formData);
      
      setSummaries(prev => [newSummary, ...prev]);
      setCurrentSummary(newSummary);
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
      console.error('Error generating summary:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const viewSummary = (index: number) => {
    if (index >= 0 && index < summaries.length) {
      setCurrentSummary(summaries[index]);
    }
  };

  const value = {
    summaries,
    currentSummary,
    isLoading,
    error,
    generateNewSummary,
    viewSummary
  };

  return (
    <SummaryContext.Provider value={value}>
      {children}
    </SummaryContext.Provider>
  );
};