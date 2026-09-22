import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  FlaskConical,
  Users,
  ShieldAlert,
  Network,
  Bell,
  LineChart,
  Cpu,
  Settings,
  Sliders,
  CheckCircle2,
  Lock,
  Hash,
  UserCheck,
  Layers,
} from 'lucide-react';

export type NavPage =
  | 'dashboard'
  | 'architecture'
  | 'transactions'
  | 'simulator'
  | 'customers'
  | 'risk-analysis'
  | 'fraud-graph'
  | 'alerts'
  | 'analytics'
  | 'ai-engine'
  | 'admin'
  | 'audit-chain'
  | 'settings';

interface SidebarProps {
  activePage: NavPage;
  setActivePage: (page: NavPage) => void;
  unreadAlertsCount: number;
  onSwitchToCustomer?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  unreadAlertsCount,
  onSwitchToCustomer,
}) => {
  const navItems = [
    { id: 'dashboard' as NavPage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'architecture' as NavPage, label: 'System Architecture', icon: Layers, badge: 'CDT-04' },
    { id: 'simulator' as NavPage, label: 'Simulate Transaction', icon: FlaskConical, badge: 'CORE' },
    { id: 'transactions' as NavPage, label: 'Transactions', icon: ArrowLeftRight },
    { id: 'customers' as NavPage, label: 'Customers & Trust', icon: Users },
    { id: 'fraud-graph' as NavPage, label: 'Fraud Graph', icon: Network },
    { id: 'alerts' as NavPage, label: 'Alerts', icon: Bell, count: unreadAlertsCount },
    { id: 'analytics' as NavPage, label: 'Analytics', icon: LineChart },
    { id: 'ai-engine' as NavPage, label: 'AI Fraud Engine', icon: Cpu },
    { id: 'audit-chain' as NavPage, label: 'Immutable Audit Chain', icon: Hash, badge: 'NEW' },
    { id: 'admin' as NavPage, label: 'Admin Governance', icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-[#080e1b] border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-[calc(100vh-61px)] sticky top-[61px]">
      {/* Navigation Links */}
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-mono-cyber font-semibold tracking-wider text-slate-400 uppercase">
          SOC Command Matrix
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-mono-cyber font-bold bg-cyan-900/60 text-cyan-300 border border-cyan-700/60 rounded">
                  {item.badge}
                </span>
              )}

              {item.count !== undefined && item.count > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono-cyber font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}

        {/* Customer Portal Link */}
        {onSwitchToCustomer && (
          <div className="pt-3 mt-3 border-t border-slate-800/80">
            <button
              onClick={onSwitchToCustomer}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-xs font-mono-cyber transition-all cursor-pointer shadow-sm group"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Customer Banking App</span>
              </div>
              <span className="text-[10px] text-emerald-400">&rarr;</span>
            </button>
          </div>
        )}
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="px-2 py-1 text-[10px] font-mono-cyber uppercase tracking-wider text-slate-400 mb-2">
          System Telemetry
        </div>
        <div className="space-y-1.5 text-[11px] font-mono-cyber">
          <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-900/50 border border-slate-800/60">
            <span className="text-slate-300">AI Fusion Core</span>
            <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ONLINE
            </span>
          </div>

          <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-900/50 border border-slate-800/60">
            <span className="text-slate-300">Audit Ledger</span>
            <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              HASH-CHAINED
            </span>
          </div>

          <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-900/50 border border-slate-800/60">
            <span className="text-slate-300">Zero-Trust Guard</span>
            <span className="flex items-center gap-1 text-cyan-400 text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              ENFORCING
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
