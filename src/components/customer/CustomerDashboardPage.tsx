import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Send,
  UserPlus,
  History,
  Shield,
  ArrowUpRight,
  ArrowDownLeft,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Ban,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Lock,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import {
  Transaction,
  DigitalTrustProfile,
  Device,
  Beneficiary,
  NavigationTab,
  User,
} from '../../types';

interface CustomerDashboardPageProps {
  currentUser: User;
  customerProfile: DigitalTrustProfile;
  transactions: Transaction[];
  devices: Device[];
  beneficiaries: Beneficiary[];
  balance: number;
  availableBalance: number;
  setActiveTab: (tab: NavigationTab) => void;
  onInspectTransaction: (txn: Transaction) => void;
  onQuickTransfer: () => void;
}

export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({
  currentUser,
  customerProfile,
  transactions,
  devices,
  beneficiaries,
  balance,
  availableBalance,
  setActiveTab,
  onInspectTransaction,
  onQuickTransfer,
}) => {
  // Determine greeting based on current local hour
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Filter transactions for this customer (or demo transactions if fresh)
  const customerTxns = transactions.slice(0, 5);

  const trustScore = customerProfile.overallTrustScore;
  const isHighTrust = trustScore >= 80;
  const isMediumTrust = trustScore >= 60 && trustScore < 80;

  const trustLabel = isHighTrust
    ? 'OPTIMAL DIGITAL TRUST'
    : isMediumTrust
    ? 'ELEVATED MONITORING'
    : 'HIGH FRAUD SUSPICION';

  const trustColor = isHighTrust
    ? 'text-emerald-400'
    : isMediumTrust
    ? 'text-amber-400'
    : 'text-rose-400';

  const trustRingColor = isHighTrust
    ? '#10b981'
    : isMediumTrust
    ? '#f59e0b'
    : '#ef4444';

  // Dynamic explanation
  const trustExplanation = isHighTrust
    ? 'Continuous biometric patterns, verified mobile hardware, and stable geographic location confirm authentic account ownership.'
    : isMediumTrust
    ? 'Trust score impacted by a new hardware client and atypical transaction window. Stepped-up verification active.'
    : 'Multiple anomalous signals detected including proxy connection and high-velocity outflow attempts.';

  const signals = customerProfile.trustSignals;

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Welcome Banner & Quick Identity Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#091120] border border-slate-800/90 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-xs font-mono-cyber text-slate-400 flex items-center gap-2">
            <span>{greeting},</span>
            <span className="text-emerald-400 font-semibold">{currentUser.name}</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
              {currentUser.accountType || 'Savings Account'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
            TrustShield AI Digital Banking
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Account <span className="font-mono-cyber text-slate-200">{currentUser.accountNumber || 'TSB-4089-2291-7840'}</span> is continuously protected by 7-vector neural fraud detection.
          </p>
        </div>

        {/* Real-time Security State Chip */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="text-left">
              <div className="text-[10px] font-mono-cyber uppercase text-slate-400">Continuous Shield</div>
              <div className="text-xs font-mono-cyber font-bold text-emerald-400">ACTIVE &amp; MONITORING</div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Balances & Digital Trust Radial Score Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Account Balances & Quick Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Balances Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0b1426] via-[#091120] to-[#070d18] border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <span className="text-xs font-mono-cyber uppercase tracking-wider text-slate-400">
                Total Financial Assets
              </span>
              <span className="text-xs font-mono-cyber text-emerald-400 font-medium">
                Verified Indian Rupee (INR)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5">
              {/* Total Balance */}
              <div>
                <span className="text-xs font-mono-cyber text-slate-400">Current Ledger Balance</span>
                <div className="text-3xl sm:text-4xl font-display font-bold text-white mt-1 tracking-tight">
                  ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono-cyber text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+₹12,400 incoming deposits this month</span>
                </div>
              </div>

              {/* Available Balance (Accounting for Holds) */}
              <div className="sm:border-l sm:border-slate-800/80 sm:pl-6">
                <span className="text-xs font-mono-cyber text-slate-400">Available to Spend</span>
                <div className="text-2xl sm:text-3xl font-display font-bold text-slate-200 mt-1">
                  ₹{availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                {balance > availableBalance ? (
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono-cyber text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>₹{(balance - availableBalance).toLocaleString('en-IN')} held under security review</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono-cyber text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Zero holds active on account</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="mt-8 pt-5 border-t border-slate-800/80">
              <span className="block text-[11px] font-mono-cyber uppercase tracking-wider text-slate-400 mb-3">
                Quick Banking Actions
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={onQuickTransfer}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 transition-all cursor-pointer shadow-sm group"
                >
                  <Send className="w-5 h-5 mb-1.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  <span className="text-xs font-display font-bold">SEND MONEY</span>
                  <span className="text-[9px] font-mono-cyber text-slate-400">UPI / IMPS / NEFT</span>
                </button>

                <button
                  onClick={() => setActiveTab('customer-beneficiaries')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-200 transition-all cursor-pointer"
                >
                  <UserPlus className="w-5 h-5 mb-1.5 text-cyan-400" />
                  <span className="text-xs font-display font-bold">BENEFICIARY</span>
                  <span className="text-[9px] font-mono-cyber text-slate-400">Manage Payees</span>
                </button>

                <button
                  onClick={() => setActiveTab('customer-transactions')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-200 transition-all cursor-pointer"
                >
                  <History className="w-5 h-5 mb-1.5 text-blue-400" />
                  <span className="text-xs font-display font-bold">HISTORY</span>
                  <span className="text-[9px] font-mono-cyber text-slate-400">Filter &amp; Export</span>
                </button>

                <button
                  onClick={() => setActiveTab('customer-security')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-200 transition-all cursor-pointer"
                >
                  <Shield className="w-5 h-5 mb-1.5 text-purple-400" />
                  <span className="text-xs font-display font-bold">SECURITY</span>
                  <span className="text-[9px] font-mono-cyber text-slate-400">Devices &amp; Alerts</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Transfer Beneficiaries Shortcut */}
          <div className="p-4 rounded-xl bg-[#091120] border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono-cyber uppercase tracking-wider text-slate-400">
                Verified Frequent Payees
              </span>
              <button
                onClick={() => setActiveTab('customer-beneficiaries')}
                className="text-[11px] font-mono-cyber text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({beneficiaries.length})</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {beneficiaries.slice(0, 4).map((b) => (
                <div
                  key={b.id}
                  onClick={onQuickTransfer}
                  className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/50 cursor-pointer transition-all text-left group"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 flex items-center justify-center text-[10px] font-bold mb-1.5">
                    {b.name.charAt(0)}
                  </div>
                  <div className="text-xs font-medium text-slate-200 truncate group-hover:text-emerald-300">
                    {b.name}
                  </div>
                  <div className="text-[10px] font-mono-cyber text-slate-500 truncate">
                    {b.bank}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Digital Trust Score Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-2xl bg-[#091120] border border-slate-800 shadow-xl space-y-5 h-full flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono-cyber uppercase font-bold text-white tracking-wider">
                    Digital Trust Score
                  </span>
                </div>
                <span className="text-[11px] font-mono-cyber text-slate-400">
                  AI Evaluated Real-Time
                </span>
              </div>

              {/* Radial Progress Ring & Main Metric */}
              <div className="flex flex-col sm:flex-row items-center gap-6 my-4">
                <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#1e293b"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={trustRingColor}
                      strokeWidth="8"
                      strokeDasharray={`${(trustScore / 100) * 251.2} 251.2`}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-display font-bold text-white">
                      {trustScore}
                    </span>
                    <span className="text-[10px] font-mono-cyber text-slate-400">/ 100</span>
                  </div>
                </div>

                <div className="text-center sm:text-left space-y-1.5">
                  <div className={`text-xs font-mono-cyber font-bold tracking-wider ${trustColor}`}>
                    {trustLabel}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono-cyber bg-emerald-950/60 border border-emerald-800/60 text-emerald-300">
                    <TrendingUp className="w-3 h-3" />
                    <span>+2.4 pts from 30-day baseline</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {trustExplanation}
                  </p>
                </div>
              </div>

              {/* 6 Trust Sub-Scores Breakdown */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2.5">
                <span className="block text-[10px] font-mono-cyber uppercase tracking-wider text-slate-400">
                  Trust Vectors Breakdown
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono-cyber">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Identity Trust</span>
                    <span className="font-bold text-emerald-400">{signals.identityTrust}%</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Device Trust</span>
                    <span className={`font-bold ${signals.deviceTrust > 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {signals.deviceTrust}%
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Behavior Trust</span>
                    <span className="font-bold text-emerald-400">{signals.behaviorTrust}%</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Location Trust</span>
                    <span className="font-bold text-emerald-400">{signals.locationTrust}%</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Transaction Trust</span>
                    <span className="font-bold text-emerald-400">{signals.transactionTrust}%</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Beneficiary Trust</span>
                    <span className="font-bold text-emerald-400">{signals.networkTrust || 85}%</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('customer-security')}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-mono-cyber text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>EXPLORE FULL SECURITY PROFILE</span>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity & Transactions */}
      <div className="p-6 rounded-2xl bg-[#091120] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-display font-bold text-white">Recent Account Transactions</h2>
            <p className="text-xs text-slate-400">
              Every payment passes through autonomous risk analysis before settlement.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('customer-transactions')}
            className="text-xs font-mono-cyber text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Statements</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {customerTxns.map((txn) => {
            const isHold = txn.decision === 'HOLD';
            const isBlock = txn.decision === 'BLOCK';
            const isVerify = txn.decision === 'VERIFY';

            return (
              <div
                key={txn.id}
                onClick={() => onInspectTransaction(txn)}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 px-3 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isBlock
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : isHold
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : isVerify
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}
                  >
                    {isBlock ? (
                      <Ban className="w-4 h-4" />
                    ) : isHold ? (
                      <Clock className="w-4 h-4" />
                    ) : isVerify ? (
                      <ShieldAlert className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-medium text-white flex items-center gap-2">
                      <span>{txn.beneficiary}</span>
                      <span className="text-[10px] font-mono-cyber text-slate-400 px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800">
                        {txn.transactionType}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono-cyber text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{txn.timestamp}</span>
                      <span>•</span>
                      <span>{txn.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <div className="text-xs font-mono-cyber font-bold text-white">
                      -₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] font-mono-cyber text-slate-400">
                      Risk Score: <span className={txn.riskScore > 60 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{txn.riskScore}/100</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-[10px] font-mono-cyber font-bold rounded-lg border uppercase ${
                      isBlock
                        ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                        : isHold
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                        : isVerify
                        ? 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                        : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {txn.decision}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
