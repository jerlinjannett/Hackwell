import React, { useState } from 'react';
import {
  Bell,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle,
  Eye,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { FraudAlert, Transaction } from '../types';

interface AlertsPageProps {
  alerts: FraudAlert[];
  transactions: Transaction[];
  onInspectTransaction: (txn: Transaction) => void;
  onUpdateAlertStatus: (alertId: string, newStatus: 'OPEN' | 'INVESTIGATING' | 'RESOLVED') => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  transactions,
  onInspectTransaction,
  onUpdateAlertStatus,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'INVESTIGATING' | 'RESOLVED'>('ALL');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  const filteredAlerts = alerts.filter((a) => {
    const matchesSearch =
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.customerName.toLowerCase().includes(search.toLowerCase()) ||
      a.reason.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchesSeverity = severityFilter === 'ALL' || a.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const handleInspect = (alert: FraudAlert) => {
    const matchedTxn = transactions.find((t) => t.id === alert.transactionId);
    if (matchedTxn) {
      onInspectTransaction(matchedTxn);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Bell className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-display font-bold text-white tracking-wide">
              Security Incident &amp; Fraud Alert Operations
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time incident dispatch, triage workflows, and analyst case resolution.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-cyber">
          <span className="px-3 py-1 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 font-bold">
            {alerts.filter((a) => a.status === 'OPEN').length} Unresolved Alerts
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search alerts, customers, reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono-cyber rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="INVESTIGATING">INVESTIGATING</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono-cyber rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-mono-cyber uppercase text-slate-400">
                <th className="py-3 px-4">Alert ID</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Fraud Score</th>
                <th className="py-3 px-4">Flagged Reason</th>
                <th className="py-3 px-3">Time</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">SOC Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-mono-cyber">
                    No alerts match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono-cyber text-slate-300 font-medium">
                      {alert.id}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono-cyber font-bold ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-700/80'
                            : alert.severity === 'HIGH'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-700/80'
                            : alert.severity === 'MEDIUM'
                            ? 'bg-blue-950/80 text-blue-300 border border-blue-700/80'
                            : 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/80'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{alert.customerName}</div>
                      <div className="text-[10px] font-mono-cyber text-slate-500">{alert.transactionId}</div>
                    </td>

                    <td className="py-3 px-3 font-mono-cyber font-bold text-slate-200">
                      {alert.riskScore ?? (alert.severity === 'CRITICAL' ? 94 : alert.severity === 'HIGH' ? 69 : 45)} / 100
                    </td>

                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate" title={alert.reason}>
                      {alert.reason}
                    </td>

                    <td className="py-3 px-3 font-mono-cyber text-[11px] text-slate-400">
                      {alert.timestamp}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono-cyber font-semibold ${
                          alert.status === 'OPEN'
                            ? 'text-rose-400 bg-rose-950/50'
                            : alert.status === 'INVESTIGATING'
                            ? 'text-amber-400 bg-amber-950/50'
                            : 'text-emerald-400 bg-emerald-950/50'
                        }`}
                      >
                        {alert.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleInspect(alert)}
                        className="py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono-cyber transition-colors cursor-pointer"
                        title="Open Investigation Dossier"
                      >
                        Investigate
                      </button>

                      {alert.status !== 'RESOLVED' ? (
                        <button
                          onClick={() => onUpdateAlertStatus(alert.id, 'RESOLVED')}
                          className="py-1 px-2 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 text-[11px] font-mono-cyber transition-colors cursor-pointer"
                          title="Mark Resolved"
                        >
                          Resolve
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateAlertStatus(alert.id, 'OPEN')}
                          className="py-1 px-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-mono-cyber transition-colors cursor-pointer"
                        >
                          Reopen
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
