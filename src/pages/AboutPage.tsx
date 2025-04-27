import React, { useState } from 'react';
import { BookOpen, GraduationCap, BookMarked, Send } from 'lucide-react';

const AboutPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { email, message });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 px-6 text-gray-800 text-lg leading-relaxed">
      {/* Hero Section with Image */}
      <div className="relative h-80 rounded-xl overflow-hidden mb-12">
        <img
          src="https://images.pexels.com/photos/5834/nature-grass-leaf-green.jpg"
          alt="Reading Journey"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="p-8 text-white max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Good EN Books</h1>
            <p className="text-xl">
              讓閱讀成為你的英文進步之路
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Journey Section */}
          <div className="space-y-4">
            <p>
              曾經面對各種英文檢定時，我也走過那條「死背單字卡、狂做考古題」的路。花了大量時間與金錢後，回過頭來卻發現自己吸收不多，考試成績也只能說差強人意。
            </p>
          </div>

          {/* Turning Point */}
          <div className="space-y-4">
            <p>
              直到某天，一位朋友分享了他的閱讀習慣，徹底改變了我的學習方式。
              他說與其硬背，不如先找那些與生活和職場有關、自己真正感興趣的英文書。
              再從這些書的英文摘要開始閱讀——先理解整體概念，再進入完整原文。
              這樣不僅更容易吸收，也能減少半途而廢的挫折感。
              就算遇到不懂的單字，也能透過上下文大致猜出意思，這在檢定考中非常實用。
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 text-center">
            <div className="space-y-3">
              <div className="flex justify-center">
                <BookOpen className="w-10 h-10 text-[#FF9000]" />
              </div>
              <h3 className="font-semibold text-gray-900">有效閱讀</h3>
              <p className="text-gray-600 text-base">
                從摘要開始，循序漸進地理解全文
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-center">
                <GraduationCap className="w-10 h-10 text-[#FF9000]" />
              </div>
              <h3 className="font-semibold text-gray-900">考試準備</h3>
              <p className="text-gray-600 text-base">
                提升閱讀速度和理解能力
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-center">
                <BookMarked className="w-10 h-10 text-[#FF9000]" />
              </div>
              <h3 className="font-semibold text-gray-900">知識成長</h3>
              <p className="text-gray-600 text-base">
                獲得實用知識，促進個人發展
              </p>
            </div>
          </div>

          {/* Personal Experience */}
          <div className="space-y-4">
            <p>
              我將這種方法運用在考試準備上後，發現自己不再那麼緊張，閱讀速度也明顯提升。
              更重要的是，這樣的閱讀不只是為了分數，它還帶動了我在工作和人生上的許多突破。
            </p>
          </div>

          {/* Mission Statement */}
          <div className="space-y-4">
            <p>
              於是我開始整理這些實用的好書，把它們濃縮成摘要，
              搭配書中常見但不一定認識的進階單字，
              幫助更多人先掌握全貌，再深入原文，
              從閱讀中真正得到成長與提升。
            </p>
          </div>

          {/* Closing Statement */}
          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <p className="text-center">
              希望這個方法也能讓你的英文能力突飛猛進，
              並在思考與生活中，都看見轉變的力量。
            </p>
          </div>
        </div>
      </div>

      {/* Ad Space */}
      <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-400 text-base">
        Advertisement
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Say Hi</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FF9000] focus:border-[#FF9000]"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FF9000] focus:border-[#FF9000]"
              placeholder="Your message..."
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 bg-[#FF9000] text-white rounded-lg hover:bg-[#FF7A00] transition-colors duration-200"
          >
            <Send className="w-5 h-5 mr-2" />
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default AboutPage;