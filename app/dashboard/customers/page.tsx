'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AddCustomerModal } from './components';

interface Customer {
  id: string;
  name: string;
  company: string;
  country: string;
  email: string;
  intentScore: number;
  status: 'new' | 'contacted' | 'negotiating' | 'closed' | 'lost';
  lastContact: string;
  phone: string;
  whatsapp: string;
  source: string;
  notes: string;
}

const mockCustomers: Customer[] = [
  { id: '1', name: 'Adebayo Okonkwo', company: 'Adebayo Plastics Ltd', country: 'Nigeria', email: 'adebayo@adeplastics.ng', intentScore: 85, status: 'negotiating', lastContact: '2024-01-15', phone: '+234-801-234-5678', whatsapp: '+234-801-234-5678', source: 'Website', notes: 'Interested in PP T30S' },
  { id: '2', name: 'Kofi Mensah', company: 'Kofi Industries Ghana', country: 'Ghana', email: 'kofi@kofiindustries.gh', intentScore: 72, status: 'contacted', lastContact: '2024-01-14', phone: '+233-20-123-4567', whatsapp: '+233-20-123-4567', source: 'Trade Show', notes: 'PE and PVC buyer' },
  { id: '3', name: 'Amara Diallo', company: 'Amara Trading SARL', country: 'Senegal', email: 'amara@amaratrading.sn', intentScore: 93, status: 'negotiating', lastContact: '2024-01-13', phone: '+221-77-123-4567', whatsapp: '+221-77-123-4567', source: 'Referral', notes: 'Large volume PP buyer' },
  { id: '4', name: 'Mwangi Kamau', company: 'Mwangi Packaging Co', country: 'Kenya', email: 'mwangi@mwangipack.ke', intentScore: 45, status: 'new', lastContact: '2024-01-12', phone: '+254-722-123-456', whatsapp: '+254-722-123-456', source: 'LinkedIn', notes: 'PET bottle manufacturer' },
  { id: '5', name: 'Fatima Toure', company: 'Toure Polymers SA', country: 'Ivory Coast', email: 'fatima@tourepolymers.ci', intentScore: 88, status: 'closed', lastContact: '2024-01-11', phone: '+225-07-123-4567', whatsapp: '+225-07-123-4567', source: 'Alibaba', notes: 'Regular PVC customer' },
  { id: '6', name: 'Samuel Owusu', company: 'Owusu Manufacturing', country: 'Ghana', email: 'samuel@owusumfg.gh', intentScore: 60, status: 'contacted', lastContact: '2024-01-10', phone: '+233-24-567-8901', whatsapp: '+233-24-567-8901', source: 'Website', notes: 'ABS for electronics' },
  { id: '7', name: 'Ibrahim Sow', company: 'Sow Plastiques', country: 'Guinea', email: 'ibrahim@sowplast.gn', intentScore: 30, status: 'lost', lastContact: '2024-01-05', phone: '+224-622-123-456', whatsapp: '+224-622-123-456', source: 'Cold Email', notes: 'Budget too low' },
  { id: '8', name: 'Grace Achieng', company: 'Achieng Polymers Ltd', country: 'Kenya', email: 'grace@achiengpoly.ke', intentScore: 78, status: 'negotiating', lastContact: '2024-01-14', phone: '+254-733-456-789', whatsapp: '+254-733-456-789', source: 'Trade Show', notes: 'PS and GPPS buyer' },
  { id: '9', name: 'Moussa Keita', company: 'Keita Import Export', country: 'Mali', email: 'moussa@keitaimport.ml', intentScore: 55, status: 'contacted', lastContact: '2024-01-09', phone: '+223-76-123-456', whatsapp: '+223-76-123-456', source: 'WhatsApp', notes: 'Mixed plastics buyer' },
  { id: '10', name: 'Chidi Nwosu', company: 'Nwosu Chemicals', country: 'Nigeria', email: 'chidi@nwosuchem.ng', intentScore: 90, status: 'negotiating', lastContact: '2024-01-15', phone: '+234-803-987-6543', whatsapp: '+234-803-987-6543', source: 'Referral', notes: 'PVC SG-5 bulk order' },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: '新客户', className: 'bg-blue-100 text-blue-700' },
  contacted: { label: '已联系', className: 'bg-yellow-100 text-yellow-700' },
  negotiating: { label: '洽谈中', className: 'bg-orange-100 text-orange-700' },
  closed: { label: '已成交', className: 'bg-green-100 text-green-700' },
  lost: { label: '已流失', className: 'bg-gray-100 text-gray-500' },
};

const countries = ['All', 'Nigeria', 'Ghana', 'Kenya', 'Senegal', 'Ivory Coast', 'Guinea', 'Mali'];
const statuses = ['All', 'new', 'contacted', 'negotiating', 'closed', 'lost'];

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [customers, setCustomers] = useState(mockCustomers);

  const filtered = customers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = countryFilter === 'All' || c.country === countryFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesCountry && matchesStatus;
  });

  const handleAddCustomer = (data: Omit<Customer, 'id' | 'intentScore' | 'status' | 'lastContact'>) => {
    const newCustomer: Customer = {
      ...data,
      id: String(customers.length + 1),
      intentScore: 10,
      status: 'new',
      lastContact: new Date().toISOString().split('T')[0],
    };
    setCustomers([newCustomer, ...customers]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">客户管理</h1>
          <p className="text-gray-500 mt-1">共 {filtered.length} 位客户</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          添加客户
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="搜索客户名、公司、邮箱..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
            />
          </div>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent bg-white"
          >
            {countries.map((c) => (
              <option key={c} value={c}>{c === 'All' ? '所有国家' : c}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent bg-white"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s === 'All' ? '所有状态' : statusConfig[s].label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">客户</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">国家</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">邮箱</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">意向度</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">状态</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">最后联系</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/dashboard/customers/${customer.id}`} className="hover:text-primary-light transition-colors">
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.company}</div>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{customer.country}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{customer.email}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            customer.intentScore >= 80 ? 'bg-green-500' :
                            customer.intentScore >= 50 ? 'bg-yellow-500' : 'bg-red-400'
                          }`}
                          style={{ width: `${customer.intentScore}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{customer.intentScore}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[customer.status].className}`}>
                      {statusConfig[customer.status].label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{customer.lastContact}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/customers/${customer.id}`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary-light transition-colors"
                        title="查看详情"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </Link>
                      <Link
                        href={`/dashboard/emails?customer=${customer.id}`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-accent transition-colors"
                        title="发邮件"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">没有找到匹配的客户</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddCustomer}
        />
      )}
    </div>
  );
}
