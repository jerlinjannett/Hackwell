export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type SecurityDecision = 'ALLOW' | 'VERIFY' | 'HOLD' | 'BLOCK';
export type TransactionStatus =
  | 'CREATED'
  | 'ANALYZING'
  | 'ALLOWED'
  | 'OTP_REQUIRED'
  | 'VERIFIED'
  | 'HOLD'
  | 'BLOCKED'
  | 'CANCELLED'
  | 'FAILED'
  | 'COMPLETED';
export type AlertStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
export type EntityRiskStatus = 'trusted' | 'suspicious' | 'high_risk' | 'blocked';
export type UserRole = 'CUSTOMER' | 'FRAUD_ANALYST' | 'ADMIN';

export type NavigationTab =
  | 'landing'
  | 'login'
  | 'register'
  | 'customer-dashboard'
  | 'customer-transfer'
  | 'customer-transactions'
  | 'customer-security'
  | 'customer-devices'
  | 'customer-beneficiaries'
  | 'customer-report-fraud'
  | 'dashboard'
  | 'architecture'
  | 'transactions'
  | 'simulator'
  | 'customers'
  | 'fraud-graph'
  | 'fraud-rings'
  | 'attack-simulator'
  | 'what-if-simulator'
  | 'audit-chain'
  | 'model-monitoring'
  | 'system-health'
  | 'alerts'
  | 'analytics'
  | 'ai-engine'
  | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accountNumber?: string;
  phone?: string;
  accountType?: 'Savings' | 'Current';
  balance?: number;
  availableBalance?: number;
}

export interface SignalBreakdown {
  transaction_score: number;
  behavior_score: number;
  device_score: number;
  location_score: number;
  beneficiary_score: number;
  login_score: number;
  network_score: number;
  graph_score?: number;
  velocity_score?: number;
}

export interface FusionWeights {
  transaction: number;  // 25%
  behavior: number;     // 20%
  device: number;       // 15%
  login: number;        // 10%
  beneficiary: number;  // 10%
  graph?: number;       // 10%
  velocity?: number;    // 10%
  location?: number;
  network?: number;
}

export interface RiskThresholds {
  lowMax: number;     // 30 -> ALLOW (0 - 30)
  mediumMax: number;  // 60 -> VERIFY (31 - 60)
  highMax: number;    // 80 -> HOLD (61 - 80), BLOCK (81 - 100)
}

export interface SecurityTimelineEvent {
  step: string;
  label: string;
  time: string;
  status: 'normal' | 'flagged' | 'critical';
  detail: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  transactionType: 'UPI' | 'NEFT' | 'IMPS' | 'CARD' | 'WIRE' | 'CRYPTO_GATEWAY';
  location: string;
  device: string;
  deviceId: string;
  beneficiary: string;
  beneficiaryAccount: string;
  beneficiaryStatus: 'known' | 'new' | 'suspicious' | 'blacklisted';
  ipAddress: string;
  timestamp: string;
  timeAgo?: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  decision: SecurityDecision;
  reasons: string[];
  signals: SignalBreakdown;
  timeline: SecurityTimelineEvent[];
  analystAction?: {
    action: string;
    analyst: string;
    timestamp: string;
    note?: string;
  };
  otpVerified?: boolean;
  status?: TransactionStatus;
}

export interface DigitalTrustProfile {
  customerId: string;
  customerName: string;
  customerEmail: string;
  accountAgeMonths: number;
  overallTrustScore: number; // 0 - 100
  trustSignals: {
    identityTrust: number;
    deviceTrust: number;
    locationTrust: number;
    behaviorTrust: number;
    transactionTrust: number;
    networkTrust: number;
  };
  typicalLocations: string[];
  knownDevices: string[];
  typicalTransactionRange: {
    min: number;
    max: number;
    average: number;
  };
  usualTransactionTimes: string;
  knownBeneficiaries: string[];
  loginPattern: string;
  recentRiskEvents: number;
  totalTransactions: number;
  status: 'ACTIVE' | 'FLAGGED' | 'SUSPENDED';
}

