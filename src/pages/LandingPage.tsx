import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Lock,
  ArrowRight,
  Activity,
  Network,
  Eye,
  CheckCircle2,
  Radio,
  Sparkles,
  UserPlus,
  CreditCard,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewDemo: () => void;
  onOpenAccount?: () => void;
  onViewCustomerDemo?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onViewDemo,
  onOpenAccount,
  onViewCustomerDemo,
}) => {
  const pillars = [
    {
      icon: Activity,
      title: 'Real-Time Detection',
      desc: 'Sub-20ms multi-modal transaction ingestion and fraud scoring before fund settlement.',
    },
    {
      icon: Eye,
      title: 'Behavioral Intelligence',
      desc: 'Continuous profiling of biometric cadences, habitual geofences, and spending velocity.',
    },
    {
      icon: Cpu,
      title: 'Fraud Fusion Score',
      desc: 'Unified 0–100 deterministic risk synthesis blending Random Forest, Isolation Forest & rules.',
    },
    {
      icon: ShieldCheck,
      title: 'Adaptive Security',
      desc: 'Autonomous policy actions: ALLOW, VERIFY with stepped-up OTP, HOLD in escrow, or BLOCK.',
    },
    {
      icon: Sparkles,
      title: 'Explainable AI',
      desc: 'Human-readable attribution reasons and signal weights for risk officers and regulatory compliance.',
    },
    {
      icon: Network,
      title: 'Fraud Intelligence Graph',
      desc: 'Real-time graph analytics mapping device emulators, mule rings, and coordinated syndicate nodes.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#060b13] text-slate-100 cyber-grid-bg relative overflow-hidden flex flex-col justify-between">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="font-display font-bold text-xl tracking-wider text-white">
            TRUSTSHIELD <span className="text-cyan-400">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-cyber">
          {onOpenAccount && (
            <button
              onClick={onOpenAccount}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open Digital Account</span>
            </button>
          )}

          <button
            onClick={onGetStarted}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono-cyber mb-6">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>CYBERSECURITY &amp; DIGITAL TRUST ARCHITECTURE &bull; CDT-04</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight max-w-4xl leading-[1.1]">
          TRUSTSHIELD <span className="text-cyan-400">AI</span>
        </h1>
        <p className="font-display text-xl sm:text-2xl text-cyan-200 mt-2 font-semibold">
          AI-POWERED BANKING FRAUD DETECTION &amp; DIGITAL TRUST PLATFORM
        </p>

        <p className="mt-4 max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
          Autonomous defense platform uniting retail digital banking with real-time SOC operations. Continuously profiling multi-dimensional customer behavioral telemetry, hybrid machine learning, and zero-trust adaptive verification.
        </p>

        {/* Dual Mode Entry Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onViewCustomerDemo || onViewDemo}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-display font-bold text-sm tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>LAUNCH CUSTOMER BANKING APP</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onViewDemo}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-sm tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>LAUNCH SOC ADMIN CENTER</span>
          </button>
        </div>

        {/* Visual Pipeline Strip */}
        <div className="mt-14 w-full max-w-4xl p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <div className="text-[11px] font-mono-cyber text-slate-400 uppercase tracking-wider mb-3">
            Autonomous Decision Pipeline
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono-cyber">
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
              Customer Telemetry
            </span>
            <span className="text-cyan-400">&rarr;</span>
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
              Digital Trust Score
            </span>
            <span className="text-cyan-400">&rarr;</span>
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
              Neural Fraud Fusion
            </span>
            <span className="text-cyan-400">&rarr;</span>
            <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">
              ALLOW / VERIFY / HOLD / BLOCK
            </span>
            <span className="text-cyan-400">&rarr;</span>
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-300">
              Immutable Audit Chain
            </span>
          </div>
        </div>

        {/* 6 Core Pillars Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl text-left">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-display font-semibold text-white text-sm">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-800/80 py-4 px-6 text-center text-xs font-mono-cyber text-slate-500">
        TrustShield AI &bull; Cybersecurity &amp; Digital Trust Solution &bull; Production Prototype
      </footer>
    </div>
  );
};
