"use client";

import { useState } from "react";

type Quote = {
  id: number;
  product: string;
  grade: string;
  price: number;
  moq: number;
  delivery: string;
  validUntil: string;
};

type Supplier = {
  id: number;
  name: string;
  contact: string;
  phone: string;
  location: string;
  products: string;
  rating: number;
  quotes: Quote[];
};

const initialSuppliers: Supplier[] = [
  {
    id: 1,
    name: "Sinopec Zhenhai Refining",
    contact: "Zhang Wei",
    phone: "+86 574 8626 8888",
    location: "Ningbo, Zhejiang",
    products: "PP, PE",
    rating: 5,
    quotes: [
      { id: 101, product: "PP", grade: "T30S", price: 1180, moq: 25, delivery: "3-5 days", validUntil: "2026-05-15" },
      { id: 102, product: "PE", grade: "HDPE 5000S", price: 1120, moq: 25, delivery: "3-5 days", validUntil: "2026-05-15" },
    ],
  },
  {
    id: 2,
    name: "PetroChina Dushanzi Petrochemical",
    contact: "Li Ming",
    phone: "+86 992 368 5000",
    location: "Karamay, Xinjiang",
    products: "PP, PE, PS",
    rating: 4,
    quotes: [
      { id: 201, product: "PP", grade: "T30S", price: 1155, moq: 50, delivery: "7-10 days", validUntil: "2026-05-20" },
      { id: 202, product: "PS", grade: "GPPS-525", price: 1290, moq: 25, delivery: "5-7 days", validUntil: "2026-05-20" },
    ],
  },
  {
    id: 3,
    name: "Wanhua Chemical Group",
    contact: "Wang Fang",
    phone: "+86 535 618 6000",
    location: "Yantai, Shandong",
    products: "ABS, PVC",
    rating: 5,
    quotes: [
      { id: 301, product: "ABS", grade: "PA-757", price: 1650, moq: 20, delivery: "3-5 days", validUntil: "2026-05-18" },
      { id: 302, product: "PVC", grade: "SG-5", price: 810, moq: 25, delivery: "5-7 days", validUntil: "2026-05-18" },
    ],
  },
  {
    id: 4,
    name: "Formosa Plastics (Ningbo)",
    contact: "Chen Jie",
    phone: "+86 574 8652 3000",
    location: "Ningbo, Zhejiang",
    products: "PP, PVC, ABS",
    rating: 4,
    quotes: [
      { id: 401, product: "PP", grade: "T30S", price: 1200, moq: 20, delivery: "3-5 days", validUntil: "2026-05-12" },
      { id: 402, product: "PVC", grade: "SG-5", price: 835, moq: 20, delivery: "3-5 days", validUntil: "2026-05-12" },
    ],
  },
  {
    id: 5,
    name: "Guangzhou Petrochemical (Sinopec)",
    contact: "Huang Lei",
    phone: "+86 20 8228 8888",
    location: "Guangzhou, Guangdong",
    products: "PE, PET, PS",
    rating: 4,
    quotes: [
      { id: 501, product: "PE", grade: "HDPE 5000S", price: 1095, moq: 25, delivery: "2-4 days", validUntil: "2026-05-25" },
      { id: 502, product: "PET", grade: "CZ-318", price: 975, moq: 20, delivery: "2-4 days", validUntil: "2026-05-25" },
    ],
  },
];

type CompareProduct = {
  product: string;
  grade: string;
  suppliers: { name: string; price: number; moq: number; delivery: string; validUntil: string }[];
};

