import {
  FusionWeights,
  RiskLevel,
  RiskThresholds,
  SecurityDecision,
  SignalBreakdown,
  SimulationInput,
  SimulationResult,
  Transaction,
  SecurityTimelineEvent,
} from '../types';

export const DEFAULT_FUSION_WEIGHTS: FusionWeights = {
  transaction: 0.25, // Transaction Risk 25%
  behavior: 0.20,    // Behavior Risk 20%
  device: 0.15,      // Device Risk 15%
  login: 0.10,       // Login Risk 10%
  beneficiary: 0.10, // Beneficiary Risk 10%
  graph: 0.10,       // Graph Risk 10%
  velocity: 0.10,    // Velocity Risk 10%
  location: 0.10,
  network: 0.10,
};

export const DEFAULT_RISK_THRESHOLDS: RiskThresholds = {
  lowMax: 30,        // ALLOW: 0 – 30
  mediumMax: 60,     // VERIFY: 31 – 60
  highMax: 80,       // HOLD: 61 – 80 (BLOCK: 81 – 100)
};

/**
 * Calculates deterministic behavioral, transaction, device, location,
 * beneficiary, login, and network anomaly signals based on input features.
 */
export function calculateSignals(input: SimulationInput): {
  signals: SignalBreakdown;
  reasons: string[];
  ruleFlags: string[];
  rfScore: number;
  ifScore: number;
  zScore: number;
} {
  const reasons: string[] = [];
  const ruleFlags: string[] = [];

  // 1. Transaction Risk (0-100)
  const avgAmount = Math.max(input.averageTransactionAmount, 100);
  const amountRatio = input.transactionAmount / avgAmount;
  // Estimated standard deviation based on normal banking log-normal variance
  const estimatedStdDev = avgAmount * 0.45;
  const zScore = Number(((input.transactionAmount - avgAmount) / estimatedStdDev).toFixed(2));

  let transactionScore = 0;
  if (amountRatio > 5.0) {
    transactionScore = Math.min(100, 75 + (amountRatio - 5) * 5);
    reasons.push(`Transaction amount (₹${input.transactionAmount.toLocaleString()}) is ${amountRatio.toFixed(1)}× customer's normal average`);
  } else if (amountRatio > 2.5) {
    transactionScore = 55 + (amountRatio - 2.5) * 8;
    reasons.push(`Transaction amount is ${amountRatio.toFixed(1)}× higher than customer's typical expenditure`);
  } else if (amountRatio > 1.4) {
    transactionScore = 25 + (amountRatio - 1.4) * 25;
  } else {
    transactionScore = Math.max(5, amountRatio * 15);
  }

  // Transaction type risk modifier
  if (input.transactionType === 'CRYPTO_GATEWAY') {
    transactionScore = Math.min(100, transactionScore + 20);
    reasons.push('High-risk high-velocity settlement channel (Crypto Gateway)');
  } else if (input.transactionType === 'WIRE' && input.transactionAmount > 50000) {
    transactionScore = Math.min(100, transactionScore + 10);
  }
  transactionScore = Math.round(Math.min(100, Math.max(0, transactionScore)));

  // 2. Behavior Risk (0-100)
  // Account age, unusual login time (e.g. 02:00 - 04:30 AM), high frequency spikes
  let behaviorScore = 0;
  const hourMatch = input.loginTime.match(/(\d\d):/);
  const hour = hourMatch ? parseInt(hourMatch[1], 10) : 14;
  const isNightOddHour = hour >= 1 && hour <= 5;

  if (isNightOddHour) {
    behaviorScore += 30;
    reasons.push(`Transaction attempted during atypical hours (${input.loginTime})`);
  }

  if (input.transactionFrequency > 15) {
    behaviorScore += 35;
    reasons.push(`Abnormal transaction frequency: ${input.transactionFrequency} transactions logged in past 24 hours`);
  } else if (input.transactionFrequency > 8) {
    behaviorScore += 18;
  }

  if (input.accountAgeMonths < 1) {
    behaviorScore += 25;
    reasons.push('Brand new account tenure (< 30 days active)');
  } else if (input.accountAgeMonths < 3) {
    behaviorScore += 10;
  }

  // Inverted behavior baseline
  behaviorScore = Math.round(Math.min(100, Math.max(5, behaviorScore + (zScore > 2 ? 20 : 0))));

  // 3. Device Risk (0-100)
  // Inversely proportional to deviceTrust (0-100)
  let deviceScore = Math.round(100 - input.deviceTrust);
  const isNewDevice = input.deviceTrust < 40 || input.device.toLowerCase().includes('new') || input.device.toLowerCase().includes('unrecognized');
  if (isNewDevice) {
    deviceScore = Math.max(deviceScore, 75);
    reasons.push(`Unrecognized or newly provisioned device fingerprint (${input.device})`);
  } else if (input.deviceTrust < 70) {
    reasons.push(`Device integrity score degraded (${input.deviceTrust}/100)`);
  }

  // 4. Location Risk (0-100)
  let locationScore = Math.round(100 - input.locationTrust);
  const isUnusualLoc = input.locationTrust < 40 || input.location.toLowerCase().includes('unknown') || input.location.toLowerCase().includes('vpn') || input.location.toLowerCase().includes('singapore') || input.location.toLowerCase().includes('russia');
  if (isUnusualLoc) {
    locationScore = Math.max(locationScore, 70);
    reasons.push(`Location differs significantly from customer baseline profile (${input.location})`);
  }

  // 5. Beneficiary Risk (0-100)
  let beneficiaryScore = Math.round(100 - input.beneficiaryTrust);
  if (input.beneficiaryIsBlacklisted) {
    beneficiaryScore = 100;
    ruleFlags.push('RULE_BLACKLISTED_BENEFICIARY');
    reasons.push(`CRITICAL: Beneficiary (${input.beneficiary}) is flagged on Central Financial Crime Blacklist`);
  } else if (input.beneficiaryTrust < 30 || input.beneficiary.toLowerCase().includes('unknown') || input.beneficiary.toLowerCase().includes('unverified') || input.beneficiary.toLowerCase().includes('crypto') || input.beneficiary.toLowerCase().includes('mule')) {
    beneficiaryScore = Math.max(beneficiaryScore, 78);
    reasons.push(`First-time unverified beneficiary with low trust reputation (${input.beneficiary})`);
  } else if (input.beneficiaryTrust < 65) {
    reasons.push(`Beneficiary recently added within 24-hour cooling window`);
  }

  // 6. Login Risk (0-100)
  let loginScore = 10;
  if (input.failedLoginAttempts >= 5) {
    loginScore = 95;
    ruleFlags.push('RULE_BRUTE_FORCE_LOCKOUT');
    reasons.push(`High brute-force risk: ${input.failedLoginAttempts} consecutive failed login attempts detected`);
  } else if (input.failedLoginAttempts >= 3) {
    loginScore = 75;
    reasons.push(`${input.failedLoginAttempts} failed authentication attempts recorded prior to session initiation`);
  } else if (input.failedLoginAttempts >= 1) {
    loginScore = 35;
  }

  // 7. Network / Graph Risk (0-100)
  let networkScore = 15;
  const ip = input.ipAddress.toLowerCase();
  const isProxyTor = ip.includes('185.') || ip.includes('45.') || ip.includes('tor') || ip.includes('vpn') || ip.includes('proxy');
  if (isProxyTor) {
    networkScore = 85;
    reasons.push(`Connection originates from anonymous proxy / hosting datacenter IP (${input.ipAddress})`);
  } else if (input.previousTransactions === 0) {
    networkScore = 40;
  }

  // Graph Risk (detects connected fraud, shared device/IP links, money mule clusters)
  let graphScore = networkScore;
  if (input.beneficiaryIsBlacklisted || input.beneficiaryTrust === 0) {
    graphScore = 95;
  } else if (input.beneficiaryTrust < 40) {
    graphScore = 75;
  } else if (isProxyTor && input.deviceTrust < 50) {
    graphScore = 80;
  }

  // Velocity Risk (rapid burst transactions, new beneficiary velocity, high frequency)
  let velocityScore = 12;
  if (input.previousTransactions > 4 || input.transactionFrequency > 10) {
    velocityScore = 75;
    reasons.push('High transaction velocity detected within a short temporal window');
  } else if (input.deviceTrust < 50 && input.transactionAmount > 15000) {
    velocityScore = 65;
  } else if (input.beneficiaryTrust < 40 && input.transactionAmount > 20000) {
    velocityScore = 55;
  }

  // Hybrid Simulated ML outputs (Random Forest & Isolation Forest)
  // Feature vector: [amountRatio, deviceRisk, locationRisk, beneficiaryRisk, failedLogins]
  const rfFeatureSum = (transactionScore * 0.3) + (deviceScore * 0.25) + (locationScore * 0.15) + (beneficiaryScore * 0.2) + (loginScore * 0.1);
  const rfScore = Math.round(rfFeatureSum);

  // Isolation Forest detects spatial outlier density (negative anomaly score -> high risk)
  const anomalyVectorNorm = Math.sqrt(
    Math.pow(transactionScore / 100, 2) +
    Math.pow(deviceScore / 100, 2) +
    Math.pow(locationScore / 100, 2) +
    Math.pow(loginScore / 100, 2)
  ) / 2;
  const ifScore = Math.round(Math.min(100, anomalyVectorNorm * 100));

  return {
    signals: {
      transaction_score: transactionScore,
      behavior_score: behaviorScore,
      device_score: deviceScore,
      location_score: locationScore,
      beneficiary_score: beneficiaryScore,
      login_score: loginScore,
      network_score: networkScore,
      graph_score: graphScore,
      velocity_score: velocityScore,
    },
    reasons: reasons.length > 0 ? reasons : ['All behavioral markers and security signals align with historic baseline trust patterns.'],
    ruleFlags,
    rfScore,
    ifScore,
    zScore,
  };
}

