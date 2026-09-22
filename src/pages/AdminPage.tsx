import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Shield,
  ToggleLeft,
  ToggleRight,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Activity,
  Lock,
  FileDown,
  Download,
  ExternalLink,
  Check,
  Search,
} from 'lucide-react';
import { FusionWeights, RiskThresholds, Transaction } from '../types';
import { DEFAULT_FUSION_WEIGHTS, DEFAULT_RISK_THRESHOLDS } from '../services/fraudFusionEngine';
import { exportTransactionPDF } from '../utils/pdfExport';
import { DEMO_TRANSACTIONS } from '../data/demoData';

interface AdminPageProps {
  weights: FusionWeights;
  thresholds: RiskThresholds;
  onSaveConfig: (newWeights: FusionWeights, newThresholds: RiskThresholds) => void;
  transactions?: Transaction[];
  onInspectTransaction?: (txn: Transaction) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  weights,
  thresholds,
  onSaveConfig,
  transactions = DEMO_TRANSACTIONS,
  onInspectTransaction,
}) => {
  const [currentWeights, setCurrentWeights] = useState<FusionWeights>(weights);
  const [currentThresholds, setCurrentThresholds] = useState<RiskThresholds>(thresholds);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Selected Transaction for PDF Dossier Export
  const [selectedTxnId, setSelectedTxnId] = useState<string>(
    transactions.find((t) => t.decision === 'BLOCK' || t.decision === 'HOLD')?.id || transactions[0]?.id || ''
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const selectedTransaction = transactions.find((t) => t.id === selectedTxnId) || transactions[0];

  const handleExportPDF = () => {
    if (!selectedTransaction) return;
    setIsExporting(true);
    try {
      exportTransactionPDF(selectedTransaction, 'SOC Lead Administrator');
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to export PDF summary:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Rule Toggles
  const [rules, setRules] = useState({
    blockBlacklisted: true,
    requireOtpNewDevice: true,
    holdOver100k: true,
    flagForeignIp: true,
    velocityLockout: true,
  });

  const handleSave = () => {
    onSaveConfig(currentWeights, currentThresholds);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleReset = () => {
    setCurrentWeights(DEFAULT_FUSION_WEIGHTS);
    setCurrentThresholds(DEFAULT_RISK_THRESHOLDS);
  };

  // Calculate sum of weights for validation
  const sumWeights = (
    (currentWeights.transaction ?? 0.25) +
    (currentWeights.behavior ?? 0.20) +
    (currentWeights.device ?? 0.15) +
    (currentWeights.login ?? 0.10) +
    (currentWeights.beneficiary ?? 0.10) +
    (currentWeights.graph ?? 0.10) +
    (currentWeights.velocity ?? 0.10)
  ).toFixed(2);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-display font-bold text-white tracking-wide">
              Security Policy &amp; Admin Governance Console
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic threshold recalibration, signal weight rebalancing, autonomous rule gates, and audit controls.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {savedSuccess && (
            <span className="text-xs font-mono-cyber text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Policy Updated!
            </span>
          )}

          <button
            onClick={handleExportPDF}
            disabled={isExporting || !selectedTransaction}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 text-xs font-mono-cyber font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
            title="Export current investigation dossier as PDF"
          >
            {exportSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">PDF Exported</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isExporting ? 'Generating...' : 'Export Incident PDF'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono-cyber text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            SAVE POLICIES
          </button>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Risk Decision Thresholds */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-mono-cyber font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              ADAPTIVE RISK THRESHOLDS (SCORE 0–100)
            </h2>
            <span className="text-[10px] font-mono-cyber text-slate-400">CUTOFF POINTS</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* ALLOW */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="flex justify-between font-mono-cyber">
                <span className="text-emerald-400 font-bold">ALLOW (Low Risk Ceiling)</span>
                <span className="text-slate-300">0 to {currentThresholds.lowMax}</span>
              </div>
              <input
                type="range"
                min={10}
                max={45}
                value={currentThresholds.lowMax}
                onChange={(e) =>
                  setCurrentThresholds({ ...currentThresholds, lowMax: Number(e.target.value) })
                }
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">
                Transactions scoring below this score proceed seamlessly without step-up friction.
              </span>
            </div>

            {/* VERIFY */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="flex justify-between font-mono-cyber">
                <span className="text-blue-400 font-bold">VERIFY (Challenge Max)</span>
                <span className="text-slate-300">{currentThresholds.lowMax + 1} to {currentThresholds.mediumMax}</span>
              </div>
              <input
                type="range"
                min={currentThresholds.lowMax + 5}
                max={75}
                value={currentThresholds.mediumMax}
                onChange={(e) =>
                  setCurrentThresholds({ ...currentThresholds, mediumMax: Number(e.target.value) })
                }
                className="w-full accent-blue-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">
                Prompts customer for Out-Of-Band stepped-up authentication (OTP or Biometric).
              </span>
            </div>

            {/* HOLD */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="flex justify-between font-mono-cyber">
                <span className="text-amber-400 font-bold">HOLD (Escrow Max)</span>
                <span className="text-slate-300">{currentThresholds.mediumMax + 1} to {currentThresholds.highMax}</span>
              </div>
              <input
                type="range"
                min={currentThresholds.mediumMax + 5}
                max={90}
                value={currentThresholds.highMax}
                onChange={(e) =>
                  setCurrentThresholds({ ...currentThresholds, highMax: Number(e.target.value) })
                }
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">
                Puts funds in security escrow for SOC analyst review before final settlement.
              </span>
            </div>

            {/* BLOCK */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="flex justify-between font-mono-cyber">
                <span className="text-rose-400 font-bold">BLOCK (Critical Intercept)</span>
                <span className="text-slate-300">&ge; {currentThresholds.highMax + 1}</span>
              </div>
              <span className="text-[10px] text-slate-500 block pt-0.5">
                Automatically terminates transaction, invalidates device token, and dispatches critical alert.
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Autonomous Rule Toggles */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-mono-cyber font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              HARD RULE GATES &amp; COMPLIANCE POLICIES
            </h2>
            <span className="text-[10px] font-mono-cyber text-slate-400">INSTANT OVERRIDE</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              {
                key: 'blockBlacklisted',
                title: 'Block Blacklisted Beneficiaries',
                desc: 'Hard block any transfer to entities on Central Crime / Mule watchlists regardless of score.',
              },
              {
                key: 'requireOtpNewDevice',
                title: 'Require Stepped-up OTP for Unrecognized Hardware',
                desc: 'Forces 2FA challenge when fingerprint does not match customer digital trust profile.',
              },
              {
                key: 'holdOver100k',
                title: 'Hold High-Value Transactions Exceeding ₹100,000',
                desc: 'Applies mandatory 15-minute escrow review window for out-of-norm whale transfers.',
              },
              {
                key: 'flagForeignIp',
                title: 'Flag Foreign or Proxy/VPN IP Addresses',
                desc: 'Automatically boosts Location and Login risk scores by +40 for cross-border or TOR endpoints.',
              },
              {
                key: 'velocityLockout',
                title: 'Rapid Outflow Velocity Circuit Breaker',
                desc: 'Temporarily freezes account if &gt;3 large transfers are initiated within a 5-minute interval.',
              },
            ].map((item) => {
              const enabled = (rules as any)[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => setRules({ ...rules, [item.key]: !enabled })}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-white">{item.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</div>
                  </div>

                  <div className="shrink-0 text-cyan-400">
                    {enabled ? (
                      <ToggleRight className="w-6 h-6 text-cyan-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-600" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Signal Weights Configuration */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-xs font-mono-cyber font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              FRAUD FUSION SIGNAL WEIGHT CALIBRATION
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Adjust relative contribution of each security vector. Current sum: <strong className={Number(sumWeights) === 1.0 ? 'text-emerald-400' : 'text-amber-400'}>{sumWeights}</strong> (Ideal: 1.00)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {[
            { key: 'transaction', name: 'Transaction Risk', val: currentWeights.transaction ?? 0.25 },
            { key: 'behavior', name: 'Behavior Risk', val: currentWeights.behavior ?? 0.20 },
            { key: 'device', name: 'Device Risk', val: currentWeights.device ?? 0.15 },
            { key: 'login', name: 'Login Risk', val: currentWeights.login ?? 0.10 },
            { key: 'beneficiary', name: 'Beneficiary Risk', val: currentWeights.beneficiary ?? 0.10 },
            { key: 'graph', name: 'Graph Topology Risk', val: currentWeights.graph ?? 0.10 },
            { key: 'velocity', name: 'Velocity Spike Risk', val: currentWeights.velocity ?? 0.10 },
          ].map((item) => (
            <div key={item.key} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <div className="flex justify-between font-mono-cyber text-[11px]">
                <span className="text-slate-300">{item.name}</span>
                <span className="text-cyan-400 font-bold">{Math.round(item.val * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={Math.round(item.val * 100)}
                onChange={(e) =>
                  setCurrentWeights({
                    ...currentWeights,
                    [item.key]: Number(e.target.value) / 100,
                  })
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Incident Dossier & Investigation PDF Audit Export */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-mono-cyber font-bold text-slate-200 uppercase tracking-wider">
                TRANSACTION INVESTIGATION AUDIT &amp; PDF EXPORT
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Select any transaction from the monitoring stream to inspect multi-vector telemetry and export a formatted, compliance-ready PDF summary dossier.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              disabled={isExporting || !selectedTransaction}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {exportSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Report Downloaded</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>{isExporting ? 'Generating PDF...' : 'Export PDF Summary'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Transaction Selector Bar */}
        <div className="space-y-2">
          <label className="text-xs font-mono-cyber text-slate-400 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            SELECT TRANSACTION FOR AUDIT DOSSIER:
          </label>
          <select
            value={selectedTxnId}
            onChange={(e) => setSelectedTxnId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono-cyber text-slate-200 focus:outline-none focus:border-cyan-500/60 cursor-pointer"
          >
            {transactions.map((t) => (
              <option key={t.id} value={t.id}>
                [{t.decision}] {t.id} &bull; {t.customerName} &bull; ₹{t.amount.toLocaleString()} &bull; Score: {t.riskScore}/100 ({t.riskLevel}) &bull; {t.transactionType}
              </option>
            ))}
          </select>
        </div>

        {/* Live Dossier Summary Preview Card */}
        {selectedTransaction && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-display font-bold text-white tracking-wide">
                    Case Ref: {selectedTransaction.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono-cyber font-bold ${
                    selectedTransaction.decision === 'BLOCK'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : selectedTransaction.decision === 'HOLD'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : selectedTransaction.decision === 'VERIFY'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {selectedTransaction.decision}
                  </span>
                  <span className="text-[11px] font-mono-cyber text-slate-400">
                    {selectedTransaction.transactionType}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Subject: <span className="text-slate-200 font-semibold">{selectedTransaction.customerName}</span> ({selectedTransaction.customerEmail}) &bull; Beneficiary: <span className="text-slate-200">{selectedTransaction.beneficiary}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-mono-cyber text-slate-400">Transfer Amount</div>
                  <div className="text-lg font-mono-cyber font-bold text-white">
                    ₹{selectedTransaction.amount.toLocaleString()}
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border text-center min-w-[70px] ${
                  selectedTransaction.riskScore >= 75
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : selectedTransaction.riskScore >= 45
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}>
                  <div className="text-[10px] font-mono-cyber font-bold uppercase">Risk Score</div>
                  <div className="text-lg font-mono-cyber font-extrabold">{selectedTransaction.riskScore}</div>
                </div>
              </div>
            </div>

            {/* Signals and Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-mono-cyber uppercase block">Endpoint / IP</span>
                <span className="font-mono-cyber text-slate-200 truncate block mt-0.5">{selectedTransaction.ipAddress}</span>
                <span className="text-[10px] text-slate-400 truncate block">{selectedTransaction.location}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-mono-cyber uppercase block">Device Fingerprint</span>
                <span className="font-mono-cyber text-slate-200 truncate block mt-0.5">{selectedTransaction.device}</span>
                <span className={`text-[10px] block ${(selectedTransaction.signals?.device_score ?? 0) > 30 ? 'text-amber-400 font-semibold' : 'text-emerald-400'}`}>
                  {(selectedTransaction.signals?.device_score ?? 0) > 30 ? 'New Hardware Flagged' : 'Known Hardware'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-mono-cyber uppercase block">Beneficiary Target</span>
                <span className="font-mono-cyber text-slate-200 truncate block mt-0.5">{selectedTransaction.beneficiary}</span>
                <span className="text-[10px] text-slate-400 truncate block">Acc: {selectedTransaction.beneficiaryAccount}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-mono-cyber uppercase block">Risk Vector Max</span>
                <span className="font-mono-cyber text-rose-400 font-bold block mt-0.5">
                  Device: {selectedTransaction.signals?.device_score ?? 12}/100
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Txn: {selectedTransaction.signals?.transaction_score ?? 15}/100
                </span>
              </div>
            </div>

            {/* Quick Actions for Selected Transaction */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-900">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>PDF report includes complete 7-vector telemetry, SOC audit trail, and SHA-256 validation seal.</span>
              </div>

              <div className="flex items-center gap-2">
                {onInspectTransaction && (
                  <button
                    onClick={() => onInspectTransaction(selectedTransaction)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono-cyber text-slate-200 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    Open Full Dossier Modal
                  </button>
                )}

                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono-cyber font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  {isExporting ? 'Generating PDF...' : 'Download PDF Summary'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
