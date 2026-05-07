const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export const customerAPI = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchAPI(`/customers${query}`);
  },
  getById: (id: string) => fetchAPI(`/customers/${id}`),
  create: (data: Record<string, unknown>) =>
    fetchAPI('/customers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, unknown>) =>
    fetchAPI(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    fetchAPI(`/customers/${id}`, { method: 'DELETE' }),
};

export const emailAPI = {
  generate: (data: Record<string, unknown>) =>
    fetchAPI('/emails/generate', { method: 'POST', body: JSON.stringify(data) }),
  getHistory: () => fetchAPI('/emails/history'),
  markSent: (id: string) =>
    fetchAPI(`/emails/${id}/sent`, { method: 'PUT' }),
};

export const followUpAPI = {
  analyze: (content: string) =>
    fetchAPI('/follow-up/analyze', { method: 'POST', body: JSON.stringify({ content }) }),
  getPending: () => fetchAPI('/follow-up/pending'),
  complete: (id: string) =>
    fetchAPI(`/follow-up/${id}/complete`, { method: 'PUT' }),
};

export const pricingAPI = {
  calculate: (data: Record<string, unknown>) =>
    fetchAPI('/pricing/calculate', { method: 'POST', body: JSON.stringify(data) }),
  getExchangeRates: () => fetchAPI('/pricing/exchange-rates'),
};

export const marketAPI = {
  getIntelligence: () => fetchAPI('/market/intelligence'),
  getTrends: (product: string) => fetchAPI(`/market/trends/${product}`),
};

export const supplierAPI = {
  getAll: () => fetchAPI('/suppliers'),
  getById: (id: string) => fetchAPI(`/suppliers/${id}`),
  create: (data: Record<string, unknown>) =>
    fetchAPI('/suppliers', { method: 'POST', body: JSON.stringify(data) }),
};

export const scraperAPI = {
  start: (config: Record<string, unknown>) =>
    fetchAPI('/scraper/start', { method: 'POST', body: JSON.stringify(config) }),
  getStatus: (taskId: string) => fetchAPI(`/scraper/status/${taskId}`),
  getResults: (taskId: string) => fetchAPI(`/scraper/results/${taskId}`),
};

export const logisticsAPI = {
  track: (trackingNumber: string) => fetchAPI(`/logistics/track/${trackingNumber}`),
  getShipments: () => fetchAPI('/logistics/shipments'),
};

export const telegramAPI = {
  getStatus: () => fetchAPI('/telegram/status'),
  sendMessage: (chatId: string, message: string) =>
    fetchAPI('/telegram/send', { method: 'POST', body: JSON.stringify({ chatId, message }) }),
};

export const inquiryAPI = {
  getAll: () => fetchAPI('/inquiries'),
  getById: (id: string) => fetchAPI(`/inquiries/${id}`),
  respond: (id: string, response: string) =>
    fetchAPI(`/inquiries/${id}/respond`, { method: 'POST', body: JSON.stringify({ response }) }),
};

export const gridBotAPI = {
  list: () => fetchAPI('/grid-bot'),
  create: (data: { symbol?: string; lower_price: number; upper_price: number; grid_count: number; investment_per_grid: number }) =>
    fetchAPI('/grid-bot', { method: 'POST', body: JSON.stringify(data) }),
  getById: (id: number) => fetchAPI(`/grid-bot/${id}`),
  start: (id: number) => fetchAPI(`/grid-bot/${id}/start`, { method: 'POST' }),
  stop: (id: number) => fetchAPI(`/grid-bot/${id}/stop`, { method: 'POST' }),
  delete: (id: number) => fetchAPI(`/grid-bot/${id}`, { method: 'DELETE' }),
  getOrders: (id: number, status?: string) => {
    const query = status ? `?status=${status}` : '';
    return fetchAPI(`/grid-bot/${id}/orders${query}`);
  },
  getSnapshots: (id: number) => fetchAPI(`/grid-bot/${id}/snapshots`),
  tick: (id: number) => fetchAPI(`/grid-bot/${id}/tick`, { method: 'POST' }),
};
