import React from 'react';
import {
  Cpu,
  Layers,
  GitBranch,
  Shield,
  Activity,
  CheckCircle2,
  Sliders,
  Network,
  Eye,
  AlertTriangle,
  ArrowRight,
  Database,
  Lock,
} from 'lucide-react';
import { DEFAULT_FUSION_WEIGHTS } from '../services/fraudFusionEngine';

interface AiEnginePageProps {
  onNavigateToArchitecture?: () => void;
}

export const AiEnginePage: React.FC<AiEnginePageProps> = ({ onNavigateToArchitecture }) => {
  const architectureLayers = [
    {
      num: '01',
      name: 'Deterministic Rule Engine',
      desc: 'Instant regex, statutory AML sanction checks, velocity bounds, and Central Crime Blacklist lookups.',
      latency: '< 1ms',
      badge: 'Hard Policies',
    },
    {
      num: '02',
      name: 'Dynamic Behavioral Profiler',
      desc: 'Real-time statistical anomaly calculation (Z-scores) against customer historical baseline.',
      latency: '3ms',
      badge: 'Z-Score Gaussian',
    },
    {
      num: '03',
      name: 'Dual Hybrid ML Models',
      desc: 'Random Forest classifier for known attack patterns + Isolation Forest for zero-day out-of-distribution fraud.',
      latency: '8ms',
      badge: 'Supervised + Unsupervised',
    },
    {
      num: '04',
      name: 'Graph Entity Intelligence',
      desc: 'Topological centrality and community detection tracing money mule syndicates and shared devices.',
      latency: '5ms',
      badge: 'Sub-Graph Analysis',
    },
    {
      num: '05',
      name: 'Fraud Fusion Aggregator',
      desc: 'Multi-signal mathematical synthesis normalizes disparate risk vectors into a calibrated 0–100 score.',
      latency: '1ms',
      badge: 'Deterministic Weights',
    },
    {
      num: '06',
      name: 'Adaptive Decision Engine',
      desc: 'Continuous real-time enforcement: ALLOW, VERIFY with stepped-up OTP, HOLD in escrow, or hard BLOCK.',
      latency: '< 1ms',
      badge: 'Adaptive Policy',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Cpu className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-display font-bold text-white tracking-wide">
              Hybrid AI Architecture &amp; Fraud Fusion Engine
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic, explainable, and production-grade architecture combining heuristic rules, ML classification, and graph topology.
          </p>
        </div>

        {onNavigateToArchitecture && (
          <button
            onClick={onNavigateToArchitecture}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono-cyber transition-all cursor-pointer shadow-sm shadow-cyan-500/10"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>SYSTEM ARCHITECTURE BLUEPRINT</span>
          </button>
        )}
      </div>

      {/* Interactive Visual Pipeline */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xs font-mono-cyber font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            END-TO-END INFERENCE &amp; DECISION PIPELINE
          </h2>
          <span className="text-[10px] font-mono-cyber text-slate-400">TOTAL LATENCY: ~18 MS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {architectureLayers.map((layer) => (
            <div
              key={layer.num}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-cyber text-lg font-bold text-cyan-400">{layer.num}</span>
                <span className="text-[10px] font-mono-cyber px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  {layer.latency}
                </span>
              </div>

              <h3 className="font-display font-bold text-sm text-white">{layer.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{layer.desc}</p>

              <div className="pt-2">
                <span className="inline-block text-[10px] font-mono-cyber text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
                  {layer.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fraud Fusion Weight Matrix & Mathematical Formula */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mathematical Formulation */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
          <h3 className="text-xs font-mono-cyber font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            FRAUD FUSION MATHEMATICAL FORMULATION
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The Fraud Fusion Score $S \in [0, 100]$ synthesizes weighted independent risk signals into a single normalized index:
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono-cyber text-xs text-cyan-300 space-y-2 overflow-x-auto">
            <div>Score = &sum; ( w_i &times; Risk_i )</div>
            <div className="text-[11px] text-slate-400">
              = 0.25&times;Txn + 0.20&times;Behavior + 0.15&times;Device + 0.10&times;Login + 0.10&times;Beneficiary + 0.10&times;Graph + 0.10&times;Velocity
            </div>
            <div className="text-[11px] text-amber-300/90 pt-1 border-t border-slate-800">
              Rule Override: If Blacklisted &rarr; Score = Max(Score, 95), Decision = BLOCK
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-1.5 pt-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Strict determinism guarantees zero hallucinated decisions.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full mathematical explainability for regulatory audits (RBI, FinCEN).</span>
            </div>
          </div>
        </div>

        {/* Fusion Signal Weights Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
          <h3 className="text-xs font-mono-cyber font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            STANDARD WEIGHT VECTOR COEFFICIENTS
          </h3>

          <div className="space-y-2.5 text-xs">
            {[
              { name: 'Transaction Risk', weight: 0.25, pct: '25%' },
              { name: 'Behavior Risk', weight: 0.20, pct: '20%' },
              { name: 'Device Risk', weight: 0.15, pct: '15%' },
              { name: 'Login Risk', weight: 0.10, pct: '10%' },
              { name: 'Beneficiary Risk', weight: 0.10, pct: '10%' },
              { name: 'Graph Risk', weight: 0.10, pct: '10%' },
              { name: 'Velocity Risk', weight: 0.10, pct: '10%' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-mono-cyber text-[11px]">
                  <span className="text-slate-300">{item.name}</span>
                  <span className="text-cyan-400 font-bold">{item.pct}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: item.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
