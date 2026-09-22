import React, { useState } from 'react';
import {
  AlertOctagon,
  X,
  ShieldAlert,
  CheckCircle2,
  Lock,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { Transaction, FraudReport, SecurityAuditEvent } from '../../types';

interface ReportFraudModalProps {
  isOpen?: boolean;
  transactions: Transaction[];
  initialTransaction?: Transaction | null;
  onClose: () => void;
  onSubmitReport: (
    report: FraudReport,
    freezeAccount: boolean,
    auditEvent: Omit<SecurityAuditEvent, 'id' | 'eventNumber' | 'prevHash' | 'currentHash'>
  ) => void;
}

export const ReportFraudModal: React.FC<ReportFraudModalProps> = ({
  isOpen = true,
  transactions,
  initialTransaction,
  onClose,
  onSubmitReport,
}) => {
  const [selectedTxnId, setSelectedTxnId] = useState<string>(
    initialTransaction?.id || transactions[0]?.id || ''
  );
  const [reason, setReason] = useState('I did not authorize this transaction');
  const [details, setDetails] = useState('');
  const [freezeAccount, setFreezeAccount] = useState(false);
  const [revokeSessions, setRevokeSessions] = useState(true);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedTxn = transactions.find((t) => t.id === selectedTxnId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reportId = `FR-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newReport: FraudReport = {
      id: reportId,
      customerId: selectedTxn?.customerId || 'jerlin-jannett',
      transactionId: selectedTxnId,
      reason,
      details: details || 'Customer reported unauthorized debit through self-service digital defense modal.',
      status: 'UNDER_INVESTIGATION',
      timestamp: 'Just now',
    };

    const auditEvent = {
      timestamp: new Date().toLocaleTimeString(),
      user: selectedTxn?.customerEmail || 'customer@trustshield.ai',
      action: 'FRAUD_REPORT_FILED',
      transactionId: selectedTxnId,
      riskScore: 98,
      decision: 'BLOCK' as const,
      systemComponent: 'SOC Dispute Ingestion',
      details: `Customer reported dispute ${reportId} on ${selectedTxnId}: "${reason}". Freeze: ${freezeAccount}.`,
    };

    onSubmitReport(newReport, freezeAccount, auditEvent);
    setSubmittedReportId(reportId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#0a1220] border border-slate-800 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            <span>Report Unauthorized Activity / Fraud</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedReportId ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-display font-bold text-white">
              Fraud Incident Dossier Registered
            </h4>
            <p className="text-xs font-mono-cyber text-slate-300">
              Reference ID: <strong className="text-cyan-400">{submittedReportId}</strong>
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Our Security Operations Center (SOC) has been alerted. The targeted transaction has been tagged for investigative hold, and digital signature logs have been committed to the audit chain.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Acknowledge &amp; Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-mono-cyber text-xs">
            {/* Transaction selector */}
            <div>
              <label className="block text-slate-300 mb-1">Select Disputed Transaction</label>
              <select
                value={selectedTxnId}
                onChange={(e) => setSelectedTxnId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
              >
                {transactions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} - ₹{t.amount.toLocaleString('en-IN')} to {t.beneficiary} ({t.timestamp}) [{t.decision}]
                  </option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-slate-300 mb-1">Dispute / Incident Category</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
              >
                <option value="I did not authorize this transaction">I did not authorize this transaction</option>
                <option value="Suspected phishing / account takeover">Suspected phishing / account takeover</option>
                <option value="Device lost, cloned or compromised">Device lost, cloned or compromised</option>
                <option value="Merchant fraud / scam recipient">Merchant fraud / scam recipient</option>
                <option value="Unusual amount or duplicate debit">Unusual amount or duplicate debit</option>
              </select>
            </div>

            {/* Narrative */}
            <div>
              <label className="block text-slate-300 mb-1">Provide Description / Timeline Details</label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain what happened (e.g. Received OTP request without initiating, unfamiliar payee, etc.)..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Protective measures checkboxes */}
            <div className="space-y-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={freezeAccount}
                  onChange={(e) => setFreezeAccount(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-rose-500"
                />
                <span className="text-[11px]">Temporarily freeze outward transfers on account</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={revokeSessions}
                  onChange={(e) => setRevokeSessions(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-rose-500"
                />
                <span className="text-[11px]">Revoke all other active device tokens immediately</span>
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-600/30"
              >
                <span>SUBMIT FRAUD DISPUTE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
