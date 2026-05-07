"use client";

import { useState } from "react";

type SearchResult = {
  id: number;
  company: string;
  contact: string;
  country: string;
  business: string;
  email: string;
  phone: string;
  imported: boolean;
};

type HistoryRecord = {
  id: number;
  time: string;
  keywords: string;
  platform: string;
  results: number;
};

const mockResults: SearchResult[] = [
  { id: 1, company: "Dangote Plastics Ltd", contact: "Adebayo Ogundimu", country: "Nigeria", business: "Plastic packaging manufacturing", email: "adebayo@dangoteplastics.ng", phone: "+234 803 456 7890", imported: false },
  { id: 2, company: "Nairobi Polymers Ltd", contact: "James Kamau", country: "Kenya", business: "PVC pipe production", email: "j.kamau@nairobipolymers.co.ke", phone: "+254 722 345 678", imported: false },
  { id: 3, company: "Accra Plastics Industries", contact: "Kwame Asante", country: "Ghana", business: "Household plastic products", email: "k.asante@accraplastics.gh", phone: "+233 244 567 890", imported: false },
  { id: 4, company: "Lagos Polymer Solutions", contact: "Chidinma Okafor", country: "Nigeria", business: "Industrial plastic containers", email: "chidinma@lagospolymer.ng", phone: "+234 706 789 0123", imported: false },
  { id: 5, company: "Mombasa Packaging Co.", contact: "Hassan Ali", country: "Kenya", business: "Food packaging & bottles", email: "h.ali@mombasapack.co.ke", phone: "+254 733 456 789", imported: false },
  { id: 6, company: "Tema Industrial Plastics", contact: "Yaw Mensah", country: "Ghana", business: "Construction materials", email: "y.mensah@temaplastics.gh", phone: "+233 277 890 123", imported: false },
  { id: 7, company: "Addis Ababa Polymer Corp", contact: "Mekonnen Tadesse", country: "Ethiopia", business: "Automotive plastic parts", email: "m.tadesse@aapoly.et", phone: "+251 911 234 567", imported: false },
  { id: 8, company: "Dar es Salaam Plastics", contact: "Juma Mwangi", country: "Tanzania", business: "Agricultural film & bags", email: "j.mwangi@darplastics.tz", phone: "+255 784 567 890", imported: false },
  { id: 9, company: "Abuja Manufacturing Ltd", contact: "Ibrahim Sule", country: "Nigeria", business: "Injection molding services", email: "i.sule@abujamfg.ng", phone: "+234 812 345 678", imported: false },
  { id: 10, company: "Kampala Poly Industries", contact: "Grace Nakamya", country: "Uganda", business: "Water tank manufacturing", email: "g.nakamya@kampalapoly.ug", phone: "+256 772 345 678", imported: false },
];

const mockHistory: HistoryRecord[] = [
  { id: 1, time: "2026-05-05 14:30", keywords: "PP polypropylene buyer", platform: "Made-in-China", results: 24 },
  { id: 2, time: "2026-05-03 09:15", keywords: "PVC pipe manufacturer Africa", platform: "Alibaba", results: 18 },
  { id: 3, time: "2026-04-28 16:45", keywords: "plastic packaging Nigeria", platform: "TradeKey", results: 31 },
];

const countries = [
  "Nigeria", "Kenya", "Ghana", "Tanzania", "Ethiopia", "South Africa",
  "Uganda", "Senegal", "Cameroon", "Cote d'Ivoire",
];

