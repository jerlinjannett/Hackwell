import React, { useState } from 'react';
import {
  NavigationTab,
  Transaction,
  FraudAlert,
  DigitalTrustProfile,
  DashboardStats,
  FusionWeights,
  RiskThresholds,
  SimulationResult,
  SecurityDecision,
  User,
  Device,
  Beneficiary,
  FraudReport,
  SecurityAuditEvent,
  UserRole,
} from './types';
import {
  DEMO_TRANSACTIONS,
  DEMO_ALERTS,
  DEMO_CUSTOMERS,
  DEMO_STATS_INITIAL,
  DEMO_SCENARIOS,
  DEMO_DEVICES,
  DEMO_BENEFICIARIES,
  DEMO_FRAUD_REPORTS,
  DEMO_AUDIT_CHAIN,
} from './data/demoData';
import {
  DEFAULT_FUSION_WEIGHTS,
  DEFAULT_RISK_THRESHOLDS,
  analyzeTransactionSimulation,
} from './services/fraudFusionEngine';

// SOC / Admin Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TransactionTable } from './components/TransactionTable';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { CustomerVerifyModal } from './components/CustomerVerifyModal';
import { BlockedModal } from './components/BlockedModal';
import { ToastNotification, ToastAlert } from './components/ToastNotification';

// Customer Banking Components
import { CustomerHeader } from './components/customer/CustomerHeader';
import { CustomerDashboardPage } from './components/customer/CustomerDashboardPage';
import { CustomerTransferFlow } from './components/customer/CustomerTransferFlow';
import { CustomerTransactionsPage } from './components/customer/CustomerTransactionsPage';
import { CustomerBeneficiariesPage } from './components/customer/CustomerBeneficiariesPage';
import { CustomerDevicesPage } from './components/customer/CustomerDevicesPage';
import { CustomerSecurityCenterPage } from './components/customer/CustomerSecurityCenterPage';
import { ReportFraudModal } from './components/customer/ReportFraudModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { CustomersPage } from './pages/CustomersPage';
import { FraudGraphPage } from './pages/FraudGraphPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AiEnginePage } from './pages/AiEnginePage';
import { AdminPage } from './pages/AdminPage';
import { AuditChainPage } from './pages/AuditChainPage';
import { ArchitecturePage } from './pages/ArchitecturePage';

