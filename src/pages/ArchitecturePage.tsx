import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Landmark,
  Layers,
  Zap,
  Database,
  Radio,
  Brain,
  Network,
  Settings,
  Shield,
  CheckCircle2,
  AlertTriangle,
  PauseCircle,
  XCircle,
  Bell,
  Smartphone,
  Mail,
  Sliders,
  FileCheck,
  RefreshCw,
  Cloud,
  ArrowRight,
  Clock,
  Play,
  Info,
  Check,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { DEFAULT_FUSION_WEIGHTS, DEFAULT_RISK_THRESHOLDS } from '../services/fraudFusionEngine';

interface ArchitecturePageProps {
  onNavigate?: (tab: string) => void;
}

interface BlockInspector {
  title: string;
  badge: string;
  category: string;
  description: string;
  techStack: string[];
  metrics: { label: string; val: string }[];
  codeSample: string;
}

export const ArchitecturePage: React.FC<ArchitecturePageProps> = ({ onNavigate }) => {
  // Live Interactive Flow Simulator State
  const [activeScenario, setActiveScenario] = useState<'BLOCK' | 'VERIFY' | 'HOLD' | 'ALLOW'>('BLOCK');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(3); // Default fully illuminated
  const [selectedBlock, setSelectedBlock] = useState<BlockInspector | null>(null);

  // Scenario definitions matching architecture
  const scenarios = {
    BLOCK: {
      name: 'Scenario 1: Account Takeover & Blacklist Wire',
      score: 92,
      decision: 'BLOCK',
      xai: [
        { badge: '+ 30', factor: 'New Unrecognized Device', cat: 'Device' },
        { badge: '+ 20', factor: 'New Unverified Beneficiary', cat: 'Beneficiary' },
        { badge: '+ 15', factor: 'Unusual Transaction Amount ($25,000)', cat: 'Amount' },
        { badge: '+ 10', factor: 'Unusual Geolocation Jump (Tor Exit)', cat: 'Location' },
        { badge: '+ 10', factor: 'Unusual Operating Time (03:14 AM)', cat: 'Behavior' },
        { badge: '+ 07', factor: 'High Velocity Burst Activity', cat: 'Velocity' },
      ],
      userAction: 'Push Notification: Suspicious Transaction Intercepted & Blocked',
    },
    VERIFY: {
      name: 'Scenario 2: Medium Anomaly Travel Wire',
      score: 48,
      decision: 'VERIFY',
      xai: [
        { badge: '+ 20', factor: 'New Geolocation (Singapore Airport)', cat: 'Location' },
        { badge: '+ 15', factor: 'Amount exceeds typical median', cat: 'Amount' },
        { badge: '+ 10', factor: '1 Failed Login in prior session', cat: 'Login' },
        { badge: '+ 03', factor: 'Unusual transfer hour', cat: 'Time' },
      ],
      userAction: 'Out-of-Band OTP Challenge dispatched via SMS & Banking App',
    },
    HOLD: {
      name: 'Scenario 3: High-Value Commercial Transfer',
      score: 74,
      decision: 'HOLD',
      xai: [
        { badge: '+ 30', factor: 'New Enterprise Device Fingerprint', cat: 'Device' },
        { badge: '+ 25', factor: 'Amount is 4.8× account monthly average', cat: 'Amount' },
        { badge: '+ 12', factor: 'Unverified Corporate Beneficiary', cat: 'Beneficiary' },
        { badge: '+ 07', factor: 'Anomalous Transfer Route', cat: 'Graph' },
      ],
      userAction: 'Transaction held in secure escrow pending SOC manual analyst signoff',
    },
    ALLOW: {
      name: 'Scenario 4: Regular Trusted Everyday Payment',
      score: 14,
      decision: 'ALLOW',
      xai: [
        { badge: '+ 05', factor: 'Known iPhone 15 Pro Hardware token', cat: 'Device' },
        { badge: '+ 04', factor: 'Routine Geofence (Home Wi-Fi IP)', cat: 'Location' },
        { badge: '+ 03', factor: 'Verified Merchant Beneficiary', cat: 'Beneficiary' },
        { badge: '+ 02', factor: 'Standard Grocery Time Interval', cat: 'Time' },
      ],
      userAction: 'Instant Settlement cleared via sub-20ms Zero-Trust policy',
    },
  };

  const currentScenarioData = scenarios[activeScenario];

  // Run Animated Pipeline Simulation
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setActiveStepIndex(0);

    const stepDuration = 550;
    const totalSteps = 4;

    for (let i = 1; i <= totalSteps; i++) {
      setTimeout(() => {
        setActiveStepIndex(i);
        if (i === totalSteps) {
          setIsSimulating(false);
        }
      }, i * stepDuration);
    }
  };

  const openInspector = (block: BlockInspector) => {
    setSelectedBlock(block);
  };

  return (
    <div className="space-y-6 pb-16 font-sans text-slate-100">
      {/* 1. Header Bar matching blueprint */}
      <div className="rounded-2xl bg-[#091122] border border-cyan-500/30 p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/50 shadow-md shadow-cyan-500/20 text-cyan-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-wide">
                  TrustShield <span className="text-cyan-400">AI</span>
                </h1>
                <span className="text-slate-500 font-light text-xl">|</span>
                <span className="text-lg sm:text-xl font-display font-bold text-slate-200">
                  System Architecture
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-cyber font-bold bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
                  PROBLEM STATEMENT: CDT-04
                </span>
              </div>
              <p className="text-xs sm:text-sm text-cyan-300/90 font-mono-cyber mt-0.5">
                Adaptive Digital Trust &amp; Fraud Intelligence Platform
              </p>
            </div>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-slate-950/80 rounded-xl p-1 border border-slate-800">
              {(['BLOCK', 'VERIFY', 'HOLD', 'ALLOW'] as const).map((scen) => (
                <button
                  key={scen}
                  onClick={() => {
                    setActiveScenario(scen);
                    handleRunSimulation();
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono-cyber font-bold transition-all cursor-pointer ${
                    activeScenario === scen
                      ? scen === 'BLOCK'
                        ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                        : scen === 'VERIFY'
                        ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                        : scen === 'HOLD'
                        ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50'
                        : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {scen}
                </button>
              ))}
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-display font-bold text-xs tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isSimulating ? 'TRACING PIPELINE...' : 'SIMULATE PIPELINE'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Pipeline Status Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs font-mono-cyber">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-slate-400">Current Pipeline Trace:</span>
          <span className="text-white font-bold">{currentScenarioData.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Expected Decision:</span>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              currentScenarioData.decision === 'BLOCK'
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : currentScenarioData.decision === 'VERIFY'
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : currentScenarioData.decision === 'HOLD'
                ? 'bg-orange-950 text-orange-300 border border-orange-800'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}
          >
            {currentScenarioData.decision} ({currentScenarioData.score}/100)
          </span>
        </div>
      </div>

      {/* 2. Top Architecture Pipeline (Blocks 1 to 5) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {/* Block 1: Users */}
        <div
          onClick={() =>
            openInspector({
              title: 'Block 1: Users',
              badge: 'Channel Inputs',
              category: 'Access Layer',
              description: 'Multi-channel identity surface encompassing mobile app, web banking, and SOC admin portal.',
              techStack: ['WebAuthn FIDO2', 'Zero-Trust Device Tokens', 'JWT Dual Token Session'],
              metrics: [
                { label: 'Active Sessions', val: '4,892' },
                { label: 'Auth Token TTL', val: '15 mins' },
                { label: 'Device Biometric', val: 'Enforced' },
              ],
              codeSample: '// Zero-Trust Client Session Header\n{\n  "Authorization": "Bearer eyJhbGciOiJIUzI1...",\n  "X-Device-Fingerprint": "sha256:d8a9e2...",\n  "X-Geo-Context": "12.9716,77.5946"\n}',
            })
          }
          className={`p-4 rounded-xl bg-[#091120] border transition-all cursor-pointer hover:scale-[1.01] ${
            activeStepIndex >= 0 ? 'border-cyan-500/60 shadow-md shadow-cyan-500/10' : 'border-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 text-[11px] font-extrabold flex items-center justify-center font-mono-cyber">
              1
            </span>
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200">
              Users
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center py-2">
            <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center mb-1">
                <User className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold block text-slate-200">Customer</span>
              <span className="text-[9px] font-mono-cyber text-slate-400">(Mobile / Web)</span>
            </div>

            <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center mb-1">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold block text-slate-200">Bank Admin</span>
              <span className="text-[9px] font-mono-cyber text-slate-400">(Dashboard)</span>
            </div>
          </div>
        </div>

        {/* Block 2: Frontend (Web UI) */}
        <div
          onClick={() =>
            openInspector({
              title: 'Block 2: Frontend (Web UI)',
              badge: 'Presentation',
              category: 'Client Layer',
              description: 'Unified single-page application built on modern React.js + Vite with modular Tailwind CSS styling.',
              techStack: ['React 18', 'Vite', 'Tailwind CSS', 'Lucide Icons'],
              metrics: [
                { label: 'Bundle Size', val: '< 180 KB' },
                { label: 'Render Latency', val: '< 16ms (60 FPS)' },
                { label: 'Portals', val: 'Customer + SOC Admin' },
              ],
              codeSample: '// Vite + React Sub-Millisecond Dispatch\nexport const CustomerTransferFlow = () => {\n  const res = await fraudFusionEngine.analyze(payload);\n  return <DecisionGate decision={res.decision} />;\n};',
            })
          }
          className={`p-4 rounded-xl bg-[#091120] border transition-all cursor-pointer hover:scale-[1.01] ${
            activeStepIndex >= 1 ? 'border-cyan-500/60 shadow-md shadow-cyan-500/10' : 'border-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 text-[11px] font-extrabold flex items-center justify-center font-mono-cyber">
              2
            </span>
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200">
              Frontend (Web UI)
            </h3>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-cyan-950/40 border border-cyan-800/40 text-[10px] font-mono-cyber text-cyan-300 mb-2.5">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>React.js + Vite | Tailwind</span>
          </div>

          <ul className="space-y-1.5 text-[11px] text-slate-300 font-mono-cyber">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Customer Banking Interface</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Admin Dashboard</span>
            </li>
          </ul>
        </div>

        {/* Block 3: Backend API */}
        <div
          onClick={() =>
            openInspector({
              title: 'Block 3: Backend API',
              badge: 'Core Services',
              category: 'Microservice Router',
              description: 'Asynchronous REST APIs and persistent WebSocket channels delivering sub-20ms transaction interception.',
              techStack: ['FastAPI / Node Express', 'WebSockets', 'Pydantic Schemas', 'JWT Auth'],
              metrics: [
                { label: 'API Throughput', val: '4,250 req/sec' },
                { label: 'P99 Latency', val: '18.4 ms' },
                { label: 'SSL Termination', val: 'TLS 1.3 / mTLS' },
              ],
              codeSample: '@app.post("/api/v1/transactions/evaluate")\nasync def evaluate_transaction(txn: TransactionInput):\n    score = await fusion_engine.fuse(txn)\n    return {"decision": score.decision, "audit_hash": score.hash}',
            })
          }
          className={`p-4 rounded-xl bg-[#091120] border transition-all cursor-pointer hover:scale-[1.01] ${
            activeStepIndex >= 1 ? 'border-cyan-500/60 shadow-md shadow-cyan-500/10' : 'border-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 text-[11px] font-extrabold flex items-center justify-center font-mono-cyber">
              3
            </span>
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200">
              Backend API
            </h3>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-950/40 border border-indigo-800/40 text-[10px] font-mono-cyber text-indigo-300 mb-2.5">
            <Zap className="w-3 h-3 text-indigo-400" />
            <span>FastAPI | REST + WebSockets</span>
          </div>

          <ul className="space-y-1 text-[11px] text-slate-300 font-mono-cyber">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>Handles requests</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>Business logic</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>Auth &amp; session management</span>
            </li>
          </ul>
        </div>

        {/* Block 4: Database */}
        <div
          onClick={() =>
            openInspector({
              title: 'Block 4: Database',
              badge: 'Persistent Storage',
              category: 'Relational DB',
              description: 'ACID-compliant relational database storing customer profiles, transaction histories, beneficiaries, and audit logs.',
              techStack: ['PostgreSQL 16', 'SQLAlchemy ORM', 'TimescaleDB Partitioning'],
              metrics: [
                { label: 'Active Rows', val: '2.4M records' },
                { label: 'Read Replicas', val: '3 Nodes' },
                { label: 'Encryption', val: 'AES-256 At Rest' },
              ],
              codeSample: 'CREATE TABLE audit_ledger (\n    event_id UUID PRIMARY KEY,\n    prev_hash CHAR(64) NOT NULL,\n    curr_hash CHAR(64) NOT NULL,\n    payload JSONB NOT NULL\n);',
            })
          }
          className={`p-4 rounded-xl bg-[#091120] border transition-all cursor-pointer hover:scale-[1.01] ${
            activeStepIndex >= 2 ? 'border-cyan-500/60 shadow-md shadow-cyan-500/10' : 'border-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 text-[11px] font-extrabold flex items-center justify-center font-mono-cyber">
              4
            </span>
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200">
              Database
            </h3>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-teal-950/40 border border-teal-800/40 text-[10px] font-mono-cyber text-teal-300 mb-2">
            <Database className="w-3 h-3 text-teal-400" />
            <span>PostgreSQL + SQLAlchemy</span>
          </div>

          <ul className="space-y-0.5 text-[10px] text-slate-300 font-mono-cyber">
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-teal-400" />
              <span>Customers &bull; Accounts</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-teal-400" />
              <span>Transactions</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-teal-400" />
              <span>Beneficiaries</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-teal-400" />
              <span>Audit logs</span>
            </li>
          </ul>
        </div>

        {/* Block 5: Event Ingestion */}
        <div
          onClick={() =>
            openInspector({
              title: 'Block 5: Event Ingestion',
              badge: 'Streaming Pipeline',
              category: 'Event Broker',
              description: 'Distributed event streaming buffer collecting high-throughput telemetry from transactions, logins, and devices.',
              techStack: ['Apache Kafka', 'WebSocket Multiplex', 'Avro Schema Registry'],
              metrics: [
                { label: 'Event Ingest Rate', val: '14,200 msg/sec' },
                { label: 'Queue Lag', val: '< 2ms' },
                { label: 'Retention Window', val: '30 Days' },
              ],
              codeSample: '// Kafka Event Producer Schema\nproducer.send("banking.transaction.events", {\n  key: customer_id,\n  value: {\n    amount: 1450.00,\n    device_id: "dev-8819",\n    timestamp: 1726918400\n  }\n});',
            })
          }
          className={`p-4 rounded-xl bg-[#091120] border transition-all cursor-pointer hover:scale-[1.01] ${
            activeStepIndex >= 2 ? 'border-cyan-500/60 shadow-md shadow-cyan-500/10' : 'border-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 text-[11px] font-extrabold flex items-center justify-center font-mono-cyber">
              5
            </span>
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200">
              Event Ingestion
            </h3>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-950/40 border border-blue-800/40 text-[10px] font-mono-cyber text-blue-300 mb-2">
            <Radio className="w-3 h-3 text-blue-400" />
            <span>Kafka / WebSockets</span>
          </div>

          <ul className="space-y-0.5 text-[10px] text-slate-300 font-mono-cyber">
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-blue-400" />
              <span>Transaction events</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-blue-400" />
              <span>Login activity</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-blue-400" />
              <span>Device &amp; location</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-blue-400" />
              <span>Session data</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Directional Indicator to AI Layer */}
      <div className="flex items-center justify-center">
        <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono-cyber text-cyan-400 flex items-center gap-2">
          <span>Continuous Real-Time Telemetry Feed</span>
          <ArrowRight className="w-3.5 h-3.5 rotate-90" />
        </div>
      </div>

      {/* 3. AI & Analytics Layer (Major Middle Section) */}
      <div className="rounded-2xl bg-[#070e1c] border-2 border-indigo-900/60 p-5 shadow-2xl relative">
        {/* Banner Label */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center font-mono-cyber shadow-sm">
              6
            </span>
            <h2 className="text-sm sm:text-base font-display font-extrabold uppercase tracking-wider text-white">
              AI &amp; Analytics Layer
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-cyber font-bold bg-indigo-950 border border-indigo-700/60 text-indigo-300">
              Deterministic + ML + Graph Fusion
            </span>
          </div>

          <span className="text-[11px] font-mono-cyber text-slate-400 hidden sm:inline">
            Execution Latency: <strong className="text-emerald-400">18.4ms</strong>
          </span>
        </div>

        {/* 5 Interconnected Sub-Engines */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Sub-block 1: Digital Trust Profile */}
          <div
            onClick={() =>
              openInspector({
                title: 'Digital Trust Profile Engine',
                badge: 'Behavioral Baseline',
                category: 'AI Feature Store',
                description: 'Builds a dynamic, evolving baseline model for each retail and corporate account holder.',
                techStack: ['Feature Store', 'Rolling Statistical Windows', 'Z-Score Normalization'],
                metrics: [
                  { label: 'Monitored Dimensions', val: '24 Variables' },
                  { label: 'Profile Update Speed', val: 'Continuous' },
                  { label: 'False Positive Ratio', val: '< 0.08%' },
                ],
                codeSample: '// Digital Trust Profile Evaluation\nconst zScore = (amount - profile.avgAmount) / profile.stdDev;\nconst isKnownDevice = profile.devices.includes(currentDeviceId);',
              })
            }
            className="p-3.5 rounded-xl bg-slate-950/70 border border-rose-900/40 hover:border-rose-500/60 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2 text-rose-400">
              <div className="w-7 h-7 rounded-lg bg-rose-950/60 border border-rose-800/60 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <h4 className="font-display font-bold text-xs text-white">
                Digital Trust Profile
              </h4>
            </div>

            <ul className="space-y-1.5 text-[11px] text-slate-300 font-mono-cyber pt-1">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>Spending pattern</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>Login behavior</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>Devices &amp; locations</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>Beneficiaries</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>Transaction frequency</span>
              </li>
            </ul>
          </div>

          {/* Sub-block 2: Hybrid AI Engine */}
          <div
            onClick={() =>
              openInspector({
                title: 'Hybrid AI Engine',
                badge: 'Supervised + Unsupervised',
                category: 'Machine Learning',
                description: 'Dual ensemble combining supervised gradient boosting for known fraud signatures with unsupervised isolation forests for zero-day spatial anomalies.',
                techStack: ['XGBoost', 'Random Forest (100 Trees)', 'Isolation Forest', 'Z-Score Gaussian'],
                metrics: [
                  { label: 'AUC-ROC', val: '0.984' },
                  { label: 'Inference Latency', val: '6.2ms' },
                  { label: 'Drift Threshold', val: 'PSI < 0.10' },
                ],
                codeSample: '# Dual Inference Vector\nrf_prob = rf_model.predict_proba(feature_vector)[0][1]\nif_score = isolation_forest.decision_function(feature_vector)[0]\nml_fused = (rf_prob * 0.6) + (norm_if * 0.4)',
              })
            }
            className="p-3.5 rounded-xl bg-slate-950/70 border border-blue-900/40 hover:border-blue-500/60 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2 text-blue-400">
              <div className="w-7 h-7 rounded-lg bg-blue-950/60 border border-blue-800/60 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <h4 className="font-display font-bold text-xs text-white">
                Hybrid AI Engine
              </h4>
            </div>

            <div className="space-y-2 pt-1">
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono-cyber font-bold text-blue-300 block">
                  XGBoost / Random Forest
                </span>
                <span className="text-[9px] font-mono-cyber text-slate-400">
                  (Known fraud patterns)
                </span>
              </div>

              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono-cyber font-bold text-cyan-300 block">
                  Isolation Forest
                </span>
                <span className="text-[9px] font-mono-cyber text-slate-400">
                  (Unusual behavior / Outliers)
                </span>
              </div>

              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono-cyber font-bold text-emerald-300 block">
                  Behavioral Analysis
                </span>
                <span className="text-[9px] font-mono-cyber text-slate-400">
                  (Deviation from baseline)
                </span>
              </div>
            </div>
          </div>

          {/* Sub-block 3: Fraud Intelligence Graph */}
          <div
            onClick={() =>
              openInspector({
                title: 'Fraud Intelligence Graph',
                badge: 'Topology Engine',
                category: 'Graph Network',
                description: 'Entity graph tracing money mule networks, circular payment rings, and shared IP/device collusions across accounts.',
                techStack: ['NetworkX / Neo4j', 'PageRank', 'Community Detection (Louvain)'],
                metrics: [
                  { label: 'Graph Nodes', val: '184,200' },
                  { label: 'Max Hop Radius', val: '3 Hops' },
                  { label: 'Mule Ring Detection', val: 'Active' },
                ],
                codeSample: '// Subgraph Centrality Query\nMATCH (a:Account)-[:TRANSFERRED_TO]->(b:Beneficiary)\nMATCH (b)-[:SHARED_DEVICE]->(d:Device)<-[:SHARED_DEVICE]-(c:Account)\nRETURN a, b, d, c LIMIT 25;',
              })
            }
            className="p-3.5 rounded-xl bg-slate-950/70 border border-teal-900/40 hover:border-teal-500/60 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-1 text-teal-400">
                <div className="w-7 h-7 rounded-lg bg-teal-950/60 border border-teal-800/60 flex items-center justify-center">
                  <Network className="w-4 h-4" />
                </div>
                <h4 className="font-display font-bold text-xs text-white">
                  Fraud Intelligence Graph
                </h4>
              </div>
              <span className="text-[10px] font-mono-cyber text-teal-300/80 block mb-2">
                Detects connected fraud
              </span>
            </div>

            {/* Visual Mini Graph Simulation matching blueprint */}
            <div className="my-auto py-2">
              <div className="relative w-full h-28 bg-[#040810] rounded-lg border border-slate-800/80 p-2 flex items-center justify-center overflow-hidden">
                {/* Connecting SVG lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-cyan-500/40 stroke-1">
                  <line x1="25%" y1="30%" x2="50%" y2="20%" />
                  <line x1="50%" y1="20%" x2="75%" y2="30%" />
                  <line x1="50%" y1="20%" x2="50%" y2="60%" />
                  <line x1="25%" y1="70%" x2="50%" y2="60%" />
                  <line x1="75%" y1="70%" x2="50%" y2="60%" />
                </svg>

                {/* Nodes */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-blue-950 border border-blue-500 text-[9px] font-mono-cyber text-blue-300 flex items-center gap-1">
                  <Laptop className="w-2.5 h-2.5" />
                  <span>Device</span>
                </div>

                <div className="absolute top-8 left-3 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[9px] font-mono-cyber text-slate-300 flex items-center gap-1">
                  <Landmark className="w-2.5 h-2.5" />
                  <span>Account</span>
                </div>

                <div className="absolute top-8 right-3 px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500 text-[9px] font-mono-cyber text-purple-300 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5" />
                  <span>IP</span>
                </div>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-[10px] font-bold font-mono-cyber text-cyan-300 flex items-center gap-1 shadow-sm shadow-cyan-500/30">
                  <User className="w-3 h-3" />
                  <span>Account</span>
                </div>

                <div className="absolute bottom-2 left-3 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-[9px] font-mono-cyber text-emerald-300">
                  Beneficiary
                </div>

                <div className="absolute bottom-2 right-3 px-1.5 py-0.5 rounded bg-amber-950 border border-amber-500 text-[9px] font-mono-cyber text-amber-300">
                  Location
                </div>
              </div>
            </div>

            <span className="text-[9px] font-mono-cyber text-center text-slate-400">
              Coordinated Syndicate &bull; Device Rings
            </span>
          </div>

          {/* Sub-block 4: Fraud Fusion Engine */}
          <div
            onClick={() =>
              openInspector({
                title: 'Fraud Fusion Engine',
                badge: 'Multi-Signal Synthesizer',
                category: 'Deterministic Core',
                description: 'Combines 7 independent risk vectors into a normalized, transparent 0-100 composite risk score.',
                techStack: ['Weighted Multi-Signal Synthesizer', 'Calibrated Sigmoid Bounds', 'Heuristic Overrides'],
                metrics: [
                  { label: 'Signal Vectors', val: '7 Dimensions' },
                  { label: 'Weight Total', val: '100% (1.00)' },
                  { label: 'Score Scale', val: '0 – 100' },
                ],
                codeSample: '// 7-Signal Mathematical Fusion\nconst score = (\n  signals.transaction * 0.25 +\n  signals.behavior * 0.20 +\n  signals.device * 0.15 +\n  signals.login * 0.10 +\n  signals.beneficiary * 0.10 +\n  signals.graph * 0.10 +\n  signals.velocity * 0.10\n);',
              })
            }
            className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-900/40 hover:border-amber-500/60 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-1 text-amber-400">
                <div className="w-7 h-7 rounded-lg bg-amber-950/60 border border-amber-800/60 flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <h4 className="font-display font-bold text-xs text-white">
                  Fraud Fusion Engine
                </h4>
              </div>
              <span className="text-[10px] font-mono-cyber text-amber-300/80 block mb-2">
                Combines multiple risk signals
              </span>
            </div>

            {/* Exact 7 Signal Weights matching blueprint */}
            <div className="space-y-1 bg-[#050a14] p-2 rounded-lg border border-slate-800/80 text-[10px] font-mono-cyber">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Transaction Risk
                </span>
                <strong className="text-cyan-300">25%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  Behavior Risk
                </span>
                <strong className="text-rose-300">20%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Device Risk
                </span>
                <strong className="text-amber-300">15%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Login Risk
                </span>
                <strong className="text-blue-300">10%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Beneficiary Risk
                </span>
                <strong className="text-purple-300">10%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Graph Risk
                </span>
                <strong className="text-indigo-300">10%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  Velocity Risk
                </span>
                <strong className="text-teal-300">10%</strong>
              </div>
            </div>

            <div className="mt-2 text-center p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/40">
              <span className="text-[10px] font-mono-cyber font-bold text-amber-300">
                Fraud Fusion Score &bull; 0 – 100
              </span>
            </div>
          </div>

          {/* Sub-block 5: Adaptive Security Engine */}
          <div
            onClick={() =>
              openInspector({
                title: 'Adaptive Security Engine',
                badge: 'Decision Gateway',
                category: 'Enforcement Core',
                description: 'Enforces dynamic risk-based intervention: instantaneous clearance, stepped-up biometric challenge, escrow hold, or hard block.',
                techStack: ['Policy Enforcement Point (PEP)', 'Adaptive 2FA Gateway', 'SOC Escrow State Machine'],
                metrics: [
                  { label: 'Decision Policies', val: '4 Tiers' },
                  { label: 'Escrow Release SLA', val: '< 5 Mins' },
                  { label: 'Zero-Trust Gate', val: '100% Transactions' },
                ],
                codeSample: '// Adaptive Decision Routing\nif (score <= 30) return "ALLOW";\nif (score <= 60) return "VERIFY";\nif (score <= 80) return "HOLD";\nreturn "BLOCK";',
              })
            }
            className="p-3.5 rounded-xl bg-slate-950/70 border border-indigo-900/40 hover:border-indigo-500/60 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-1 text-indigo-400">
                <div className="w-7 h-7 rounded-lg bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <h4 className="font-display font-bold text-xs text-white">
                  Adaptive Security Engine
                </h4>
              </div>
              <span className="text-[10px] font-mono-cyber text-indigo-300/80 block mb-2">
                Risk-based decision
              </span>
            </div>

            {/* Exact 4 decisions & thresholds matching blueprint */}
            <div className="space-y-1.5">
              <div
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all ${
                  currentScenarioData.decision === 'ALLOW'
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] font-bold">ALLOW</span>
                </div>
                <span className="text-[10px] font-mono-cyber text-emerald-400">(0 – 30)</span>
              </div>

              <div
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all ${
                  currentScenarioData.decision === 'VERIFY'
                    ? 'bg-amber-950/80 border-amber-400 text-amber-200 ring-2 ring-amber-500/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-bold">VERIFY</span>
                </div>
                <span className="text-[10px] font-mono-cyber text-amber-400">(31 – 60)</span>
              </div>

              <div
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all ${
                  currentScenarioData.decision === 'HOLD'
                    ? 'bg-orange-950/80 border-orange-400 text-orange-200 ring-2 ring-orange-500/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <PauseCircle className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-[11px] font-bold">HOLD</span>
                </div>
                <span className="text-[10px] font-mono-cyber text-orange-400">(61 – 80)</span>
              </div>

              <div
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all ${
                  currentScenarioData.decision === 'BLOCK'
                    ? 'bg-rose-950/80 border-rose-400 text-rose-200 ring-2 ring-rose-500/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-[11px] font-bold">BLOCK</span>
                </div>
                <span className="text-[10px] font-mono-cyber text-rose-400">(81 – 100)</span>
              </div>
            </div>

            <span className="text-[9px] font-mono-cyber text-center text-slate-400 mt-2 block">
              Continuous Zero-Trust Policy
            </span>
          </div>
        </div>
      </div>

      {/* Directional Indicator to Downstream Closed Loop */}
      <div className="flex items-center justify-center">
        <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono-cyber text-indigo-400 flex items-center gap-2">
          <span>Downstream Closed-Loop Enforcement &amp; Learning</span>
          <ArrowRight className="w-3.5 h-3.5 rotate-90" />
        </div>
      </div>

      {/* 4. Bottom Row (Closed-Loop Enforcement, Explainability & Federation) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Customer Alert & Response */}
        <div
          onClick={() =>
            openInspector({
              title: 'Customer Alert & Response',
              badge: 'Real-time Channel',
              category: 'Engagement Layer',
              description: 'Instant multi-channel push alerting customer with one-touch confirm/deny capabilities.',
              techStack: ['Web Push Notifications', 'Twilio SMS Gateway', 'SendGrid Email API'],
              metrics: [
                { label: 'Dispatch Latency', val: '< 400ms' },
                { label: 'Customer Confirm Rate', val: '94.2%' },
                { label: 'Channel Priority', val: 'App > SMS > Email' },
              ],
              codeSample: '// Out-of-Band Push Notification\nawait pushService.send({\n  userId: customerId,\n  title: "Unusual Transfer Detected",\n  actions: ["ALLOW_TRANSACTION", "FREEZE_ACCOUNT"]\n});',
            })
          }
          className="p-4 rounded-xl bg-[#091120] border border-blue-900/40 hover:border-blue-500/60 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-2 text-blue-400">
              <Bell className="w-4 h-4" />
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200">
                Customer Alert &amp; Response
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-1.5 py-2 text-center">
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                <Smartphone className="w-3.5 h-3.5 mx-auto text-blue-400 mb-0.5" />
                <span className="text-[10px] font-bold font-mono-cyber text-slate-300">SMS</span>
              </div>
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                <Mail className="w-3.5 h-3.5 mx-auto text-cyan-400 mb-0.5" />
                <span className="text-[10px] font-bold font-mono-cyber text-slate-300">Email</span>
              </div>
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 mx-auto text-emerald-400 mb-0.5" />
                <span className="text-[10px] font-bold font-mono-cyber text-slate-300">App</span>
              </div>
            </div>

            <ul className="space-y-1 text-[11px] text-slate-300 font-mono-cyber pt-1">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Transaction alerts</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Confirm / Deny</span>
              </li>
            </ul>
          </div>

          <div className="mt-2 p-1.5 rounded bg-blue-950/60 border border-blue-800/60 text-[10px] font-mono-cyber text-blue-300">
            Active: One-Touch Feedback
          </div>
        </div>

        {/* Explainable AI */}
        <div
          onClick={() =>
            openInspector({
              title: 'Explainable AI (XAI)',
              badge: 'Feature Attribution',
              category: 'Regulatory Compliance',
              description: 'SHAP & LIME-inspired mathematical attribution showing operators and customers exact factor-by-factor contributions to the risk score.',
              techStack: ['SHAP Attribution Engine', 'TreeSHAP', 'Regulatory Audit Exporter'],
              metrics: [
                { label: 'Attribution Depth', val: 'Exact Point Delta' },
                { label: 'Compliance Level', val: 'FinCEN / GDPR / RBI' },
                { label: 'Explainability SLA', val: '< 2ms' },
              ],
              codeSample: '// Explainable AI Contribution Breakdown\n[\n  { "factor": "New Device", "points": +30 },\n  { "factor": "New Beneficiary", "points": +20 },\n  { "factor": "Unusual Amount", "points": +15 }\n]',
            })
          }
          className="p-4 rounded-xl bg-[#091120] border border-purple-900/40 hover:border-purple-500/60 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1 text-purple-400">
              <Sliders className="w-4 h-4" />
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200">
                Explainable AI
              </h3>
            </div>
            <span className="text-[10px] font-mono-cyber text-purple-300/80 block mb-2">
              Shows why the decision was made
            </span>

            {/* Dynamic Example Risk Score Badge matching blueprint */}
            <div className="px-2 py-1 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-center text-xs font-mono-cyber font-bold mb-2">
              Example Risk Score: {currentScenarioData.score}/100
            </div>

            {/* Attribution Items matching blueprint (+30, +20, +15, +10, +10, +07) */}
            <div className="space-y-1 text-[10px] font-mono-cyber">
              {currentScenarioData.xai.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-300">
                  <strong className="text-rose-400 font-bold">{item.badge}</strong>
                  <span className="truncate ml-1 text-right">{item.factor}</span>
                </div>
              ))}
            </div>
          </div>

          <span className="text-[9px] font-mono-cyber text-purple-400 text-center mt-2 block">
            Regulatory Compliance Ready
          </span>
        </div>

        {/* Audit & Evidence Chain */}
        <div
          onClick={() =>
            openInspector({
              title: 'Audit & Evidence Chain',
              badge: 'Cryptographic Ledger',
              category: 'Integrity',
              description: 'Cryptographically linked hash chain recording every decision, override, telemetry factor, and investigator review note.',
              techStack: ['SHA-256 Merkle Chain', 'Tamper-Evident Ledger', 'PDF Audit Exporter'],
              metrics: [
                { label: 'Ledger State', val: 'Verified 100%' },
                { label: 'Hash Collision Risk', val: 'Zero (< 10^-77)' },
                { label: 'Analyst Non-Repudiation', val: 'Enforced' },
              ],
              codeSample: '// SHA-256 Tamper-Evident Event Hash\nconst eventHash = crypto.createHash("sha256")\n  .update(`${eventNumber}:${timestamp}:${prevHash}:${action}`)\n  .digest("hex");',
            })
          }
          className="p-4 rounded-xl bg-[#091120] border border-cyan-900/40 hover:border-cyan-500/60 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-2 text-cyan-400">
              <FileCheck className="w-4 h-4" />
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200">
                Audit &amp; Evidence Chain
              </h3>
            </div>

            <ul className="space-y-1 text-[11px] text-slate-300 font-mono-cyber">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Decision logs</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Risk factors</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Transaction details</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Customer response</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Investigator notes</span>
              </li>
            </ul>
          </div>

          <div className="mt-2 p-1.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-[10px] font-mono-cyber text-cyan-300 text-center">
            SHA-256 Chain Verified
          </div>
        </div>

        {/* Continuous Learning */}
        <div
          onClick={() =>
            openInspector({
              title: 'Continuous Learning & MLOps',
              badge: 'Adaptive Loop',
              category: 'ML Maintenance',
              description: 'Feedback loop updating model weights from confirmed fraud disputes, customer confirms, and SOC overrides while preventing concept drift.',
              techStack: ['MLflow', 'Population Stability Index (PSI)', 'Shadow Model Canary Deployment'],
              metrics: [
                { label: 'Retraining Cycle', val: 'Weekly / On Drift' },
                { label: 'Concept Drift Monitor', val: 'Active 24/7' },
                { label: 'Feedback Ingestion', val: 'Real-Time' },
              ],
              codeSample: '// Feedback Drift Monitor\nif (calculatePSI(productionFeatures, baselineFeatures) > 0.15) {\n    triggerCanaryRetrainingPipeline();\n}',
            })
          }
          className="p-4 rounded-xl bg-[#091120] border border-indigo-900/40 hover:border-indigo-500/60 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1 text-indigo-400">
              <RefreshCw className="w-4 h-4" />
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200">
                Continuous Learning
              </h3>
            </div>
            <span className="text-[10px] font-mono-cyber text-indigo-300/80 block mb-2">
              Improves with new data
            </span>

            <ul className="space-y-1 text-[11px] text-slate-300 font-mono-cyber">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Customer feedback</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Fraud team decisions</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Model retraining</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Drift monitoring</span>
              </li>
            </ul>
          </div>

          <div className="mt-2 p-1.5 rounded bg-indigo-950/60 border border-indigo-800/60 text-[10px] font-mono-cyber text-indigo-300 text-center">
            Zero-Downtime Model Swap
          </div>
        </div>

        {/* Future Extension: Federated Learning */}
        <div
          onClick={() =>
            openInspector({
              title: 'Future Extension: Federated Learning',
              badge: 'Privacy-Preserving AI',
              category: 'Cross-Bank Consortium',
              description: 'Collaborative fraud intelligence sharing across consortium banks without transferring private customer PII or raw transaction records.',
              techStack: ['Federated Averaging (FedAvg)', 'Differential Privacy', 'Secure Multi-Party Computation'],
              metrics: [
                { label: 'Consortium Nodes', val: 'Simulated 3 Banks' },
                { label: 'Raw Data Shared', val: '0% (Gradients Only)' },
                { label: 'Syndicate Defense', val: '+38% Catch Rate' },
              ],
              codeSample: '// Federated Gradient Aggregation\nglobal_weights = sum(n_k / N * w_k for k in banks)\napply_differential_privacy_noise(global_weights, epsilon=0.5);',
            })
          }
          className="p-4 rounded-xl bg-[#091120] border border-blue-900/40 hover:border-blue-500/60 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1 text-blue-400">
              <Cloud className="w-4 h-4" />
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200">
                Future Extension
              </h3>
            </div>
            <span className="text-[10px] font-mono-cyber text-blue-300/80 block mb-2">
              Federated Learning
            </span>

            {/* Visual Bank Cluster Graphic matching blueprint */}
            <div className="py-2 flex items-center justify-center">
              <div className="relative w-full h-16 bg-[#040810] rounded-lg border border-slate-800 flex items-center justify-around px-2">
                <div className="text-center">
                  <Landmark className="w-4 h-4 mx-auto text-slate-400" />
                  <span className="text-[8px] font-mono-cyber text-slate-500">Bank A</span>
                </div>

                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shadow-md shadow-cyan-500/20">
                  <Lock className="w-3 h-3 text-cyan-400" />
                </div>

                <div className="text-center">
                  <Landmark className="w-4 h-4 mx-auto text-slate-400" />
                  <span className="text-[8px] font-mono-cyber text-slate-500">Bank B</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] font-mono-cyber text-slate-300 text-center leading-snug">
              Cross-bank collaboration without sharing raw data
            </p>
          </div>

          <div className="mt-2 p-1.5 rounded bg-blue-950/60 border border-blue-800/60 text-[10px] font-mono-cyber text-blue-300 text-center">
            Consortium Ready
          </div>
        </div>
      </div>

      {/* 5. Footer Bar matching blueprint */}
      <div className="rounded-2xl bg-[#091122] border border-cyan-500/30 p-3 sm:p-4 text-xs font-mono-cyber shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-around gap-3 text-center">
          <div className="flex items-center gap-2 text-white font-display font-bold">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>TrustShield AI</span>
          </div>

          <span className="hidden sm:inline text-slate-600">|</span>

          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Real-time Protection</span>
          </div>

          <span className="hidden sm:inline text-slate-600">|</span>

          <div className="flex items-center gap-2 text-slate-300">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span>Smarter Decisions</span>
          </div>

          <span className="hidden sm:inline text-slate-600">|</span>

          <div className="flex items-center gap-2 text-slate-300">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Safer Banking</span>
          </div>
        </div>
      </div>

      {/* Block Inspector Modal */}
      {selectedBlock && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-[#0a1220] border border-cyan-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono-cyber text-cyan-400 uppercase tracking-wider block">
                  {selectedBlock.category} &bull; {selectedBlock.badge}
                </span>
                <h3 className="text-lg font-display font-bold text-white">
                  {selectedBlock.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBlock(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-mono-cyber cursor-pointer"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono-cyber">
              {selectedBlock.description}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2">
              {selectedBlock.metrics.map((m, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] font-mono-cyber text-slate-400 block">{m.label}</span>
                  <strong className="text-xs font-mono-cyber text-cyan-300">{m.val}</strong>
                </div>
              ))}
            </div>

            {/* Tech Stack */}
            <div>
              <span className="text-[11px] font-mono-cyber text-slate-400 block mb-1.5">
                Technologies &amp; Libraries:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedBlock.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-[10px] font-mono-cyber"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Code / Schema Excerpt */}
            <div>
              <span className="text-[11px] font-mono-cyber text-slate-400 block mb-1.5">
                Architecture Implementation Excerpt:
              </span>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono-cyber text-cyan-300 overflow-x-auto">
                {selectedBlock.codeSample}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
