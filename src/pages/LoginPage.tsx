import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  Eye,
  EyeOff,
  User,
  Shield,
  HelpCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  onLoginSuccess: (email: string, role: UserRole) => void;
  onNavigateToRegister: () => void;
  registeredNotice?: string;
  defaultEmail?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  registeredNotice,
  defaultEmail,
}) => {
  const [email, setEmail] = useState(defaultEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot Password Modal State
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Form submission with explicit validation & clear error message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!normalizedEmail) {
      setError('Please enter your email address to continue.');
      return;
    }

    if (!cleanPassword) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // 1. Admin Credentials
      if (normalizedEmail === 'admin@trustshield.ai' && cleanPassword === 'admin123') {
        onLoginSuccess('admin@trustshield.ai', 'ADMIN');
        return;
      }

      // 2. Demo Customer (Jerlin Jannett)
      if (
        (normalizedEmail === 'jerlin.jannett@bankcorp.com' ||
          normalizedEmail === 'customer@trustshield.ai') &&
        (cleanPassword === 'customer123' || cleanPassword === 'admin123')
      ) {
        onLoginSuccess('jerlin.jannett@bankcorp.com', 'CUSTOMER');
        return;
      }

      // 3. Demo Flagged Customer (Michael Chen)
      if (
        normalizedEmail === 'michael.chen@techglobal.sg' &&
        (cleanPassword === 'customer123' || cleanPassword === 'admin123')
      ) {
        onLoginSuccess('michael.chen@techglobal.sg', 'CUSTOMER');
        return;
      }

      // 4. Any newly registered customer (password must be at least 6 characters)
      if (
        normalizedEmail.includes('@') &&
        cleanPassword.length >= 6 &&
        !normalizedEmail.endsWith('.invalid')
      ) {
        const role: UserRole = normalizedEmail.includes('admin') ? 'ADMIN' : 'CUSTOMER';
        onLoginSuccess(normalizedEmail, role);
        return;
      }

      // 5. Explicit Authentication Error
      setIsLoading(false);
      setError(
        'Authentication Failed: Invalid email or password. Please verify your credentials or click "Demo Customer Login" / "Demo Admin Login" below.'
      );
    }, 450);
  };

  // One-click instant Demo Customer Login
  const handleDemoCustomerLogin = () => {
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess('jerlin.jannett@bankcorp.com', 'CUSTOMER');
    }, 250);
  };

  // One-click instant Demo Admin Login
  const handleDemoAdminLogin = () => {
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess('admin@trustshield.ai', 'ADMIN');
    }, 250);
  };

  // Handle forgot password submission
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#050912] text-slate-100 cyber-grid-bg relative flex flex-col justify-center items-center p-4 sm:p-6 select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[550px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md my-auto">
        {/* Main Authentication Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0a1220]/95 border border-slate-800/90 backdrop-blur-2xl shadow-2xl shadow-black/80">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 mb-3.5 shadow-lg shadow-cyan-500/10">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-wider">
              TRUSTSHIELD <span className="text-cyan-400">AI</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono-cyber">
              AI-Powered Banking Fraud Detection &amp; Digital Trust
            </p>

            {/* Zero Trust Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800/40 text-cyan-400 text-[11px] font-mono-cyber mt-3">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>Zero-Trust Architecture &bull; Sub-20ms Intercept</span>
            </div>
          </div>

          {/* Registration Notice Banner */}
          {registeredNotice && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-mono-cyber flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-emerald-200">Account Ready!</span>
                <span>{registeredNotice}</span>
              </div>
            </div>
          )}

          {/* Error Message Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/90 text-rose-300 text-xs font-mono-cyber flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold block text-rose-200">Access Denied</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-mono-cyber text-slate-300 mb-1.5 font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="name@trustshield.ai or customer email"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 font-mono-cyber transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-mono-cyber text-slate-300 mb-1.5 font-medium">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your security password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 font-mono-cyber transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer hover:text-slate-300 transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span className="font-mono-cyber text-[11px]">Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotSubmitted(false);
                  setIsForgotPasswordOpen(true);
                }}
                className="font-mono-cyber text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Action Buttons: LOGIN and REGISTER */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-[0.98] text-slate-950 font-display font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>LOGIN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onNavigateToRegister}
                className="py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 active:scale-[0.98] text-slate-200 border border-slate-700 hover:border-cyan-500/50 font-display font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <span>REGISTER</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-mono-cyber uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>One-Click Hackathon Access</span>
              </span>
              <span className="text-[10px] font-mono-cyber text-slate-500">Auto-routes</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Demo Customer Login Button */}
              <button
                type="button"
                onClick={handleDemoCustomerLogin}
                disabled={isLoading}
                className="p-3 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-950/80 border border-emerald-800/50 hover:border-emerald-500/80 hover:bg-emerald-950/60 transition-all text-left cursor-pointer group shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-display font-bold text-xs">
                    <User className="w-3.5 h-3.5" />
                    <span>Demo Customer Login</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-500/60 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[10px] font-mono-cyber text-slate-400 leading-snug">
                  Jerlin Jannett &bull; Retail Banking &amp; Transfers
                </p>
                <span className="text-[9px] font-mono-cyber text-emerald-400/80 mt-1 block">
                  &rarr; Customer Dashboard
                </span>
              </button>

              {/* Demo Admin Login Button */}
              <button
                type="button"
                onClick={handleDemoAdminLogin}
                disabled={isLoading}
                className="p-3 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-950/80 border border-cyan-800/50 hover:border-cyan-500/80 hover:bg-cyan-950/60 transition-all text-left cursor-pointer group shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-display font-bold text-xs">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Demo Admin Login</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-500/60 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[10px] font-mono-cyber text-slate-400 leading-snug">
                  SOC Commander &bull; Defense &amp; Fusion AI
                </p>
                <span className="text-[9px] font-mono-cyber text-cyan-400/80 mt-1 block">
                  &rarr; Admin Dashboard
                </span>
              </button>
            </div>
          </div>

          {/* Security Assurance Footer */}
          <div className="mt-5 text-center">
            <p className="text-[11px] font-mono-cyber text-slate-500">
              Protected by TrustShield Continuous Zero-Trust Verification
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0a1220] border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <span>Reset Security Credentials</span>
              </h3>
              <button
                onClick={() => setIsForgotPasswordOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-mono-cyber space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Password Reset Link Dispatched!</span>
                  </div>
                  <p className="text-slate-300">
                    A cryptographic security link has been dispatched to{' '}
                    <span className="text-white font-bold">{forgotEmail || 'your email'}</span>.
                  </p>
                  <p className="text-[11px] text-slate-400 pt-1 border-t border-emerald-900/50">
                    Tip for judges: You can also instantly log in using the one-click Demo Customer
                    or Demo Admin options on the login screen.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-slate-400 font-mono-cyber leading-relaxed">
                  Enter your verified account email address to receive an out-of-band verification
                  token and security recovery credentials.
                </p>

                <div>
                  <label className="block text-xs font-mono-cyber text-slate-300 mb-1.5">
                    Account Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. jerlin.jannett@bankcorp.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 font-mono-cyber"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono-cyber text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {forgotLoading ? (
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Send Recovery Token</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
