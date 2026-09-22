import React from 'react';
import {
  LogIn,
  Laptop,
  MapPin,
  UserPlus,
  Send,
  Cpu,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { SecurityTimelineEvent } from '../types';

interface SecurityTimelineProps {
  timeline: SecurityTimelineEvent[];
}

export const SecurityTimeline: React.FC<SecurityTimelineProps> = ({ timeline }) => {
  const getStepIcon = (step: string) => {
    switch (step) {
      case 'LOGIN':
        return LogIn;
      case 'DEVICE CHANGE':
        return Laptop;
      case 'LOCATION CHANGE':
        return MapPin;
      case 'BENEFICIARY ADDED':
        return UserPlus;
      case 'TRANSACTION INITIATED':
        return Send;
      case 'AI ANALYSIS':
        return Cpu;
      case 'RISK SCORE':
        return ShieldAlert;
      case 'SECURITY ACTION':
        return ShieldCheck;
      default:
        return CheckCircle2;
    }
  };

  const getStatusColor = (status: SecurityTimelineEvent['status']) => {
    switch (status) {
      case 'critical':
        return {
          badge: 'bg-rose-950/80 border-rose-600 text-rose-300 ring-rose-500/30',
          dot: 'bg-rose-500',
          line: 'bg-rose-500/40',
        };
      case 'flagged':
        return {
          badge: 'bg-amber-950/80 border-amber-600 text-amber-300 ring-amber-500/30',
          dot: 'bg-amber-400',
          line: 'bg-amber-500/40',
        };
      case 'normal':
      default:
        return {
          badge: 'bg-emerald-950/80 border-emerald-600 text-emerald-300 ring-emerald-500/30',
          dot: 'bg-emerald-400',
          line: 'bg-emerald-500/30',
        };
    }
  };

  return (
    <div className="py-2">
      <div className="relative">
        {/* Desktop horizontal flow */}
        <div className="hidden lg:grid grid-cols-8 gap-2 relative">
          {/* Connector Line */}
          <div className="absolute top-5 left-8 right-8 h-0.5 bg-slate-800 -z-0" />

          {timeline.map((item, idx) => {
            const Icon = getStepIcon(item.step);
            const colors = getStatusColor(item.status);
            return (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ring-4 transition-all shadow-md ${colors.badge}`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="mt-2 w-full px-1">
                  <div className="text-[10px] font-mono-cyber font-bold tracking-wider text-slate-300 uppercase truncate">
                    {item.step}
                  </div>
                  <div className="text-[11px] font-semibold text-white truncate">
                    {item.label}
                  </div>
                  <div className="text-[9px] font-mono-cyber text-slate-400 mt-0.5">
                    {item.time}
                  </div>
                  <div className="text-[10px] text-slate-300 mt-1 line-clamp-2 leading-tight">
                    {item.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile vertical flow */}
        <div className="lg:hidden space-y-3 relative pl-6 border-l-2 border-slate-800">
          {timeline.map((item, idx) => {
            const Icon = getStepIcon(item.step);
            const colors = getStatusColor(item.status);
            return (
              <div key={idx} className="relative pl-3">
                <div
                  className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border text-[10px] ${colors.badge}`}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white uppercase">{item.step}</span>
                  <span className="text-[10px] font-mono-cyber text-slate-400">{item.time}</span>
                </div>
                <div className="text-xs text-slate-200 font-medium">{item.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{item.detail}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
