import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Database,
  Radio,
  Bell,
  LogOut,
  User,
  Sliders,
  ChevronDown,
  UserCheck,
  Layers,
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isLiveMonitoring: boolean;
  setIsLiveMonitoring: (val: boolean) => void;
  onLogout: () => void;
  unreadAlertsCount: number;
  onOpenAlerts: () => void;
  onSwitchToCustomer?: () => void;
  onOpenArchitecture?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  isLiveMonitoring,
  setIsLiveMonitoring,
  onLogout,
  unreadAlertsCount,
  onOpenAlerts,
  onSwitchToCustomer,
  onOpenArchitecture,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#070d18]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Logo & Product Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 shadow-sm shadow-cyan-500/20">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg tracking-wider text-white">
                TRUSTSHIELD <span className="text-cyan-400">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono-cyber font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 rounded">
                SOC COMMAND CENTER
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden md:block">
              Continuous Zero-Trust Banking Fraud Detection &amp; Prevention
            </p>
          </div>
        </div>

        {/* System Health Indicators */}
        <div className="hidden xl:flex items-center gap-4 text-xs font-mono-cyber">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/60 border border-slate-800 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Engine</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] text-emerald-400 font-semibold">ONLINE</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/60 border border-slate-800 text-slate-300">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Telemetry DB</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] text-emerald-400 font-semibold">CONNECTED</span>
          </div>

          <button
            onClick={() => setIsLiveMonitoring(!isLiveMonitoring)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-all cursor-pointer ${
              isLiveMonitoring
                ? 'bg-cyan-950/50 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isLiveMonitoring ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
            <span>LIVE STREAM</span>
            <span className={`h-1.5 w-1.5 rounded-full ${isLiveMonitoring ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
            <span className={`text-[11px] font-semibold ${isLiveMonitoring ? 'text-cyan-400' : 'text-slate-500'}`}>
              {isLiveMonitoring ? 'ACTIVE' : 'PAUSED'}
            </span>
          </button>
        </div>

        {/* Actions & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Architecture Blueprint Button */}
          {onOpenArchitecture && (
            <button
              onClick={onOpenArchitecture}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono-cyber transition-all cursor-pointer shadow-sm"
              title="Open System Architecture Blueprint"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">ARCHITECTURE</span>
            </button>
          )}

          {/* Direct Switch to Customer Portal Button */}
          {onSwitchToCustomer && (
            <button
              onClick={onSwitchToCustomer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono-cyber transition-all cursor-pointer shadow-sm"
              title="Open Retail Customer Banking App"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">CUSTOMER PORTAL</span>
            </button>
          )}

          {/* Alerts Bell */}
          <button
            onClick={onOpenAlerts}
            aria-label="View security alerts"
            className="relative p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Role selector */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={currentRole}
              onChange={(e) => {
                const newRole = e.target.value as UserRole;
                setCurrentRole(newRole);
                if (newRole === 'CUSTOMER' && onSwitchToCustomer) {
                  onSwitchToCustomer();
                }
              }}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="ADMIN" className="bg-slate-900 text-slate-100">Role: Admin</option>
              <option value="FRAUD_ANALYST" className="bg-slate-900 text-slate-100">Role: Fraud Analyst</option>
              <option value="CUSTOMER" className="bg-slate-900 text-slate-100">Role: Customer View</option>
            </select>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            title="Log Out"
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
