import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  ArrowUpRight,
  ShieldAlert,
  Ban,
  Clock,
  CheckCircle2,
  FileText,
  Download,
  AlertOctagon,
  ExternalLink,
} from 'lucide-react';
import { Transaction, SecurityDecision } from '../../types';

interface CustomerTransactionsPageProps {
  transactions: Transaction[];
  onInspectTransaction: (txn: Transaction) => void;
  onOpenReportFraud: (txn?: Transaction) => void;
}

export const CustomerTransactionsPage: React.FC<CustomerTransactionsPageProps> = ({
  transactions,
  onInspectTransaction,
  onOpenReportFraud,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter((txn) => {
    // Filter status
    if (filterStatus === 'SUCCESSFUL' && txn.decision !== 'ALLOW' && txn.status !== 'COMPLETED') {
      return false;
    }
    if (filterStatus === 'VERIFIED' && !txn.otpVerified && txn.decision !== 'VERIFY') {
      return false;
    }
    if (filterStatus === 'HOLD' && txn.decision !== 'HOLD' && txn.status !== 'HOLD') {
      return false;
    }
    if (filterStatus === 'BLOCKED' && txn.decision !== 'BLOCK' && txn.status !== 'BLOCKED') {
      return false;
    }
    if (filterStatus === 'FAILED' && txn.status !== 'FAILED' && txn.status !== 'CANCELLED') {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        txn.id.toLowerCase().includes(q) ||
        txn.beneficiary.toLowerCase().includes(q) ||
        txn.transactionType.toLowerCase().includes(q) ||
        txn.location.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#091120] border border-slate-800">
        <div>
          <h1 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <span>Account Transaction History</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable transaction records with embedded AI risk scoring and compliance verification.
          </p>
        </div>

        <button
          onClick={() => onOpenReportFraud()}
          className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/80 text-rose-300 text-xs font-mono-cyber flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
          <span>Dispute or Report Fraud</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#091120] border border-slate-800">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, Payee, Rail, or Location..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono-cyber"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'SUCCESSFUL', 'VERIFIED', 'HOLD', 'BLOCKED', 'FAILED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono-cyber font-medium cursor-pointer transition-all ${
                filterStatus === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl bg-[#091120] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono-cyber text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Payment Rail</th>
                <th className="py-3 px-4 text-right">Amount (INR)</th>
                <th className="py-3 px-4 text-center">Risk Score</th>
                <th className="py-3 px-4 text-center">AI Decision</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => {
                  const isHold = txn.decision === 'HOLD';
                  const isBlock = txn.decision === 'BLOCK';
                  const isVerify = txn.decision === 'VERIFY';

                  const statusText =
                    txn.status ||
                    (txn.decision === 'ALLOW'
                      ? 'COMPLETED'
                      : txn.decision === 'VERIFY'
                      ? 'VERIFIED'
                      : txn.decision === 'HOLD'
                      ? 'HOLD'
                      : 'BLOCKED');

                  return (
                    <tr
                      key={txn.id}
                      onClick={() => onInspectTransaction(txn)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                        {txn.id}
                      </td>
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {txn.timestamp}
                      </td>
                      <td className="py-3 px-4 text-slate-200">
                        <div className="font-medium text-white truncate max-w-[160px]">
                          {txn.beneficiary}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[160px]">
                          {txn.beneficiaryAccount}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-cyan-300">
                          {txn.transactionType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-white whitespace-nowrap">
                        -₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-bold ${
                            txn.riskScore >= 80
                              ? 'text-rose-400'
                              : txn.riskScore >= 60
                              ? 'text-amber-400'
                              : txn.riskScore >= 30
                              ? 'text-blue-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {txn.riskScore}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase border ${
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
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="text-[11px] text-slate-300">
                          {statusText}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onInspectTransaction(txn);
                          }}
                          className="p-1 rounded hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 transition-colors"
                          title="Inspect Audit Dossier & PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
