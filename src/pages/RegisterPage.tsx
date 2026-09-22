import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Mail, Phone, Calendar, KeyRound, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { DigitalTrustProfile } from '../types';

interface RegisterPageProps {
  onRegisterSuccess: (newCustomer: DigitalTrustProfile, initialAccount: {
    accountNumber: string;
    accountType: 'Savings' | 'Current';
    balance: number;
    phone: string;
    password: string;
  }) => void;
  onNavigateToLogin: (registeredEmail?: string) => void;
  onBackToLanding: () => void;
  existingEmails: string[];
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
  onBackToLanding,
  existingEmails,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('1995-06-15');
  const [accountType, setAccountType] = useState<'Savings' | 'Current'>('Savings');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 3) {
      errs.fullName = 'Please enter your full legal name (minimum 3 characters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      errs.email = 'Please provide a valid email address';
    } else if (existingEmails.some(e => e.toLowerCase() === email.trim().toLowerCase())) {
      errs.email = 'This email is already registered. Please login instead.';
    }

    const phoneRegex = /^[0-9+ -]{10,15}$/;
    if (!phone.trim() || !phoneRegex.test(phone)) {
      errs.phone = 'Please provide a valid 10-digit mobile number';
    }

    if (!dob) {
      errs.dob = 'Date of birth is required';
    }

    if (!password || password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!termsAccepted) {
      errs.terms = 'You must accept the Digital Banking & Security Terms';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Generate realistic banking credentials
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const randomMiddle = Math.floor(1000 + Math.random() * 9000);
      const customerId = `cust-${fullName.toLowerCase().replace(/\s+/g, '-')}-${randomSuffix}`;
      const accountNumber = `TSB-${randomMiddle}-8819-${randomSuffix}`;

      const newCustomerProfile: DigitalTrustProfile = {
        customerId,
        customerName: fullName.trim(),
        customerEmail: email.trim(),
        accountAgeMonths: 1,
        overallTrustScore: 92, // Initial high trust for freshly verified KYC identity
        trustSignals: {
          identityTrust: 95,
          deviceTrust: 90,
          locationTrust: 88,
          behaviorTrust: 92,
          transactionTrust: 90,
          networkTrust: 92,
        },
        typicalLocations: ['Chennai, India', 'Domestic Network'],
        knownDevices: ['Chrome Browser (Current Registered Device)'],
        typicalTransactionRange: {
          min: 100,
          max: 25000,
          average: 3500,
        },
        usualTransactionTimes: '08:00 - 22:00 IST',
        knownBeneficiaries: ['Self Linked Savings', 'Utility Board TN'],
        loginPattern: 'Primary device biometric/password authentication',
        recentRiskEvents: 0,
        totalTransactions: 0,
        status: 'ACTIVE',
      };

      onRegisterSuccess(newCustomerProfile, {
        accountNumber,
        accountType,
        balance: 150000,
        phone: phone.trim(),
        password,
      });

      setIsSubmitting(false);
      onNavigateToLogin(email.trim());
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#060b13] text-slate-100 cyber-grid-bg relative flex flex-col justify-center items-center p-4 py-12">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl">
        {/* Return Link */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToLanding}
            className="text-xs font-mono-cyber text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            &larr; Return to Landing
          </button>
          <button
            onClick={() => onNavigateToLogin()}
            className="text-xs font-mono-cyber text-cyan-400 hover:underline cursor-pointer"
          >
            Already have an account? Login
          </button>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0a1220]/95 border border-slate-800 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-cyan-400 mb-3 shadow-sm shadow-cyan-500/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide">
              OPEN DIGITAL BANKING ACCOUNT
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Register for next-generation AI protected retail banking with continuous digital trust monitoring.
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-[11px] font-mono-cyber mt-3">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>Automated KYC &amp; Real-Time Trust Scoring Initializer</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono-cyber text-slate-300 mb-1">
                Full Legal Name <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jerlin Jannett"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono-cyber"
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-rose-400 font-mono-cyber mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-cyber text-slate-300 mb-1">
                  Email Address <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono-cyber"
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-rose-400 font-mono-cyber mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono-cyber text-slate-300 mb-1">
                  Mobile Number <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono-cyber"
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-rose-400 font-mono-cyber mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Date of Birth & Account Type Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-cyber text-slate-300 mb-1">
                  Date of Birth <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono-cyber"
                  />
                </div>
                {errors.dob && (
                  <p className="text-[11px] text-rose-400 font-mono-cyber mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.dob}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono-cyber text-slate-300 mb-1">
                  Account Type <span className="text-cyan-400">*</span>
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as 'Savings' | 'Current')}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono-cyber"
                >
                  <option value="Savings">Savings Account (Default ₹1,50,000 Sandbox Credit)</option>
                  <option value="Current">Current / Business Account</option>
                </select>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-cyber text-slate-300 mb-1">
                  Create Password <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono-cyber"
                  />
                </div>
                {errors.password && (
                  <p className="text-[11px] text-rose-400 font-mono-cyber mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono-cyber text-slate-300 mb-1">
                  Confirm Password <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono-cyber"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-rose-400 font-mono-cyber mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs text-slate-400 leading-relaxed">
                  I consent to continuous AI telemetry, behavioral fraud detection, device profiling, and automated zero-trust authorization under the TrustShield Banking Charter.
                </span>
              </label>
              {errors.terms && (
                <p className="text-[11px] text-rose-400 font-mono-cyber mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.terms}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>CREATE ACCOUNT &amp; INITIALIZE TRUST PROFILE</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] font-mono-cyber text-slate-500">
              Instant Account Number (TSB-XXXX) and baseline Trust Profile generated upon submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
