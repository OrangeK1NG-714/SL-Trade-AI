'use client';

import { useState } from 'react';

interface AnalysisResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  intentScore: number;
  keywords: string[];
  strategy: string;
  draftReply: string;
}

const mockAnalysisResults: Record<string, AnalysisResult> = {
  positive: {
    sentiment: 'positive',
    intentScore: 8,
    keywords: ['interested', 'competitive price', 'ready to order', 'payment terms', 'delivery schedule'],
    strategy: '客户表现出明确的购买意向，建议立即发送正式报价单（PI），并主动提供灵活的付款方式。可以适当给予首单优惠以促成交易。同时准备好产品证书（COA, SGS）以增强信任度。建议 24 小时内跟进。',
    draftReply: `Dear Customer,

Thank you for your positive response! I'm glad to hear that our pricing meets your expectations.

As discussed, I've prepared a formal Proforma Invoice for your review:

- Product: PP T30S
- Quantity: 50 MT
- Price: USD $1,130/MT CIF Lagos (special first-order discount)
- Payment: 30% T/T advance, 70% against B/L copy
- Delivery: 25 days from payment confirmation

I've also attached our SGS inspection certificate and COA for your quality assurance team.

Shall we proceed with the order? I'm available on WhatsApp for any quick questions.

Best regards,
Alex Chen
SL Trade International`,
  },
  neutral: {
    sentiment: 'neutral',
    intentScore: 5,
    keywords: ['comparing prices', 'need more information', 'specifications', 'samples'],
    strategy: '客户处于比价阶段，尚未做出最终决定。建议提供更详细的产品技术资料和竞争优势说明。可以主动提出寄送样品，并分享其他非洲客户的成功案例来增强说服力。保持 3-5 天的跟进频率。',
    draftReply: `Dear Customer,

Thank you for your inquiry. I understand you're evaluating options, and I'd like to help you make an informed decision.

Here's what sets SL Trade apart:
1. Direct factory supply - no middleman markup
2. Consistent quality with batch-to-batch certificates
3. Dedicated Africa logistics team
4. 24/7 WhatsApp support

I'd be happy to send you free samples for testing. We also have many satisfied customers in your region who can provide references.

Would you like me to arrange a sample shipment?

Best regards,
Alex Chen`,
  },
  negative: {
    sentiment: 'negative',
    intentScore: 2,
    keywords: ['too expensive', 'found cheaper', 'not interested', 'budget constraints'],
    strategy: '客户对价格不满意或已找到更便宜的供应商。建议了解竞争对手的具体报价，分析价格差异原因。可以强调质量保证和售后服务的价值。如果价格确实偏高，考虑调整产品规格或提供替代方案（如不同等级的产品）。避免直接降价，而是增加附加值。',
    draftReply: `Dear Customer,

Thank you for your honest feedback. I appreciate you sharing your concerns about pricing.

I'd like to understand your requirements better. Could you share:
1. Your target price range?
2. The specific grade and quantity you need?
3. Your preferred delivery schedule?

We have several product options that might fit different budget levels. For example, our PP V30G offers similar performance at a more competitive price point.

We're committed to finding a solution that works for both sides. Quality and reliability are our top priorities, and many of our long-term customers started with a trial order.

Would you be open to discussing alternative options?

Best regards,
Alex Chen`,
  },
};

const pendingFollowUps = [
  { id: '1', customer: 'Adebayo Okonkwo', company: 'Adebayo Plastics Ltd', lastContact: '2024-01-15', dueDate: '2024-01-18', priority: 'high', product: 'PP T30S' },
  { id: '2', customer: 'Kofi Mensah', company: 'Kofi Industries Ghana', lastContact: '2024-01-14', dueDate: '2024-01-17', priority: 'medium', product: 'HDPE 5000S' },
  { id: '3', customer: 'Grace Achieng', company: 'Achieng Polymers Ltd', lastContact: '2024-01-14', dueDate: '2024-01-19', priority: 'medium', product: 'GPPS 525' },
  { id: '4', customer: 'Moussa Keita', company: 'Keita Import Export', lastContact: '2024-01-09', dueDate: '2024-01-16', priority: 'high', product: 'LDPE 2426H' },
  { id: '5', customer: 'Chidi Nwosu', company: 'Nwosu Chemicals', lastContact: '2024-01-15', dueDate: '2024-01-17', priority: 'high', product: 'PVC SG-5' },
  { id: '6', customer: 'Samuel Owusu', company: 'Owusu Manufacturing', lastContact: '2024-01-10', dueDate: '2024-01-20', priority: 'low', product: 'ABS 750A' },
];