const compareData: CompareProduct[] = [
  {
    product: "PP",
    grade: "T30S",
    suppliers: [
      { name: "Sinopec Zhenhai", price: 1180, moq: 25, delivery: "3-5 days", validUntil: "2026-05-15" },
      { name: "PetroChina Dushanzi", price: 1155, moq: 50, delivery: "7-10 days", validUntil: "2026-05-20" },
      { name: "Formosa Plastics", price: 1200, moq: 20, delivery: "3-5 days", validUntil: "2026-05-12" },
    ],
  },
  {
    product: "PE",
    grade: "HDPE 5000S",
    suppliers: [
      { name: "Sinopec Zhenhai", price: 1120, moq: 25, delivery: "3-5 days", validUntil: "2026-05-15" },
      { name: "Guangzhou Petrochemical", price: 1095, moq: 25, delivery: "2-4 days", validUntil: "2026-05-25" },
    ],
  },
  {
    product: "PVC",
    grade: "SG-5",
    suppliers: [
      { name: "Wanhua Chemical", price: 810, moq: 25, delivery: "5-7 days", validUntil: "2026-05-18" },
      { name: "Formosa Plastics", price: 835, moq: 20, delivery: "3-5 days", validUntil: "2026-05-12" },
    ],
  },
  {
    product: "ABS",
    grade: "PA-757",
    suppliers: [
      { name: "Wanhua Chemical", price: 1650, moq: 20, delivery: "3-5 days", validUntil: "2026-05-18" },
    ],
  },
];

