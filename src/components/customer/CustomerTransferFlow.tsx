import React, { useState, useEffect } from 'react';
import {
  Send,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Ban,
  Clock,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Cpu,
  CreditCard,
  Building,
  KeyRound,
  Lock,
  ArrowLeft,
  XCircle,
  FileText,
  AlertOctagon,
} from 'lucide-react';
import {
  Transaction,
  DigitalTrustProfile,
  Beneficiary,
  SecurityDecision,
  SimulationInput,
  User,
  SecurityAuditEvent,
} from '../../types';
import { analyzeTransactionSimulation } from '../../services/fraudFusionEngine';

interface CustomerTransferFlowProps {
  currentUser: User;
  customerProfile: DigitalTrustProfile;
  beneficiaries: Beneficiary[];
  balance: number;
  availableBalance: number;
  onTransferCompleted: (txn: Transaction, newBalance: number, newAvailableBalance: number) => void;
  onAuditLog: (event: Omit<SecurityAuditEvent, 'id' | 'eventNumber' | 'prevHash' | 'currentHash'>) => void;
  onOpenReportFraud: (txn?: Transaction) => void;
  onCancel: () => void;
  onInspectTransaction: (txn: Transaction) => void;
}

type Step = 'FORM' | 'CONFIRM' | 'ANALYZING' | 'OTP' | 'RESULT' | 'CHALLENGE_WAS_THIS_YOU';

