import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ShieldAlert,
  AlertTriangle,
  Ban,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { DashboardStats } from '../types';

interface KpiCardsProps {
  stats: DashboardStats;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ stats }) => {
  const cards = [
    {
      label: 'TOTAL TRANSACTIONS',
      value: stats.totalTransactions.toLocaleString(),
      change: `+${stats.totalTransactionsChange}%`,
      isPositive: true,
      icon: Activity,
      accent: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
      textColor: 'text-white',
    },
    {
      label: 'FRAUD DETECTED',
      value: stats.fraudDetected.toLocaleString(),
      change: `${stats.fraudDetectedChange}%`,
      isPositive: true, // Decreasing fraud is positive!
      icon: ShieldAlert,
      accent: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
      textColor: 'text-rose-400',
    },
    {
      label: 'HIGH RISK QUEUE',
      value: stats.highRisk.toLocaleString(),
      change: `+${stats.highRiskChange}%`,
      isPositive: false,
      icon: AlertTriangle,
      accent: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
      textColor: 'text-amber-300',
    },
    {
      label: 'BLOCKED ATTEMPTS',
      value: stats.blocked.toLocaleString(),
      change: `${stats.blockedChange}%`,
      isPositive: true,
      icon: Ban,
      accent: 'border-red-500/30 text-red-400 bg-red-500/10',
      textColor: 'text-red-400',
    },
    {
      label: 'VERIFY REQUIRED',
      value: stats.verifyRequired.toLocaleString(),
      change: `+${stats.verifyRequiredChange}%`,
      isPositive: false,
      icon: ShieldCheck,
      accent: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
      textColor: 'text-cyan-300',
    },
    {
      label: 'AVG TRUST SCORE',
      value: `${stats.trustScore}%`,
      change: `+${stats.trustScoreChange}%`,
      isPositive: true,
      icon: CheckCircle2,
      accent: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
      textColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-mono-cyber font-medium tracking-wider text-slate-400 uppercase truncate">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-md ${card.accent}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <span className={`text-xl font-display font-bold ${card.textColor}`}>
                {card.value}
              </span>

              <div
                className={`flex items-center text-[11px] font-mono-cyber font-medium ${
                  card.isPositive ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {card.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                <span>{card.change}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
