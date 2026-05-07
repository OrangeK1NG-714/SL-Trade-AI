'use client';

import { useState } from 'react';

interface CustomerFormData {
  name: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  whatsapp: string;
  source: string;
  notes: string;
}

const defaultFormData: CustomerFormData = {
  name: '',
  company: '',
  country: '',
  email: '',
  phone: '',
  whatsapp: '',
  source: '',
  notes: '',
};

const countriesList = [
  'Nigeria', 'Ghana', 'Kenya', 'Senegal', 'Ivory Coast', 'Tanzania',
  'Ethiopia', 'South Africa', 'Cameroon', 'Guinea', 'Mali', 'Mozambique',
  'Angola', 'Uganda', 'DR Congo',
];

const sourcesList = [
  'Website', 'Alibaba', 'Trade Show', 'LinkedIn', 'Referral', 'WhatsApp', 'Cold Email', 'Google Ads',
];

export function CustomerForm({
  initialData,
  onSubmit,
  submitLabel,
}: {
  initialData?: CustomerFormData;
  onSubmit: (data: CustomerFormData) => void;
  submitLabel: string;
}) {
  const [formData, setFormData] = useState<CustomerFormData>(initialData || defaultFormData);

  const handleChange = (field: keyof CustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
            placeholder="客户姓名"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">公司 *</label>
          <input
            type="text"
            required
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
            placeholder="公司名称"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">国家 *</label>
          <select
            required
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent bg-white"
          >
            <option value="">选择国家</option>
            {countriesList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">邮箱 *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
            placeholder="+234-xxx-xxx-xxxx"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
          <input
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => handleChange('whatsapp', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
            placeholder="+234-xxx-xxx-xxxx"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">来源</label>
          <select
            value={formData.source}
            onChange={(e) => handleChange('source', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent bg-white"
          >
            <option value="">选择来源</option>
            {sourcesList.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent resize-none"
          placeholder="客户备注信息..."
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-5 py-2.5 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export function AddCustomerModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">添加新客户</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <CustomerForm onSubmit={onSubmit} submitLabel="添加客户" />
        </div>
      </div>
    </div>
  );
}