export const CustomerTransferFlow: React.FC<CustomerTransferFlowProps> = ({
  currentUser,
  customerProfile,
  beneficiaries,
  balance,
  availableBalance,
  onTransferCompleted,
  onAuditLog,
  onOpenReportFraud,
  onCancel,
  onInspectTransaction,
}) => {
  const [step, setStep] = useState<Step>('FORM');

  // Form Fields
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string>(beneficiaries[0]?.id || 'custom');
  const [customPayeeName, setCustomPayeeName] = useState('');
  const [customPayeeAccount, setCustomPayeeAccount] = useState('');
  const [customPayeeBank, setCustomPayeeBank] = useState('State Bank of India');
  const [amount, setAmount] = useState<number>(1200);
  const [transferType, setTransferType] = useState<'UPI' | 'IMPS' | 'NEFT'>('UPI');
  const [description, setDescription] = useState('Payment for retail invoice');

  // Demo simulation triggers (allowing user or judge to simulate specific attack vector easily!)
  const [simulateNewDevice, setSimulateNewDevice] = useState(false);
  const [simulateForeignLocation, setSimulateForeignLocation] = useState(false);
  const [simulateOffHours, setSimulateOffHours] = useState(false);

  // Analysis result
  const [generatedTxn, setGeneratedTxn] = useState<Transaction | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpError, setOtpError] = useState('');
  const [otpAttemptsRemaining, setOtpAttemptsRemaining] = useState(3);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any = null;
    if (step === 'OTP' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  // Resend cooldown timer
  useEffect(() => {
    let interval: any = null;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const selectedBeneficiary = beneficiaries.find((b) => b.id === selectedBeneficiaryId);
  const payeeName = selectedBeneficiaryId === 'custom' ? customPayeeName : selectedBeneficiary?.name || '';
  const payeeAccount = selectedBeneficiaryId === 'custom' ? customPayeeAccount : selectedBeneficiary?.accountNumber || '';
  const payeeBank = selectedBeneficiaryId === 'custom' ? customPayeeBank : selectedBeneficiary?.bank || '';

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    if (amount > availableBalance) {
      alert('Transfer amount exceeds available balance.');
      return;
    }
    if (selectedBeneficiaryId === 'custom' && (!customPayeeName || !customPayeeAccount)) {
      alert('Please provide custom beneficiary details.');
      return;
    }
    setStep('CONFIRM');
  };

  const handleConfirmTransfer = () => {
    setStep('ANALYZING');
    setAnalysisProgress(15);

    // Simulate animated neural scanning
    const p1 = setTimeout(() => setAnalysisProgress(45), 300);
    const p2 = setTimeout(() => setAnalysisProgress(80), 650);

    const p3 = setTimeout(() => {
      setAnalysisProgress(100);

      // Determine parameters for real fraud fusion engine
      const isNewPayee = selectedBeneficiaryId === 'custom' || selectedBeneficiary?.trustStatus === 'NEW';
      const isSuspiciousPayee = selectedBeneficiary?.trustStatus === 'SUSPICIOUS';

      const avgAmount = customerProfile.typicalTransactionRange.average;

      const simInput: SimulationInput = {
        customer: customerProfile.customerName,
        transactionAmount: amount,
        transactionType: transferType,
        location: simulateForeignLocation ? 'Moscow / TOR Exit Node' : 'Chennai, India',
        device: simulateNewDevice ? 'DV-204 (Bluestacks x86 Linux Emulator)' : 'MacBook Pro (M2 - macOS)',
        loginTime: simulateOffHours ? '03:42 AM' : '14:20 PM',
        beneficiary: payeeName,
        ipAddress: simulateForeignLocation ? '185.220.101.45' : '103.21.144.12',
        previousTransactions: customerProfile.totalTransactions,
        averageTransactionAmount: avgAmount,
        failedLoginAttempts: simulateForeignLocation ? 3 : 0,
        deviceTrust: simulateNewDevice ? 20 : 92,
        locationTrust: simulateForeignLocation ? 15 : 90,
        beneficiaryTrust: isSuspiciousPayee ? 10 : isNewPayee ? 50 : 92,
        transactionFrequency: simulateForeignLocation ? 18 : 2,
        accountAgeMonths: customerProfile.accountAgeMonths,
        beneficiaryIsBlacklisted: isSuspiciousPayee,
      };

      const result = analyzeTransactionSimulation(simInput);

      const txnId = `TXN-${Math.floor(1000 + Math.random() * 9000)}`;
      const evaluatedTxn: Transaction = {
        ...result.transaction,
        id: txnId,
        customerId: customerProfile.customerId,
        customerName: customerProfile.customerName,
        customerEmail: customerProfile.customerEmail,
        amount,
        beneficiary: payeeName,
        beneficiaryAccount: payeeAccount,
        transactionType: transferType,
        timestamp: 'Just now',
        status:
          result.transaction.decision === 'ALLOW'
            ? 'COMPLETED'
            : result.transaction.decision === 'VERIFY'
            ? 'OTP_REQUIRED'
            : result.transaction.decision === 'HOLD'
            ? 'HOLD'
            : 'BLOCKED',
      };

      setGeneratedTxn(evaluatedTxn);

      // Log to audit chain
      onAuditLog({
        timestamp: new Date().toLocaleTimeString(),
        user: customerProfile.customerEmail,
        action: `TRANSACTION_${evaluatedTxn.decision}`,
        transactionId: txnId,
        riskScore: evaluatedTxn.riskScore,
        decision: evaluatedTxn.decision,
        systemComponent: 'Fraud Fusion Core',
        details: `₹${amount.toLocaleString()} to ${payeeName} (${transferType}). Score: ${evaluatedTxn.riskScore}/100. Status: ${evaluatedTxn.status}.`,
      });

      if (evaluatedTxn.decision === 'ALLOW') {
        onTransferCompleted(evaluatedTxn, balance - amount, availableBalance - amount);
        setStep('RESULT');
      } else if (evaluatedTxn.decision === 'VERIFY') {
        setStep('OTP');
      } else if (evaluatedTxn.decision === 'HOLD') {
        // Held transaction locks available balance, balance stays until resolved
        onTransferCompleted(evaluatedTxn, balance, availableBalance - amount);
        setStep('RESULT');
      } else {
        // Blocked: zero money transferred
        onTransferCompleted(evaluatedTxn, balance, availableBalance);
        setStep('RESULT');
      }
    }, 1100);

    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
    };
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otp.join('');

    if (enteredCode === '123456') {
      if (generatedTxn) {
        const verifiedTxn: Transaction = {
          ...generatedTxn,
          status: 'COMPLETED',
          otpVerified: true,
        };
        setGeneratedTxn(verifiedTxn);
        onTransferCompleted(verifiedTxn, balance - amount, availableBalance - amount);

        onAuditLog({
          timestamp: new Date().toLocaleTimeString(),
          user: customerProfile.customerEmail,
          action: 'OTP_VERIFICATION_SUCCESS',
          transactionId: verifiedTxn.id,
          riskScore: verifiedTxn.riskScore,
          decision: 'ALLOW',
          systemComponent: 'Adaptive 2FA Engine',
          details: `Out-of-band OTP verified for ${verifiedTxn.id}. Funds settled.`,
        });
      }
      setStep('RESULT');
    } else {
      const remaining = otpAttemptsRemaining - 1;
      setOtpAttemptsRemaining(remaining);
      if (remaining <= 0) {
        setOtpError('Maximum OTP attempts reached. Transaction cancelled for your security.');
        if (generatedTxn) {
          const failedTxn: Transaction = {
            ...generatedTxn,
            status: 'FAILED',
          };
          setGeneratedTxn(failedTxn);
        }
        setStep('RESULT');
      } else {
        setOtpError(`Incorrect verification code. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.`);
      }
    }
  };

  const handleResendOtp = () => {
    if (resendCooldown > 0) return;
    setOtpTimer(60);
    setResendCooldown(30);
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    alert('A new demo OTP has been sent: 123456');
  };

  const handleReportFraudOnCurrent = () => {
    if (generatedTxn) {
      onOpenReportFraud(generatedTxn);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back button */}
      <button
        onClick={onCancel}
        className="mb-4 text-xs font-mono-cyber text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Dashboard</span>
      </button>

      {/* STEP 1: FORM */}
      {step === 'FORM' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0a1220] border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-400" />
                <span>Initiate Digital Transfer</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Protected by TrustShield Continuous Zero-Trust Security
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono-cyber text-slate-400 block">Available</span>
              <span className="text-sm font-mono-cyber font-bold text-emerald-400">
                ₹{availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <form onSubmit={handleProceedToConfirm} className="space-y-4">
            {/* From Account */}
            <div>
              <label className="block text-xs font-mono-cyber text-slate-300 mb-1">
                From Source Account
              </label>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="text-xs font-medium text-white">
                      {currentUser.accountType || 'Savings Account'} • {currentUser.accountNumber || 'TSB-4089-2291-7840'}
                    </div>
                    <div className="text-[10px] font-mono-cyber text-slate-400">
                      Primary Domestic Currency Account
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono-cyber text-emerald-400 font-bold">
                  ₹{balance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Beneficiary Selector */}
            <div>
              <label className="block text-xs font-mono-cyber text-slate-300 mb-1">
                Select Beneficiary / Payee
              </label>
              <select
                value={selectedBeneficiaryId}
                onChange={(e) => setSelectedBeneficiaryId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-100 font-mono-cyber focus:outline-none focus:border-emerald-500"
              >
                {beneficiaries.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.bank} - {b.accountNumber.slice(-4)}) [{b.trustStatus}]
                  </option>
                ))}
                <option value="custom">+ Add New Custom Payee</option>
              </select>
            </div>

            {/* Custom Payee Fields */}
            {selectedBeneficiaryId === 'custom' && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <div className="text-[11px] font-mono-cyber text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Transfers to new unverified payees undergo enhanced behavioral analysis.</span>
                </div>
                <div>
                  <label className="block text-[11px] font-mono-cyber text-slate-400 mb-1">
                    Payee Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customPayeeName}
                    onChange={(e) => setCustomPayeeName(e.target.value)}
                    placeholder="e.g. Acme Tech Solutions"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono-cyber"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono-cyber text-slate-400 mb-1">
                      Account / UPI ID
                    </label>
                    <input
                      type="text"
                      required
                      value={customPayeeAccount}
                      onChange={(e) => setCustomPayeeAccount(e.target.value)}
                      placeholder="e.g. 981273645012"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono-cyber"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono-cyber text-slate-400 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customPayeeBank}
                      onChange={(e) => setCustomPayeeBank(e.target.value)}
                      placeholder="e.g. HDFC Bank"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono-cyber"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Amount & Rail */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-cyber text-slate-300 mb-1">
                  Transfer Amount (INR ₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-mono-cyber text-slate-500">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono-cyber text-white focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-cyber text-slate-300 mb-1">
                  Settlement Rail
                </label>
                <select
                  value={transferType}
                  onChange={(e) => setTransferType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-100 font-mono-cyber focus:outline-none focus:border-emerald-500"
                >
                  <option value="UPI">UPI Instant Pay (24x7 Real-time)</option>
                  <option value="IMPS">IMPS Immediate Payment (Bank-to-Bank)</option>
                  <option value="NEFT">NEFT National Electronic Funds</option>
                </select>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-mono-cyber text-slate-300 mb-1">
                Payment Remark / Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-100 font-mono-cyber focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Hackathon Demo Attack Vectors Toggle Box */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="block text-[10px] font-mono-cyber uppercase tracking-wider text-cyan-400 font-bold">
                Jury / Demo Attack Vector Controls (Simulate Risk Vectors)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label className="flex items-center gap-2 text-[11px] font-mono-cyber text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simulateNewDevice}
                    onChange={(e) => setSimulateNewDevice(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-cyan-500"
                  />
                  <span>New Android Emulator</span>
                </label>

                <label className="flex items-center gap-2 text-[11px] font-mono-cyber text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simulateForeignLocation}
                    onChange={(e) => setSimulateForeignLocation(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-cyan-500"
                  />
                  <span>Foreign TOR IP (Moscow)</span>
                </label>

                <label className="flex items-center gap-2 text-[11px] font-mono-cyber text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simulateOffHours}
                    onChange={(e) => setSimulateOffHours(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-cyan-500"
                  />
                  <span>Off-Hours (03:42 AM)</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>CONTINUE TO CONFIRMATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: CONFIRMATION SCREEN */}
      {step === 'CONFIRM' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0a1220] border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center pb-4 border-b border-slate-800">
            <h2 className="text-lg font-display font-bold text-white">Review Transfer Summary</h2>
            <p className="text-xs text-slate-400">
              Verify recipient details before passing transaction to AI risk inspection.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono-cyber text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-900">
              <span className="text-slate-400">Recipient Name</span>
              <span className="text-white font-bold">{payeeName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-900">
              <span className="text-slate-400">Account / Payee ID</span>
              <span className="text-slate-200">{payeeAccount}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-900">
              <span className="text-slate-400">Receiving Bank</span>
              <span className="text-slate-200">{payeeBank}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-900">
              <span className="text-slate-400">Transfer Channel</span>
              <span className="text-cyan-400 font-bold">{transferType}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-900">
              <span className="text-slate-400">Transfer Amount</span>
              <span className="text-white font-bold text-sm">
                ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-900">
              <span className="text-slate-400">Service Fee</span>
              <span className="text-emerald-400 font-bold">₹0.00 (Zero Fee)</span>
            </div>
            <div className="flex justify-between pt-2 text-sm font-bold">
              <span className="text-white">Total Deductible</span>
              <span className="text-emerald-400">
                ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-cyan-950/50 border border-cyan-800/60 text-cyan-300 text-xs font-mono-cyber flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              TrustShield Neural Engine will autonomously evaluate 7 risk vectors and determine adaptive security clearance.
            </span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setStep('FORM')}
              className="w-1/3 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono-cyber transition-all border border-slate-800 cursor-pointer"
            >
              Cancel / Edit
            </button>
            <button
              onClick={handleConfirmTransfer}
              className="w-2/3 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>CONFIRM &amp; AUTHORIZE TRANSFER</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REAL-TIME AI FRAUD EVALUATION ANIMATION */}
      {step === 'ANALYZING' && (
        <div className="p-8 rounded-2xl bg-[#0a1220] border border-slate-800 shadow-2xl text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <Cpu className="w-9 h-9 text-cyan-400 animate-pulse" />
          </div>

          <div>
            <h2 className="text-lg font-display font-bold text-white">
              TrustShield AI Neural Risk Inspection
            </h2>
            <p className="text-xs font-mono-cyber text-slate-400 mt-1">
              Correlating customer behavioral baseline, hardware fingerprint, geo-velocity, and recipient network...
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono-cyber text-slate-400">
            <div className="p-2 rounded bg-slate-950/80 border border-slate-900">
              <span className="block text-slate-500">Z-Score Deviation</span>
              <span className="text-cyan-300 font-bold">CALCULATING</span>
            </div>
            <div className="p-2 rounded bg-slate-950/80 border border-slate-900">
              <span className="block text-slate-500">Device Fingerprint</span>
              <span className="text-cyan-300 font-bold">MATCHING</span>
            </div>
            <div className="p-2 rounded bg-slate-950/80 border border-slate-900">
              <span className="block text-slate-500">Geo-Velocity</span>
              <span className="text-cyan-300 font-bold">VERIFYING</span>
            </div>
            <div className="p-2 rounded bg-slate-950/80 border border-slate-900">
              <span className="block text-slate-500">Mule Graph Check</span>
              <span className="text-cyan-300 font-bold">SCANNING</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: OTP VERIFICATION (FOR MEDIUM RISK DECISION: VERIFY) */}
      {step === 'OTP' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0a1220] border border-amber-500/40 shadow-2xl space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mb-3">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-display font-bold text-white">
              ADDITIONAL VERIFICATION REQUIRED
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Our AI engine detected elevated risk ({generatedTxn?.riskScore}/100) due to{' '}
              <span className="text-amber-300 font-medium">
                {generatedTxn?.reasons[0] || 'device or location variance'}
              </span>
              . Please enter the 6-digit one-time security passkey.
            </p>

            {/* Hackathon Demo Helper Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-mono-cyber font-bold mt-3">
              <span>Demo OTP: 123456</span>
            </div>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {otpError && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-mono-cyber text-center">
                {otpError}
              </div>
            )}

            {/* 6 Digit Box Inputs */}
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-mono-cyber font-bold text-white bg-slate-950/90 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs font-mono-cyber text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Code expires in: <strong className="text-white">{otpTimer}s</strong></span>
              </div>

              <button
                type="button"
                disabled={resendCooldown > 0}
                onClick={handleResendOtp}
                className="text-cyan-400 hover:underline cursor-pointer disabled:text-slate-600 disabled:no-underline"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              <span>VERIFY &amp; RELEASE FUNDS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Prompt: Was this not you? */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              onClick={handleReportFraudOnCurrent}
              className="text-xs text-rose-400 hover:text-rose-300 font-mono-cyber flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Did not initiate this? Cancel &amp; Report Fraud Immediately</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: FINAL RESULT SCREENS (ALLOW, HOLD, BLOCK, or COMPLETED) */}
      {step === 'RESULT' && generatedTxn && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0a1220] border border-slate-800 shadow-2xl space-y-6">
          {/* ALLOW / COMPLETED */}
          {(generatedTxn.decision === 'ALLOW' || generatedTxn.status === 'COMPLETED') && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-display font-bold text-white">
                Transfer Successfully Completed
              </h2>
              <p className="text-xs text-slate-400">
                Transaction ID: <span className="font-mono-cyber text-slate-200">{generatedTxn.id}</span>
              </p>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono-cyber text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount Sent</span>
                  <span className="text-white font-bold">
                    ₹{generatedTxn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Paid To</span>
                  <span className="text-white">{generatedTxn.beneficiary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AI Risk Score</span>
                  <span className="text-emerald-400 font-bold">{generatedTxn.riskScore}/100 (LOW)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Security Decision</span>
                  <span className="text-emerald-400 font-bold uppercase">{generatedTxn.decision}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  onClick={() => onInspectTransaction(generatedTxn)}
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-cyber flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Inspect Audit &amp; PDF</span>
                </button>
                <button
                  onClick={onCancel}
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-display font-bold tracking-wider uppercase cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* HOLD */}
          {generatedTxn.decision === 'HOLD' && generatedTxn.status === 'HOLD' && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
                <Clock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-display font-bold text-white">
                TRANSACTION ON SECURITY HOLD
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Risk Score: <strong className="text-amber-400 font-mono-cyber">{generatedTxn.riskScore}/100 (HIGH)</strong>. Transfer suspended to safeguard your funds from potential unauthorized liquidation.
              </p>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 font-mono-cyber text-xs space-y-2 text-left">
                <div className="text-amber-300 font-bold mb-1">Triggered Risk Factors:</div>
                {generatedTxn.reasons.map((r, i) => (
                  <div key={i} className="text-slate-300 flex items-start gap-1.5">
                    <span className="text-amber-400">•</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  onClick={handleReportFraudOnCurrent}
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/80 text-rose-300 text-xs font-mono-cyber cursor-pointer"
                >
                  Report Unauthorized
                </button>
                <button
                  onClick={onCancel}
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-cyber cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* BLOCK */}
          {generatedTxn.decision === 'BLOCK' && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
                <Ban className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-display font-bold text-white">
                TRANSACTION BLOCKED BY AI DEFENSE
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Risk Score: <strong className="text-rose-400 font-mono-cyber">{generatedTxn.riskScore}/100 (CRITICAL)</strong>. Zero funds were deducted. Hostile signals triggered autonomous defense intercept.
              </p>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 font-mono-cyber text-xs space-y-2 text-left">
                <div className="text-rose-300 font-bold mb-1">Defense Intercept Rationale:</div>
                {generatedTxn.reasons.map((r, i) => (
                  <div key={i} className="text-slate-300 flex items-start gap-1.5">
                    <span className="text-rose-400">•</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  onClick={handleReportFraudOnCurrent}
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-display font-bold tracking-wider uppercase cursor-pointer shadow-lg shadow-rose-600/30"
                >
                  Report Fraud Incident
                </button>
                <button
                  onClick={() => onInspectTransaction(generatedTxn)}
                  className="w-1/2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-cyber cursor-pointer"
                >
                  View Security Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