/**
 * Calculates the Fraud Fusion Score (0-100) using configurable weighted fusion.
 * Signal Weights match Architecture Blueprint:
 * - Transaction Risk: 25%
 * - Behavior Risk: 20%
 * - Device Risk: 15%
 * - Login Risk: 10%
 * - Beneficiary Risk: 10%
 * - Graph Risk: 10%
 * - Velocity Risk: 10%
 */
export function calculateFraudFusionScore(
  signals: SignalBreakdown,
  weights: FusionWeights = DEFAULT_FUSION_WEIGHTS
): number {
  const graphW = weights.graph ?? 0.10;
  const velocityW = weights.velocity ?? 0.10;
  const graphS = signals.graph_score ?? signals.network_score ?? 15;
  const velocityS = signals.velocity_score ?? signals.location_score ?? 15;

  const weightedSum =
    signals.transaction_score * weights.transaction +
    signals.behavior_score * weights.behavior +
    signals.device_score * weights.device +
    signals.login_score * weights.login +
    signals.beneficiary_score * weights.beneficiary +
    graphS * graphW +
    velocityS * velocityW;

  return Math.round(Math.min(100, Math.max(0, weightedSum)));
}

export interface ExplainableAIAttribution {
  factor: string;
  points: number;
  category: string;
  badge: string;
}

