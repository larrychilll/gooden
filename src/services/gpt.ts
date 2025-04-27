import { BookEntry } from '../types';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface GeneratedContent {
  summaryEn: string;
  summaryCh: string;
  vocabulary: Array<{
    word: string;
    translation: string;
    sentenceEn: string;
    sentenceCh: string;
  }>;
  keyPoints: Array<{
    english: string;
    chinese: string;
  }>;
  quiz: Array<{
    question: string;
    options: Array<{
      text: string;
      isCorrect: boolean;
    }>;
    explanation: {
      english: string;
      chinese: string;
    };
  }>;
}

export async function generateBookContent(entry: BookEntry): Promise<GeneratedContent> {
  const prompt = `You are an expert bilingual educational content writer.

The book title is: "${entry.bookTitle}"
The author is: ${entry.author || 'Unknown'}
The chapter title is: "${entry.chapterName}"

Please generate the following:

1. An **English summary** of the chapter (4–6 sentences). Use **advanced vocabulary** (CEFR C1–C2 level) and professional tone suitable for adult learners.
2. A **Chinese translation** of the summary, using **traditional Chinese** for Taiwanese readers.
3. Always keep Author's name in English even in the Chinese translation. 
4. Always keep the book name and chapter name in English even in the Chinese translation.
5. Extract **5-8 advanced vocabulary words** from the English summary, **in the order they appear**. For each, provide:
   - "word" (the English vocabulary)
   - "zh" (Chinese translation in parentheses)
   - "en_sent" (one English sentence using the word)
   - "zh_sent" (the Chinese translation of that sentence)
   Format them in **JSON array**.
6. Write **3-5 Key Points**, each presented in **English first**, followed by its **traditional Chinese translation**. Format: English. 中文。
7. Write **3-5 comprehension questions**, each with:
   - One English multiple-choice question based on the summary
   - Four options (A, B, C, D)
   - Indicate the correct answer
   - Bilingual explanation (English + 中文解析)`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: "You are an expert bilingual educational content writer specializing in creating high-quality book summaries in English and Traditional Chinese."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 3000
  });

  const raw = completion.choices[0]?.message?.content || '';
  const sections = raw.split('\n\n');
  const parsedResponse: any = {};

  for (const section of sections) {
    if (section.startsWith('EN Summary:')) {
      parsedResponse.summaryEn = section.replace('EN Summary:', '').trim();
    } else if (section.startsWith('ZH Summary:')) {
      parsedResponse.summaryCh = section.replace('ZH Summary:', '').trim();
    } else if (section.startsWith('Vocabulary JSON:')) {
      try {
        const jsonStr = section.replace('Vocabulary JSON:', '').trim();
        parsedResponse.vocabulary = JSON.parse(jsonStr).map((item: any) => ({
          word: item.word,
          translation: item.zh,
          sentenceEn: item.en_sent,
          sentenceCh: item.zh_sent
        }));
      } catch (e) {
        console.error('Error parsing vocabulary JSON:', e);
        parsedResponse.vocabulary = [];
      }
    } else if (section.startsWith('Key Points:')) {
      const points = section.replace('Key Points:', '').trim().split('\n');
      parsedResponse.keyPoints = points.map((point: string) => {
        const [english, chinese] = point.split('。');
        return {
          english: english.replace(/^\d+\.\s*/, '').trim(),
          chinese: (chinese || '').trim()
        };
      }).filter((p: any) => p.english && p.chinese);
    } else if (section.match(/^Exam Q\d+:/)) {
      if (!parsedResponse.quiz) parsedResponse.quiz = [];

      const lines = section.split('\n');
      const question = lines.find((l: string) => l.startsWith('Q:'))?.replace('Q:', '').trim();
      const options = lines.filter((l: string) => /^[A-D]\./.test(l))
        .map((l: string) => l.replace(/^[A-D]\./, '').trim());
      const answer = lines.find((l: string) => l.startsWith('Answer:'))?.replace('Answer:', '').trim();
      const explanation = lines.find((l: string) => l.startsWith('Explanation:'))?.replace('Explanation:', '').trim();

      if (question && options.length === 4) {
        parsedResponse.quiz.push({
          question,
          options: options.map((text: string, i: number) => ({
            text,
            isCorrect: answer === String.fromCharCode(65 + i)
          })),
          explanation: {
            english: explanation?.split('中文解析：')[0].trim() || '',
            chinese: explanation?.split('中文解析：')[1].trim() || ''
          }
        });
      }
    }
  }

  const content: GeneratedContent = {
    summaryEn: parsedResponse.summaryEn || '',
    summaryCh: parsedResponse.summaryCh || '',
    vocabulary: parsedResponse.vocabulary || [],
    keyPoints: parsedResponse.keyPoints || [],
    quiz: parsedResponse.quiz || []
  };

  return content;
}

export function generateMarkdownContent(content: GeneratedContent, entry: BookEntry): string {
  const markdown = [
    `# ${entry.bookTitle} - ${entry.chapterName}`,
    '\n## English Summary\n',
    content.summaryEn,
    '\n## Chinese Summary\n',
    content.summaryCh,
    '\n## Vocabulary\n',
    content.vocabulary.map(v => (
      `### ${v.word} (${v.translation})\n` +
      `- English: ${v.sentenceEn}\n` +
      `- Chinese: ${v.sentenceCh}`
    )).join('\n\n'),
    '\n## Key Points\n',
    content.keyPoints.map((kp, i) => (
      `${i + 1}. ${kp.english}\n   ${kp.chinese}`
    )).join('\n\n'),
    '\n## Quiz\n',
    content.quiz.map((q, i) => (
      `### Question ${i + 1}\n\n` +
      `${q.question}\n\n` +
      q.options.map((opt, j) => (
        `${String.fromCharCode(65 + j)}. ${opt.text}${opt.isCorrect ? ' ✓' : ''}`
      )).join('\n') +
      '\n\n**Explanation**\n' +
      `- English: ${q.explanation.english}\n` +
      `- Chinese: ${q.explanation.chinese}`
    )).join('\n\n')
  ].join('\n');

  return markdown;
}