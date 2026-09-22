import React from 'react';
import { AlertTriangle, ShieldAlert, X, ArrowRight } from 'lucide-react';
import { Transaction } from '../types';

export interface ToastAlert {
  id: string;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'HIGH' | 'INFO';
  transaction?: Transaction;
}

interface ToastNotificationProps {
  toasts: ToastAlert[];
  onDismiss: (id: string) => void;
  onInspect: (txn: Transaction) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toasts,
  onDismiss,
  onInspect,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-xl border shadow-2xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-300 ${
            toast.severity === 'CRITICAL'
              ? 'bg-[#180a0f]/95 border-rose-500/80 shadow-rose-950/50'
              : toast.severity === 'HIGH'
              ? 'bg-[#181309]/95 border-amber-500/80 shadow-amber-950/50'
              : 'bg-[#091522]/95 border-cyan-500/80 shadow-cyan-950/50'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`p-1 rounded-md ${
                  toast.severity === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-400'
                    : toast.severity === 'HIGH'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-cyan-500/20 text-cyan-400'
                }`}
              >
                <ShieldAlert className="w-4 h-4 animate-pulse" />
              </div>
              <span
                className={`text-xs font-mono-cyber font-bold uppercase tracking-wider ${
                  toast.severity === 'CRITICAL'
                    ? 'text-rose-400'
                    : toast.severity === 'HIGH'
                    ? 'text-amber-400'
                    : 'text-cyan-400'
                }`}
              >
                {toast.title}
              </span>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-200 mt-1.5 leading-relaxed">{toast.message}</p>

          {toast.transaction && (
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] font-mono-cyber text-slate-400">
                {toast.transaction.id} &bull; ₹{toast.transaction.amount.toLocaleString()}
              </span>
              <button
                onClick={() => {
                  onInspect(toast.transaction!);
                  onDismiss(toast.id);
                }}
                className="flex items-center gap-1 text-[11px] font-mono-cyber text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
              >
                <span>Inspect</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
