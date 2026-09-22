import React, { useState } from 'react';
import {
  FlaskConical,
  RotateCcw,
  Play,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Ban,
  Cpu,
  Sliders,
  Sparkles,
  Info,
  Radio,
  Clock,
  Laptop,
  MapPin,
  Building2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { DEMO_SCENARIOS } from '../data/demoData';
import {
  FusionWeights,
  RiskThresholds,
  SimulationInput,
  SimulationResult,
  Transaction,
  SecurityDecision,
} from '../types';
import { analyzeTransactionSimulation } from '../services/fraudFusionEngine';
import { SecurityTimeline } from '../components/SecurityTimeline';

interface SimulatorPageProps {
  onTransactionAnalyzed: (result: SimulationResult) => void;
  onOpenVerifyModal: (txn: Transaction) => void;
  onOpenBlockedModal: (txn: Transaction) => void;
  onOpenDetailModal: (txn: Transaction) => void;
  weights?: FusionWeights;
  thresholds?: RiskThresholds;
  activePresetId?: string;
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({
  onTransactionAnalyzed,
  onOpenVerifyModal,
  onOpenBlockedModal,
  onOpenDetailModal,
  weights,
  thresholds,
  activePresetId,
}) => {
  const defaultInput: SimulationInput = DEMO_SCENARIOS[0].input;

  const [input, setInput] = useState<SimulationInput>(defaultInput);
  const [result, setResult] = useState<SimulationResult>(() =>
    analyzeTransactionSimulation(defaultInput, weights, thresholds)
  );
  const [selectedPreset, setSelectedPreset] = useState<string>(activePresetId || 'DEMO_1');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSelectPreset = (presetId: string) => {
    const found = DEMO_SCENARIOS.find((d) => d.id === presetId);
    if (found) {
      setSelectedPreset(presetId);
      setInput(found.input);
      // Automatically analyze on preset selection
      const res = analyzeTransactionSimulation(found.input, weights, thresholds);
      setResult(res);
      onTransactionAnalyzed(res);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeTransactionSimulation(input, weights, thresholds);
      setResult(res);
      onTransactionAnalyzed(res);
      setIsAnalyzing(false);
    }, 250);
  };

  const handleReset = () => {
    setInput(defaultInput);
    setSelectedPreset('DEMO_1');
    const res = analyzeTransactionSimulation(defaultInput, weights, thresholds);
    setResult(res);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-display font-bold text-white tracking-wide">
              Transaction Risk Simulator &amp; Fraud Fusion Lab
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Interactively simulate complex banking fraud vectors, adjust behavioral variables, and observe real-time hybrid AI decisions.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 self-start sm:self-auto">
          <Sparkles className="w-4 h-4 text-cyan-400 ml-1.5" />
          <span className="text-xs font-mono-cyber text-slate-400">Load Scenario:</span>
          <select
            value={selectedPreset}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="bg-slate-950 text-cyan-300 text-xs font-mono-cyber rounded-lg px-2 py-1 border border-slate-800 focus:outline-none cursor-pointer"
          >
            {DEMO_SCENARIOS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Input Form on Left (60%) vs Dynamic Fusion Results on Right (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Input Matrix */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-mono-cyber font-bold tracking-wider text-slate-200 uppercase flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              TRANSACTION &amp; BEHAVIORAL ATTRIBUTES
            </h2>
            <span className="text-[11px] font-mono-cyber text-slate-400">
              Deterministic Feature Vector
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Customer */}
            <div>
              <label className="block text-slate-300 font-mono-cyber text-[11px] mb-1">
                Customer Name / Account
              </label>
              <input
                type="text"
                value={input.customer}
                onChange={(e) => setInput({ ...input, customer: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-slate-300 font-mono-cyber text-[11px] mb-1">
                Transaction Amount (INR ₹)
              </label>
              <input
                type="number"
                value={input.transactionAmount}
                onChange={(e) => setInput({ ...input, transactionAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono-cyber font-semibold text-cyan-400 focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-slate-300 font-mono-cyber text-[11px] mb-1">
                Settlement Channel
              </label>
              <select
                value={input.transactionType}
                onChange={(e) => setInput({ ...input, transactionType: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500/60 cursor-pointer"
              >
                <option value="UPI">UPI (Instant Real-time)</option>
                <option value="IMPS">IMPS (Immediate Payment)</option>
                <option value="NEFT">NEFT (National Electronic Fund)</option>
                <option value="CARD">Card Gateway / POS</option>
                <option value="WIRE">Cross-Border Wire</option>
                <option value="CRYPTO_GATEWAY">Crypto Gateway Escrow</option>
              </select>
            </div>

            {/* Beneficiary */}
            <div>
              <label className="block text-slate-300 font-mono-cyber text-[11px] mb-1">
                Counterparty / Beneficiary
              </label>
              <input
                type="text"
                value={input.beneficiary}
                onChange={(e) => setInput({ ...input, beneficiary: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            {/* Device */}
            <div>
              <label className="block text-slate-300 font-mono-cyber text-[11px] mb-1">
                Client Device Fingerprint
              </label>
              <input
                type="text"
                value={input.device}
                onChange={(e) => setInput({ ...input, device: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-slate-300 font-mono-cyber text-[11px] mb-1">
                Geo-Location IP Telemetry
              </label>
              <input
                type="text"
                value={input.location}
                onChange={(e) => setInput({ ...input, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            {/* IP Address */}
            <div>
              <label className="block text-slate-300 font-mono-cyber text-[11px] mb-1">
                IP Address
              </label>
              <input
                type="text"
                value={input.ipAddress}
                onChange={(e) => setInput({ ...input, ipAddress: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono-cyber focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            {/* Login Time */}
            <div>
              <label className="block text-slate-300 font-mono-cyber text-[11px] mb-1">
                Session Initiation Time
              </label>
              <input
                type="text"
                value={input.loginTime}
                onChange={(e) => setInput({ ...input, loginTime: e.target.value })}
                placeholder="HH:MM:SS"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono-cyber focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            {/* Average Amount */}
            <div>
              <label className="block text-slate-300 font-mono-cyber text-[11px] mb-1">
                Customer Historical Avg Amount (₹)
              </label>
              <input
                type="number"
                value={input.averageTransactionAmount}
                onChange={(e) => setInput({ ...input, averageTransactionAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono-cyber focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            {/* Failed Logins */}
            <div>
              <label className="block text-slate-300 font-mono-cyber text-[11px] mb-1">
                Consecutive Failed Logins
              </label>
              <input
                type="number"
                min={0}
                max={20}
                value={input.failedLoginAttempts}
                onChange={(e) => setInput({ ...input, failedLoginAttempts: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono-cyber focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            {/* Txn Frequency */}
            <div>
              <label className="block text-slate-300 font-mono-cyber text-[11px] mb-1">
                24h Velocity (Txns count)
              </label>
              <input
                type="number"
                value={input.transactionFrequency}
                onChange={(e) => setInput({ ...input, transactionFrequency: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono-cyber focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            {/* Account Age */}
            <div>
              <label className="block text-slate-300 font-mono-cyber text-[11px] mb-1">
                Account Age (Months)
              </label>
              <input
                type="number"
                value={input.accountAgeMonths}
                onChange={(e) => setInput({ ...input, accountAgeMonths: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono-cyber focus:outline-none focus:border-cyan-500/60"
              />
            </div>
          </div>

          {/* Trust Ratings Sliders */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <span className="block text-[11px] font-mono-cyber text-slate-400 uppercase tracking-wider">
              Telemetry Trust Signals (0 = Fraudulent, 100 = Fully Trusted)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="flex justify-between text-xs font-mono-cyber mb-1">
                  <span className="text-slate-300">Device Trust</span>
                  <span className="text-cyan-400 font-bold">{input.deviceTrust}/100</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={input.deviceTrust}
                  onChange={(e) => setInput({ ...input, deviceTrust: Number(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="flex justify-between text-xs font-mono-cyber mb-1">
                  <span className="text-slate-300">Location Trust</span>
                  <span className="text-cyan-400 font-bold">{input.locationTrust}/100</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={input.locationTrust}
                  onChange={(e) => setInput({ ...input, locationTrust: Number(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="flex justify-between text-xs font-mono-cyber mb-1">
                  <span className="text-slate-300">Beneficiary Trust</span>
                  <span className="text-cyan-400 font-bold">{input.beneficiaryTrust}/100</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={input.beneficiaryTrust}
                  onChange={(e) => setInput({ ...input, beneficiaryTrust: Number(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Blacklist Override toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-rose-950/20 border border-rose-900/40">
              <div className="flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-400" />
                <span className="text-xs text-rose-200">
                  Flag Beneficiary on Central Crime Blacklist (Force Rule Override)
                </span>
              </div>
              <input
                type="checkbox"
                checked={!!input.beneficiaryIsBlacklisted}
                onChange={(e) => setInput({ ...input, beneficiaryIsBlacklisted: e.target.checked })}
                className="w-4 h-4 rounded border-rose-700 bg-slate-950 text-rose-500 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isAnalyzing ? 'COMPUTING FRAUD FUSION...' : 'ANALYZE TRANSACTION'}</span>
            </button>

            <button
              onClick={handleReset}
              className="py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-mono-cyber transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Fraud Fusion Evaluation Results */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Decision Badge Card */}
          <div className="p-5 rounded-2xl bg-[#0a1220] border-2 border-slate-800 shadow-xl relative overflow-hidden">
            {/* Top Score & Action */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono-cyber uppercase tracking-wider text-slate-400">
                  FRAUD FUSION SCORE
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span
                    className={`text-4xl font-display font-extrabold ${
                      result.transaction.riskLevel === 'CRITICAL'
                        ? 'text-rose-400'
                        : result.transaction.riskLevel === 'HIGH'
                        ? 'text-amber-400'
                        : result.transaction.riskLevel === 'MEDIUM'
                        ? 'text-cyan-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {result.transaction.riskScore}
                  </span>
                  <span className="text-xs text-slate-400 font-mono-cyber">/ 100</span>
                </div>

                <div className="mt-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono-cyber font-bold ${
                      result.transaction.riskLevel === 'CRITICAL'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-700/80'
                        : result.transaction.riskLevel === 'HIGH'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-700/80'
                        : result.transaction.riskLevel === 'MEDIUM'
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/80'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/80'
                    }`}
                  >
                    {result.transaction.riskLevel} RISK
                  </span>
                </div>
              </div>

              {/* Security Decision Pill */}
              <div className="text-right">
                <span className="text-[10px] font-mono-cyber uppercase tracking-wider text-slate-400">
                  ADAPTIVE DECISION
                </span>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-display font-extrabold text-sm tracking-wider uppercase border shadow-md ${
                      result.transaction.decision === 'ALLOW'
                        ? 'bg-emerald-950/80 border-emerald-500/70 text-emerald-300 shadow-emerald-900/30'
                        : result.transaction.decision === 'VERIFY'
                        ? 'bg-blue-950/80 border-blue-500/70 text-blue-300 shadow-blue-900/30'
                        : result.transaction.decision === 'HOLD'
                        ? 'bg-amber-950/80 border-amber-500/70 text-amber-300 shadow-amber-900/30'
                        : 'bg-rose-950/80 border-rose-500/70 text-rose-300 shadow-rose-900/30'
                    }`}
                  >
                    {result.transaction.decision === 'ALLOW' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                    {result.transaction.decision === 'VERIFY' && <Radio className="w-4 h-4 text-blue-400 animate-pulse" />}
                    {result.transaction.decision === 'HOLD' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    {result.transaction.decision === 'BLOCK' && <Ban className="w-4 h-4 text-rose-400" />}
                    {result.transaction.decision}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Interactive Triggers for Decision */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
              {result.transaction.decision === 'VERIFY' && (
                <button
                  onClick={() => onOpenVerifyModal(result.transaction)}
                  className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono-cyber font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Radio className="w-3.5 h-3.5" />
                  TRIGGER CUSTOMER OTP VERIFY DIALOG
                </button>
              )}

              {result.transaction.decision === 'BLOCK' && (
                <button
                  onClick={() => onOpenBlockedModal(result.transaction)}
                  className="flex-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono-cyber font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Ban className="w-3.5 h-3.5" />
                  TRIGGER INTERCEPT BLOCK DIALOG
                </button>
              )}

              <button
                onClick={() => onOpenDetailModal(result.transaction)}
                className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-cyber transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Full Investigation Dossier</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Explainable AI Explanations Box */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono-cyber font-bold tracking-wider text-slate-200 uppercase flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                WHY WAS THIS FLAGGED? (EXPLAINABLE AI)
              </h3>
              <span className="text-[10px] font-mono-cyber text-slate-500">
                {result.aiExplanation.length} Factors
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              {result.aiExplanation.map((reason, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-slate-300 flex items-start gap-2 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signal Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <h3 className="text-xs font-mono-cyber font-bold tracking-wider text-slate-200 uppercase">
              SIGNAL BREAKDOWN
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { label: 'Transaction Risk', val: result.breakdown.transaction_score },
                { label: 'Behavior Risk', val: result.breakdown.behavior_score },
                { label: 'Device Risk', val: result.breakdown.device_score },
                { label: 'Location Risk', val: result.breakdown.location_score },
                { label: 'Beneficiary Risk', val: result.breakdown.beneficiary_score },
                { label: 'Login Risk', val: result.breakdown.login_score },
                { label: 'Network Risk', val: result.breakdown.network_score },
              ].map((s, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-slate-400 font-mono-cyber text-[11px]">
                    <span>{s.label}</span>
                    <span
                      className={`font-bold ${
                        s.val > 70 ? 'text-rose-400' : s.val > 40 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {s.val} / 100
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        s.val > 70 ? 'bg-rose-500' : s.val > 40 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${s.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hybrid Machine Learning Indicators */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 font-mono-cyber font-bold uppercase text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Hybrid ML Model Engine Diagnostics
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 font-mono-cyber text-[11px]">
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 block text-[9px]">RANDOM FOREST</span>
                <span className="text-white font-bold">{result.anomalyIndicators.randomForestScore} / 100</span>
              </div>

              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 block text-[9px]">ISOLATION FOREST</span>
                <span className="text-white font-bold">{result.anomalyIndicators.isolationForestAnomaly} / 100</span>
              </div>

              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 block text-[9px]">Z-SCORE SPREAD</span>
                <span className="text-white font-bold">{result.anomalyIndicators.behavioralZScore} &sigma;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
