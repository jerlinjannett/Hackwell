import React from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Laptop,
  AlertTriangle,
  Lock,
  Smartphone,
  Eye,
  CheckCircle2,
  AlertOctagon,
  FileText,
  TrendingUp,
} from 'lucide-react';
import {
  DigitalTrustProfile,
  Device,
  FraudReport,
  SecurityAuditEvent,
} from '../../types';

interface CustomerSecurityCenterPageProps {
  customerProfile: DigitalTrustProfile;
  devices: Device[];
  fraudReports: FraudReport[];
  auditChain: SecurityAuditEvent[];
  onOpenReportFraud: () => void;
}

export const CustomerSecurityCenterPage: React.FC<CustomerSecurityCenterPageProps> = ({
  customerProfile,
  devices,
  fraudReports,
  auditChain,
  onOpenReportFraud,
}) => {
  const trustScore = customerProfile.overallTrustScore;
  const signals = customerProfile.trustSignals;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-12">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#091120] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <span>Customer Security &amp; Digital Trust Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous identity verification, behavioral trust signals, and real-time defense monitoring.
          </p>
        </div>

        <button
          onClick={onOpenReportFraud}
          className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/80 text-rose-300 text-xs font-mono-cyber flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
          <span>Report Suspicious Activity</span>
        </button>
      </div>

      {/* Trust Score & Signal Matrices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Trust Score Radar & Status */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#091120] border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-display font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Multi-Vector Digital Trust Rating</span>
            </h2>
            <span className="text-xs font-mono-cyber text-emerald-400 font-bold">
              {trustScore}/100 OPTIMAL
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono-cyber text-xs">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">Identity Trust</span>
              <span className="text-emerald-400 font-bold text-sm">{signals.identityTrust}%</span>
              <p className="text-[10px] text-slate-500">Government KYC &amp; Biometric match</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">Device Trust</span>
              <span className="text-emerald-400 font-bold text-sm">{signals.deviceTrust}%</span>
              <p className="text-[10px] text-slate-500">Known hardware cryptographic keys</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">Behavior Trust</span>
              <span className="text-emerald-400 font-bold text-sm">{signals.behaviorTrust}%</span>
              <p className="text-[10px] text-slate-500">Keystroke &amp; session flow pattern</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">Location Trust</span>
              <span className="text-emerald-400 font-bold text-sm">{signals.locationTrust}%</span>
              <p className="text-[10px] text-slate-500">Geo-velocity &amp; domestic ISP</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">Transaction Trust</span>
              <span className="text-emerald-400 font-bold text-sm">{signals.transactionTrust}%</span>
              <p className="text-[10px] text-slate-500">Z-score baseline compliance</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">Network Trust</span>
              <span className="text-emerald-400 font-bold text-sm">{signals.networkTrust}%</span>
              <p className="text-[10px] text-slate-500">Mule graph degree distance: Safe</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 font-mono-cyber leading-relaxed">
            <strong className="text-emerald-400 block mb-1">Defense Assessment Summary:</strong>
            Your profile exhibits high digital trust. Transactions within typical hours and limits execute instantly without friction. Out-of-profile actions will trigger automated step-up challenges.
          </div>
        </div>

        {/* Right: Security Recommendations */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#091120] border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-sm font-display font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Active Security Protections &amp; Recommendations</span>
          </h2>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Continuous Zero-Trust Monitoring</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono-cyber">
                  Every request evaluates 7 risk dimensions before releasing funds to settlement rails.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Hardware Fingerprint Binding</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono-cyber">
                  {devices.length} registered cryptographic hardware profiles bound to your identity.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-300">Cooling Period for New Payees</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono-cyber">
                  Transactions to payees added within 24 hours require mandatory out-of-band verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Security Incidents & Fraud Reports */}
      <div className="p-6 rounded-2xl bg-[#091120] border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-sm font-display font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <span>Reported Incidents &amp; Dispute Dossiers</span>
        </h2>

        {fraudReports.length === 0 ? (
          <p className="text-xs font-mono-cyber text-slate-400 py-4 text-center">
            No disputes or fraud incidents filed on this account.
          </p>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {fraudReports.map((report) => (
              <div key={report.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono-cyber">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{report.id}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                      Txn: {report.transactionId}
                    </span>
                    <span className="text-slate-400">({report.timestamp})</span>
                  </div>
                  <p className="text-slate-300 mt-1">{report.reason} — {report.details}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${
                      report.status === 'RESOLVED'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                        : report.status === 'UNDER_INVESTIGATION'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                        : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {report.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
