import React from 'react';
import { Ban, ShieldAlert, FileSearch, X } from 'lucide-react';
import { Transaction } from '../types';

interface BlockedModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onViewAnalysis: (txn: Transaction) => void;
}

export const BlockedModal: React.FC<BlockedModalProps> = ({
  transaction,
  onClose,
  onViewAnalysis,
}) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-[#160c11] border-2 border-rose-500/70 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Banner */}
        <div className="p-4 bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-b border-rose-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/50">
              <Ban className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-mono-cyber font-bold tracking-wider text-rose-400 uppercase">
                SECURITY INTERCEPT
              </div>
              <h3 className="font-display font-bold text-base text-white">
                TRANSACTION BLOCKED
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="text-center py-2">
            <span className="text-xs text-slate-400">Blocked Attempt</span>
            <div className="text-3xl font-mono-cyber font-extrabold text-rose-400 mt-0.5 line-through">
              ₹{transaction.amount.toLocaleString()}
            </div>
            <div className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-mono-cyber font-bold bg-rose-500/20 text-rose-300 border border-rose-500/50">
              Fraud Fusion Score: {transaction.riskScore} / 100 &bull; CRITICAL
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="font-mono-cyber font-semibold text-rose-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Primary Security Factors Detected:
            </div>
            <ul className="space-y-1 text-slate-300 text-[11px] pt-1">
              {transaction.reasons.slice(0, 5).map((r, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onViewAnalysis(transaction);
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono-cyber font-bold transition-all shadow-lg shadow-rose-600/30 cursor-pointer flex items-center justify-center gap-2"
            >
              <FileSearch className="w-4 h-4" />
              VIEW DETAILED SECURITY ANALYSIS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
