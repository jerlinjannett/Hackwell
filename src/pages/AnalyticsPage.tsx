import React from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Zap,
  Activity,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  ANALYTICS_FRAUD_TREND,
  ANALYTICS_CHANNEL_DISTRIBUTION,
  ANALYTICS_RISK_DISTRIBUTION,
  ANALYTICS_TOP_FRAUD_FACTORS,
} from '../data/demoData';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-display font-bold text-white tracking-wide">
              Fraud Analytics &amp; Risk Intelligence Trends
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Macro-level portfolio risk telemetry, channel fraud densities, and financial loss prevention metrics.
          </p>
        </div>
      </div>

      {/* Financial Loss Prevented & Performance Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <span className="text-[11px] font-mono-cyber uppercase text-slate-400">
            Fraud Losses Prevented
          </span>
          <div className="text-2xl font-mono-cyber font-bold text-emerald-400 mt-1">
            ₹4,28,45,000
          </div>
          <span className="text-[10px] text-emerald-500 font-mono-cyber">
            +₹32,50,000 this week (100% saved)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <span className="text-[11px] font-mono-cyber uppercase text-slate-400">
            Average Decision Latency
          </span>
          <div className="text-2xl font-mono-cyber font-bold text-cyan-400 mt-1">
            18.4 ms
          </div>
          <span className="text-[10px] text-slate-400 font-mono-cyber">
            Sub-second pre-authorization
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <span className="text-[11px] font-mono-cyber uppercase text-slate-400">
            False Positive Rate
          </span>
          <div className="text-2xl font-mono-cyber font-bold text-white mt-1">
            0.12%
          </div>
          <span className="text-[10px] text-cyan-400 font-mono-cyber">
            Industry Benchmark: ~1.5%
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
          <span className="text-[11px] font-mono-cyber uppercase text-slate-400">
            Stepped-Up OTP Success
          </span>
          <div className="text-2xl font-mono-cyber font-bold text-white mt-1">
            94.8%
          </div>
          <span className="text-[10px] text-emerald-400 font-mono-cyber">
            Frictionless genuine user bypass
          </span>
        </div>
      </div>

      {/* Row 1: Fraud Volume Trend over Time (Area Chart) */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xs font-mono-cyber font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            TRANSACTION INGESTION VS FRAUD ATTEMPTS OVER TIME (LAST 7 DAYS)
          </h2>
          <span className="text-[10px] font-mono-cyber text-slate-400">HOURLY BATCH TELEMETRY</span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ANALYTICS_FRAUD_TREND}>
              <defs>
                <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="fraudColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" />
              <YAxis stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090f1d',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  fontFamily: 'JetBrains Mono',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingTop: '10px' }}
              />
              <Area
                type="monotone"
                dataKey="total"
                name="Total Transactions"
                stroke="#0ea5e9"
                fillOpacity={1}
                fill="url(#totalColor)"
              />
              <Area
                type="monotone"
                dataKey="fraud"
                name="Flagged / Intercepted"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#fraudColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Two Columns: Channel Distribution + Risk Level Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Distribution Bar Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono-cyber font-bold text-slate-200 uppercase tracking-wider">
              FRAUD ATTEMPTS BY PAYMENT CHANNEL
            </h3>
            <span className="text-[10px] font-mono-cyber text-slate-400">CHANNEL RISK</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_CHANNEL_DISTRIBUTION}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="channel" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090f1d',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono',
                  }}
                />
                <Bar dataKey="frauds" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Flagged Fraud" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono-cyber font-bold text-slate-200 uppercase tracking-wider">
              DECISION RISK LEVEL DISTRIBUTION
            </h3>
            <span className="text-[10px] font-mono-cyber text-slate-400">PORTFOLIO SPREAD</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ANALYTICS_RISK_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {ANALYTICS_RISK_DISTRIBUTION.map((entry: { name: string; value: number; color: string }, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090f1d',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    fontFamily: 'JetBrains Mono',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Top Fraud Factors (Horizontal Bar) */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-mono-cyber font-bold text-slate-200 uppercase tracking-wider">
            PRIMARY ATTRIBUTION DRIVERS (TOP FRAUD FACTORS DETECTED)
          </h3>
          <span className="text-[10px] font-mono-cyber text-slate-400">AI EXPLAINABILITY FREQUENCY</span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={ANALYTICS_TOP_FRAUD_FACTORS}
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" />
              <YAxis
                dataKey="factor"
                type="category"
                stroke="#94a3b8"
                fontSize={11}
                fontFamily="JetBrains Mono"
                width={130}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090f1d',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  fontFamily: 'JetBrains Mono',
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} name="Incidents Flagged" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
