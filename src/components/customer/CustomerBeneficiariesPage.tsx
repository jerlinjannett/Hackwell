import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Send,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Building,
  CreditCard,
  ArrowRight,
  X,
} from 'lucide-react';
import { Beneficiary } from '../../types';

interface CustomerBeneficiariesPageProps {
  beneficiaries: Beneficiary[];
  onAddBeneficiary: (newBnf: Beneficiary) => void;
  onRemoveBeneficiary: (id: string) => void;
  onSelectToSend: (beneficiaryId: string) => void;
}

export const CustomerBeneficiariesPage: React.FC<CustomerBeneficiariesPageProps> = ({
  beneficiaries,
  onAddBeneficiary,
  onRemoveBeneficiary,
  onSelectToSend,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bank, setBank] = useState('HDFC Bank');
  const [ifsc, setIfsc] = useState('');
  const [upiId, setUpiId] = useState('');
  const [category, setCategory] = useState('Personal / Friend');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !accountNumber) return;

    const newBnf: Beneficiary = {
      id: `bnf-${Date.now()}`,
      customerId: 'jerlin-jannett',
      name: name.trim(),
      accountNumber: accountNumber.trim(),
      bank: bank.trim(),
      ifsc: ifsc.trim() || 'HDFC0001829',
      upiId: upiId.trim() || undefined,
      addedDate: 'Today (New)',
      transactionCount: 0,
      trustStatus: 'NEW', // Tagged NEW as per banking fraud guidelines
      category,
    };

    onAddBeneficiary(newBnf);
    setShowAddModal(false);
    setName('');
    setAccountNumber('');
    setIfsc('');
    setUpiId('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-12">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#091120] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Beneficiaries &amp; Whitelisted Payees</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified recipient endpoints. Transfers to newly added payees undergo stepped-up anomaly detection.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>ADD NEW BENEFICIARY</span>
        </button>
      </div>

      {/* Beneficiaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {beneficiaries.map((bnf) => {
          const isTrusted = bnf.trustStatus === 'TRUSTED';
          const isNew = bnf.trustStatus === 'NEW';
          const isSuspicious = bnf.trustStatus === 'SUSPICIOUS';

          return (
            <div
              key={bnf.id}
              className={`p-5 rounded-2xl bg-[#091120] border flex flex-col justify-between transition-all ${
                isSuspicious
                  ? 'border-rose-500/50 shadow-lg shadow-rose-500/5'
                  : isNew
                  ? 'border-amber-500/50 shadow-lg shadow-amber-500/5'
                  : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-sm font-bold text-emerald-400">
                      {bnf.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-display font-bold text-white truncate max-w-[170px]">
                        {bnf.name}
                      </h3>
                      <p className="text-[11px] font-mono-cyber text-slate-400">{bnf.category || 'General Payee'}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono-cyber font-bold rounded uppercase border ${
                      isTrusted
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                        : isNew
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                        : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {bnf.trustStatus}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs font-mono-cyber">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bank:</span>
                    <span className="text-slate-200">{bnf.bank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account No:</span>
                    <span className="text-slate-200">{bnf.accountNumber}</span>
                  </div>
                  {bnf.upiId && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">UPI VPA:</span>
                      <span className="text-cyan-400">{bnf.upiId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Completed Txns:</span>
                    <span className="text-white font-bold">{bnf.transactionCount} payments</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectToSend(bnf.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono-cyber flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Money</span>
                </button>

                <button
                  onClick={() => onRemoveBeneficiary(bnf.id)}
                  className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                  title="Remove Beneficiary"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Beneficiary Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0a1220] border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <span>Add Bank Payee</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-amber-950/50 border border-amber-800/60 text-amber-300 text-xs font-mono-cyber flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Under FinTech regulatory security guidelines, new beneficiaries enter a cooling status. Initial transactions will require step-up authentication.
              </span>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 font-mono-cyber text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Beneficiary Legal Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh S."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Account Number *</label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 918237190012"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Bank Name</label>
                  <input
                    type="text"
                    required
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    placeholder="e.g. HDFC Bank"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    placeholder="e.g. HDFC0001244"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">UPI VPA (Optional)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. user@oksbi"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase tracking-wider"
                >
                  Save Payee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