export interface FraudAlert {
  id: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
  customerName: string;
  customerId: string;
  transactionId: string;
  amount: number;
  reason: string;
  status: AlertStatus;
  riskScore?: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'customer' | 'device' | 'ip' | 'location' | 'beneficiary' | 'account' | 'transaction';
  status: EntityRiskStatus;
  riskScore: number;
  connectedCount: number;
  details?: Record<string, any>;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  status: EntityRiskStatus;
}

export interface FraudIntelligenceGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface SimulationInput {
  customer: string;
  transactionAmount: number;
  transactionType: 'UPI' | 'NEFT' | 'IMPS' | 'CARD' | 'WIRE' | 'CRYPTO_GATEWAY';
  location: string;
  device: string;
  beneficiary: string;
  loginTime: string;
  ipAddress: string;
  previousTransactions: number;
  averageTransactionAmount: number;
  failedLoginAttempts: number;
  deviceTrust: number;
  locationTrust: number;
  beneficiaryTrust: number;
  transactionFrequency: number; // txns per day
  accountAgeMonths: number;
  beneficiaryIsBlacklisted?: boolean;
}

export interface SimulationResult {
  transaction: Transaction;
  breakdown: SignalBreakdown;
  aiExplanation: string[];
  anomalyIndicators: {
    randomForestScore: number;
    isolationForestAnomaly: number;
    behavioralZScore: number;
    ruleFlags: string[];
  };
}

export interface DashboardStats {
  totalTransactions: number;
  totalTransactionsChange: number;
  fraudDetected: number;
  fraudDetectedChange: number;
  highRisk: number;
  highRiskChange: number;
  blocked: number;
  blockedChange: number;
  verifyRequired: number;
  verifyRequiredChange: number;
  trustScore: number;
  trustScoreChange: number;
  preventedLossINR?: number;
}

export interface Device {
  id: string;
  customerId: string;
  name: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  firstSeen: string;
  lastActive: string;
  trustStatus: 'TRUSTED' | 'NEW' | 'SUSPICIOUS' | 'BLOCKED';
  isCurrent?: boolean;
}

export interface Beneficiary {
  id: string;
  customerId: string;
  name: string;
  accountNumber: string;
  bank: string;
  ifsc: string;
  upiId?: string;
  addedDate: string;
  transactionCount: number;
  trustStatus: 'TRUSTED' | 'NEW' | 'SUSPICIOUS';
  category?: string;
}

export interface FraudReport {
  id: string;
  reportId?: string;
  transactionId?: string;
  customerId: string;
  customerName?: string;
  reason: string;
  description?: string;
  details?: string;
  timestamp: string;
  status: 'NEW' | 'INVESTIGATING' | 'UNDER_INVESTIGATION' | 'RESOLVED';
  severity?: 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface SecurityAuditEvent {
  id: string;
  eventNumber: number;
  timestamp: string;
  user: string;
  action: string;
  transactionId?: string;
  riskScore?: number;
  decision?: SecurityDecision | 'N/A';
  systemComponent: string;
  prevHash: string;
  currentHash: string;
  details: string;
}

export interface FraudRing {
  id: string;
  ringId: string;
  name: string;
  riskScore: number;
  members: {
    accountId: string;
    holderName: string;
    role: string;
    joinedDate: string;
  }[];
  totalSuspiciousAmount: number;
  sharedDevices: string[];
  sharedIps: string[];
  commonBeneficiaries: string[];
  pattern: string;
  status: 'ACTIVE' | 'DISRUPTED' | 'MONITORING';
  description: string;
}

export interface AttackScenario {
  id: string;
  name: string;
  title: string;
  description: string;
  threatLevel: 'HIGH' | 'CRITICAL';
  estimatedLossINR: number;
  steps: {
    id: string;
    step: string;
    label: string;
    status: 'pending' | 'active' | 'flagged' | 'blocked' | 'mitigated';
    detail: string;
    component: string;
    delayMs: number;
  }[];
}