/**
 * Generates an Explainable AI (XAI) risk contribution attribution list
 * matching the System Architecture specification:
 * e.g. +30 New Device, +20 New Beneficiary, +15 Unusual Amount, etc.
 */
export function generateExplainableAIBreakdown(
  score: number,
  signals: SignalBreakdown
): ExplainableAIAttribution[] {
  const items: ExplainableAIAttribution[] = [];

  if (signals.device_score >= 60) {
    items.push({ factor: 'New Unrecognized Device', points: 30, category: 'Device', badge: '+30' });
  } else if (signals.device_score >= 35) {
    items.push({ factor: 'Unusual Device Profile', points: 15, category: 'Device', badge: '+15' });
  }

  if (signals.beneficiary_score >= 60) {
    items.push({ factor: 'New Unverified Beneficiary', points: 20, category: 'Beneficiary', badge: '+20' });
  }

  if (signals.transaction_score >= 60) {
    items.push({ factor: 'Unusual Transaction Amount', points: 15, category: 'Amount', badge: '+15' });
  }

  if (signals.location_score >= 50) {
    items.push({ factor: 'Unusual Geolocation Jump', points: 10, category: 'Location', badge: '+10' });
  }

  if (signals.behavior_score >= 60) {
    items.push({ factor: 'Unusual Operating Hour / Time', points: 10, category: 'Behavior', badge: '+10' });
  }

  if ((signals.velocity_score ?? 0) >= 50 || signals.login_score >= 60) {
    items.push({ factor: 'High Velocity / Rapid Activity', points: 7, category: 'Velocity', badge: '+07' });
  }

  if ((signals.graph_score ?? 0) >= 60) {
    items.push({ factor: 'Syndicate / Graph Link Risk', points: 10, category: 'Graph', badge: '+10' });
  }

  return items;
}

