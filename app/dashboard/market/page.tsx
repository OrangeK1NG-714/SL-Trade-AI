"use client";

import { useState } from "react";

type PriceRecord = {
  id: number;
  date: string;
  product: string;
  grade: string;
  priceUSD: number;
  priceRMB: number;
  source: string;
};

type Policy = {
  id: number;
  country: string;
  title: string;
  summary: string;
  date: string;
  countryColor: string;
};

type CurrencyCard = {
  pair: string;
  rate: number;
  change: number;
  flag: string;
};

const products = ["PP", "PE", "PVC", "ABS", "PET", "PS"];

const monthlyData: Record<string, number[]> = {
  PP: [1120, 1085, 1150, 1098, 1175, 1210],
  PE: [1050, 1020, 1080, 1045, 1095, 1130],
  PVC: [780, 810, 795, 830, 845, 820],
  ABS: [1580, 1620, 1560, 1600, 1640, 1670],
  PET: [920, 890, 940, 910, 960, 985],
  PS: [1250, 1280, 1220, 1260, 1300, 1320],
};

const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

const initialPrices: PriceRecord[] = [
  { id: 1, date: "2026-04-28", product: "PP", grade: "T30S", priceUSD: 1210, priceRMB: 8712, source: "ICIS" },
  { id: 2, date: "2026-04-28", product: "PP", grade: "S1003", priceUSD: 1195, priceRMB: 8604, source: "Platts" },
  { id: 3, date: "2026-04-25", product: "PE", grade: "HDPE 5000S", priceUSD: 1130, priceRMB: 8136, source: "ICIS" },
  { id: 4, date: "2026-04-25", product: "PVC", grade: "SG-5", priceUSD: 820, priceRMB: 5904, source: "CCFGroup" },
  { id: 5, date: "2026-04-24", product: "ABS", grade: "PA-757", priceUSD: 1670, priceRMB: 12024, source: "Platts" },
  { id: 6, date: "2026-04-24", product: "PET", grade: "CZ-318", priceUSD: 985, priceRMB: 7092, source: "ICIS" },
  { id: 7, date: "2026-04-23", product: "PS", grade: "GPPS-525", priceUSD: 1320, priceRMB: 9504, source: "CCFGroup" },
  { id: 8, date: "2026-04-22", product: "PP", grade: "EPS30R", priceUSD: 1180, priceRMB: 8496, source: "ICIS" },
];

const initialPolicies: Policy[] = [
  {
    id: 1,
    country: "Nigeria",
    title: "Nigeria Raises Import Tariff on Finished Plastic Products to 35%",
    summary: "The Nigerian Customs Service announced an increase in import duties on finished plastic products from 20% to 35%, effective June 2026. Raw material imports remain at 5% to encourage domestic manufacturing.",
    date: "2026-04-20",
    countryColor: "bg-green-100 text-green-800",
  },
  {
    id: 2,
    country: "Kenya",
    title: "Kenya Bureau of Standards Updates Plastic Raw Material Import Regulations",
    summary: "KEBS has introduced new quality certification requirements for imported plastic raw materials. All shipments must include Certificate of Conformity (CoC) issued by approved inspection agencies starting August 2026.",
    date: "2026-04-15",
    countryColor: "bg-red-100 text-red-800",
  },
  {
    id: 3,
    country: "Ghana",
    title: "Ghana Signs AfCFTA Supplementary Protocol on Petrochemical Products",
    summary: "Ghana has ratified the AfCFTA supplementary protocol reducing tariffs on petrochemical raw materials traded between member states. PP and PE imports from fellow African nations will enjoy 0% tariff by 2027.",
    date: "2026-04-10",
    countryColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: 4,
    country: "Tanzania",
    title: "Tanzania Bans Single-Use Plastics, Exempts Industrial Raw Materials",
    summary: "The Tanzanian government has expanded its plastic ban to include all single-use plastic products. However, industrial-grade plastic raw materials for manufacturing are explicitly exempted from the ban.",
    date: "2026-04-05",
    countryColor: "bg-blue-100 text-blue-800",
  },
  {
    id: 5,
    country: "South Africa",
    title: "SARS Introduces Pre-Clearance System for Bulk Chemical Imports",
    summary: "South African Revenue Service is implementing a new pre-clearance system for bulk chemical and plastic raw material imports to reduce port congestion. Importers can submit documentation 14 days before vessel arrival.",
    date: "2026-03-28",
    countryColor: "bg-purple-100 text-purple-800",
  },
];