export default function ScraperPage() {
  const [activeTab, setActiveTab] = useState<"search" | "import" | "history">("search");
  const [platform, setPlatform] = useState("Made-in-China");
  const [keywords, setKeywords] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [companySize, setCompanySize] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [bulkText, setBulkText] = useState("");

  const tabs = [
    { key: "search" as const, label: "Data Search" },
    { key: "import" as const, label: "Bulk Import" },
    { key: "history" as const, label: "Search History" },
  ];

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const handleSearch = () => {
    setIsSearching(true);
    setHasSearched(true);
    setTimeout(() => {
      setResults(mockResults.map((r) => ({ ...r, imported: false })));
      setIsSearching(false);
    }, 2000);
  };

  const handleImportToCRM = (id: number) => {
    setResults((prev) => prev.map((r) => (r.id === id ? { ...r, imported: true } : r)));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Customer Data Collection</h1>
        <p className="text-gray-500 mt-1">Search, scrape, and import potential buyer data from trade platforms</p>
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

      {activeTab === "search" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Search Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                >
                  <option value="Made-in-China">Made-in-China</option>
                  <option value="TradeKey">TradeKey</option>
                  <option value="Alibaba">Alibaba</option>
                  <option value="Global Sources">Global Sources</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Keywords</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. PP polypropylene, PVC pipe"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Countries</label>
                <div className="flex flex-wrap gap-2">
                  {countries.map((c) => (
                    <button
                      key={c}
                      onClick={() => toggleCountry(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedCountries.includes(c)
                          ? "bg-primary-light text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                >
                  <option value="all">All Sizes</option>
                  <option value="small">Small (1-50 employees)</option>
                  <option value="medium">Medium (51-200 employees)</option>
                  <option value="large">Large (200+ employees)</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="px-6 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSearching ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          {isSearching && (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <div className="w-12 h-12 border-4 border-primary-light border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Scraping data from {platform}...</p>
              <p className="text-sm text-gray-400 mt-1">This may take a few moments</p>
            </div>
          )}

          {!isSearching && hasSearched && results.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Search Results ({results.length} found)</h3>
                <span className="text-xs text-gray-400">Platform: {platform}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Business</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {results.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 font-medium text-gray-900">{r.company}</td>
                        <td className="px-6 py-3 text-gray-600">{r.contact}</td>
                        <td className="px-6 py-3">
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">{r.country}</span>
                        </td>
                        <td className="px-6 py-3 text-gray-600 max-w-[200px] truncate">{r.business}</td>
                        <td className="px-6 py-3 text-gray-600 text-xs">{r.email}</td>
                        <td className="px-6 py-3 text-gray-600 text-xs">{r.phone}</td>
                        <td className="px-6 py-3">
                          {r.imported ? (
                            <span className="text-green-600 text-xs font-medium flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Imported
                            </span>
                          ) : (
                            <button
                              onClick={() => handleImportToCRM(r.id)}
                              className="px-3 py-1 bg-primary-light hover:bg-primary text-white rounded text-xs font-medium transition-colors"
                            >
                              Import CRM
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!isSearching && !hasSearched && (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-500">Configure search parameters above and click Search to find potential buyers</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "import" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Upload File</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary-light transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-primary-light/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium mb-1">Drag & drop files here</p>
              <p className="text-sm text-gray-400 mb-4">or click to browse</p>
              <div className="flex justify-center gap-3">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">CSV</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Excel (.xlsx)</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Excel (.xls)</span>
              </div>
            </div>
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Required Columns</h4>
              <div className="flex flex-wrap gap-2">
                {["Company Name", "Contact Person", "Country", "Email", "Phone", "Business Type"].map((col) => (
                  <span key={col} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">{col}</span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">Download template: <span className="text-primary-light cursor-pointer hover:underline">CSV Template</span> | <span className="text-primary-light cursor-pointer hover:underline">Excel Template</span></p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Manual Bulk Entry</h3>
            <p className="text-xs text-gray-500 mb-3">Enter one record per line. Format: Company | Contact | Country | Email | Phone</p>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={8}
              placeholder={"Dangote Industries | John Doe | Nigeria | john@dangote.ng | +234 801 234 5678\nNairobi Plastics | Jane Smith | Kenya | jane@nairobiplastics.co.ke | +254 712 345 678"}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none resize-none"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-gray-400">
                {bulkText.split("\n").filter((l) => l.trim()).length} records detected
              </span>
              <button className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors">
                Import All
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-4">
          {mockHistory.map((h) => (
            <div key={h.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-light/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{h.keywords}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">{h.time}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{h.platform}</span>
                    <span className="text-xs text-gray-500">{h.results} results</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-primary-light hover:bg-primary text-white rounded-lg text-xs font-medium transition-colors">
                  Re-run
                </button>
                <button className="px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-xs font-medium transition-colors">
                  View Results
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