export default function App() {
  // Navigation & Authentication - Default to dedicated Login Page
  const [currentTab, setCurrentTab] = useState<NavigationTab>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Core Data State (shared across SOC & Customer Banking)
  const [transactions, setTransactions] = useState<Transaction[]>(DEMO_TRANSACTIONS);
  const [alerts, setAlerts] = useState<FraudAlert[]>(DEMO_ALERTS);
  const [customers, setCustomers] = useState<DigitalTrustProfile[]>(DEMO_CUSTOMERS);
  const [stats, setStats] = useState<DashboardStats>(DEMO_STATS_INITIAL);

  // Customer Personal Banking State
  const [balance, setBalance] = useState<number>(148250.0);
  const [availableBalance, setAvailableBalance] = useState<number>(142250.0);
  const [devices, setDevices] = useState<Device[]>(DEMO_DEVICES);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(DEMO_BENEFICIARIES);
  const [fraudReports, setFraudReports] = useState<FraudReport[]>(DEMO_FRAUD_REPORTS);
  const [auditEvents, setAuditEvents] = useState<SecurityAuditEvent[]>(DEMO_AUDIT_CHAIN);

  // Onboarding & Auth State
  const [registeredNotice, setRegisteredNotice] = useState<string | undefined>(undefined);
  const [defaultLoginEmail, setDefaultLoginEmail] = useState<string | undefined>(undefined);

  // Configuration Policies (from Admin)
  const [weights, setWeights] = useState<FusionWeights>(DEFAULT_FUSION_WEIGHTS);
  const [thresholds, setThresholds] = useState<RiskThresholds>(DEFAULT_RISK_THRESHOLDS);

  // Active Modals & Selected Entities
  const [investigatingTxn, setInvestigatingTxn] = useState<Transaction | null>(null);
  const [verifyingTxn, setVerifyingTxn] = useState<Transaction | null>(null);
  const [blockedTxn, setBlockedTxn] = useState<Transaction | null>(null);
  const [activePresetScenarioId, setActivePresetScenarioId] = useState<string>('DEMO_1');

  // Customer Report Fraud Modal
  const [isFraudReportModalOpen, setIsFraudReportModalOpen] = useState(false);
  const [fraudReportInitialTxn, setFraudReportInitialTxn] = useState<Transaction | null>(null);

  // Real-time Toast Notifications
  const [toasts, setToasts] = useState<ToastAlert[]>([]);

  const addToast = (toast: Omit<ToastAlert, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Live Monitoring Toggle
  const [isLiveMonitoring, setIsLiveMonitoring] = useState(true);

  // Append to Cryptographic Audit Ledger
  const handleAppendAuditEvent = (
    event: Omit<SecurityAuditEvent, 'id' | 'eventNumber' | 'prevHash' | 'currentHash'>
  ) => {
    setAuditEvents((prev) => {
      const lastEvent = prev[prev.length - 1];
      const prevHash = lastEvent
        ? lastEvent.currentHash
        : '0000000000000000000000000000000000000000000000000000000000000000';
      const newNumber = prev.length + 1;

      // Deterministic hash generation simulation
      const seed = `${newNumber}:${event.timestamp}:${event.action}:${prevHash}`;
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i);
        hash |= 0;
      }
      const currentHash =
        Math.abs(hash).toString(16).padStart(8, '0') +
        'c8f3e2b19a7d4051'.repeat(4).slice(0, 56);

      const fullEvent: SecurityAuditEvent = {
        ...event,
        id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        eventNumber: newNumber,
        prevHash,
        currentHash,
      };
      return [...prev, fullEvent];
    });
  };

  // Recalculate Stats helper
  const recomputeStats = (currentTxns: Transaction[]) => {
    const total = currentTxns.length;
    const fraudCount = currentTxns.filter(
      (t) => t.decision === 'BLOCK' || t.decision === 'HOLD'
    ).length;
    const highRiskCount = currentTxns.filter(
      (t) => t.riskLevel === 'HIGH' || t.riskLevel === 'CRITICAL'
    ).length;
    const blockedCount = currentTxns.filter((t) => t.decision === 'BLOCK').length;
    const verifyCount = currentTxns.filter((t) => t.decision === 'VERIFY').length;
    const avgTrust = 87.4;

    setStats((prev) => ({
      ...prev,
      totalTransactions: total,
      fraudDetected: fraudCount,
      highRisk: highRiskCount,
      blocked: blockedCount,
      verifyRequired: verifyCount,
      trustScore: avgTrust,
      preventedLossINR: 42845000,
    }));
  };

  // Handler: When analyst updates a transaction in investigation modal
  const handleUpdateTransactionStatus = (
    txnId: string,
    newDecision: SecurityDecision,
    note?: string
  ) => {
    setTransactions((prev) => {
      const updated = prev.map((t) => {
        if (t.id === txnId) {
          return {
            ...t,
            decision: newDecision,
            analystAction: {
              action: newDecision,
              analyst: currentUser ? currentUser.name : 'SOC Lead Analyst',
              timestamp: new Date().toLocaleTimeString(),
              note,
            },
          };
        }
        return t;
      });
      recomputeStats(updated);
      return updated;
    });

    handleAppendAuditEvent({
      timestamp: new Date().toLocaleTimeString(),
      user: currentUser?.email || 'admin@trustshield.ai',
      action: `TRANSACTION_${newDecision}`,
      transactionId: txnId,
      decision: newDecision,
      systemComponent: 'SOC Analyst Override Console',
      details: `Operator ${currentUser?.name || 'Lead Analyst'} modified transaction decision to ${newDecision}. Note: ${note || 'Manual review completed'}`,
    });

    addToast({
      title: `TXN ${txnId} UPDATED`,
      message: `Status updated to ${newDecision} by ${currentUser?.name || 'Operator'}.`,
      severity: 'INFO',
    });
  };

  // Handler: When user completes simulated customer OTP
  const handleVerifySuccess = (txnId: string) => {
    setTransactions((prev) => {
      const updated = prev.map((t) => {
        if (t.id === txnId) {
          return {
            ...t,
            decision: 'ALLOW' as SecurityDecision,
            status: 'COMPLETED' as any,
            analystAction: {
              action: 'ALLOW',
              analyst: 'Customer (OTP Verified)',
              timestamp: new Date().toLocaleTimeString(),
              note: 'Stepped-up One-Time Password (OTP) 123456 verified successfully.',
            },
          };
        }
        return t;
      });
      recomputeStats(updated);
      return updated;
    });

    handleAppendAuditEvent({
      timestamp: new Date().toLocaleTimeString(),
      user: currentUser?.email || 'customer@trustshield.ai',
      action: 'OTP_VERIFIED',
      transactionId: txnId,
      decision: 'ALLOW',
      systemComponent: 'Adaptive 2FA Engine',
      details: `Stepped-up cryptographic challenge passed by account owner for txn ${txnId}. Converted to ALLOW.`,
    });

    addToast({
      title: 'CHALLENGE CLEARED',
      message: `Transaction ${txnId} verified by customer OTP and converted to ALLOW.`,
      severity: 'INFO',
    });
  };

  // Handler: When user cancels transaction in OTP dialog
  const handleCancelTransaction = (txnId: string) => {
    setTransactions((prev) => {
      const updated = prev.map((t) => {
        if (t.id === txnId) {
          return {
            ...t,
            decision: 'BLOCK' as SecurityDecision,
            status: 'CANCELLED' as any,
            analystAction: {
              action: 'BLOCK',
              analyst: 'Customer (Payment Denied)',
              timestamp: new Date().toLocaleTimeString(),
              note: 'Customer rejected unrecognized payment challenge.',
            },
          };
        }
        return t;
      });
      recomputeStats(updated);
      return updated;
    });

    handleAppendAuditEvent({
      timestamp: new Date().toLocaleTimeString(),
      user: currentUser?.email || 'customer@trustshield.ai',
      action: 'TRANSACTION_CANCELLED_BY_USER',
      transactionId: txnId,
      decision: 'BLOCK',
      systemComponent: 'Customer Security App',
      details: `Customer flagged transaction ${txnId} as unauthorized during 2FA challenge. Outflow cancelled.`,
    });

    addToast({
      title: 'TRANSACTION CANCELLED',
      message: `Transaction ${txnId} terminated by customer request.`,
      severity: 'CRITICAL',
    });
  };

  // Handler: When a new transaction is simulated or executed
  const handleTransactionAnalyzed = (result: SimulationResult) => {
    setTransactions((prev) => {
      const exists = prev.some((t) => t.id === result.transaction.id);
      const updated = exists
        ? prev.map((t) => (t.id === result.transaction.id ? result.transaction : t))
        : [result.transaction, ...prev];
      recomputeStats(updated);
      return updated;
    });

    handleAppendAuditEvent({
      timestamp: new Date().toLocaleTimeString(),
      user: result.transaction.customerEmail,
      action: `TRANSACTION_${result.transaction.decision}`,
      transactionId: result.transaction.id,
      riskScore: result.transaction.riskScore,
      decision: result.transaction.decision,
      systemComponent: 'Fraud Fusion Core',
      details: `Analyzed ₹${result.transaction.amount.toLocaleString()} transfer to ${result.transaction.beneficiary}. Signals: TXN=${result.breakdown.transaction_score}, DEV=${result.breakdown.device_score}, LOC=${result.breakdown.location_score}.`,
    });

    // If critical or high, fire toast alert
    if (result.transaction.riskLevel === 'CRITICAL') {
      addToast({
        title: 'HIGH-RISK TRANSACTION DETECTED',
        message: `${result.transaction.customerName} • ₹${result.transaction.amount.toLocaleString()} flagged with score ${result.transaction.riskScore}/100. Action: ${result.transaction.decision}`,
        severity: 'CRITICAL',
        transaction: result.transaction,
      });
    } else if (result.transaction.decision === 'VERIFY') {
      addToast({
        title: 'VERIFICATION STEP REQUIRED',
        message: `Stepped-up authentication triggered for ${result.transaction.customerName} (₹${result.transaction.amount.toLocaleString()}).`,
        severity: 'HIGH',
        transaction: result.transaction,
      });
    }
  };

  // Handler: Customer completes a transfer from CustomerTransferFlow
  const handleCustomerTransferCompleted = (
    txn: Transaction,
    newBal: number,
    newAvailBal: number
  ) => {
    setBalance(newBal);
    setAvailableBalance(newAvailBal);

    setTransactions((prev) => [txn, ...prev]);
    recomputeStats([txn, ...transactions]);

    if (txn.decision === 'BLOCK') {
      addToast({
        title: 'CRITICAL SECURITY INTERCEPT',
        message: `Transfer of ₹${txn.amount.toLocaleString()} blocked by AI Fraud Engine. Risk score: ${txn.riskScore}/100.`,
        severity: 'CRITICAL',
        transaction: txn,
      });
    } else if (txn.decision === 'HOLD') {
      addToast({
        title: 'TRANSACTION HELD IN ESCROW',
        message: `Transfer of ₹${txn.amount.toLocaleString()} placed on hold for SOC review. Risk score: ${txn.riskScore}/100.`,
        severity: 'HIGH',
        transaction: txn,
      });
    } else {
      addToast({
        title: 'TRANSFER COMPLETED',
        message: `₹${txn.amount.toLocaleString()} transferred successfully to ${txn.beneficiary}.`,
        severity: 'INFO',
        transaction: txn,
      });
    }
  };

  // Handler: Customer reports fraud via ReportFraudModal
  const handleSubmitFraudReport = (
    report: FraudReport,
    freezeAccount: boolean,
    auditEvent: Omit<SecurityAuditEvent, 'id' | 'eventNumber' | 'prevHash' | 'currentHash'>
  ) => {
    setFraudReports((prev) => [report, ...prev]);
    handleAppendAuditEvent(auditEvent);

    if (freezeAccount) {
      setAvailableBalance(0);
      addToast({
        title: 'ACCOUNT EMERGENCY FROZEN',
        message: 'All outward transfers locked pending investigation. Cards deactivated.',
        severity: 'CRITICAL',
      });
    }

    if (report.transactionId) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === report.transactionId
            ? {
                ...t,
                status: 'HOLD' as any,
                analystAction: {
                  action: 'HOLD',
                  analyst: 'Customer Fraud Dispute',
                  timestamp: new Date().toLocaleTimeString(),
                  note: `Customer reported fraud: ${report.reason}. Dispute Case: ${report.reportId}`,
                },
              }
            : t
        )
      );
    }

    const newAlert: FraudAlert = {
      id: `ALT-DISPUTE-${Date.now().toString().slice(-4)}`,
      transactionId: report.transactionId || 'N/A',
      customerId: report.customerId,
      customerName: report.customerName || currentUser?.name || 'Customer',
      timestamp: new Date().toLocaleTimeString(),
      severity: 'HIGH',
      title: 'Customer Fraud Dispute Filed',
      amount: report.transactionId
        ? transactions.find((t) => t.id === report.transactionId)?.amount || 0
        : 0,
      reason: `Report filed: ${report.reason}. ${report.details || report.description || ''}`,
      status: 'OPEN',
    };
    setAlerts((prev) => [newAlert, ...prev]);

    setIsFraudReportModalOpen(false);
    setFraudReportInitialTxn(null);

    addToast({
      title: 'FRAUD REPORT DISPATCHED TO SOC',
      message: `Incident #${report.reportId} created. An investigator is reviewing the activity.`,
      severity: 'HIGH',
    });
  };

  // Handler: Customer adds beneficiary
  const handleAddBeneficiary = (newBnf: Beneficiary) => {
    setBeneficiaries((prev) => [newBnf, ...prev]);
    addToast({
      title: 'BENEFICIARY REGISTERED',
      message: `${newBnf.name} added. 24-hour cooling threshold active for high-value transfers.`,
      severity: 'INFO',
    });
    handleAppendAuditEvent({
      timestamp: new Date().toLocaleTimeString(),
      user: currentUser?.email || 'customer@trustshield.ai',
      action: 'BENEFICIARY_ADDED',
      systemComponent: 'Beneficiary Management Service',
      details: `New payee ${newBnf.name} (${newBnf.bank} • ${newBnf.accountNumber}) registered. Trust status: ${newBnf.trustStatus}.`,
    });
  };

  // Handler: Customer removes beneficiary
  const handleRemoveBeneficiary = (id: string) => {
    const bnf = beneficiaries.find((b) => b.id === id);
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    addToast({
      title: 'BENEFICIARY REMOVED',
      message: `${bnf?.name || 'Payee'} was removed from your trusted beneficiaries.`,
      severity: 'INFO',
    });
  };

  // Handler: Device management
  const handleRemoveDevice = (deviceId: string) => {
    const dev = devices.find((d) => d.id === deviceId);
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    addToast({
      title: 'DEVICE UNLINKED',
      message: `${dev?.name || 'Device'} was de-authenticated and sessions revoked.`,
      severity: 'INFO',
    });
  };

  const handleTrustDevice = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, trustStatus: 'TRUSTED' } : d))
    );
    addToast({
      title: 'DEVICE VERIFIED',
      message: 'Hardware fingerprint registered as trusted terminal.',
      severity: 'INFO',
    });
  };

  // Handler: Scenario Trigger from Demo Bar
  const handleSelectScenario = (scenario: typeof DEMO_SCENARIOS[0]) => {
    setActivePresetScenarioId(scenario.id);
    const analyzed = analyzeTransactionSimulation(scenario.input, weights, thresholds);
    handleTransactionAnalyzed(analyzed);

    addToast({
      title: `SCENARIO LOADED: ${scenario.name.toUpperCase()}`,
      message: scenario.subtitle,
      severity: analyzed.transaction.riskLevel === 'CRITICAL' ? 'CRITICAL' : 'INFO',
      transaction: analyzed.transaction,
    });

    if (scenario.expectedDecision === 'VERIFY') {
      setVerifyingTxn(analyzed.transaction);
    } else if (scenario.expectedDecision === 'BLOCK') {
      setBlockedTxn(analyzed.transaction);
    } else {
      setInvestigatingTxn(analyzed.transaction);
    }
  };

  // Handler: Alert status update
  const handleUpdateAlertStatus = (
    alertId: string,
    newStatus: 'OPEN' | 'INVESTIGATING' | 'RESOLVED'
  ) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a))
    );
    addToast({
      title: `ALERT ${alertId} UPDATED`,
      message: `Incident status updated to ${newStatus}.`,
      severity: 'INFO',
    });
  };

  // Handler: Registration
  const handleRegisterSuccess = (
    newCustomer: DigitalTrustProfile,
    initialAccount: {
      accountNumber: string;
      accountType: 'Savings' | 'Current';
      balance: number;
      phone: string;
      password: string;
    }
  ) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    setBalance(initialAccount.balance);
    setAvailableBalance(initialAccount.balance);
    setRegisteredNotice(
      `Account opened successfully for ${newCustomer.customerName}! Your account number is ${initialAccount.accountNumber}. Please sign in to access your digital account.`
    );
    setDefaultLoginEmail(newCustomer.customerEmail);
    setCurrentTab('login');

    addToast({
      title: 'DIGITAL ACCOUNT ONBOARDED',
      message: `Profile established for ${newCustomer.customerName} with initial balance of ₹${initialAccount.balance.toLocaleString()}.`,
      severity: 'INFO',
    });

    handleAppendAuditEvent({
      timestamp: new Date().toLocaleTimeString(),
      user: newCustomer.customerEmail,
      action: 'CUSTOMER_ONBOARDING',
      systemComponent: 'Digital Identity Verification',
      details: `New digital account ${initialAccount.accountNumber} created for ${newCustomer.customerName}. Base trust score: ${newCustomer.overallTrustScore}/100.`,
    });
  };

  // Handler: Login Success
  const handleLoginSuccess = (email: string, role: UserRole) => {
    const normalized = email.trim().toLowerCase();
    const matchedCustomer = customers.find(
      (c) => c.customerEmail.toLowerCase() === normalized
    );

    const newUser: User = {
      id: matchedCustomer ? matchedCustomer.customerId : 'usr-1',
      name:
        role === 'ADMIN'
          ? 'Commander Alex Vance'
          : matchedCustomer
          ? matchedCustomer.customerName
          : 'Jerlin Jannett',
      email,
      role,
      accountNumber: '4092-8819-2041-9923',
      accountType: 'Savings',
      balance,
      availableBalance,
    };

    setCurrentUser(newUser);

    if (role === 'CUSTOMER') {
      setCurrentTab('customer-dashboard');
      addToast({
        title: 'CUSTOMER SESSION INITIALIZED',
        message: `Welcome back, ${newUser.name}. Continuous Zero-Trust Security active.`,
        severity: 'INFO',
      });
    } else {
      setCurrentTab('dashboard');
      addToast({
        title: 'OPERATOR SESSION INITIALIZED',
        message: `Authenticated as ${newUser.name} (${newUser.role}). Digital Trust Engine online.`,
        severity: 'INFO',
      });
    }

    handleAppendAuditEvent({
      timestamp: new Date().toLocaleTimeString(),
      user: email,
      action: 'USER_LOGIN',
      systemComponent: 'Authentication Service',
      details: `User session authenticated for ${newUser.name} (${role}) from verified device token.`,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTab('login');
  };

  // Quick Demo Access from Landing
  const handleViewDemo = () => {
    const demoUser: User = {
      id: 'demo-admin',
      name: 'Commander Alex Vance',
      email: 'admin@trustshield.ai',
      role: 'ADMIN',
    };
    setCurrentUser(demoUser);
    setCurrentTab('dashboard');
  };

  const handleViewCustomerDemo = () => {
    const demoCustomerUser: User = {
      id: 'jerlin-jannett',
      name: 'Jerlin Jannett',
      email: 'jerlin.jannett@bankcorp.com',
      role: 'CUSTOMER',
      accountNumber: '4092-8819-2041-9923',
      accountType: 'Savings',
      balance,
      availableBalance,
    };
    setCurrentUser(demoCustomerUser);
    setCurrentTab('customer-dashboard');
  };

  // Current customer profile matching logged-in customer or default
  const activeCustomerProfile =
    customers.find(
      (c) => c.customerEmail.toLowerCase() === currentUser?.email.toLowerCase()
    ) ||
    customers.find((c) => c.customerId === 'jerlin-jannett') ||
    customers[0];

  // Unauthenticated Flow: Enforce dedicated TrustShield AI Login page (no bypass or auto-skip)
  if (!currentUser) {
    if (currentTab === 'register') {
      return (
        <RegisterPage
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateToLogin={(email) => {
            if (email) setDefaultLoginEmail(email);
            setCurrentTab('login');
          }}
          onBackToLanding={() => setCurrentTab('login')}
          existingEmails={customers.map((c) => c.customerEmail)}
        />
      );
    }

    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setCurrentTab('register')}
        registeredNotice={registeredNotice}
        defaultEmail={defaultLoginEmail}
      />
    );
  }

  // Determine whether we are in Customer Banking mode or SOC Command Center mode
  const isCustomerPortal =
    currentTab.startsWith('customer-') || currentUser?.role === 'CUSTOMER';

  // 4. Customer Portal Layout
  if (isCustomerPortal && (currentTab.startsWith('customer-') || currentTab === 'architecture')) {
    const safeCustomerUser: User = currentUser || {
      id: activeCustomerProfile.customerId,
      name: activeCustomerProfile.customerName,
      email: activeCustomerProfile.customerEmail,
      role: 'CUSTOMER',
      accountNumber: '4092-8819-2041-9923',
      accountType: 'Savings',
      balance,
      availableBalance,
    };

    return (
      <div className="min-h-screen bg-[#070d18] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
        <CustomerHeader
          currentUser={safeCustomerUser}
          activeTab={currentTab}
          setActiveTab={(tab) => setCurrentTab(tab)}
          onLogout={handleLogout}
          onSwitchToAdmin={() => {
            if (currentUser) {
              setCurrentUser({ ...currentUser, role: 'ADMIN' });
            }
            setCurrentTab('dashboard');
          }}
          unreadAlertsCount={alerts.filter((a) => a.status === 'OPEN').length}
        />

        <main className="flex-1 overflow-y-auto">
          {currentTab === 'architecture' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <ArchitecturePage onNavigate={(tab) => setCurrentTab(tab as any)} />
            </div>
          )}
          {currentTab === 'customer-dashboard' && (
            <CustomerDashboardPage
              currentUser={safeCustomerUser}
              customerProfile={activeCustomerProfile}
              transactions={transactions}
              devices={devices}
              beneficiaries={beneficiaries}
              balance={balance}
              availableBalance={availableBalance}
              setActiveTab={(tab) => setCurrentTab(tab)}
              onInspectTransaction={(txn) => setInvestigatingTxn(txn)}
              onQuickTransfer={() => setCurrentTab('customer-transfer')}
            />
          )}

          {currentTab === 'customer-transfer' && (
            <CustomerTransferFlow
              currentUser={safeCustomerUser}
              customerProfile={activeCustomerProfile}
              beneficiaries={beneficiaries}
              balance={balance}
              availableBalance={availableBalance}
              onTransferCompleted={handleCustomerTransferCompleted}
              onAuditLog={handleAppendAuditEvent}
              onOpenReportFraud={(txn) => {
                setFraudReportInitialTxn(txn || null);
                setIsFraudReportModalOpen(true);
              }}
              onCancel={() => setCurrentTab('customer-dashboard')}
              onInspectTransaction={(txn) => setInvestigatingTxn(txn)}
            />
          )}

          {currentTab === 'customer-transactions' && (
            <CustomerTransactionsPage
              transactions={transactions}
              onInspectTransaction={(txn) => setInvestigatingTxn(txn)}
              onOpenReportFraud={(txn) => {
                setFraudReportInitialTxn(txn || null);
                setIsFraudReportModalOpen(true);
              }}
            />
          )}

          {currentTab === 'customer-beneficiaries' && (
            <CustomerBeneficiariesPage
              beneficiaries={beneficiaries}
              onAddBeneficiary={handleAddBeneficiary}
              onRemoveBeneficiary={handleRemoveBeneficiary}
              onSelectToSend={() => setCurrentTab('customer-transfer')}
            />
          )}

          {currentTab === 'customer-devices' && (
            <CustomerDevicesPage
              devices={devices}
              onRemoveDevice={handleRemoveDevice}
              onTrustDevice={handleTrustDevice}
            />
          )}

          {currentTab === 'customer-security' && (
            <CustomerSecurityCenterPage
              customerProfile={activeCustomerProfile}
              devices={devices}
              fraudReports={fraudReports}
              auditChain={auditEvents}
              onOpenReportFraud={() => {
                setFraudReportInitialTxn(null);
                setIsFraudReportModalOpen(true);
              }}
            />
          )}
        </main>

        {/* Customer Fraud Dispute Modal */}
        <ReportFraudModal
          isOpen={isFraudReportModalOpen}
          transactions={transactions}
          initialTransaction={fraudReportInitialTxn}
          onClose={() => {
            setIsFraudReportModalOpen(false);
            setFraudReportInitialTxn(null);
          }}
          onSubmitReport={handleSubmitFraudReport}
        />

        {/* Transaction Detail Dossier Modal */}
        <TransactionDetailModal
          transaction={investigatingTxn}
          onClose={() => setInvestigatingTxn(null)}
          onUpdateStatus={handleUpdateTransactionStatus}
          onOpenCustomerProfile={() => {
            setCurrentTab('customer-dashboard');
          }}
        />

        {/* Customer 2FA OTP Modal */}
        <CustomerVerifyModal
          transaction={verifyingTxn}
          onClose={() => setVerifyingTxn(null)}
          onVerifySuccess={handleVerifySuccess}
          onCancelTransaction={handleCancelTransaction}
        />

        {/* Blocked Modal */}
        <BlockedModal
          transaction={blockedTxn}
          onClose={() => setBlockedTxn(null)}
          onViewAnalysis={(txn) => setInvestigatingTxn(txn)}
        />

        {/* Real-time Toast Alerts */}
        <ToastNotification
          toasts={toasts}
          onDismiss={removeToast}
          onInspect={(txn) => setInvestigatingTxn(txn)}
        />
      </div>
    );
  }

  // 5. SOC Command Center (Admin / Fraud Analyst Portal)
  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Command Center Header */}
      <Header
        currentRole={currentUser?.role || 'ADMIN'}
        setCurrentRole={(role) =>
          currentUser && setCurrentUser({ ...currentUser, role })
        }
        isLiveMonitoring={isLiveMonitoring}
        setIsLiveMonitoring={setIsLiveMonitoring}
        onLogout={handleLogout}
        unreadAlertsCount={alerts.filter((a) => a.status === 'OPEN').length}
        onOpenAlerts={() => setCurrentTab('alerts')}
        onOpenArchitecture={() => setCurrentTab('architecture')}
        onSwitchToCustomer={() => {
          if (currentUser) {
            setCurrentUser({ ...currentUser, role: 'CUSTOMER' });
          }
          setCurrentTab('customer-dashboard');
        }}
      />

      {/* Main Body with Persistent Sidebar & Route View Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Navigation Sidebar */}
        <Sidebar
          activePage={currentTab as any}
          setActivePage={(page) => setCurrentTab(page as any)}
          unreadAlertsCount={alerts.filter((a) => a.status === 'OPEN').length}
          onSwitchToCustomer={() => {
            if (currentUser) {
              setCurrentUser({ ...currentUser, role: 'CUSTOMER' });
            }
            setCurrentTab('customer-dashboard');
          }}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          {/* TAB: System Architecture Blueprint */}
          {currentTab === 'architecture' && (
            <ArchitecturePage onNavigate={(tab) => setCurrentTab(tab as any)} />
          )}

          {/* TAB: Dashboard */}
          {currentTab === 'dashboard' && (
            <DashboardPage
              stats={stats}
              transactions={transactions}
              alerts={alerts}
              customers={customers}
              onSelectTransaction={(txn) => setInvestigatingTxn(txn)}
              onSelectScenario={handleSelectScenario}
              onNavigateToSimulator={() => setCurrentTab('simulator')}
              onNavigateToCustomers={() => setCurrentTab('customers')}
              onNavigateToGraph={() => setCurrentTab('fraud-graph')}
            />
          )}

          {/* TAB: Transactions Monitoring Table */}
          {currentTab === 'transactions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-display font-bold text-white tracking-wide">
                    Real-Time Transaction Stream
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Continuous monitoring with sub-20ms multi-modal risk scoring and adaptive enforcement.
                  </p>
                </div>
              </div>
              <TransactionTable
                transactions={transactions}
                onSelectTransaction={(txn) => setInvestigatingTxn(txn)}
              />
            </div>
          )}

          {/* TAB: Transaction Risk Simulator */}
          {currentTab === 'simulator' && (
            <SimulatorPage
              onTransactionAnalyzed={handleTransactionAnalyzed}
              onOpenVerifyModal={(txn) => setVerifyingTxn(txn)}
              onOpenBlockedModal={(txn) => setBlockedTxn(txn)}
              onOpenDetailModal={(txn) => setInvestigatingTxn(txn)}
              weights={weights}
              thresholds={thresholds}
              activePresetId={activePresetScenarioId}
            />
          )}

          {/* TAB: Customers & Digital Trust Profiles */}
          {currentTab === 'customers' && (
            <CustomersPage customers={customers} />
          )}

          {/* TAB: Fraud Intelligence Graph */}
          {currentTab === 'fraud-graph' && <FraudGraphPage />}

          {/* TAB: Alerts Management */}
          {currentTab === 'alerts' && (
            <AlertsPage
              alerts={alerts}
              transactions={transactions}
              onInspectTransaction={(txn) => setInvestigatingTxn(txn)}
              onUpdateAlertStatus={handleUpdateAlertStatus}
            />
          )}

          {/* TAB: Analytics & Trends */}
          {currentTab === 'analytics' && <AnalyticsPage />}

          {/* TAB: Hybrid AI Engine & Architecture */}
          {currentTab === 'ai-engine' && (
            <AiEnginePage onNavigateToArchitecture={() => setCurrentTab('architecture')} />
          )}

          {/* TAB: Immutable Audit Chain & Compliance Ledger */}
          {currentTab === 'audit-chain' && (
            <AuditChainPage
              auditEvents={auditEvents}
              transactions={transactions}
              onSelectTransaction={(txn) => setInvestigatingTxn(txn)}
            />
          )}

          {/* TAB: Admin Governance Console */}
          {currentTab === 'admin' && (
            <AdminPage
              weights={weights}
              thresholds={thresholds}
              transactions={transactions}
              onInspectTransaction={(txn) => setInvestigatingTxn(txn)}
              onSaveConfig={(w, t) => {
                setWeights(w);
                setThresholds(t);
                handleAppendAuditEvent({
                  timestamp: new Date().toLocaleTimeString(),
                  user: currentUser?.email || 'admin@trustshield.ai',
                  action: 'SECURITY_POLICY_COMMITTED',
                  systemComponent: 'Admin Governance Console',
                  details: `Risk thresholds updated (LOW: ${t.lowMax}, MED: ${t.mediumMax}, HIGH: ${t.highMax}). Signal weights re-calibrated.`,
                });
                addToast({
                  title: 'SECURITY POLICY COMMITTED',
                  message:
                    'Risk thresholds and signal weight matrices updated in runtime engine.',
                  severity: 'INFO',
                });
              }}
            />
          )}
        </main>
      </div>

      {/* Investigation Dossier Modal */}
      <TransactionDetailModal
        transaction={investigatingTxn}
        onClose={() => setInvestigatingTxn(null)}
        onUpdateStatus={handleUpdateTransactionStatus}
        onOpenCustomerProfile={() => {
          setCurrentTab('customers');
        }}
      />

      {/* Customer 2FA OTP Stepped-Up Verification Modal */}
      <CustomerVerifyModal
        transaction={verifyingTxn}
        onClose={() => setVerifyingTxn(null)}
        onVerifySuccess={handleVerifySuccess}
        onCancelTransaction={handleCancelTransaction}
      />

      {/* Blocked Transaction Intercept Modal */}
      <BlockedModal
        transaction={blockedTxn}
        onClose={() => setBlockedTxn(null)}
        onViewAnalysis={(txn) => setInvestigatingTxn(txn)}
      />

      {/* Real-time Toast Notifications Alert Stack */}
      <ToastNotification
        toasts={toasts}
        onDismiss={removeToast}
        onInspect={(txn) => setInvestigatingTxn(txn)}
      />
    </div>
  );
}
