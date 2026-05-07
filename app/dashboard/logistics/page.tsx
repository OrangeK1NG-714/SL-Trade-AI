"use client";

import { useState } from "react";

type ShipmentEvent = {
  date: string;
  time: string;
  description: string;
  location: string;
};

type Shipment = {
  id: number;
  orderNo: string;
  status: "booked" | "loaded" | "in_transit" | "arrived" | "delivered";
  origin: string;
  destination: string;
  carrier: string;
  containerNo: string;
  blNo: string;
  etd: string;
  eta: string;
  progress: number;
  events: ShipmentEvent[];
};

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  booked: { label: "Booked", bg: "bg-blue-100", text: "text-blue-700" },
  loaded: { label: "Loaded", bg: "bg-yellow-100", text: "text-yellow-700" },
  in_transit: { label: "In Transit", bg: "bg-orange-100", text: "text-orange-700" },
  arrived: { label: "Arrived", bg: "bg-green-100", text: "text-green-700" },
  delivered: { label: "Delivered", bg: "bg-teal-100", text: "text-teal-700" },
};

const initialShipments: Shipment[] = [
  {
    id: 1,
    orderNo: "SL-2026-0412",
    status: "in_transit",
    origin: "Shanghai, China",
    destination: "Lagos, Nigeria",
    carrier: "COSCO Shipping",
    containerNo: "CSLU2345678",
    blNo: "COSU6278943210",
    etd: "2026-04-12",
    eta: "2026-05-18",
    progress: 65,
    events: [
      { date: "2026-04-12", time: "08:00", description: "Container loaded at Shanghai Port", location: "Shanghai, China" },
      { date: "2026-04-12", time: "18:30", description: "Vessel departed from Shanghai", location: "Shanghai, China" },
      { date: "2026-04-16", time: "06:00", description: "Vessel arrived at Singapore for transshipment", location: "Singapore" },
      { date: "2026-04-17", time: "14:00", description: "Container transferred to feeder vessel", location: "Singapore" },
      { date: "2026-04-18", time: "09:00", description: "Vessel departed from Singapore", location: "Singapore" },
      { date: "2026-04-30", time: "12:00", description: "Vessel passing through Suez Canal", location: "Suez Canal, Egypt" },
      { date: "2026-05-06", time: "10:00", description: "Currently in transit - West African waters", location: "Atlantic Ocean" },
    ],
  },
  {
    id: 2,
    orderNo: "SL-2026-0325",
    status: "arrived",
    origin: "Ningbo, China",
    destination: "Mombasa, Kenya",
    carrier: "MSC",
    containerNo: "MSCU7891234",
    blNo: "MSCUB1234567",
    etd: "2026-03-25",
    eta: "2026-04-28",
    progress: 95,
    events: [
      { date: "2026-03-25", time: "10:00", description: "Container loaded at Ningbo Port", location: "Ningbo, China" },
      { date: "2026-03-25", time: "22:00", description: "Vessel departed from Ningbo", location: "Ningbo, China" },
      { date: "2026-03-30", time: "08:00", description: "Vessel arrived at Port Klang", location: "Port Klang, Malaysia" },
      { date: "2026-03-31", time: "16:00", description: "Vessel departed from Port Klang", location: "Port Klang, Malaysia" },
      { date: "2026-04-15", time: "07:00", description: "Vessel passing through Indian Ocean", location: "Indian Ocean" },
      { date: "2026-04-28", time: "06:30", description: "Vessel arrived at Mombasa Port", location: "Mombasa, Kenya" },
      { date: "2026-04-28", time: "14:00", description: "Container discharged from vessel", location: "Mombasa, Kenya" },
      { date: "2026-04-30", time: "09:00", description: "Customs clearance in progress", location: "Mombasa, Kenya" },
    ],
  },
  {
    id: 3,
    orderNo: "SL-2026-0503",
    status: "booked",
    origin: "Guangzhou, China",
    destination: "Tema, Ghana",
    carrier: "Evergreen Marine",
    containerNo: "EGHU5678901",
    blNo: "EGLV987654321",
    etd: "2026-05-12",
    eta: "2026-06-15",
    progress: 5,
    events: [
      { date: "2026-05-03", time: "11:00", description: "Booking confirmed with Evergreen Marine", location: "Guangzhou, China" },
      { date: "2026-05-05", time: "15:00", description: "Container assigned: EGHU5678901", location: "Guangzhou, China" },
    ],
  },
];

