interface CompletionResponse {
  text: string;
}

interface CompletionOptions {
  temperature?: number;
  max_tokens?: number;
}

const mockGpt = {
  async complete(prompt: string, options: CompletionOptions): Promise<CompletionResponse> {
    console.log('Mock GPT called with:', { prompt, options });
    
    // Return mock data for testing
    return {
      text: `EN Summary:
In this groundbreaking chapter, the author elucidates the intricate relationship between cognitive development and environmental factors. The discourse encompasses a comprehensive analysis of neuroplasticity and its implications for learning methodologies. Through empirical evidence and case studies, the text demonstrates how adaptive learning strategies can significantly enhance knowledge retention and comprehension. The author's innovative approach challenges conventional pedagogical frameworks while proposing alternative methods for educational advancement.

ZH Summary:
在這具有開創性的章節中，作者闡明了認知發展與環境因素之間的複雜關係。內容涵蓋了對神經可塑性及其對學習方法影響的全面分析。通過實證研究和案例分析，本文展示了適應性學習策略如何能顯著提升知識保留和理解能力。作者的創新方法挑戰了傳統的教學框架，同時提出了教育進步的替代方法。

Vocabulary JSON:
[
  {
    "word": "elucidate",
    "zh": "闡明",
    "en_sent": "The professor sought to elucidate the complex theories for his students.",
    "zh_sent": "教授試圖為學生闡明這些複雜的理論。"
  },
  {
    "word": "neuroplasticity",
    "zh": "神經可塑性",
    "en_sent": "Recent studies on neuroplasticity have revolutionized our understanding of brain development.",
    "zh_sent": "最近關於神經可塑性的研究徹底改變了我們對大腦發展的理解。"
  }
]

Key Points:
1. Environmental factors play a crucial role in cognitive development. 環境因素在認知發展中起著關鍵作用。
2. Neuroplasticity enables continuous learning throughout life. 神經可塑性使終身學習成為可能。
3. Adaptive learning strategies enhance knowledge retention. 適應性學習策略增強知識保留。

Exam Q1:
Q: What is the primary focus of the chapter's discussion?
A. The role of genetics in learning
B. The relationship between environment and cognition
C. Teaching methodologies in primary education
D. Historical development of educational theories
Answer: B
Explanation: The chapter primarily focuses on examining the intricate relationship between cognitive development and environmental factors, emphasizing how these elements interact in the learning process. 中文解析：本章主要探討認知發展與環境因素之間的複雜關係，強調這些要素在學習過程中如何相互作用。`
    };
  }
};

export default mockGpt;