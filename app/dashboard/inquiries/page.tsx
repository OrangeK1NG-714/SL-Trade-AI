"use client";

import { useState } from "react";

type Inquiry = {
  id: number;
  name: string;
  company: string;
  country: string;
  countryFlag: string;
  email: string;
  phone: string;
  product: string;
  quantity: string;
  message: string;
  status: "new" | "processing" | "replied" | "closed";
  submittedAt: string;
  importedToCRM: boolean;
};

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  new: { label: "New", bg: "bg-blue-100", text: "text-blue-700" },
  processing: { label: "Processing", bg: "bg-yellow-100", text: "text-yellow-700" },
  replied: { label: "Replied", bg: "bg-green-100", text: "text-green-700" },
  closed: { label: "Closed", bg: "bg-gray-100", text: "text-gray-600" },
};

const initialInquiries: Inquiry[] = [
  {
    id: 1,
    name: "Adebayo Ogundimu",
    company: "Dangote Plastics Ltd",
    country: "Nigeria",
    countryFlag: "NG",
    email: "adebayo@dangoteplastics.ng",
    phone: "+234 803 456 7890",
    product: "PP T30S",
    quantity: "50 MT",
    message: "We are a large-scale plastic packaging manufacturer in Lagos, Nigeria. We are looking for a reliable supplier of PP T30S for our production line. We currently consume about 50 MT per month and are looking for competitive CFR Lagos pricing. Please send us your best offer including payment terms and delivery schedule.",
    status: "new",
    submittedAt: "2026-05-06 09:30",
    importedToCRM: false,
  },
  {
    id: 2,
    name: "James Kamau",
    company: "Nairobi Polymers Ltd",
    country: "Kenya",
    countryFlag: "KE",
    email: "j.kamau@nairobipolymers.co.ke",
    phone: "+254 722 345 678",
    product: "PVC SG-5",
    quantity: "25 MT",
    message: "Hello, we produce PVC pipes for the East African construction market. We need PVC SG-5 resin with K-value 66-68. Can you provide samples first? We need regular monthly supplies of 25 MT. Please quote CIF Mombasa price.",
    status: "processing",
    submittedAt: "2026-05-05 14:15",
    importedToCRM: true,
  },
  {
    id: 3,
    name: "Kwame Asante",
    company: "Accra Plastics Industries",
    country: "Ghana",
    countryFlag: "GH",
    email: "k.asante@accraplastics.gh",
    phone: "+233 244 567 890",
    product: "HDPE 5000S",
    quantity: "30 MT",
    message: "We manufacture household plastic products in Tema, Ghana. Interested in HDPE 5000S for blow molding applications. Need 30 MT trial order with possibility of regular 60 MT monthly orders. What is your CIF Tema price? Do you offer any trade finance options?",
    status: "replied",
    submittedAt: "2026-05-04 11:00",
    importedToCRM: true,
  },
  {
    id: 4,
    name: "Mekonnen Tadesse",
    company: "Addis Ababa Polymer Corp",
    country: "Ethiopia",
    countryFlag: "ET",
    email: "m.tadesse@aapoly.et",
    phone: "+251 911 234 567",
    product: "ABS PA-757",
    quantity: "20 MT",
    message: "We are an automotive parts manufacturer in Addis Ababa. We require ABS PA-757 for injection molding of car interior components. The material must meet automotive grade standards. Can you supply 20 MT per month? Please provide COA and material data sheet.",
    status: "new",
    submittedAt: "2026-05-03 16:45",
    importedToCRM: false,
  },
  {
    id: 5,
    name: "Fatima Diallo",
    company: "Dakar Polymers SARL",
    country: "Senegal",
    countryFlag: "SN",
    email: "f.diallo@dakarpolymers.sn",
    phone: "+221 77 456 7890",
    product: "PP, PE Mixed",
    quantity: "40 MT",
    message: "Bonjour, we are a distributor of plastic raw materials based in Dakar, Senegal. We serve the West African francophone market. Looking for a supplier who can provide mixed containers of PP T30S (20 MT) and PE HDPE 5000S (20 MT). Need CFR Dakar pricing. Interested in establishing a long-term supply agreement.",
    status: "processing",
    submittedAt: "2026-05-02 08:20",
    importedToCRM: false,
  },
];

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const stats = [
    {
      label: "Total Inquiries",
      value: inquiries.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      color: "bg-blue-500",
    },
    {
      label: "New",
      value: inquiries.filter((i) => i.status === "new").length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-green-500",
    },
    {
      label: "Processing",
      value: inquiries.filter((i) => i.status === "processing").length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-yellow-500",
    },
    {
      label: "Replied",
      value: inquiries.filter((i) => i.status === "replied").length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-purple-500",
    },
  ];

  const handleStatusChange = (id: number, newStatus: string) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus as Inquiry["status"] } : inq))
    );
  };

  const handleImportToCRM = (id: number) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, importedToCRM: true } : inq))
    );
  };

  const filtered = inquiries.filter((inq) => {
    if (statusFilter !== "all" && inq.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inq.name.toLowerCase().includes(q) ||
        inq.company.toLowerCase().includes(q) ||
        inq.country.toLowerCase().includes(q) ||
        inq.product.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Inquiry Management</h1>
        <p className="text-gray-500 mt-1">Track and manage customer inquiries from all channels</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-xl text-white`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center gap-4">
          <div className="flex gap-1">
            {[
              { key: "all", label: "All" },
              { key: "new", label: "New" },
              { key: "processing", label: "Processing" },
              { key: "replied", label: "Replied" },
              { key: "closed", label: "Closed" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === f.key
                    ? "bg-primary-light text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, company, country, product..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((inq) => {
                const sc = statusConfig[inq.status];
                const isExpanded = expandedId === inq.id;
                return (
                  <>
                    <tr key={inq.id} className={`hover:bg-gray-50 transition-colors ${isExpanded ? "bg-blue-50/30" : ""}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {inq.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="font-medium text-gray-900">{inq.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{inq.company}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">{inq.country}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-primary-light/10 text-primary-light rounded text-xs font-medium">{inq.product}</span>
                        <span className="text-xs text-gray-400 ml-2">{inq.quantity}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>{sc.label}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{inq.submittedAt}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                          className="text-primary-light hover:text-primary text-sm font-medium"
                        >
                          {isExpanded ? "Collapse" : "View"}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${inq.id}-detail`}>
                        <td colSpan={7} className="px-6 py-5 bg-blue-50/30">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-4">
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Inquiry Message</h4>
                                <p className="text-sm text-gray-700 leading-relaxed bg-white rounded-lg p-4 border border-gray-100">
                                  {inq.message}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</h4>
                                  <p className="text-sm text-gray-700">{inq.email}</p>
                                </div>
                                <div>
                                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</h4>
                                  <p className="text-sm text-gray-700">{inq.phone}</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Update Status</h4>
                                <select
                                  value={inq.status}
                                  onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                                >
                                  <option value="new">New</option>
                                  <option value="processing">Processing</option>
                                  <option value="replied">Replied</option>
                                  <option value="closed">Closed</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                {inq.importedToCRM ? (
                                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 rounded-lg px-4 py-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Imported to CRM
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleImportToCRM(inq.id)}
                                    className="w-full px-4 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    Import as Customer
                                  </button>
                                )}
                                <button className="w-full px-4 py-2.5 bg-primary-light hover:bg-primary text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  Send Reply Email
                                </button>
                                <button className="w-full px-4 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  Generate Quotation
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-500">No inquiries match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