export default function LogisticsPage() {
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notificationId, setNotificationId] = useState<number | null>(null);
  const [form, setForm] = useState({
    carrier: "",
    containerNo: "",
    blNo: "",
    origin: "",
    destination: "",
    etd: "",
    eta: "",
  });

  const stats = [
    {
      label: "In Transit",
      value: shipments.filter((s) => s.status === "in_transit" || s.status === "loaded").length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
      color: "bg-orange-500",
    },
    {
      label: "Arrived at Port",
      value: shipments.filter((s) => s.status === "arrived").length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-green-500",
    },
    {
      label: "Delivered",
      value: shipments.filter((s) => s.status === "delivered").length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
      color: "bg-teal-500",
    },
    {
      label: "Booked",
      value: shipments.filter((s) => s.status === "booked").length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      color: "bg-blue-500",
    },
  ];

  const handleAddShipment = () => {
    if (!form.carrier || !form.origin || !form.destination || !form.etd || !form.eta) return;
    const newShipment: Shipment = {
      id: Date.now(),
      orderNo: `SL-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      status: "booked",
      origin: form.origin,
      destination: form.destination,
      carrier: form.carrier,
      containerNo: form.containerNo || "TBD",
      blNo: form.blNo || "TBD",
      etd: form.etd,
      eta: form.eta,
      progress: 0,
      events: [
        {
          date: new Date().toISOString().split("T")[0],
          time: new Date().toTimeString().slice(0, 5),
          description: `Booking confirmed with ${form.carrier}`,
          location: form.origin,
        },
      ],
    };
    setShipments([newShipment, ...shipments]);
    setForm({ carrier: "", containerNo: "", blNo: "", origin: "", destination: "", etd: "", eta: "" });
    setShowAddModal(false);
  };

  const generateNotification = (shipment: Shipment) => {
    const sc = statusConfig[shipment.status];
    return `Dear Valued Customer,

We are writing to update you on the status of your shipment.

Order Number: ${shipment.orderNo}
Container No.: ${shipment.containerNo}
B/L Number: ${shipment.blNo}
Carrier: ${shipment.carrier}

Route: ${shipment.origin} --> ${shipment.destination}
ETD: ${shipment.etd}
ETA: ${shipment.eta}

Current Status: ${sc.label}
Progress: ${shipment.progress}%

Latest Update:
${shipment.events[shipment.events.length - 1].date} - ${shipment.events[shipment.events.length - 1].description}

Please feel free to contact us if you have any questions regarding your shipment.

Best regards,
SL Trade International
Email: logistics@sltrade.com
Tel: +86 20 8888 9999`;
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Logistics Tracking</h1>
          <p className="text-gray-500 mt-1">Monitor shipments, track containers, and notify customers</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Shipment
        </button>
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

      <div className="space-y-4">
        {shipments.map((shipment) => {
          const sc = statusConfig[shipment.status];
          const isExpanded = expandedId === shipment.id;
          const showNotif = notificationId === shipment.id;

          return (
            <div key={shipment.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900 text-lg">{shipment.orderNo}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>{sc.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setNotificationId(showNotif ? null : shipment.id)}
                      className="px-3 py-1.5 bg-primary-light hover:bg-primary text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Generate Notification
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : shipment.id)}
                      className="px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-xs font-medium transition-colors"
                    >
                      {isExpanded ? "Collapse" : "Details"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Origin</p>
                    <p className="text-sm font-semibold text-gray-900">{shipment.origin}</p>
                  </div>
                  <div className="flex-1 relative">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${shipment.progress}%`,
                          background: "linear-gradient(to right, #2563eb, #f97316)",
                        }}
                      />
                    </div>
                    <div
                      className="absolute -top-1 w-4 h-4 rounded-full bg-white border-2 border-accent shadow-sm transition-all duration-700"
                      style={{ left: `calc(${shipment.progress}% - 8px)` }}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-400">ETD: {shipment.etd}</span>
                      <span className="text-xs text-gray-400">ETA: {shipment.eta}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Destination</p>
                    <p className="text-sm font-semibold text-gray-900">{shipment.destination}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Carrier:</span>
                    <span className="font-medium text-gray-700">{shipment.carrier}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Container:</span>
                    <span className="font-medium text-gray-700 font-mono text-xs">{shipment.containerNo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">B/L No.:</span>
                    <span className="font-medium text-gray-700 font-mono text-xs">{shipment.blNo}</span>
                  </div>
                </div>
              </div>

              {showNotif && (
                <div className="border-t border-gray-100 bg-green-50/50 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h4 className="font-semibold text-green-800 text-sm">Customer Notification Template</h4>
                    <button
                      onClick={() => setNotificationId(null)}
                      className="ml-auto text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed bg-white rounded-lg p-4 border border-green-200">
                    {generateNotification(shipment)}
                  </pre>
                  <div className="mt-3 flex gap-2">
                    <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors">
                      Copy to Clipboard
                    </button>
                    <button className="px-3 py-1.5 bg-primary-light hover:bg-primary text-white rounded-lg text-xs font-medium transition-colors">
                      Send via Email
                    </button>
                  </div>
                </div>
              )}

              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Shipment Timeline</h4>
                  <div className="relative pl-8">
                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200" />
                    {shipment.events.map((event, i) => {
                      const isLast = i === shipment.events.length - 1;
                      return (
                        <div key={i} className="relative mb-6 last:mb-0">
                          <div
                            className={`absolute -left-5 w-2.5 h-2.5 rounded-full border-2 ${
                              isLast
                                ? "bg-accent border-accent"
                                : "bg-white border-primary-light"
                            }`}
                            style={{ top: "4px" }}
                          />
                          <div className="flex items-start gap-4">
                            <div className="min-w-[100px]">
                              <p className="text-xs font-semibold text-gray-900">{event.date}</p>
                              <p className="text-xs text-gray-400">{event.time}</p>
                            </div>
                            <div>
                              <p className={`text-sm ${isLast ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                                {event.description}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">{event.location}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Shipment</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Carrier</label>
                <select
                  value={form.carrier}
                  onChange={(e) => setForm({ ...form, carrier: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                >
                  <option value="">Select carrier</option>
                  <option value="COSCO Shipping">COSCO Shipping</option>
                  <option value="MSC">MSC</option>
                  <option value="Maersk">Maersk</option>
                  <option value="Evergreen Marine">Evergreen Marine</option>
                  <option value="CMA CGM">CMA CGM</option>
                  <option value="ONE">ONE (Ocean Network Express)</option>
                  <option value="Yang Ming">Yang Ming</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Container No.</label>
                <input
                  type="text"
                  value={form.containerNo}
                  onChange={(e) => setForm({ ...form, containerNo: e.target.value })}
                  placeholder="e.g. CSLU2345678"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">B/L Number</label>
                <input
                  type="text"
                  value={form.blNo}
                  onChange={(e) => setForm({ ...form, blNo: e.target.value })}
                  placeholder="e.g. COSU6278943210"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origin Port</label>
                <select
                  value={form.origin}
                  onChange={(e) => setForm({ ...form, origin: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                >
                  <option value="">Select origin</option>
                  <option value="Shanghai, China">Shanghai, China</option>
                  <option value="Ningbo, China">Ningbo, China</option>
                  <option value="Guangzhou, China">Guangzhou, China</option>
                  <option value="Shenzhen, China">Shenzhen, China</option>
                  <option value="Qingdao, China">Qingdao, China</option>
                  <option value="Tianjin, China">Tianjin, China</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination Port</label>
                <select
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                >
                  <option value="">Select destination</option>
                  <option value="Lagos, Nigeria">Lagos, Nigeria</option>
                  <option value="Mombasa, Kenya">Mombasa, Kenya</option>
                  <option value="Tema, Ghana">Tema, Ghana</option>
                  <option value="Dar es Salaam, Tanzania">Dar es Salaam, Tanzania</option>
                  <option value="Durban, South Africa">Durban, South Africa</option>
                  <option value="Djibouti, Djibouti">Djibouti, Djibouti</option>
                  <option value="Luanda, Angola">Luanda, Angola</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ETD</label>
                <input
                  type="date"
                  value={form.etd}
                  onChange={(e) => setForm({ ...form, etd: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ETA</label>
                <input
                  type="date"
                  value={form.eta}
                  onChange={(e) => setForm({ ...form, eta: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddShipment}
                className="flex-1 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors"
              >
                Add Shipment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
