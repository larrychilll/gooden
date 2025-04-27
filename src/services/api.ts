// This is a mock implementation of the GPT API service
// In a production environment, this would be replaced with actual API calls

import { Summary, SummaryFormData } from '../types';

const MOCK_DELAY = 2000; // Simulate API delay

export const generateSummary = async (formData: SummaryFormData): Promise<Summary> => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

  // Mock response
  return {
    bookTitle: formData.bookTitle,
    chapterName: formData.chapterName,
    language1: formData.language1,
    language2: formData.language2,
    summaryText1: generateMockSummary(formData.bookTitle, formData.chapterName, formData.language1),
    summaryText2: generateMockSummary(formData.bookTitle, formData.chapterName, formData.language2),
    keyPoints: generateMockKeyPoints(),
    advancedVocabulary: generateMockVocabulary(formData.language1, formData.language2),
    questions: generateMockQuestions(),
    dateGenerated: new Date().toISOString(),
  };
};

// Helper functions to generate mock data
const generateMockSummary = (bookTitle: string, chapterName: string, language: string): string => {
  if (language === 'English') {
    return `This chapter of "${bookTitle}" titled "${chapterName}" explores themes of identity and belonging. The protagonist faces a significant moral dilemma that forces them to reconsider their values and beliefs. Through a series of events, they discover the importance of empathy and understanding different perspectives. The author uses vivid imagery and metaphors to convey the emotional journey of the characters, creating a deeply moving narrative that resonates with readers long after they've finished the chapter.`;
  } else if (language === 'Spanish') {
    return `Este capítulo de "${bookTitle}" titulado "${chapterName}" explora temas de identidad y pertenencia. El protagonista se enfrenta a un importante dilema moral que le obliga a reconsiderar sus valores y creencias. A través de una serie de eventos, descubre la importancia de la empatía y la comprensión de diferentes perspectivas. El autor utiliza imágenes vívidas y metáforas para transmitir el viaje emocional de los personajes, creando una narrativa profundamente conmovedora que resuena con los lectores mucho después de haber terminado el capítulo.`;
  } else {
    return `Summary in ${language} for "${bookTitle}" - "${chapterName}"`;
  }
};

const generateMockKeyPoints = (): string[] => {
  return [
    "The protagonist undergoes a significant transformation in their worldview",
    "Symbolism of water appears throughout the chapter, representing rebirth",
    "Secondary characters serve as foils to highlight the protagonist's journey",
    "Flashback sequences provide essential context for current events",
    "The chapter ends with an unresolved conflict that sets up the next section"
  ];
};

const generateMockVocabulary = (language1: string, language2: string): { term: string; definition: string; language: string }[] => {
  return [
    {
      term: "Ephemeral",
      definition: "Lasting for a very short time; temporary or transient",
      language: language1
    },
    {
      term: "Taciturn",
      definition: "Reserved or uncommunicative in speech; saying little",
      language: language1
    },
    {
      term: "Perspicacious",
      definition: "Having a ready insight into and understanding of things",
      language: language1
    },
    {
      term: "Efímero",
      definition: "Que dura por un período muy corto; temporal o transitorio",
      language: language2
    },
    {
      term: "Taciturno",
      definition: "Reservado o poco comunicativo en el habla; que dice poco",
      language: language2
    },
    {
      term: "Perspicaz",
      definition: "Que tiene una rápida percepción y comprensión de las cosas",
      language: language2
    }
  ];
};

const generateMockQuestions = (): string[] => {
  return [
    "How does the protagonist's decision reflect broader themes of moral ambiguity in the novel?",
    "What role does the setting play in creating atmosphere and influencing character decisions?",
    "How do the secondary characters serve as catalysts for the protagonist's development?",
    "What literary devices does the author employ to foreshadow upcoming events?",
    "How might the chapter be interpreted differently from various cultural perspectives?"
  ];
};