const currencies: CurrencyCard[] = [
  { pair: "USD/CNY", rate: 7.2045, change: -0.12, flag: "🇺🇸" },
  { pair: "EUR/CNY", rate: 7.8320, change: 0.25, flag: "🇪🇺" },
  { pair: "NGN/CNY", rate: 0.00468, change: -0.85, flag: "🇳🇬" },
  { pair: "KES/CNY", rate: 0.0558, change: 0.15, flag: "🇰🇪" },
  { pair: "GHS/CNY", rate: 0.5620, change: -0.32, flag: "🇬🇭" },
];

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState<"prices" | "policies" | "exchange">("prices");
  const [selectedProduct, setSelectedProduct] = useState("PP");
  const [prices, setPrices] = useState<PriceRecord[]>(initialPrices);
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies);
  const [showAddPrice, setShowAddPrice] = useState(false);
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [priceForm, setPriceForm] = useState({ date: "", product: "PP", grade: "", priceUSD: "", source: "" });
  const [policyForm, setPolicyForm] = useState({ country: "", title: "", summary: "", date: "" });

  const tabs = [
    { key: "prices" as const, label: "Price Trends" },
    { key: "policies" as const, label: "Policy Updates" },
    { key: "exchange" as const, label: "Exchange Rates" },
  ];

  const chartData = monthlyData[selectedProduct] || [];
  const maxVal = Math.max(...chartData);

  const handleAddPrice = () => {
    if (!priceForm.date || !priceForm.grade || !priceForm.priceUSD || !priceForm.source) return;
    const usd = parseFloat(priceForm.priceUSD);
    const newPrice: PriceRecord = {
      id: Date.now(),
      date: priceForm.date,
      product: priceForm.product,
      grade: priceForm.grade,
      priceUSD: usd,
      priceRMB: Math.round(usd * 7.2),
      source: priceForm.source,
    };
    setPrices([newPrice, ...prices]);
    setPriceForm({ date: "", product: "PP", grade: "", priceUSD: "", source: "" });
    setShowAddPrice(false);
  };

  const handleAddPolicy = () => {
    if (!policyForm.country || !policyForm.title || !policyForm.summary || !policyForm.date) return;
    const colors: Record<string, string> = {
      Nigeria: "bg-green-100 text-green-800",
      Kenya: "bg-red-100 text-red-800",
      Ghana: "bg-yellow-100 text-yellow-800",
      Tanzania: "bg-blue-100 text-blue-800",
      "South Africa": "bg-purple-100 text-purple-800",
    };
    const newPolicy: Policy = {
      id: Date.now(),
      ...policyForm,
      countryColor: colors[policyForm.country] || "bg-gray-100 text-gray-800",
    };
    setPolicies([newPolicy, ...policies]);
    setPolicyForm({ country: "", title: "", summary: "", date: "" });
    setShowAddPolicy(false);
  };

  const aiAnalysisText = `**${selectedProduct} Market Trend Analysis Report**

Current Price: $${chartData[chartData.length - 1]}/MT | 6-Month Change: ${(((chartData[chartData.length - 1] - chartData[0]) / chartData[0]) * 100).toFixed(1)}%

Key Findings:
1. Price Momentum: ${selectedProduct} prices show an upward trend over the past 6 months, with prices rising from $${chartData[0]} to $${chartData[chartData.length - 1]} per metric ton. The overall trend is bullish with moderate volatility.

2. Supply Side: Chinese domestic production remains stable. Major producers including Sinopec and PetroChina have maintained regular output. Some maintenance shutdowns in Q1 2026 briefly tightened supply.

3. Demand Drivers: African market demand continues to grow, particularly from Nigeria (+12% YoY) and Kenya (+8% YoY). The construction and packaging sectors are the primary demand drivers.

4. Forecast: We expect ${selectedProduct} prices to remain in the $${Math.round(chartData[chartData.length - 1] * 0.95)}-${Math.round(chartData[chartData.length - 1] * 1.08)} range over the next quarter. Seasonal demand from African markets ahead of festive seasons may push prices higher.

5. Recommendation: Consider locking in current prices for Q3 2026 orders. The risk-reward favors early procurement given the upward price trajectory and potential supply constraints during summer maintenance season.`;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Market Intelligence</h1>
        <p className="text-gray-500 mt-1">Monitor prices, policies, and exchange rates for African markets</p>
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

      {activeTab === "prices" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              {products.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedProduct(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedProduct === p
                      ? "bg-primary-light text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAIAnalysis(!showAIAnalysis)}
                className="px-4 py-2 bg-primary-light hover:bg-primary text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Trend Analysis
              </button>
              <button
                onClick={() => setShowAddPrice(true)}
                className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors"
              >
                + Add Price Data
              </button>
            </div>
          </div>

          {showAIAnalysis && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-primary">AI Market Analysis</h3>
                <button onClick={() => setShowAIAnalysis(false)} className="ml-auto text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{aiAnalysisText}</div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">{selectedProduct} Price Trend (Last 6 Months) - USD/MT</h3>
            <div className="flex items-end gap-3 h-48 px-4">
              {chartData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-gray-600">${val}</span>
                  <div
                    className="w-full rounded-t-md transition-all duration-500"
                    style={{
                      height: `${(val / maxVal) * 140}px`,
                      background: `linear-gradient(to top, #1e3a5f, #2563eb)`,
                    }}
                  />
                  <span className="text-xs text-gray-500">{months[i]}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
              <span>Min: ${Math.min(...chartData)}</span>
              <span>Max: ${Math.max(...chartData)}</span>
              <span>Avg: ${Math.round(chartData.reduce((a, b) => a + b, 0) / chartData.length)}</span>
              <span className={`font-medium ${chartData[chartData.length - 1] >= chartData[0] ? "text-green-600" : "text-red-600"}`}>
                {chartData[chartData.length - 1] >= chartData[0] ? "+" : ""}
                {(((chartData[chartData.length - 1] - chartData[0]) / chartData[0]) * 100).toFixed(1)}% overall
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">Price Data</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (USD/MT)</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (RMB/MT)</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {prices.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 text-gray-600">{row.date}</td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-0.5 bg-primary-light/10 text-primary-light rounded text-xs font-medium">{row.product}</span>
                      </td>
                      <td className="px-6 py-3 text-gray-700 font-medium">{row.grade}</td>
                      <td className="px-6 py-3 text-right font-semibold text-gray-900">${row.priceUSD.toLocaleString()}</td>
                      <td className="px-6 py-3 text-right text-gray-600">{"¥"}{row.priceRMB.toLocaleString()}</td>
                      <td className="px-6 py-3 text-gray-500">{row.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "policies" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddPolicy(true)}
              className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors"
            >
              + Add Policy
            </button>
          </div>
          <div className="space-y-4">
            {policies.map((policy) => (
              <div key={policy.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${policy.countryColor}`}>
                        {policy.country}
                      </span>
                      <span className="text-xs text-gray-400">{policy.date}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{policy.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{policy.summary}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "exchange" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currencies.map((cur) => (
            <div key={cur.pair} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cur.flag}</span>
                  <span className="font-semibold text-gray-900">{cur.pair}</span>
                </div>
                <span
                  className={`flex items-center gap-1 text-sm font-medium ${
                    cur.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {cur.change >= 0 ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                    </svg>
                  )}
                  {cur.change >= 0 ? "+" : ""}{cur.change}%
                </span>
              </div>
              <div className="text-3xl font-bold text-primary mb-3">{cur.rate.toFixed(4)}</div>
              <div className="flex gap-1 h-8 items-end">
                {[40, 55, 45, 60, 50, 65, 58, 70, 62, 75, 68, 72].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      backgroundColor: cur.change >= 0 ? (i >= 10 ? "#16a34a" : "#bbf7d0") : (i >= 10 ? "#dc2626" : "#fecaca"),
                    }}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">Last 12 hours trend</p>
            </div>
          ))}
        </div>
      )}

      {showAddPrice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddPrice(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Price Data</h3>
              <button onClick={() => setShowAddPrice(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={priceForm.date}
                  onChange={(e) => setPriceForm({ ...priceForm, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select
                  value={priceForm.product}
                  onChange={(e) => setPriceForm({ ...priceForm, product: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                >
                  {products.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                <input
                  type="text"
                  value={priceForm.grade}
                  onChange={(e) => setPriceForm({ ...priceForm, grade: e.target.value })}
                  placeholder="e.g. T30S"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD/MT)</label>
                <input
                  type="number"
                  value={priceForm.priceUSD}
                  onChange={(e) => setPriceForm({ ...priceForm, priceUSD: e.target.value })}
                  placeholder="e.g. 1200"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <input
                  type="text"
                  value={priceForm.source}
                  onChange={(e) => setPriceForm({ ...priceForm, source: e.target.value })}
                  placeholder="e.g. ICIS, Platts"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddPrice(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPrice}
                className="flex-1 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddPolicy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddPolicy(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Policy Update</h3>
              <button onClick={() => setShowAddPolicy(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  value={policyForm.country}
                  onChange={(e) => setPolicyForm({ ...policyForm, country: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                >
                  <option value="">Select country</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Ethiopia">Ethiopia</option>
                  <option value="Senegal">Senegal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={policyForm.date}
                  onChange={(e) => setPolicyForm({ ...policyForm, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={policyForm.title}
                  onChange={(e) => setPolicyForm({ ...policyForm, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                <textarea
                  value={policyForm.summary}
                  onChange={(e) => setPolicyForm({ ...policyForm, summary: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddPolicy(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPolicy}
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
