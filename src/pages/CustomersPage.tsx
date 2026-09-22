import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Laptop,
  MapPin,
  Clock,
  Building2,
  Lock,
  Activity,
  AlertTriangle,
  ArrowRight,
  Shield,
  Search,
} from 'lucide-react';
import { DigitalTrustProfile } from '../types';

interface CustomersPageProps {
  customers: DigitalTrustProfile[];
  initialSelectedId?: string;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({
  customers,
  initialSelectedId,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    initialSelectedId || customers[0]?.customerId || 'jerlin-jannett'
  );
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCustomer =
    customers.find((c) => c.customerId === selectedCustomerId) || customers[0];

  const filteredCustomers = customers.filter(
    (c) =>
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-display font-bold text-white tracking-wide">
              Customer Directory &amp; Digital Trust Profiles
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Continuous behavioral reputation scoring: Instead of analyzing only the transaction in isolation, TrustShield AI monitors systemic digital trust.
          </p>
        </div>
      </div>

      {/* Grid: Customer List (5 cols) + Selected Digital Trust Profile (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Customer List Card */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-mono-cyber font-bold text-slate-200 uppercase tracking-wider">
              Enrolled Banking Customers ({customers.length})
            </h2>
            <span className="text-[10px] font-mono-cyber text-slate-400">TIER 1 REPUTATION</span>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search customer, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
            />
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredCustomers.map((cust) => {
              const isSelected = cust.customerId === selectedCustomer?.customerId;
              return (
                <div
                  key={cust.customerId}
                  onClick={() => setSelectedCustomerId(cust.customerId)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/50 border-cyan-500/80 shadow-sm shadow-cyan-500/20 ring-1 ring-cyan-500/40'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-display font-semibold text-xs text-white">
                        {cust.customerName}
                      </div>
                      <div className="text-[10px] font-mono-cyber text-slate-400 truncate max-w-[180px]">
                        {cust.customerEmail}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono-cyber font-bold text-xs text-cyan-400">
                        {cust.overallTrustScore} / 100
                      </div>
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-mono-cyber font-semibold ${
                          cust.status === 'ACTIVE'
                            ? 'text-emerald-400 bg-emerald-950/80 border border-emerald-800/60'
                            : 'text-amber-400 bg-amber-950/80 border border-amber-800/60'
                        }`}
                      >
                        {cust.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/70 grid grid-cols-2 text-[10px] font-mono-cyber text-slate-400">
                    <div>Txns: <span className="text-slate-200">{cust.totalTransactions}</span></div>
                    <div>Risk Events: <span className="text-slate-200">{cust.recentRiskEvents}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Customer Digital Trust Profile Dossier */}
        {selectedCustomer && (
          <div className="lg:col-span-7 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md p-5 space-y-6">
            {/* Header / Score Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-mono-cyber uppercase tracking-wider text-cyan-400">
                  DIGITAL TRUST DOSSIER
                </span>
                <h2 className="font-display font-bold text-lg text-white">
                  {selectedCustomer.customerName}
                </h2>
                <div className="text-xs text-slate-400 font-mono-cyber">
                  {selectedCustomer.customerEmail} &bull; Account Age: {selectedCustomer.accountAgeMonths} Months
                </div>
              </div>

              {/* Radial/Big Score Display */}
              <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 shrink-0 self-start sm:self-auto">
                <ShieldCheck className="w-8 h-8 text-cyan-400" />
                <div>
                  <div className="text-[10px] font-mono-cyber text-slate-400 uppercase">
                    Trust Score
                  </div>
                  <div className="text-2xl font-display font-extrabold text-cyan-300">
                    {selectedCustomer.overallTrustScore}
                    <span className="text-xs text-slate-400 font-normal"> / 100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual: Trust Profile Sub-Signals */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <h3 className="text-xs font-mono-cyber font-bold tracking-wider text-slate-200 uppercase flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                TRUST PROFILE SIGNALS BREAKDOWN
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { label: 'Identity Trust', val: selectedCustomer.trustSignals.identityTrust },
                  { label: 'Device Trust', val: selectedCustomer.trustSignals.deviceTrust },
                  { label: 'Location Trust', val: selectedCustomer.trustSignals.locationTrust },
                  { label: 'Behavior Trust', val: selectedCustomer.trustSignals.behaviorTrust },
                  { label: 'Transaction Trust', val: selectedCustomer.trustSignals.transactionTrust },
                  { label: 'Network Trust', val: selectedCustomer.trustSignals.networkTrust },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                    <div className="flex justify-between font-mono-cyber text-[11px]">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="text-cyan-400 font-bold">{item.val} / 100</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        style={{ width: `${item.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Behavioral Pattern Telemetry Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Typical Locations */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono-cyber text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Habitual Locations</span>
                </div>
                <div className="space-y-1 pt-1">
                  {selectedCustomer.typicalLocations.map((loc, i) => (
                    <div key={i} className="text-slate-200 font-medium bg-slate-900/80 px-2 py-1 rounded">
                      {loc}
                    </div>
                  ))}
                </div>
              </div>

              {/* Known Devices */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono-cyber text-[11px]">
                  <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Paired Hardware Devices</span>
                </div>
                <div className="space-y-1 pt-1">
                  {selectedCustomer.knownDevices.map((dev, i) => (
                    <div key={i} className="text-slate-200 font-medium bg-slate-900/80 px-2 py-1 rounded">
                      {dev}
                    </div>
                  ))}
                </div>
              </div>

              {/* Typical Range */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono-cyber text-[11px]">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Spending Velocity Baseline</span>
                </div>
                <div className="pt-1 font-mono-cyber text-slate-300">
                  Avg: <strong className="text-cyan-400">₹{selectedCustomer.typicalTransactionRange.average.toLocaleString()}</strong>
                </div>
                <div className="text-[11px] text-slate-400">
                  Range: ₹{selectedCustomer.typicalTransactionRange.min.toLocaleString()} – ₹{selectedCustomer.typicalTransactionRange.max.toLocaleString()}
                </div>
              </div>

              {/* Usual Timing */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono-cyber text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Usual Transaction Window</span>
                </div>
                <div className="pt-1 font-semibold text-slate-200">
                  {selectedCustomer.usualTransactionTimes}
                </div>
                <div className="text-[11px] text-slate-400">
                  Logins outside window trigger Behavioral Risk modifier
                </div>
              </div>
            </div>

            {/* Known Beneficiaries & Login pattern */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 font-mono-cyber text-[11px]">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Whitelisted / Known Beneficiaries</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedCustomer.knownBeneficiaries.map((b, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-[11px]"
                  >
                    {b}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-400 font-mono-cyber">
                Login Pattern: <span className="text-slate-200">{selectedCustomer.loginPattern}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
