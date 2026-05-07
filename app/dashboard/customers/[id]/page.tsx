'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface CommunicationRecord {
  id: string;
  type: 'email' | 'whatsapp' | 'call' | 'meeting' | 'note';
  content: string;
  date: string;
  direction: 'inbound' | 'outbound';
}

const customerData: Record<string, {
  id: string;
  name: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  whatsapp: string;
  source: string;
  status: string;
  intentScore: number;
  notes: string;
  createdAt: string;
  totalOrders: number;
  totalValue: string;
  products: string[];
}> = {
  '1': {
    id: '1', name: 'Adebayo Okonkwo', company: 'Adebayo Plastics Ltd', country: 'Nigeria',
    email: 'adebayo@adeplastics.ng', phone: '+234-801-234-5678', whatsapp: '+234-801-234-5678',
    source: 'Website', status: 'negotiating', intentScore: 85, notes: 'Interested in PP T30S, large volume buyer. Has factory in Lagos.',
    createdAt: '2023-11-20', totalOrders: 3, totalValue: '$124,500', products: ['PP T30S', 'HDPE 5000S'],
  },
  '2': {
    id: '2', name: 'Kofi Mensah', company: 'Kofi Industries Ghana', country: 'Ghana',
    email: 'kofi@kofiindustries.gh', phone: '+233-20-123-4567', whatsapp: '+233-20-123-4567',
    source: 'Trade Show', status: 'contacted', intentScore: 72, notes: 'Met at Canton Fair 2023. PE and PVC buyer for pipe manufacturing.',
    createdAt: '2023-12-05', totalOrders: 1, totalValue: '$45,000', products: ['HDPE 5000S', 'PVC SG-5'],
  },
  '3': {
    id: '3', name: 'Amara Diallo', company: 'Amara Trading SARL', country: 'Senegal',
    email: 'amara@amaratrading.sn', phone: '+221-77-123-4567', whatsapp: '+221-77-123-4567',
    source: 'Referral', status: 'negotiating', intentScore: 93, notes: 'Referred by Fatima Toure. Large volume PP buyer for woven bag production.',
    createdAt: '2023-10-15', totalOrders: 5, totalValue: '$287,000', products: ['PP T30S', 'PP V30G'],
  },
};

const defaultCustomer = {
  id: '0', name: 'Unknown Customer', company: 'Unknown Company', country: 'N/A',
  email: 'unknown@example.com', phone: 'N/A', whatsapp: 'N/A',
  source: 'N/A', status: 'new', intentScore: 0, notes: '',
  createdAt: '2024-01-01', totalOrders: 0, totalValue: '$0', products: [],
};

const mockCommunications: CommunicationRecord[] = [
  { id: '1', type: 'email', content: 'Sent initial quotation for PP T30S - 100MT at $1,150/MT CIF Lagos', date: '2024-01-15 14:30', direction: 'outbound' },
  { id: '2', type: 'whatsapp', content: 'Customer confirmed receipt of quotation, asked about payment terms and delivery timeline', date: '2024-01-14 09:15', direction: 'inbound' },
  { id: '3', type: 'email', content: 'Replied with detailed payment terms: 30% T/T advance, 70% against B/L copy. Delivery in 25-30 days.', date: '2024-01-13 16:45', direction: 'outbound' },
  { id: '4', type: 'call', content: 'Phone call to discuss specifications. Customer needs MFR 3.0 g/10min. Confirmed we can supply.', date: '2024-01-10 11:00', direction: 'outbound' },
  { id: '5', type: 'email', content: 'Customer sent inquiry about PP T30S pricing for 50-100MT monthly supply', date: '2024-01-08 08:30', direction: 'inbound' },
  { id: '6', type: 'note', content: 'Internal note: Customer has good reputation in Lagos market. Credit check positive.', date: '2024-01-07 15:00', direction: 'outbound' },
];

const aiAnalysis = {
  closeProbability: 82,
  reasons: [
    '客户回复速度快，平均 4 小时内回复',
    '已确认产品规格需求，表明采购意向明确',
    '询问了付款条件和交货时间，说明在做采购决策',
    '历史订单记录良好，有复购行为',
    '价格谈判已进入最后阶段',
  ],
  riskFactors: [
    '竞争对手也在报价，需要关注价格竞争力',
    '海运费近期波动较大，可能影响 CIF 报价',
  ],
  suggestion: '建议在 48 小时内提供最终优惠报价，并附上过往客户案例增强信任感。可以考虑给予首次大额订单 2% 折扣。',
};

