import React from 'react';
import { Sparkles, Play, Shield, AlertTriangle, UserX, Network, Laptop, Globe } from 'lucide-react';
import { DEMO_SCENARIOS } from '../data/demoData';
import { SimulationInput } from '../types';

interface DemoScenariosBarProps {
  onSelectScenario: (scenario: typeof DEMO_SCENARIOS[0]) => void;
  activeScenarioId?: string;
}

export const DemoScenariosBar: React.FC<DemoScenariosBarProps> = ({
  onSelectScenario,
  activeScenarioId,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'DEMO_1':
        return Shield;
      case 'DEMO_2':
        return Laptop;
      case 'DEMO_3':
        return Globe;
      case 'DEMO_4':
        return AlertTriangle;
      case 'DEMO_5':
        return Sparkles;
      case 'DEMO_6':
        return UserX;
      case 'DEMO_7':
        return Network;
      default:
        return Play;
    }
  };

  const getBadgeColor = (decision: string) => {
    if (decision.includes('ALLOW')) return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
    if (decision.includes('VERIFY')) return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60';
    if (decision.includes('HOLD')) return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
    return 'text-rose-400 bg-rose-950/60 border-rose-800/60';
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono-cyber font-bold tracking-wider text-slate-200 uppercase">
              Hackathon Demo Scenarios (Interactive Test Suite)
            </h3>
            <p className="text-[11px] text-slate-400">
              One-click simulate realistic fraud patterns &amp; observe automated Fraud Fusion scoring and policy actions
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono-cyber px-2 py-0.5 rounded bg-slate-800 text-slate-300 self-start sm:self-auto">
          7 PRESETS LOADED
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2">
        {DEMO_SCENARIOS.map((demo) => {
          const Icon = getIcon(demo.id);
          const isSelected = activeScenarioId === demo.id;
          return (
            <button
              key={demo.id}
              onClick={() => onSelectScenario(demo)}
              className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                isSelected
                  ? 'bg-cyan-950/60 border-cyan-500/80 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-500/50'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span
                    className={`text-[9px] font-mono-cyber font-semibold px-1.5 py-0.2 border rounded ${getBadgeColor(
                      demo.expectedDecision
                    )}`}
                  >
                    {demo.expectedDecision}
                  </span>
                </div>
                <div className="font-display font-semibold text-xs text-white line-clamp-1">
                  {demo.name.replace('DEMO ', 'D')}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-2 leading-tight mt-0.5">
                  {demo.subtitle}
                </div>
              </div>

              <div className="text-[9px] font-mono-cyber text-slate-400 border-t border-slate-800/80 pt-1 flex items-center justify-between">
                <span>Outcome:</span>
                <span className="text-slate-200 font-semibold">{demo.expectedResult}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