export default function SuppliersPage() {
  const [activeTab, setActiveTab] = useState<"list" | "compare" | "ai">("list");
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [expandedSupplier, setExpandedSupplier] = useState<number | null>(null);
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [selectedCompare, setSelectedCompare] = useState("PP");
  const [showAIResult, setShowAIResult] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [supplierForm, setSupplierForm] = useState({
    name: "", contact: "", phone: "", location: "", products: "", rating: "4",
  });

  const tabs = [
    { key: "list" as const, label: "Supplier List" },
    { key: "compare" as const, label: "Quote Comparison" },
    { key: "ai" as const, label: "AI Recommendations" },
  ];

  const handleAddSupplier = () => {
    if (!supplierForm.name || !supplierForm.contact) return;
    const newSupplier: Supplier = {
      id: Date.now(),
      name: supplierForm.name,
      contact: supplierForm.contact,
      phone: supplierForm.phone,
      location: supplierForm.location,
      products: supplierForm.products,
      rating: parseInt(supplierForm.rating),
      quotes: [],
    };
    setSuppliers([newSupplier, ...suppliers]);
    setSupplierForm({ name: "", contact: "", phone: "", location: "", products: "", rating: "4" });
    setShowAddSupplier(false);
  };

  const handleGetAI = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      setShowAIResult(true);
    }, 1500);
  };

  const currentCompare = compareData.find((c) => c.product === selectedCompare);
  const maxPrice = currentCompare ? Math.max(...currentCompare.suppliers.map((s) => s.price)) : 0;

  const radarCategories = ["Price", "Quality", "Delivery", "MOQ", "Service"];
  const radarSuppliers = [
    { name: "Sinopec Zhenhai", scores: [85, 95, 90, 70, 88], color: "#2563eb" },
    { name: "PetroChina Dushanzi", scores: [92, 88, 65, 55, 80], color: "#f97316" },
    { name: "Formosa Plastics", scores: [78, 90, 88, 90, 85], color: "#16a34a" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">AI Supplier Comparison</h1>
        <p className="text-gray-500 mt-1">Manage suppliers, compare quotes, and get AI-powered recommendations</p>
      </div>

      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.key
                ? "text-primary-light after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-light"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "list" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddSupplier(true)}
              className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors"
            >
              + Add Supplier
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {suppliers.map((supplier) => (
                    <>
                      <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{supplier.name}</td>
                        <td className="px-6 py-4 text-gray-600">{supplier.contact}</td>
                        <td className="px-6 py-4 text-gray-600">{supplier.phone}</td>
                        <td className="px-6 py-4 text-gray-600">{supplier.location}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1 flex-wrap">
                            {supplier.products.split(", ").map((p) => (
                              <span key={p} className="px-2 py-0.5 bg-primary-light/10 text-primary-light rounded text-xs font-medium">
                                {p}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <svg
                                key={s}
                                className={`w-4 h-4 ${s <= supplier.rating ? "text-yellow-400" : "text-gray-200"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setExpandedSupplier(expandedSupplier === supplier.id ? null : supplier.id)}
                            className="text-primary-light hover:text-primary text-sm font-medium"
                          >
                            {expandedSupplier === supplier.id ? "Collapse" : "View Quotes"}
                          </button>
                        </td>
                      </tr>
                      {expandedSupplier === supplier.id && (
                        <tr key={`${supplier.id}-quotes`}>
                          <td colSpan={7} className="px-6 py-4 bg-blue-50/50">
                            {supplier.quotes.length === 0 ? (
                              <p className="text-sm text-gray-500 text-center py-2">No quotes available</p>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Active Quotes</p>
                                <div className="grid gap-2">
                                  {supplier.quotes.map((q) => (
                                    <div key={q.id} className="flex items-center gap-6 bg-white rounded-lg px-4 py-3 text-sm">
                                      <span className="px-2 py-0.5 bg-primary-light/10 text-primary-light rounded text-xs font-medium">{q.product}</span>
                                      <span className="text-gray-700 font-medium">{q.grade}</span>
                                      <span className="font-semibold text-gray-900">${q.price}/MT</span>
                                      <span className="text-gray-500">MOQ: {q.moq} MT</span>
                                      <span className="text-gray-500">Delivery: {q.delivery}</span>
                                      <span className="text-gray-400 text-xs">Valid until {q.validUntil}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "compare" && (
        <div className="space-y-6">
          <div className="flex gap-2">
            {compareData.map((c) => (
              <button
                key={c.product}
                onClick={() => setSelectedCompare(c.product)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCompare === c.product
                    ? "bg-primary-light text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c.product} - {c.grade}
              </button>
            ))}
          </div>

          {currentCompare && (
            <>
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Price Comparison - {currentCompare.product} {currentCompare.grade} (USD/MT)
                </h3>
                <div className="space-y-4">
                  {currentCompare.suppliers.map((s, i) => {
                    const colors = ["#2563eb", "#f97316", "#16a34a", "#8b5cf6"];
                    return (
                      <div key={i} className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 w-44 truncate">{s.name}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                          <div
                            className="h-full rounded-full flex items-center justify-end pr-3 transition-all duration-700"
                            style={{
                              width: `${(s.price / maxPrice) * 100}%`,
                              backgroundColor: colors[i % colors.length],
                            }}
                          >
                            <span className="text-white text-sm font-semibold">${s.price}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700">Detailed Comparison</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier</th>
                        <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price/MT</th>
                        <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">MOQ (MT)</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valid Until</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {currentCompare.suppliers.map((s, i) => {
                        const isLowest = s.price === Math.min(...currentCompare.suppliers.map((x) => x.price));
                        return (
                          <tr key={i} className={`hover:bg-gray-50 transition-colors ${isLowest ? "bg-green-50/50" : ""}`}>
                            <td className="px-6 py-3 font-medium text-gray-900">
                              {s.name}
                              {isLowest && (
                                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Best Price</span>
                              )}
                            </td>
                            <td className="px-6 py-3 text-right font-semibold text-gray-900">${s.price}</td>
                            <td className="px-6 py-3 text-right text-gray-600">{s.moq}</td>
                            <td className="px-6 py-3 text-gray-600">{s.delivery}</td>
                            <td className="px-6 py-3 text-gray-500">{s.validUntil}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "ai" && (
        <div className="space-y-6">
          {!showAIResult && (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-primary-light/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Supplier Analysis</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Let AI analyze all supplier data, quotes, and historical performance to provide personalized procurement recommendations.
              </p>
              <button
                onClick={handleGetAI}
                disabled={aiLoading}
                className="px-6 py-3 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {aiLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  "Get AI Recommendations"
                )}
              </button>
            </div>
          )}

          {showAIResult && (
            <>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-primary">AI Procurement Recommendation</h3>
                  <button onClick={() => setShowAIResult(false)} className="ml-auto text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4 text-sm text-gray-700">
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Top Recommendation: Sinopec Zhenhai Refining</h4>
                    <p className="leading-relaxed">
                      Based on comprehensive analysis of pricing, quality consistency, delivery reliability, and after-sales support, Sinopec Zhenhai Refining is the recommended primary supplier for PP and PE procurement. They offer competitive pricing at $1,180/MT for PP T30S with consistent quality and a strong track record of on-time delivery (98.5% on-time rate).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Alternative: PetroChina Dushanzi</h4>
                    <p className="leading-relaxed">
                      PetroChina Dushanzi offers the lowest PP T30S price at $1,155/MT, which is $25 lower than Sinopec. However, the higher MOQ (50 MT vs 25 MT) and longer delivery time (7-10 days vs 3-5 days) should be considered. Best suited for large-volume orders where cost optimization is the priority.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Procurement Strategy</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Split PP orders: 60% Sinopec Zhenhai (reliability) + 40% PetroChina (cost savings)</li>
                      <li>Source ABS exclusively from Wanhua Chemical - best quality and competitive pricing</li>
                      <li>Negotiate volume discounts with Sinopec for Q3 2026 commitments</li>
                      <li>Consider Guangzhou Petrochemical for PE orders destined for West Africa (proximity to Guangzhou port)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-6">Supplier Performance Radar</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {radarSuppliers.map((supplier) => (
                    <div key={supplier.name} className="text-center">
                      <h4 className="text-sm font-medium text-gray-700 mb-4">{supplier.name}</h4>
                      <div className="relative w-48 h-48 mx-auto">
                        {radarCategories.map((cat, i) => {
                          const angle = (i * 72 - 90) * (Math.PI / 180);
                          const x = 50 + 40 * Math.cos(angle);
                          const y = 50 + 40 * Math.sin(angle);
                          return (
                            <div
                              key={cat}
                              className="absolute text-xs text-gray-500 font-medium"
                              style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                transform: "translate(-50%, -50%)",
                              }}
                            >
                              {cat}
                            </div>
                          );
                        })}
                        {[20, 40, 60, 80, 100].map((level) => (
                          <div
                            key={level}
                            className="absolute border border-gray-200 rounded-full"
                            style={{
                              width: `${level * 0.7}%`,
                              height: `${level * 0.7}%`,
                              left: `${50 - (level * 0.7) / 2}%`,
                              top: `${50 - (level * 0.7) / 2}%`,
                            }}
                          />
                        ))}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative w-full h-full">
                            {supplier.scores.map((score, i) => {
                              const angle = (i * 72 - 90) * (Math.PI / 180);
                              const r = (score / 100) * 35;
                              const x = 50 + r * Math.cos(angle);
                              const y = 50 + r * Math.sin(angle);
                              return (
                                <div
                                  key={i}
                                  className="absolute w-2.5 h-2.5 rounded-full"
                                  style={{
                                    backgroundColor: supplier.color,
                                    left: `${x}%`,
                                    top: `${y}%`,
                                    transform: "translate(-50%, -50%)",
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap justify-center gap-2">
                        {radarCategories.map((cat, i) => (
                          <span key={cat} className="text-xs text-gray-500">
                            {cat}: <span className="font-semibold" style={{ color: supplier.color }}>{supplier.scores[i]}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {showAddSupplier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddSupplier(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Supplier</h3>
              <button onClick={() => setShowAddSupplier(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  value={supplierForm.contact}
                  onChange={(e) => setSupplierForm({ ...supplierForm, contact: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={supplierForm.phone}
                  onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={supplierForm.location}
                  onChange={(e) => setSupplierForm({ ...supplierForm, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Products</label>
                <input
                  type="text"
                  value={supplierForm.products}
                  onChange={(e) => setSupplierForm({ ...supplierForm, products: e.target.value })}
                  placeholder="e.g. PP, PE, PVC"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select
                  value={supplierForm.rating}
                  onChange={(e) => setSupplierForm({ ...supplierForm, rating: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                >
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddSupplier(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSupplier}
                className="flex-1 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