const sentimentConfig = {
  positive: { label: '积极', color: 'text-green-600', bg: 'bg-green-100', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm-4.34 7.244a.75.75 0 01-1.061-1.06 5.236 5.236 0 013.73-1.544 5.236 5.236 0 013.695 1.538.75.75 0 11-1.061 1.06 3.736 3.736 0 00-2.639-1.098 3.736 3.736 0 00-2.664 1.104z" clipRule="evenodd" />
    </svg>
  )},
  neutral: { label: '中性', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zM9 15.75a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9z" clipRule="evenodd" />
    </svg>
  )},
  negative: { label: '消极', color: 'text-red-600', bg: 'bg-red-100', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 8.743a.75.75 0 00-1.06-1.06 3.736 3.736 0 01-2.652 1.098 3.736 3.736 0 01-2.652-1.098.75.75 0 00-1.06 1.06A5.236 5.236 0 0012 18.75a5.236 5.236 0 003.712-1.538z" clipRule="evenodd" />
    </svg>
  )},
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  high: { label: '紧急', className: 'bg-red-100 text-red-700' },
  medium: { label: '中等', className: 'bg-yellow-100 text-yellow-700' },
  low: { label: '一般', className: 'bg-green-100 text-green-700' },
};

export default function FollowUpPage() {
  const [emailContent, setEmailContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);

  const analyzeEmail = () => {
    if (!emailContent.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      const lowerContent = emailContent.toLowerCase();
      let sentiment: 'positive' | 'neutral' | 'negative';

      if (lowerContent.includes('interested') || lowerContent.includes('order') || lowerContent.includes('agree') || lowerContent.includes('ready') || lowerContent.includes('accept')) {
        sentiment = 'positive';
      } else if (lowerContent.includes('expensive') || lowerContent.includes('cheap') || lowerContent.includes('not interested') || lowerContent.includes('decline') || lowerContent.includes('cancel')) {
        sentiment = 'negative';
      } else {
        sentiment = 'neutral';
      }

      setAnalysisResult(mockAnalysisResults[sentiment]);
      setIsAnalyzing(false);
    }, 1000);
  };

  const copyDraft = () => {
    if (analysisResult) {
      navigator.clipboard.writeText(analysisResult.draftReply);
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI 跟进助手</h1>
        <p className="text-gray-500 mt-1">分析客户回复邮件，智能生成跟进策略</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">粘贴客户回复邮件</h2>
        <textarea
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          rows={6}
          placeholder="将客户的回复邮件内容粘贴到这里..."
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent resize-none"
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={analyzeEmail}
            disabled={isAnalyzing || !emailContent.trim()}
            className="px-5 py-2.5 bg-accent hover:bg-accent-dark disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                分析中...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                AI 分析
              </>
            )}
          </button>
          <span className="text-xs text-gray-400">提示：粘贴英文邮件可获得更准确的情绪分析</span>
        </div>
      </div>

      {isAnalyzing && (
        <div className="bg-white rounded-xl border border-gray-100 p-10 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin w-10 h-10 text-accent mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-gray-500">AI 正在分析客户情绪和意向...</p>
          </div>
        </div>
      )}

      {analysisResult && !isAnalyzing && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-sm text-gray-500 mb-3">情绪判断</p>
              <div className="flex items-center gap-3">
                <div className={`${sentimentConfig[analysisResult.sentiment].bg} p-2 rounded-xl ${sentimentConfig[analysisResult.sentiment].color}`}>
                  {sentimentConfig[analysisResult.sentiment].icon}
                </div>
                <span className={`text-xl font-bold ${sentimentConfig[analysisResult.sentiment].color}`}>
                  {sentimentConfig[analysisResult.sentiment].label}
                </span>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-sm text-gray-500 mb-3">意向度评分</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">{analysisResult.intentScore}</span>
                <span className="text-gray-400">/10</span>
              </div>
              <div className="mt-2 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    analysisResult.intentScore >= 7 ? 'bg-green-500' :
                    analysisResult.intentScore >= 4 ? 'bg-yellow-500' : 'bg-red-400'
                  }`}
                  style={{ width: `${analysisResult.intentScore * 10}%` }}
                />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-sm text-gray-500 mb-3">关键信息</p>
              <div className="flex flex-wrap gap-2">
                {analysisResult.keywords.map((kw) => (
                  <span key={kw} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">AI 跟进策略建议</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{analysisResult.strategy}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">AI 回复邮件草稿</h3>
              <button
                onClick={copyDraft}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-light hover:bg-blue-50 rounded-lg transition-colors"
              >
                {copiedDraft ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-600">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    已复制
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                    复制草稿
                  </>
                )}
              </button>
            </div>
            <div className="text-sm text-gray-700 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {analysisResult.draftReply}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">待跟进客户</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">客户</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">产品</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">上次联系</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">到期日</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">优先级</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pendingFollowUps.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium text-sm text-gray-900">{item.customer}</div>
                    <div className="text-xs text-gray-500">{item.company}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{item.product}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{item.lastContact}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{item.dueDate}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${priorityConfig[item.priority].className}`}>
                      {priorityConfig[item.priority].label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-xs font-medium text-white bg-accent hover:bg-accent-dark rounded-lg transition-colors">
                        发邮件
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        标记完成
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
