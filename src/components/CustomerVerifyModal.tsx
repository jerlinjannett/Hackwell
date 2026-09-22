import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, XCircle, KeyRound, CheckCircle } from 'lucide-react';
import { Transaction } from '../types';

interface CustomerVerifyModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onVerifySuccess: (txnId: string) => void;
  onCancelTransaction: (txnId: string) => void;
}

export const CustomerVerifyModal: React.FC<CustomerVerifyModalProps> = ({
  transaction,
  onClose,
  onVerifySuccess,
  onCancelTransaction,
}) => {
  const [otpInput, setOtpInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const DEMO_OTP = '123456';

  if (!transaction) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim() === DEMO_OTP) {
      setErrorMsg('');
      setIsSuccess(true);
      setTimeout(() => {
        onVerifySuccess(transaction.id);
        onClose();
      }, 1200);
    } else {
      setErrorMsg(`Invalid verification code. Please use demo OTP: ${DEMO_OTP}`);
    }
  };

  const handleCancel = () => {
    onCancelTransaction(transaction.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0b1322] border-2 border-amber-500/50 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Banner */}
        <div className="p-4 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-b border-amber-500/30 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-mono-cyber font-bold tracking-wider text-amber-400 uppercase">
              BANKING SECURITY GUARD
            </div>
            <h3 className="font-display font-bold text-base text-white">
              TRANSACTION REQUIRES VERIFICATION
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="text-center py-2">
            <span className="text-xs text-slate-400">Payment Request Amount</span>
            <div className="text-3xl font-mono-cyber font-extrabold text-white mt-0.5">
              ₹{transaction.amount.toLocaleString()}
            </div>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-mono-cyber font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Risk Score: {transaction.riskScore} / 100
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Beneficiary:</span>
              <span className="font-semibold text-slate-200">{transaction.beneficiary}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="font-semibold text-slate-200">{transaction.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Device:</span>
              <span className="font-semibold text-slate-200">{transaction.device}</span>
            </div>
            <div className="border-t border-slate-800 pt-2 text-[11px] text-amber-200/90 leading-relaxed">
              <strong>Reason:</strong> This transaction differs from your normal banking behavior pattern.
            </div>
          </div>

          {/* OTP Verification Form */}
          {isSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
              <div className="font-display font-bold text-emerald-300">
                OTP VERIFIED SUCCESSFULLY
              </div>
              <p className="text-xs text-emerald-400 font-mono-cyber">
                Status Updated: VERIFIED &rarr; ALLOW
              </p>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono-cyber mb-1">
                  <label htmlFor="otp-security-input" className="text-slate-300 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    Enter One-Time Password (OTP)
                  </label>
                  <span className="text-cyan-400 font-semibold">Demo OTP: {DEMO_OTP}</span>
                </div>
                <input
                  id="otp-security-input"
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-mono-cyber font-bold py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                />
                {errorMsg && (
                  <p className="text-xs text-rose-400 mt-1 text-center font-mono-cyber">{errorMsg}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="py-2.5 px-3 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-mono-cyber font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4 text-slate-400" />
                  CANCEL TXN
                </button>

                <button
                  type="submit"
                  className="py-2.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono-cyber font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  VERIFY TXN
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
