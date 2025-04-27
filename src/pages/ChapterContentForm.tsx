import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface ChapterContentFormProps {
  chapterId: string;
  onSave: () => void;
}

const ChapterContentForm: React.FC<ChapterContentFormProps> = ({ chapterId, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    summary_en: '',
    summary_ch: '',
    vocabulary: [] as Array<{
      word: string;
      translation: string;
      context: {
        en: string;
        ch: string;
      };
      examples: Array<{
        en: string;
        ch: string;
      }>;
    }>,
    key_points: [] as Array<{
      en: string;
      ch: string;
      importance: number;
      related_concepts: string[];
    }>,
    status: 'draft' as 'draft' | 'published' | 'archived',
    tags: [] as string[]
  });

  const [questions, setQuestions] = useState<Array<{
    question: string;
    options: string[];
    correct_answer: number;
    explanation: string;
  }>>([]);

  useEffect(() => {
    fetchContent();
  }, [chapterId]);

  async function fetchContent() {
    try {
      const { data: contentData, error: contentError } = await supabase
        .from('chapter_content')
        .select('*')
        .eq('chapter_id', chapterId)
        .maybeSingle();

      if (contentError) throw contentError;
      if (contentData) {
        setFormData(contentData);
      }

      const { data: questionsData, error: questionsError } = await supabase
        .from('chapter_questions')
        .select('*')
        .eq('chapter_id', chapterId);

      if (questionsError) throw questionsError;
      if (questionsData) {
        setQuestions(questionsData.map(q => ({
          question: q.question,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation_en
        })));
      }
    } catch (error) {
      console.error('Error fetching chapter content:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch chapter content');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: contentError } = await supabase
        .from('chapter_content')
        .upsert({
          chapter_id: chapterId,
          ...formData
        });

      if (contentError) throw contentError;

      const { error: questionsError } = await supabase
        .from('chapter_questions')
        .delete()
        .eq('chapter_id', chapterId);

      if (questionsError) throw questionsError;

      if (questions.length > 0) {
        const { error: insertError } = await supabase
          .from('chapter_questions')
          .insert(
            questions.map(q => ({
              chapter_id: chapterId,
              question: q.question,
              options: q.options,
              correct_answer: q.correct_answer,
              explanation_en: q.explanation,
              explanation_ch: ''
            }))
          );

        if (insertError) throw insertError;
      }

      onSave();
    } catch (error) {
      console.error('Error saving chapter content:', error);
      setError(error instanceof Error ? error.message : 'Failed to save chapter content');
    } finally {
      setLoading(false);
    }
  };

  const addVocabularyItem = () => {
    setFormData(prev => ({
      ...prev,
      vocabulary: [
        ...prev.vocabulary,
        {
          word: '',
          translation: '',
          context: { en: '', ch: '' },
          examples: [{ en: '', ch: '' }]
        }
      ]
    }));
  };

  const addKeyPoint = () => {
    setFormData(prev => ({
      ...prev,
      key_points: [
        ...prev.key_points,
        {
          en: '',
          ch: '',
          importance: 3,
          related_concepts: []
        }
      ]
    }));
  };

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        question: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        explanation: ''
      }
    ]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            English Summary
          </label>
          <textarea
            value={formData.summary_en}
            onChange={(e) => setFormData({ ...formData, summary_en: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Chinese Summary
          </label>
          <textarea
            value={formData.summary_ch}
            onChange={(e) => setFormData({ ...formData, summary_ch: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vocabulary
          </label>
          {formData.vocabulary.map((item, index) => (
            <div key={index} className="border rounded-md p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={item.word}
                  onChange={(e) => {
                    const newVocabulary = [...formData.vocabulary];
                    newVocabulary[index].word = e.target.value;
                    setFormData({ ...formData, vocabulary: newVocabulary });
                  }}
                  placeholder="Word"
                  className="rounded-md border-gray-300"
                />
                <input
                  type="text"
                  value={item.translation}
                  onChange={(e) => {
                    const newVocabulary = [...formData.vocabulary];
                    newVocabulary[index].translation = e.target.value;
                    setFormData({ ...formData, vocabulary: newVocabulary });
                  }}
                  placeholder="Translation"
                  className="rounded-md border-gray-300"
                />
              </div>

              <div className="space-y-4 mt-4 border-t pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Context
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={item.context.en}
                      onChange={(e) => {
                        const newVocabulary = [...formData.vocabulary];
                        newVocabulary[index].context.en = e.target.value;
                        setFormData({ ...formData, vocabulary: newVocabulary });
                      }}
                      placeholder="English context"
                      className="w-full rounded-md border-gray-300"
                    />
                    <input
                      type="text"
                      value={item.context.ch}
                      onChange={(e) => {
                        const newVocabulary = [...formData.vocabulary];
                        newVocabulary[index].context.ch = e.target.value;
                        setFormData({ ...formData, vocabulary: newVocabulary });
                      }}
                      placeholder="Chinese context"
                      className="w-full rounded-md border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Examples
                  </label>
                  {item.examples.map((example, exIndex) => (
                    <div key={exIndex} className="space-y-2 mb-4">
                      <input
                        type="text"
                        value={example.en}
                        onChange={(e) => {
                          const newVocabulary = [...formData.vocabulary];
                          newVocabulary[index].examples[exIndex].en = e.target.value;
                          setFormData({ ...formData, vocabulary: newVocabulary });
                        }}
                        placeholder="English example sentence"
                        className="w-full rounded-md border-gray-300"
                      />
                      <input
                        type="text"
                        value={example.ch}
                        onChange={(e) => {
                          const newVocabulary = [...formData.vocabulary];
                          newVocabulary[index].examples[exIndex].ch = e.target.value;
                          setFormData({ ...formData, vocabulary: newVocabulary });
                        }}
                        placeholder="Chinese translation"
                        className="w-full rounded-md border-gray-300"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newVocabulary = [...formData.vocabulary];
                      newVocabulary[index].examples.push({ en: '', ch: '' });
                      setFormData({ ...formData, vocabulary: newVocabulary });
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    + Add Example
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addVocabularyItem}
            className="mt-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            Add Vocabulary Item
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Key Points
          </label>
          {formData.key_points.map((point, index) => (
            <div key={index} className="border rounded-md p-4 mb-4">
              <div className="space-y-4">
                <input
                  type="text"
                  value={point.en}
                  onChange={(e) => {
                    const newKeyPoints = [...formData.key_points];
                    newKeyPoints[index].en = e.target.value;
                    setFormData({ ...formData, key_points: newKeyPoints });
                  }}
                  placeholder="English"
                  className="w-full rounded-md border-gray-300"
                />
                <input
                  type="text"
                  value={point.ch}
                  onChange={(e) => {
                    const newKeyPoints = [...formData.key_points];
                    newKeyPoints[index].ch = e.target.value;
                    setFormData({ ...formData, key_points: newKeyPoints });
                  }}
                  placeholder="Chinese"
                  className="w-full rounded-md border-gray-300"
                />
                <div className="flex items-center space-x-4">
                  <label className="text-sm text-gray-600">Importance:</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={point.importance}
                    onChange={(e) => {
                      const newKeyPoints = [...formData.key_points];
                      newKeyPoints[index].importance = parseInt(e.target.value);
                      setFormData({ ...formData, key_points: newKeyPoints });
                    }}
                    className="w-32"
                  />
                  <span className="text-sm text-gray-600">{point.importance}</span>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addKeyPoint}
            className="mt-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            Add Key Point
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Questions
          </label>
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="border rounded-md p-4 mb-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-sm font-medium text-gray-700">Question {qIndex + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                  placeholder="Question text"
                  className="w-full rounded-md border-gray-300"
                />

                <div className="space-y-2">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={question.correct_answer === oIndex}
                        onChange={() => updateQuestion(qIndex, 'correct_answer', oIndex)}
                        className="rounded-full border-gray-300"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...question.options];
                          newOptions[oIndex] = e.target.value;
                          updateQuestion(qIndex, 'options', newOptions);
                        }}
                        placeholder={`Option ${oIndex + 1}`}
                        className="flex-1 rounded-md border-gray-300"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <textarea
                    value={question.explanation}
                    onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                    placeholder="Explanation"
                    rows={3}
                    className="w-full rounded-md border-gray-300"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addQuestion}
            className="mt-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            <Plus className="w-4 h-4 inline mr-1" />
            Add Question
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'archived' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags.join(', ')}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="grammar, vocabulary, business"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Save Content'
          )}
        </button>
      </div>
    </form>
  );
};

export default ChapterContentForm;