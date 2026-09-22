import React, { useState } from 'react';
import {
  Laptop,
  Smartphone,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Clock,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { Device } from '../../types';

interface CustomerDevicesPageProps {
  devices: Device[];
  onRemoveDevice: (deviceId: string) => void;
  onTrustDevice: (deviceId: string) => void;
}

export const CustomerDevicesPage: React.FC<CustomerDevicesPageProps> = ({
  devices,
  onRemoveDevice,
  onTrustDevice,
}) => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-12">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#091120] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Laptop className="w-5 h-5 text-cyan-400" />
            <span>Authorized Hardware Devices &amp; Fingerprints</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic device fingerprints authorized for digital banking sessions and transactions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-cyber">
          <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
            {devices.filter((d) => d.trustStatus === 'TRUSTED').length} Trusted
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-800/60 text-amber-400">
            {devices.filter((d) => d.trustStatus === 'SUSPICIOUS').length} Suspicious
          </span>
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.map((dev) => {
          const isTrusted = dev.trustStatus === 'TRUSTED';
          const isSuspicious = dev.trustStatus === 'SUSPICIOUS';
          const isBlocked = dev.trustStatus === 'BLOCKED';

          const isMobile =
            dev.name.toLowerCase().includes('iphone') || dev.name.toLowerCase().includes('android');

          return (
            <div
              key={dev.id}
              className={`p-5 rounded-2xl bg-[#091120] border transition-all ${
                isSuspicious
                  ? 'border-amber-500/50 shadow-lg shadow-amber-500/5'
                  : isBlocked
                  ? 'border-rose-500/50 shadow-lg shadow-rose-500/5'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isTrusted
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : isSuspicious
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {isMobile ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-display font-bold text-white">{dev.name}</h3>
                      {dev.isCurrent && (
                        <span className="px-1.5 py-0.5 text-[9px] font-mono-cyber font-bold bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 rounded">
                          CURRENT DEVICE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{dev.os} • {dev.browser}</p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 text-[10px] font-mono-cyber font-bold rounded uppercase border ${
                    isTrusted
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                      : isSuspicious
                      ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                      : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {dev.trustStatus}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono-cyber text-slate-400">
                <div>
                  <span className="text-slate-500 block">IP Address:</span>
                  <span className="text-slate-300">{dev.ip}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Location:</span>
                  <span className="text-slate-300 truncate">{dev.location}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">First Registered:</span>
                  <span className="text-slate-300">{dev.firstSeen}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Last Active Session:</span>
                  <span className="text-slate-300">{dev.lastActive}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div>
                  {isSuspicious && (
                    <button
                      onClick={() => onTrustDevice(dev.id)}
                      className="text-xs font-mono-cyber text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify &amp; Trust Device</span>
                    </button>
                  )}
                </div>

                {!dev.isCurrent && (
                  <button
                    onClick={() => onRemoveDevice(dev.id)}
                    className="text-xs font-mono-cyber text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Revoke Access</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