/**
 * Maps Fraud Fusion Score to Risk Level based on thresholds.
 */
export function getRiskLevel(
  score: number,
  thresholds: RiskThresholds = DEFAULT_RISK_THRESHOLDS
): RiskLevel {
  if (score <= thresholds.lowMax) return 'LOW';
  if (score <= thresholds.mediumMax) return 'MEDIUM';
  if (score <= thresholds.highMax) return 'HIGH';
  return 'CRITICAL';
}

/**
 * Evaluates Adaptive Security Decision with rule overrides.
 */
export function evaluateSecurityDecision(
  score: number,
  riskLevel: RiskLevel,
  signals: SignalBreakdown,
  ruleFlags: string[] = [],
  input?: SimulationInput
): { decision: SecurityDecision; overrideReason?: string } {
  // 1. Mandatory Rule Overrides
  if (ruleFlags.includes('RULE_BLACKLISTED_BENEFICIARY')) {
    return {
      decision: 'BLOCK',
      overrideReason: 'Automated Rule Override: Beneficiary is flagged on crime blacklist.',
    };
  }

  if (signals.login_score >= 90 && signals.device_score >= 70 && signals.beneficiary_score >= 70) {
    return {
      decision: 'BLOCK',
      overrideReason: 'Automated Rule Override: Multiple failed logins + new device + unverified beneficiary (Account Takeover signature).',
    };
  }

  if (signals.device_score >= 70 && signals.location_score >= 70 && signals.transaction_score >= 65) {
    return {
      decision: 'HOLD',
      overrideReason: 'Automated Rule Override: High anomaly combination (New device + unusual location + large transaction).',
    };
  }

  // Trusted override
  if (signals.device_score <= 15 && signals.location_score <= 15 && signals.transaction_score <= 25 && signals.beneficiary_score <= 20) {
    return {
      decision: 'ALLOW',
      overrideReason: 'Trusted Context: Known device, recognized geofence, and verified beneficiary.',
    };
  }

  // 2. Baseline Threshold Decision
  switch (riskLevel) {
    case 'LOW':
      return { decision: 'ALLOW' };
    case 'MEDIUM':
      return { decision: 'VERIFY' };
    case 'HIGH':
      return { decision: 'HOLD' };
    case 'CRITICAL':
      return { decision: 'BLOCK' };
  }
}

/**
 * Generates an end-to-end simulation analysis result.
 */
