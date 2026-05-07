# SL Trade Platform

AI 驱动的外贸管理平台 + 加密货币网格交易模拟系统。

## 项目结构

```
sl-trade/
├── app/                    # Next.js 前端页面
│   ├── page.tsx            # 官网首页
│   ├── products/           # 产品展示页
│   ├── about/              # 关于我们
│   ├── contact/            # 联系我们（询盘表单）
│   └── dashboard/          # 后台管理面板
│       ├── page.tsx        # 仪表盘概览
│       └── grid-bot/       # 网格交易 Bot
├── components/             # 前端公共组件
├── lib/api.ts              # 后端 API 客户端封装
├── data/products.ts        # 产品静态数据
├── backend/                # Python FastAPI 后端
│   ├── app/
│   │   ├── main.py         # FastAPI 入口
│   │   ├── config.py       # 环境变量配置
│   │   ├── database.py     # SQLAlchemy 数据库连接
│   │   ├── models/         # 数据模型（ORM）
│   │   ├── api/            # API 路由
│   │   └── services/       # 业务逻辑服务
│   ├── requirements.txt    # Python 依赖
│   └── trade.db            # SQLite 数据库文件
└── package.json            # Node.js 依赖
```

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 |
| 后端 | Python FastAPI + SQLAlchemy + Pydantic |
| 数据库 | SQLite |
| AI | Anthropic Claude API（可选，无 Key 时有 Mock 兜底） |

## 快速启动

### 1. 启动后端（端口 8000）

```bash
cd backend
python3 -m venv venv            # 首次需要创建虚拟环境
source venv/bin/activate       # 激活虚拟环境（Windows: venv\Scripts\activate）
pip install -r requirements.txt  # 首次需要安装依赖
uvicorn app.main:app --reload
```

启动后访问：
- API 文档：http://localhost:8000/docs
- 健康检查：http://localhost:8000/api/health

### 2. 启动前端（端口 3000）

```bash
npm install    # 首次需要安装依赖
npm run dev
```

启动后访问：
- 官网首页：http://localhost:3000
- 后台管理：http://localhost:3000/dashboard
- 网格交易：http://localhost:3000/dashboard/grid-bot

### 3. 环境变量（可选）

在 `backend/` 目录下创建 `.env` 文件：

```env
ANTHROPIC_API_KEY=sk-ant-xxx   # Claude API Key，不配置则使用 Mock 响应
TELEGRAM_BOT_TOKEN=xxx         # Telegram Bot Token，不配置则使用 Mock
```

## 功能模块

### 官网（公开页面）

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `/` | 公司介绍、产品分类、优势展示 |
| 产品中心 | `/products` | PP/PE/PVC 等塑料原料产品目录，支持分类筛选 |
| 关于我们 | `/about` | 公司信息 |
| 联系我们 | `/contact` | 询盘表单 |

### 后台管理（Dashboard）

| 模块 | 路径 | 说明 | 后端接口 |
|------|------|------|----------|
| 仪表盘 | `/dashboard` | 数据概览、快速操作入口 | - |
| 客户管理 | `/dashboard/customers` | 客户 CRUD + AI 意向评分 | `/api/customers` |
| AI 邮件 | `/dashboard/emails` | AI 生成多语言冷启动邮件 | `/api/emails` |
| 跟进助手 | `/dashboard/follow-up` | AI 分析邮件情感 + 生成回复建议 | `/api/follow-up` |
| 价格计算 | `/dashboard/pricing` | FOB/CIF 报价计算器 + 汇率 | `/api/pricing` |
| 市场情报 | `/dashboard/market` | 价格记录 + AI 趋势分析 | `/api/market` |
| 供应商 | `/dashboard/suppliers` | 供应商管理 + 报价对比 | `/api/suppliers` |
| 数据采集 | `/dashboard/scraper` | B2B 平台买家搜索 + CRM 导入 | `/api/scraper` |
| 物流追踪 | `/dashboard/logistics` | 货运跟踪 + 事件记录 | `/api/logistics` |
| Telegram Bot | `/dashboard/telegram` | Telegram 机器人管理 | `/api/telegram` |
| 询盘管理 | `/dashboard/inquiries` | 网站询盘处理 | `/api/inquiries` |
| **网格交易** | `/dashboard/grid-bot` | **加密货币网格交易模拟系统** | `/api/grid-bot` |

### 网格交易 Bot（详细说明）

模拟加密货币网格交易策略，用于学习量化交易基础。

**什么是网格交易：** 在一个价格区间内设置多个等距的买卖价位，价格下跌时自动买入，价格上涨时自动卖出，反复赚取每个网格的价差利润。

**使用流程：**
1. 在 `/dashboard/grid-bot` 页面配置参数（价格区间、网格数、每格投入金额）
2. 点击"创建 Bot"
3. 点击"启动"，Bot 会自动模拟 BTC 价格波动并执行网格策略
4. 观察实时价格、网格分布、订单成交、收益变化
5. 也可以点击"手动 Tick"加速观察价格变动

**当前为模拟盘**，使用随机游走 + 均值回归算法模拟价格，不连接真实交易所。
