import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Ban,
  Radio,
  Clock,
  Laptop,
  MapPin,
  Building2,
} from 'lucide-react';
import { Transaction, RiskLevel, SecurityDecision } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
  onSelectTransaction: (txn: Transaction) => void;
  title?: string;
  subtitle?: string;
  limit?: number;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onSelectTransaction,
  title = 'Real-Time Transaction Monitor',
  subtitle = 'Live adaptive telemetry stream with instant AI risk fusion classification',
  limit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [decisionFilter, setDecisionFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'timestamp' | 'amount' | 'riskScore'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((txn) => {
        const matchesSearch =
          txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          txn.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          txn.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          txn.beneficiary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          txn.device.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRisk = riskFilter === 'ALL' || txn.riskLevel === riskFilter;
        const matchesDecision = decisionFilter === 'ALL' || txn.decision === decisionFilter;

        return matchesSearch && matchesRisk && matchesDecision;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'timestamp') {
          diff = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        } else if (sortBy === 'amount') {
          diff = b.amount - a.amount;
        } else if (sortBy === 'riskScore') {
          diff = b.riskScore - a.riskScore;
        }
        return sortOrder === 'asc' ? -diff : diff;
      })
      .slice(0, limit || transactions.length);
  }, [transactions, searchQuery, riskFilter, decisionFilter, sortBy, sortOrder, limit]);

  const toggleSort = (field: 'timestamp' | 'amount' | 'riskScore') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getRiskBadge = (level: RiskLevel, score: number) => {
    switch (level) {
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono-cyber font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            LOW ({score})
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono-cyber font-semibold bg-cyan-950/60 text-cyan-400 border border-cyan-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            MEDIUM ({score})
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono-cyber font-semibold bg-amber-950/60 text-amber-400 border border-amber-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            HIGH ({score})
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono-cyber font-bold bg-rose-950/70 text-rose-400 border border-rose-800/80 shadow-sm shadow-rose-900/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
            CRITICAL ({score})
          </span>
        );
    }
  };

  const getDecisionBadge = (decision: SecurityDecision) => {
    switch (decision) {
      case 'ALLOW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono-cyber font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            ALLOW
          </span>
        );
      case 'VERIFY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono-cyber font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30">
            <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
            VERIFY
          </span>
        );
      case 'HOLD':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono-cyber font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            HOLD
          </span>
        );
      case 'BLOCK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono-cyber font-bold bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm">
            <Ban className="w-3 h-3 text-rose-400" />
            BLOCK
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-md overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 border-b border-slate-800/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-bold text-white tracking-wide">
                {title}
              </h2>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-cyber bg-cyan-950/60 text-cyan-400 border border-cyan-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                LIVE SOC STREAM
              </span>
            </div>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>

          <div className="text-xs font-mono-cyber text-slate-400">
            Showing <span className="text-slate-100 font-semibold">{filteredTransactions.length}</span> of{' '}
            <span className="text-slate-100 font-semibold">{transactions.length}</span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Search input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by ID, customer, location, device, payee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
            />
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
            <span className="text-slate-400 text-[11px] font-mono-cyber">Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Risks</option>
              <option value="LOW" className="bg-slate-900">Low (0-29)</option>
              <option value="MEDIUM" className="bg-slate-900">Medium (30-59)</option>
              <option value="HIGH" className="bg-slate-900">High (60-79)</option>
              <option value="CRITICAL" className="bg-slate-900">Critical (80-100)</option>
            </select>
          </div>

          {/* Decision Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
            <span className="text-slate-400 text-[11px] font-mono-cyber">Decision:</span>
            <select
              value={decisionFilter}
              onChange={(e) => setDecisionFilter(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Decisions</option>
              <option value="ALLOW" className="bg-slate-900">ALLOW</option>
              <option value="VERIFY" className="bg-slate-900">VERIFY</option>
              <option value="HOLD" className="bg-slate-900">HOLD</option>
              <option value="BLOCK" className="bg-slate-900">BLOCK</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-950/40 text-[11px] font-mono-cyber uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => toggleSort('amount')}>
                <div className="flex items-center gap-1">
                  <span>Amount</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Device</th>
              <th className="py-3 px-4">Beneficiary</th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => toggleSort('riskScore')}>
                <div className="flex items-center gap-1">
                  <span>Risk Score</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4">Decision</th>
              <th className="py-3 px-4 cursor-pointer select-none" onClick={() => toggleSort('timestamp')}>
                <div className="flex items-center gap-1">
                  <span>Time</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-xs">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-500">
                  No transactions match the selected filters.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn) => (
                <tr
                  key={txn.id}
                  onClick={() => onSelectTransaction(txn)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-mono-cyber font-medium text-cyan-300">
                    {txn.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-200">
                    <div>{txn.customerName}</div>
                    <div className="text-[10px] text-slate-500">{txn.transactionType}</div>
                  </td>
                  <td className="py-3 px-4 font-mono-cyber font-semibold text-white">
                    ₹{txn.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate max-w-[120px]">{txn.location}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Laptop className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate max-w-[120px]">{txn.device}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate max-w-[130px]">{txn.beneficiary}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {getRiskBadge(txn.riskLevel, txn.riskScore)}
                  </td>
                  <td className="py-3 px-4">
                    {getDecisionBadge(txn.decision)}
                  </td>
                  <td className="py-3 px-4 font-mono-cyber text-slate-400 text-[11px] whitespace-nowrap">
                    {txn.timeAgo || new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTransaction(txn);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Inspect Investigation Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
