import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Radio,
  Cpu,
  User,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Ban,
  Activity,
  Network,
} from 'lucide-react';
import { KpiCards } from '../components/KpiCards';
import { DemoScenariosBar } from '../components/DemoScenariosBar';
import { TransactionTable } from '../components/TransactionTable';
import {
  DashboardStats,
  Transaction,
  FraudAlert,
  DigitalTrustProfile,
} from '../types';
import { DEMO_SCENARIOS } from '../data/demoData';

interface DashboardPageProps {
  stats: DashboardStats;
  transactions: Transaction[];
  alerts: FraudAlert[];
  customers: DigitalTrustProfile[];
  onSelectTransaction: (txn: Transaction) => void;
  onSelectScenario: (scenario: typeof DEMO_SCENARIOS[0]) => void;
  onNavigateToSimulator: () => void;
  onNavigateToCustomers: () => void;
  onNavigateToGraph: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stats,
  transactions,
  alerts,
  customers,
  onSelectTransaction,
  onSelectScenario,
  onNavigateToSimulator,
  onNavigateToCustomers,
  onNavigateToGraph,
}) => {
  // Identify highest risk item for the "WHO / WHAT / WHY" 30-second jury banner
  const highestRiskTxn = [...transactions].sort((a, b) => b.riskScore - a.riskScore)[0] || transactions[0];

  return (
    <div className="space-y-6 pb-12">
      {/* 30-Second Jury Overview: Critical Incident Threat Vector Banner */}
      {highestRiskTxn && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/40 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 mt-1 shrink-0">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-cyber font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                    ACTIVE HIGH-SEVERITY THREAT INTERCEPT
                  </span>
                  <span className="text-xs font-mono-cyber text-slate-400">
                    ID: <strong className="text-white">{highestRiskTxn.id}</strong> &bull; {highestRiskTxn.timeAgo}
                  </span>
                </div>

                <h2 className="font-display font-bold text-base sm:text-lg text-white">
                  Suspicious Outflow Attempt: ₹{highestRiskTxn.amount.toLocaleString()} ({highestRiskTxn.transactionType})
                </h2>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                  <span><strong>WHO:</strong> {highestRiskTxn.customerName}</span>
                  <span><strong>COUNTERPARTY:</strong> {highestRiskTxn.beneficiary}</span>
                  <span><strong>LOCATION:</strong> {highestRiskTxn.location}</span>
                  <span>
                    <strong>FRAUD FUSION SCORE:</strong>{' '}
                    <span className="font-mono-cyber font-bold text-rose-400">
                      {highestRiskTxn.riskScore}/100
                    </span>
                  </span>
                  <span>
                    <strong>DECISION:</strong>{' '}
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-cyber font-bold bg-rose-900/60 text-rose-300 border border-rose-700/60">
                      {highestRiskTxn.decision}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
              <button
                onClick={() => onSelectTransaction(highestRiskTxn)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono-cyber font-bold text-xs transition-all shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <span>OPEN INVESTIGATION</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <KpiCards stats={stats} />

      {/* Hackathon Demo Scenarios Trigger Bar */}
      <DemoScenariosBar onSelectScenario={onSelectScenario} />

      {/* Main Command Center Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Real-time Transaction Table (8 cols) */}
        <div className="xl:col-span-8 space-y-6">
          <TransactionTable
            transactions={transactions}
            onSelectTransaction={onSelectTransaction}
            limit={8}
          />
        </div>

        {/* Right Rail: Active Alerts & Digital Trust Profile highlights (4 cols) */}
        <div className="xl:col-span-4 space-y-6">
          {/* Active Alerts Panel */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="text-xs font-mono-cyber font-bold tracking-wider text-slate-200 uppercase">
                  ACTIVE FRAUD ALERTS
                </h3>
              </div>
              <span className="text-[10px] font-mono-cyber text-slate-500">
                {alerts.filter((a) => a.status === 'OPEN').length} OPEN
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {alerts.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-display font-semibold text-slate-100 text-xs">
                      {alert.title}
                    </div>
                    <span
                      className={`text-[9px] font-mono-cyber font-bold px-1.5 py-0.5 rounded ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-700/80'
                          : alert.severity === 'HIGH'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-700/80'
                          : 'bg-blue-950/80 text-blue-300 border border-blue-700/80'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {alert.reason}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono-cyber text-slate-500 mt-2 pt-1.5 border-t border-slate-900">
                    <span>{alert.customerName}</span>
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Trust Profile Spotlight */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-xs font-mono-cyber font-bold tracking-wider text-slate-200 uppercase flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                DIGITAL TRUST SPOTLIGHT
              </h3>
              <button
                onClick={onNavigateToCustomers}
                className="text-[11px] font-mono-cyber text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                View All &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {customers.slice(0, 3).map((cust) => (
                <div
                  key={cust.customerId}
                  onClick={onNavigateToCustomers}
                  className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-xs text-white">{cust.customerName}</div>
                    <div className="text-[10px] text-slate-500">{cust.knownDevices[0]}</div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono-cyber font-bold text-xs text-cyan-400">
                      {cust.overallTrustScore} / 100
                    </div>
                    <div className="text-[9px] font-mono-cyber text-emerald-400">
                      {cust.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Fraud Graph Link */}
          <div
            onClick={onNavigateToGraph}
            className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/30 hover:border-cyan-500/60 transition-all cursor-pointer shadow-sm group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-400" />
                <h4 className="font-display font-bold text-xs text-white">
                  FRAUD INTELLIGENCE GRAPH
                </h4>
              </div>
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Explore live relational nodes mapping customer accounts, hardware emulators, IP relays, and illicit money mule syndicates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