const typeConfig: Record<string, { label: string; color: string }> = {
  email: { label: '邮件', color: 'bg-blue-100 text-blue-700' },
  whatsapp: { label: 'WhatsApp', color: 'bg-green-100 text-green-700' },
  call: { label: '电话', color: 'bg-purple-100 text-purple-700' },
  meeting: { label: '会议', color: 'bg-orange-100 text-orange-700' },
  note: { label: '备注', color: 'bg-gray-100 text-gray-600' },
};

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: '新客户', className: 'bg-blue-100 text-blue-700' },
  contacted: { label: '已联系', className: 'bg-yellow-100 text-yellow-700' },
  negotiating: { label: '洽谈中', className: 'bg-orange-100 text-orange-700' },
  closed: { label: '已成交', className: 'bg-green-100 text-green-700' },
  lost: { label: '已流失', className: 'bg-gray-100 text-gray-500' },
};

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const customer = customerData[id] || defaultCustomer;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(customer);
  const [communications, setCommunications] = useState(mockCommunications);
  const [newRecord, setNewRecord] = useState({ type: 'email', content: '' });

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleAddRecord = () => {
    if (!newRecord.content.trim()) return;
    const record: CommunicationRecord = {
      id: String(communications.length + 1),
      type: newRecord.type as CommunicationRecord['type'],
      content: newRecord.content,
      date: new Date().toLocaleString(),
      direction: 'outbound',
    };
    setCommunications([record, ...communications]);
    setNewRecord({ type: 'email', content: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/customers"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
          <p className="text-gray-500">{customer.company}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">基本信息</h2>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="text-sm text-primary-light hover:text-primary font-medium"
              >
                {isEditing ? '保存' : '编辑'}
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[customer.status]?.className || 'bg-gray-100 text-gray-500'}`}>
                  {statusConfig[customer.status]?.label || customer.status}
                </span>
              </div>
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500">姓名</label>
                    <input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">公司</label>
                    <input
                      value={editData.company}
                      onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">邮箱</label>
                    <input
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">电话</label>
                    <input
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">备注</label>
                    <textarea
                      value={editData.notes}
                      onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                      rows={3}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light resize-none"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-3 py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 mt-0.5 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">国家</p>
                      <p className="text-sm text-gray-900">{customer.country}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 mt-0.5 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">邮箱</p>
                      <p className="text-sm text-gray-900">{customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 mt-0.5 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">电话</p>
                      <p className="text-sm text-gray-900">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 mt-0.5 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">WhatsApp</p>
                      <p className="text-sm text-gray-900">{customer.whatsapp}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 mt-0.5 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">来源</p>
                      <p className="text-sm text-gray-900">{customer.source}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <p className="text-xs text-gray-500 mb-1">备注</p>
                    <p className="text-sm text-gray-700">{customer.notes}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">交易统计</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">{customer.totalOrders}</p>
                <p className="text-xs text-gray-500 mt-1">总订单</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">{customer.totalValue}</p>
                <p className="text-xs text-gray-500 mt-1">总金额</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">常购产品</p>
              <div className="flex flex-wrap gap-2">
                {customer.products.map((p) => (
                  <span key={p} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI 成交概率分析</h2>
            <div className="flex items-center gap-6 mb-5">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                  <circle
                    cx="48" cy="48" r="40" fill="none" stroke="#f97316" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40 * aiAnalysis.closeProbability / 100} ${2 * Math.PI * 40}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">{aiAnalysis.closeProbability}%</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-2">成交概率评估</p>
                <p className="text-sm text-gray-600">{aiAnalysis.suggestion}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-green-700 mb-2">积极因素</p>
                <ul className="space-y-1.5">
                  {aiAnalysis.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500 shrink-0 mt-0.5">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-red-700 mb-2">风险因素</p>
                <ul className="space-y-1.5">
                  {aiAnalysis.riskFactors.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-500 shrink-0 mt-0.5">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">添加沟通记录</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={newRecord.type}
                onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
                className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light bg-white sm:w-36"
              >
                <option value="email">邮件</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="call">电话</option>
                <option value="meeting">会议</option>
                <option value="note">备注</option>
              </select>
              <input
                type="text"
                value={newRecord.content}
                onChange={(e) => setNewRecord({ ...newRecord, content: e.target.value })}
                placeholder="输入沟通内容..."
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
                onKeyDown={(e) => e.key === 'Enter' && handleAddRecord()}
              />
              <button
                onClick={handleAddRecord}
                className="px-4 py-2.5 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition-colors shrink-0"
              >
                添加
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">沟通记录</h2>
            <div className="space-y-0">
              {communications.map((record, index) => (
                <div key={record.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {index < communications.length - 1 && (
                    <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gray-200" />
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    record.direction === 'inbound' ? 'bg-blue-100' : 'bg-orange-100'
                  }`}>
                    {record.direction === 'inbound' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-orange-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${typeConfig[record.type].color}`}>
                        {typeConfig[record.type].label}
                      </span>
                      <span className="text-xs text-gray-400">{record.date}</span>
                      <span className={`text-xs ${record.direction === 'inbound' ? 'text-blue-500' : 'text-orange-500'}`}>
                        {record.direction === 'inbound' ? '收到' : '发出'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{record.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
