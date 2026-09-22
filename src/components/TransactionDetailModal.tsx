import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Ban,
  Clock,
  User,
  Laptop,
  MapPin,
  Building2,
  Cpu,
  Check,
  Radio,
  FileText,
  Share2,
  FileDown,
  Download,
} from 'lucide-react';
import { Transaction, SecurityDecision } from '../types';
import { SecurityTimeline } from './SecurityTimeline';
import { exportTransactionPDF } from '../utils/pdfExport';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onUpdateStatus: (txnId: string, newDecision: SecurityDecision, note?: string) => void;
  onOpenCustomerProfile?: (customerId: string) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
  onUpdateStatus,
  onOpenCustomerProfile,
}) => {
  const [analystNote, setAnalystNote] = useState('');
  const [activeTab, setActiveTab] = useState<'signals' | 'timeline' | 'actions'>('signals');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!transaction) return null;

  const handleAction = (decision: SecurityDecision) => {
    onUpdateStatus(transaction.id, decision, analystNote || `Analyst manual override to ${decision}`);
    setAnalystNote('');
  };

  const handleExportPDF = () => {
    if (!transaction) return;
    setIsExporting(true);
    try {
      exportTransactionPDF(transaction, 'Lead Fraud Investigator');
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2500);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#090f1d] border border-slate-700 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-display font-bold text-white tracking-wide">
                  SOC Investigation Dossier: {transaction.id}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-cyber bg-slate-800 text-slate-300">
                  {transaction.transactionType}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Customer: {transaction.customerName} ({transaction.customerEmail}) &bull; Recorded {transaction.timeAgo || transaction.timestamp}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 hover:text-cyan-200 text-xs font-mono-cyber font-medium transition-all cursor-pointer shadow-sm disabled:opacity-50"
              title="Export formatted PDF investigation report"
            >
              {exportSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">PDF Downloaded</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isExporting ? 'Generating PDF...' : 'Export PDF Report'}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top Key Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] font-mono-cyber uppercase text-slate-400">Amount</span>
              <div className="text-lg font-mono-cyber font-bold text-white">
                ₹{transaction.amount.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">{transaction.currency}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] font-mono-cyber uppercase text-slate-400">Fraud Fusion Score</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-mono-cyber font-bold text-cyan-400">
                  {transaction.riskScore}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <span className={`text-[10px] font-bold ${
                transaction.riskLevel === 'CRITICAL' ? 'text-rose-400' :
                transaction.riskLevel === 'HIGH' ? 'text-amber-400' :
                transaction.riskLevel === 'MEDIUM' ? 'text-cyan-400' : 'text-emerald-400'
              }`}>
                {transaction.riskLevel} RISK
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] font-mono-cyber uppercase text-slate-400">Current Decision</span>
              <div className="text-lg font-display font-bold text-white mt-0.5">
                {transaction.decision}
              </div>
              <span className="text-[10px] text-slate-400">Adaptive Policy</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] font-mono-cyber uppercase text-slate-400">Beneficiary</span>
              <div className="text-sm font-semibold text-white truncate mt-1">
                {transaction.beneficiary}
              </div>
              <span className="text-[10px] font-mono-cyber text-slate-400">
                {transaction.beneficiaryAccount}
              </span>
            </div>
          </div>

          {/* Tab navigation within modal */}
          <div className="flex border-b border-slate-800 gap-4 text-xs font-mono-cyber">
            <button
              onClick={() => setActiveTab('signals')}
              className={`pb-2 transition-colors cursor-pointer ${
                activeTab === 'signals'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Signal Breakdown &amp; Explainability
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`pb-2 transition-colors cursor-pointer ${
                activeTab === 'timeline'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Security Timeline Flow
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`pb-2 transition-colors cursor-pointer ${
                activeTab === 'actions'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Analyst Action &amp; Audit Log
            </button>
          </div>

          {/* TAB 1: Signals & AI Explanation */}
          {activeTab === 'signals' && (
            <div className="space-y-5">
              {/* Explainable AI Reasons */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <h3 className="text-xs font-mono-cyber font-bold tracking-wider text-slate-300 uppercase mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  WHY WAS THIS FLAGGED? (EXPLAINABLE AI ENGINE)
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {transaction.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Signal Breakdown Progress Bars */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <h3 className="text-xs font-mono-cyber font-bold tracking-wider text-slate-300 uppercase mb-3">
                  FRAUD FUSION SIGNAL BREAKDOWN (0–100 RISK)
                </h3>
                <div className="space-y-2.5 text-xs">
                  {[
                    { label: 'Transaction Risk', score: transaction.signals.transaction_score, weight: '25%' },
                    { label: 'Behavior Risk', score: transaction.signals.behavior_score, weight: '20%' },
                    { label: 'Device Risk', score: transaction.signals.device_score, weight: '15%' },
                    { label: 'Location Risk', score: transaction.signals.location_score, weight: '10%' },
                    { label: 'Beneficiary Risk', score: transaction.signals.beneficiary_score, weight: '15%' },
                    { label: 'Login Risk', score: transaction.signals.login_score, weight: '10%' },
                    { label: 'Network Risk', score: transaction.signals.network_score, weight: '5%' },
                  ].map((sig, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-slate-300 font-mono-cyber text-[11px]">
                        <span>{sig.label} <span className="text-slate-500 font-normal">({sig.weight})</span></span>
                        <span className={`font-bold ${
                          sig.score > 70 ? 'text-rose-400' : sig.score > 40 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {sig.score} / 100
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            sig.score > 70 ? 'bg-rose-500' : sig.score > 40 ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                          style={{ width: `${sig.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Context Intelligence Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                    <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Device Context</span>
                  </div>
                  <div className="font-semibold text-white">{transaction.device}</div>
                  <div className="text-[11px] font-mono-cyber text-slate-500">{transaction.deviceId}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Location &amp; IP</span>
                  </div>
                  <div className="font-semibold text-white">{transaction.location}</div>
                  <div className="text-[11px] font-mono-cyber text-slate-500">{transaction.ipAddress}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Beneficiary Status</span>
                  </div>
                  <div className="font-semibold text-white">{transaction.beneficiary}</div>
                  <div className="text-[11px] font-mono-cyber text-slate-500">
                    Status: {transaction.beneficiaryStatus.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Security Timeline */}
          {activeTab === 'timeline' && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <h3 className="text-xs font-mono-cyber font-bold tracking-wider text-slate-300 uppercase mb-4">
                CHRONOLOGICAL FRAUD ATTRIBUTION TIMELINE
              </h3>
              <SecurityTimeline timeline={transaction.timeline} />
            </div>
          )}

          {/* TAB 3: Analyst Actions & Audit */}
          {activeTab === 'actions' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h3 className="text-xs font-mono-cyber font-bold tracking-wider text-slate-300 uppercase">
                  CURRENT AUDIT STATUS
                </h3>
                {transaction.analystAction ? (
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between text-slate-400 font-mono-cyber text-[11px]">
                      <span>Action: <strong className="text-cyan-400">{transaction.analystAction.action}</strong></span>
                      <span>{transaction.analystAction.timestamp}</span>
                    </div>
                    <div className="text-slate-300">By: {transaction.analystAction.analyst}</div>
                    {transaction.analystAction.note && (
                      <div className="text-slate-400 italic">Note: "{transaction.analystAction.note}"</div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    Governed autonomously by TrustShield AI Adaptive Decision Engine. No manual override has been applied yet.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Manual Analyst Override Control Bar */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono-cyber font-bold text-slate-200 uppercase">
                FRAUD ANALYST ADAPTIVE OVERRIDE
              </h4>
              <span className="text-[11px] text-slate-400">Immediate Policy Enforcement</span>
            </div>

            <input
              type="text"
              placeholder="Enter analyst justification note for audit log (optional)..."
              value={analystNote}
              onChange={(e) => setAnalystNote(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <button
                onClick={() => handleAction('ALLOW')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/60 text-xs font-mono-cyber font-bold transition-all cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                APPROVE (ALLOW)
              </button>

              <button
                onClick={() => handleAction('VERIFY')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-cyan-950/60 border border-cyan-700/60 text-cyan-300 hover:bg-cyan-900/60 text-xs font-mono-cyber font-bold transition-all cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5" />
                CHALLENGE (VERIFY)
              </button>

              <button
                onClick={() => handleAction('HOLD')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-950/60 border border-amber-700/60 text-amber-300 hover:bg-amber-900/60 text-xs font-mono-cyber font-bold transition-all cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                ESCROW (HOLD)
              </button>

              <button
                onClick={() => handleAction('BLOCK')}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-rose-950/60 border border-rose-700/60 text-rose-300 hover:bg-rose-900/60 text-xs font-mono-cyber font-bold transition-all cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5" />
                BLACKLIST (BLOCK)
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-900/60">
          {onOpenCustomerProfile && (
            <button
              onClick={() => {
                onOpenCustomerProfile(transaction.customerId);
                onClose();
              }}
              className="text-xs font-mono-cyber text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
            >
              &rarr; Open Customer Digital Trust Profile
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
            >
              {exportSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950" />
                  <span>Report Downloaded</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  <span>{isExporting ? 'Generating...' : 'Export PDF Report'}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition-colors cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
