'use client';

import { useState, useEffect, useCallback } from 'react';
import { gridBotAPI } from '@/lib/api';

interface Bot {
  id: number;
  symbol: string;
  lower_price: number;
  upper_price: number;
  grid_count: number;
  investment_per_grid: number;
  total_investment: number;
  status: string;
  current_price: number;
  realized_pnl: number;
  unrealized_pnl: number;
  total_trades: number;
  created_at: string;
}

interface Order {
  id: number;
  side: string;
  price: number;
  quantity: number;
  status: string;
  grid_level: number;
  filled_at: string | null;
  created_at: string;
}

export default function GridBotPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [activeBot, setActiveBot] = useState<Bot | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    lower_price: '60000',
    upper_price: '70000',
    grid_count: '10',
    investment_per_grid: '100',
  });

  const loadBots = useCallback(async () => {
    try {
      const data = await gridBotAPI.list();
      setBots(data);
      if (data.length > 0 && !activeBot) {
        setActiveBot(data[0]);
      }
    } catch {
      // backend not available
    }
  }, [activeBot]);

  const loadOrders = useCallback(async () => {
    if (!activeBot) return;
    try {
      const data = await gridBotAPI.getOrders(activeBot.id);
      setOrders(data);
    } catch {
      // ignore
    }
  }, [activeBot]);

  const refreshActiveBot = useCallback(async () => {
    if (!activeBot) return;
    try {
      const bot = await gridBotAPI.getById(activeBot.id);
      setActiveBot(bot);
      setBots(prev => prev.map(b => b.id === bot.id ? bot : b));
    } catch {
      // ignore
    }
  }, [activeBot]);

  useEffect(() => {
    loadBots();
  }, []);

  useEffect(() => {
    loadOrders();
  }, [activeBot?.id, activeBot?.total_trades]);

  useEffect(() => {
    if (!activeBot || activeBot.status !== 'running') return;
    const interval = setInterval(() => {
      refreshActiveBot();
      loadOrders();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBot?.id, activeBot?.status]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const bot = await gridBotAPI.create({
        symbol: 'BTC/USDT',
        lower_price: parseFloat(form.lower_price),
        upper_price: parseFloat(form.upper_price),
        grid_count: parseInt(form.grid_count),
        investment_per_grid: parseFloat(form.investment_per_grid),
      });
      setBots(prev => [bot, ...prev]);
      setActiveBot(bot);
    } catch {
      alert('创建失败，请检查后端是否启动');
    } finally {
      setCreating(false);
    }
  };

  const handleStart = async () => {
    if (!activeBot) return;
    setLoading(true);
    try {
      await gridBotAPI.start(activeBot.id);
      await refreshActiveBot();
      await loadOrders();
    } catch {
      alert('启动失败');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    if (!activeBot) return;
    setLoading(true);
    try {
      await gridBotAPI.stop(activeBot.id);
      await refreshActiveBot();
    } catch {
      alert('停止失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTick = async () => {
    if (!activeBot) return;
    try {
      await gridBotAPI.tick(activeBot.id);
      await refreshActiveBot();
      await loadOrders();
    } catch {
      alert('Tick 失败');
    }
  };

  const handleDelete = async () => {
    if (!activeBot) return;
    if (!confirm('确定删除此 Bot？')) return;
    try {
      await gridBotAPI.delete(activeBot.id);
      setBots(prev => prev.filter(b => b.id !== activeBot.id));
      setActiveBot(null);
      setOrders([]);
    } catch {
      alert('删除失败');
    }
  };

  const gridStep = activeBot
    ? (activeBot.upper_price - activeBot.lower_price) / activeBot.grid_count
    : 0;

  const pnlPercent = activeBot && activeBot.total_investment > 0
    ? ((activeBot.realized_pnl + activeBot.unrealized_pnl) / activeBot.total_investment * 100).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">网格交易 Bot</h1>
          <p className="text-sm text-gray-500 mt-1">模拟盘 · BTC/USDT · 自动低买高卖</p>
        </div>
      </div>

      {/* 创建 Bot */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">创建新 Bot</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">价格下限 (USDT)</label>
            <input
              type="number"
              value={form.lower_price}
              onChange={e => setForm(prev => ({ ...prev, lower_price: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">价格上限 (USDT)</label>
            <input
              type="number"
              value={form.upper_price}
              onChange={e => setForm(prev => ({ ...prev, upper_price: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">网格数量</label>
            <input
              type="number"
              value={form.grid_count}
              onChange={e => setForm(prev => ({ ...prev, grid_count: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">每格投入 (USDT)</label>
            <input
              type="number"
              value={form.investment_per_grid}
              onChange={e => setForm(prev => ({ ...prev, investment_per_grid: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleCreate}
            disabled={creating}
            className="px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {creating ? '创建中...' : '创建 Bot'}
          </button>
          <span className="text-sm text-gray-500">
            总投入: {(parseFloat(form.investment_per_grid || '0') * parseInt(form.grid_count || '0')).toLocaleString()} USDT
            · 每格价差: {((parseFloat(form.upper_price || '0') - parseFloat(form.lower_price || '0')) / parseInt(form.grid_count || '1')).toFixed(2)} USDT
          </span>
        </div>
      </div>

      {/* Bot 列表 & 选择 */}
      {bots.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {bots.map(bot => (
            <button
              key={bot.id}
              onClick={() => setActiveBot(bot)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeBot?.id === bot.id
                  ? 'bg-[#1e3a5f] text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Bot #{bot.id} · {bot.symbol}
              <span className={`ml-2 inline-block w-2 h-2 rounded-full ${
                bot.status === 'running' ? 'bg-green-400' : bot.status === 'stopped' ? 'bg-red-400' : 'bg-gray-400'
              }`} />
            </button>
          ))}
        </div>
      )}

      {activeBot && (
        <>
          {/* 操作栏 */}
          <div className="flex items-center gap-3">
            {activeBot.status === 'idle' && (
              <button
                onClick={handleStart}
                disabled={loading}
                className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                启动 Bot
              </button>
            )}
            {activeBot.status === 'running' && (
              <>
                <button
                  onClick={handleStop}
                  disabled={loading}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  停止 Bot
                </button>
                <button
                  onClick={handleTick}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  手动 Tick
                </button>
                <span className="flex items-center gap-2 text-sm text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  运行中 · 每 5 秒自动 Tick
                </span>
              </>
            )}
            {activeBot.status === 'stopped' && (
              <span className="text-sm text-gray-500">Bot 已停止</span>
            )}
            <div className="flex-1" />
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              删除
            </button>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              label="当前价格"
              value={`$${activeBot.current_price.toLocaleString()}`}
              sub={`区间: $${activeBot.lower_price.toLocaleString()} - $${activeBot.upper_price.toLocaleString()}`}
            />
            <StatCard
              label="总投入"
              value={`$${activeBot.total_investment.toLocaleString()}`}
              sub={`${activeBot.grid_count} 格 × $${activeBot.investment_per_grid}`}
            />
            <StatCard
              label="已实现收益"
              value={`$${activeBot.realized_pnl.toFixed(2)}`}
              sub={`${activeBot.total_trades} 笔成交`}
              positive={activeBot.realized_pnl >= 0}
            />
            <StatCard
              label="未实现收益"
              value={`$${activeBot.unrealized_pnl.toFixed(2)}`}
              sub="浮动盈亏"
              positive={activeBot.unrealized_pnl >= 0}
            />
            <StatCard
              label="总收益率"
              value={`${pnlPercent}%`}
              sub={`$${(activeBot.realized_pnl + activeBot.unrealized_pnl).toFixed(2)}`}
              positive={parseFloat(pnlPercent) >= 0}
            />
          </div>

          {/* 网格可视化 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">网格分布</h2>
            <div className="relative h-64 flex items-end gap-1">
              {Array.from({ length: activeBot.grid_count + 1 }, (_, i) => {
                const price = activeBot.lower_price + i * gridStep;
                const isCurrentLevel = Math.abs(price - activeBot.current_price) < gridStep * 0.5;
                const pendingOrder = orders.find(
                  o => o.grid_level === i && o.status === 'pending'
                );
                const height = ((i + 1) / (activeBot.grid_count + 1)) * 100;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div
                      className={`w-full rounded-t transition-all ${
                        isCurrentLevel
                          ? 'bg-orange-500'
                          : pendingOrder?.side === 'buy'
                            ? 'bg-green-400'
                            : pendingOrder?.side === 'sell'
                              ? 'bg-red-400'
                              : 'bg-gray-200'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[10px] text-gray-500 mt-1 truncate w-full text-center">
                      {price >= 1000 ? `${(price / 1000).toFixed(1)}k` : price.toFixed(0)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-6 mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-400" /> 买单</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-400" /> 卖单</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-500" /> 当前价格</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-200" /> 无挂单</span>
            </div>
          </div>

          {/* 订单列表 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              订单记录
              <span className="text-sm font-normal text-gray-500 ml-2">共 {orders.length} 条</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 font-medium text-gray-500">时间</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">方向</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">价格</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">数量 (BTC)</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">金额 (USDT)</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-500">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 50).map(order => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-2 text-gray-600">
                        {order.filled_at
                          ? new Date(order.filled_at).toLocaleTimeString('zh-CN')
                          : new Date(order.created_at).toLocaleTimeString('zh-CN')}
                      </td>
                      <td className="py-2.5 px-2">
                        <span className={`font-medium ${order.side === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                          {order.side === 'buy' ? '买入' : '卖出'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono">${order.price.toLocaleString()}</td>
                      <td className="py-2.5 px-2 text-right font-mono">{order.quantity.toFixed(6)}</td>
                      <td className="py-2.5 px-2 text-right font-mono">${(order.price * order.quantity).toFixed(2)}</td>
                      <td className="py-2.5 px-2 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'filled'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-600'
                        }`}>
                          {order.status === 'filled' ? '已成交' : order.status === 'pending' ? '挂单中' : '已取消'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <p className="text-center text-gray-400 py-8">暂无订单，启动 Bot 后将自动生成网格订单</p>
              )}
            </div>
          </div>
        </>
      )}

      {bots.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">还没有 Bot</p>
          <p className="text-sm mt-1">在上方配置参数，创建你的第一个网格交易 Bot</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, positive }: {
  label: string;
  value: string;
  sub: string;
  positive?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-xl font-bold mt-1 ${
        positive === undefined ? 'text-gray-900' : positive ? 'text-green-600' : 'text-red-600'
      }`}>
        {value}
      </p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}