export function analyzeTransactionSimulation(
  input: SimulationInput,
  weights: FusionWeights = DEFAULT_FUSION_WEIGHTS,
  thresholds: RiskThresholds = DEFAULT_RISK_THRESHOLDS
): SimulationResult {
  const { signals, reasons, ruleFlags, rfScore, ifScore, zScore } = calculateSignals(input);
  const fusionScore = calculateFraudFusionScore(signals, weights);
  const riskLevel = getRiskLevel(fusionScore, thresholds);
  const { decision, overrideReason } = evaluateSecurityDecision(
    fusionScore,
    riskLevel,
    signals,
    ruleFlags,
    input
  );

  if (overrideReason) {
    reasons.unshift(overrideReason);
  }

  // Build security timeline
  const timeline: SecurityTimelineEvent[] = [
    {
      step: 'LOGIN',
      label: 'Authentication Check',
      time: input.loginTime || '14:20:00',
      status: signals.login_score > 60 ? 'critical' : signals.login_score > 30 ? 'flagged' : 'normal',
      detail: signals.login_score > 60 ? `${input.failedLoginAttempts} failed attempts noted` : 'Single sign-on authenticated',
    },
    {
      step: 'DEVICE CHANGE',
      label: 'Device Fingerprint',
      time: '14:20:15',
      status: signals.device_score > 60 ? 'critical' : signals.device_score > 30 ? 'flagged' : 'normal',
      detail: signals.device_score > 60 ? `New Device (${input.device})` : 'Known & registered hardware token',
    },
    {
      step: 'LOCATION CHANGE',
      label: 'Geo-Telemetry Validation',
      time: '14:20:22',
      status: signals.location_score > 60 ? 'critical' : signals.location_score > 30 ? 'flagged' : 'normal',
      detail: signals.location_score > 60 ? `Unusual Geolocation (${input.location})` : 'Normal domestic IP subnet',
    },
    {
      step: 'BENEFICIARY ADDED',
      label: 'Counterparty Audit',
      time: '14:20:45',
      status: signals.beneficiary_score > 60 ? 'critical' : signals.beneficiary_score > 30 ? 'flagged' : 'normal',
      detail: signals.beneficiary_score > 60 ? `Unvetted Beneficiary (${input.beneficiary})` : 'Whitelist recurring merchant',
    },
    {
      step: 'TRANSACTION INITIATED',
      label: 'Payment Request',
      time: '14:21:05',
      status: signals.transaction_score > 60 ? 'critical' : signals.transaction_score > 30 ? 'flagged' : 'normal',
      detail: `₹${input.transactionAmount.toLocaleString()} via ${input.transactionType}`,
    },
    {
      step: 'AI ANALYSIS',
      label: 'Hybrid ML Evaluation',
      time: '14:21:06',
      status: fusionScore >= 60 ? 'critical' : fusionScore >= 30 ? 'flagged' : 'normal',
      detail: `Random Forest: ${rfScore}/100 | Isolation Forest: ${ifScore}/100`,
    },
    {
      step: 'RISK SCORE',
      label: 'Fraud Fusion Score',
      time: '14:21:07',
      status: riskLevel === 'CRITICAL' || riskLevel === 'HIGH' ? 'critical' : riskLevel === 'MEDIUM' ? 'flagged' : 'normal',
      detail: `Computed Score: ${fusionScore} (${riskLevel})`,
    },
    {
      step: 'SECURITY ACTION',
      label: 'Adaptive Policy Enforcement',
      time: '14:21:08',
      status: decision === 'BLOCK' || decision === 'HOLD' ? 'critical' : decision === 'VERIFY' ? 'flagged' : 'normal',
      detail: `Enforced Action: ${decision}`,
    },
  ];

  const transaction: Transaction = {
    id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
    customerId: input.customer.toLowerCase().replace(/\s+/g, '-'),
    customerName: input.customer,
    customerEmail: `${input.customer.toLowerCase().replace(/\s+/g, '.')}@trustshield.demo`,
    amount: input.transactionAmount,
    currency: 'INR',
    transactionType: input.transactionType,
    location: input.location,
    device: input.device,
    deviceId: `DEV-${Math.floor(100 + Math.random() * 900)}`,
    beneficiary: input.beneficiary,
    beneficiaryAccount: `ACC-****${Math.floor(1000 + Math.random() * 9000)}`,
    beneficiaryStatus: input.beneficiaryIsBlacklisted
      ? 'blacklisted'
      : signals.beneficiary_score > 60
      ? 'suspicious'
      : 'known',
    ipAddress: input.ipAddress,
    timestamp: new Date().toISOString(),
    timeAgo: 'Just now',
    riskScore: fusionScore,
    riskLevel,
    decision,
    reasons,
    signals,
    timeline,
  };

  return {
    transaction,
    breakdown: signals,
    aiExplanation: reasons,
    anomalyIndicators: {
      randomForestScore: rfScore,
      isolationForestAnomaly: ifScore,
      behavioralZScore: zScore,
      ruleFlags,
    },
  };
}
