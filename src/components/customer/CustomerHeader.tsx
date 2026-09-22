import React from 'react';
import {
  ShieldCheck,
  Bell,
  LogOut,
  Send,
  History,
  Shield,
  Laptop,
  Users,
  AlertOctagon,
  Sliders,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { NavigationTab, User } from '../../types';

interface CustomerHeaderProps {
  currentUser: User;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onLogout: () => void;
  onSwitchToAdmin: () => void;
  unreadAlertsCount: number;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
  onSwitchToAdmin,
  unreadAlertsCount,
}) => {
  const navLinks: { tab: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { tab: 'customer-dashboard', label: 'Overview', icon: ShieldCheck },
    { tab: 'customer-transfer', label: 'Send Money', icon: Send },
    { tab: 'customer-transactions', label: 'Transactions', icon: History },
    { tab: 'customer-beneficiaries', label: 'Beneficiaries', icon: Users },
    { tab: 'customer-devices', label: 'My Devices', icon: Laptop },
    { tab: 'customer-security', label: 'Security Center', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070d18]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Logo & Platform Name */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('customer-dashboard')}
            className="cursor-pointer relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-600/20 border border-emerald-500/40 shadow-sm shadow-emerald-500/20"
          >
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg tracking-wider text-white">
                TRUSTSHIELD <span className="text-emerald-400">BANK</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono-cyber font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 rounded">
                AI PROTECTED
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Retail Digital Banking &amp; Continuous Digital Trust
            </p>
          </div>
        </div>

        {/* Customer Primary Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/70 p-1 rounded-xl border border-slate-800/80">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-cyber transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Architecture Blueprint Button */}
          <button
            onClick={() => setActiveTab('architecture')}
            title="View System Architecture Blueprint"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 text-xs font-mono-cyber transition-all cursor-pointer shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">ARCHITECTURE</span>
          </button>

          {/* Switch to Admin SOC View button (Crucial for Hackathon presentation!) */}
          <button
            onClick={onSwitchToAdmin}
            title="Switch to Security Operations Center (Admin) View"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-700/50 text-cyan-300 text-xs font-mono-cyber transition-all cursor-pointer shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">SWITCH TO SOC ADMIN</span>
          </button>

          {/* User Info */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-medium text-slate-200 truncate max-w-[120px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] font-mono-cyber text-slate-400">
                {currentUser.accountNumber || 'TSB-4089-2291'}
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-800/40 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav scrollbar */}
      <div className="flex md:hidden items-center gap-1 overflow-x-auto pt-2.5 pb-1 no-scrollbar">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono-cyber whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'text-slate-400 bg-slate-900/60 border border-slate-800/80'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
