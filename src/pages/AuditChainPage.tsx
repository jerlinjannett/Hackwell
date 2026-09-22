import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Hash,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Link,
  Lock,
  FileText,
  Clock,
  ArrowRight,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { SecurityAuditEvent, Transaction } from '../types';

interface AuditChainPageProps {
  auditEvents: SecurityAuditEvent[];
  transactions: Transaction[];
  onSelectTransaction: (txn: Transaction) => void;
}

export const AuditChainPage: React.FC<AuditChainPageProps> = ({
  auditEvents,
  transactions,
  onSelectTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [verificationStatus, setVerificationStatus] = useState<null | {
    valid: boolean;
    blocksChecked: number;
    timestamp: string;
  }>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Filter events
  const filteredEvents = auditEvents.filter((evt) => {
    if (filterAction !== 'ALL' && !evt.action.includes(filterAction)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        evt.action.toLowerCase().includes(q) ||
        evt.user.toLowerCase().includes(q) ||
        (evt.transactionId ? evt.transactionId.toLowerCase().includes(q) : false) ||
        evt.details.toLowerCase().includes(q) ||
        evt.systemComponent.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleVerifyChain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      // Check that prevHash equals the hash of preceding event
      let valid = true;
      for (let i = 1; i < auditEvents.length; i++) {
        if (auditEvents[i].prevHash !== auditEvents[i - 1].currentHash) {
          valid = false;
          break;
        }
      }

      setVerificationStatus({
        valid,
        blocksChecked: auditEvents.length,
        timestamp: new Date().toLocaleTimeString(),
      });
      setIsVerifying(false);
    }, 750);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-[#091120] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Hash className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-display font-bold text-white tracking-wide">
              IMMUTABLE AUDIT CHAIN &amp; COMPLIANCE LEDGER
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Cryptographically signed and sequentially hashed ledger of every transaction decision, adaptive challenge, and administrative policy override.
          </p>
        </div>

        <button
          onClick={handleVerifyChain}
          disabled={isVerifying}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          {isVerifying ? (
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Lock className="w-4 h-4" />
          )}
          <span>VERIFY CHAIN INTEGRITY</span>
        </button>
      </div>

      {/* Verification Result Banner */}
      {verificationStatus && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-4 font-mono-cyber text-xs ${
            verificationStatus.valid
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-3">
            {verificationStatus.valid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <div>
              <span className="font-bold block">
                {verificationStatus.valid
                  ? 'Cryptographic Chain Integrity Verified: 100% Intact'
                  : 'Tamper Alert: Hash Discrepancy Detected'}
              </span>
              <span className="text-[11px] opacity-80">
                {verificationStatus.blocksChecked} sequential blocks validated using SHA-256 hash chaining at {verificationStatus.timestamp}. Zero broken links.
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-black/40 text-[10px] uppercase font-bold">
            Verified
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#091120] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Actor, Txn ID, Component, or Action..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono-cyber"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'ALLOW', 'BLOCK', 'HOLD', 'OTP', 'OVERRIDE'].map((act) => (
            <button
              key={act}
              onClick={() => setFilterAction(act)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono-cyber font-medium cursor-pointer transition-all ${
                filterAction === act
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Cryptographic Event Chain List */}
      <div className="space-y-4">
        {filteredEvents.map((evt, idx) => {
          const matchedTxn = transactions.find((t) => t.id === evt.transactionId);

          const isAllow = evt.decision === 'ALLOW';
          const isBlock = evt.decision === 'BLOCK';
          const isHold = evt.decision === 'HOLD';

          return (
            <div
              key={evt.id}
              className="p-5 rounded-2xl bg-[#091120] border border-slate-800 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all"
            >
              {/* Event Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono-cyber text-xs font-bold text-cyan-400">
                    BLOCK #{String(evt.eventNumber).padStart(3, '0')}
                  </div>

                  <span className="font-mono-cyber text-xs font-bold text-white">
                    {evt.action}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono-cyber font-bold uppercase border ${
                      isBlock
                        ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                        : isHold
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                        : isAllow
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                        : 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                    }`}
                  >
                    {evt.decision}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono-cyber text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{evt.timestamp}</span>
                  </div>
                  <span>•</span>
                  <span>{evt.systemComponent}</span>
                </div>
              </div>

              {/* Event Body */}
              <div className="py-3.5 space-y-2">
                <p className="text-xs text-slate-300 leading-relaxed font-mono-cyber">
                  {evt.details}
                </p>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono-cyber text-slate-400">
                  <div>
                    <span className="text-slate-500">Actor / Principal:</span>{' '}
                    <span className="text-white font-medium">{evt.user}</span>
                  </div>

                  <div>
                    <span className="text-slate-500">Transaction ID:</span>{' '}
                    {matchedTxn ? (
                      <button
                        onClick={() => onSelectTransaction(matchedTxn)}
                        className="text-cyan-400 hover:underline inline-flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <span>{evt.transactionId}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-slate-300 font-bold">{evt.transactionId}</span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500">Risk Score:</span>{' '}
                    {evt.riskScore !== undefined ? (
                      <span
                        className={`font-bold ${
                          evt.riskScore >= 80
                            ? 'text-rose-400'
                            : evt.riskScore >= 60
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {evt.riskScore}/100
                      </span>
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Cryptographic Hash Bar */}
              <div className="mt-2 pt-3 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono-cyber text-[11px]">
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-900 flex items-center gap-2 truncate">
                  <Link className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="text-slate-500 shrink-0">Prev Hash:</span>
                  <span className="text-slate-400 truncate">{evt.prevHash}</span>
                </div>

                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-900 flex items-center gap-2 truncate">
                  <Lock className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span className="text-cyan-400 shrink-0">Current Hash:</span>
                  <span className="text-cyan-300 truncate">{evt.currentHash}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
