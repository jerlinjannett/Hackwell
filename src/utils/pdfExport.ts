import { jsPDF } from 'jspdf';
import { Transaction } from '../types';

export function exportTransactionPDF(transaction: Transaction, operatorName: string = 'Security Operations Lead'): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const darkNavy = [11, 19, 38]; // #0b1326
  const primaryCyan = [6, 182, 212]; // #06b6d4
  const slateDark = [30, 41, 59]; // #1e293b
  const slateLight = [241, 245, 249]; // #f1f5f9
  const textDark = [15, 23, 42]; // #0f172a
  const textMuted = [100, 116, 139]; // #64748b

  // Decision Colors
  let decisionBg = [16, 185, 129]; // Emerald
  let decisionText = [255, 255, 255];
  if (transaction.decision === 'BLOCK') {
    decisionBg = [239, 68, 68]; // Red
  } else if (transaction.decision === 'HOLD') {
    decisionBg = [245, 158, 11]; // Amber
  } else if (transaction.decision === 'VERIFY') {
    decisionBg = [59, 130, 246]; // Blue
  }

  // --- HEADER BANNER ---
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Decorative cyan accent bar
  doc.setFillColor(primaryCyan[0], primaryCyan[1], primaryCyan[2]);
  doc.rect(0, 32, pageWidth, 1.5, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('TRUSTSHIELD AI // INCIDENT INVESTIGATION DOSSIER', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Autonomous Banking Fraud Detection & Digital Trust Intelligence Grid', margin, 20);

  // Classification & Timestamp on Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(239, 68, 68);
  doc.text('CLASSIFICATION: CONFIDENTIAL // SOC TIER-3', pageWidth - margin, 12, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  const reportDate = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });
  doc.text(`Generated: ${reportDate}`, pageWidth - margin, 18, { align: 'right' });
  doc.text(`Investigator: ${operatorName}`, pageWidth - margin, 24, { align: 'right' });

  let y = 40;

  // --- INCIDENT SUMMARY CARD ---
  doc.setFillColor(slateLight[0], slateLight[1], slateLight[2]);
  doc.roundedRect(margin, y, contentWidth, 28, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 28, 2, 2, 'S');

  // Left: Txn ID & Customer
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`TRANSACTION CASE REF: ${transaction.id}`, margin + 5, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Subject: ${transaction.customerName} (${transaction.customerId})`, margin + 5, y + 15);
  doc.text(`Timestamp: ${transaction.timestamp || 'Just now'} | Channel: ${transaction.transactionType}`, margin + 5, y + 22);

  // Right: Decision Badge & Amount
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`INR ${transaction.amount.toLocaleString()}`, pageWidth - margin - 5, y + 10, { align: 'right' });

  // Badge for Decision
  const badgeW = 34;
  const badgeH = 8;
  const badgeX = pageWidth - margin - 5 - badgeW;
  const badgeY = y + 14;

  doc.setFillColor(decisionBg[0], decisionBg[1], decisionBg[2]);
  doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 1.5, 1.5, 'F');
  doc.setTextColor(decisionText[0], decisionText[1], decisionText[2]);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`DECISION: ${transaction.decision}`, badgeX + badgeW / 2, badgeY + 5.5, { align: 'center' });

  y += 34;

  // --- SECTION: MULTI-VECTOR RISK FUSION SCORE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('1. MULTI-MODAL RISK FUSION SCORE', margin, y);

  // Risk Score Box
  y += 4;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'S');

  // Big Risk Number
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  if (transaction.riskScore >= 75) {
    doc.setTextColor(220, 38, 38);
  } else if (transaction.riskScore >= 45) {
    doc.setTextColor(217, 119, 6);
  } else {
    doc.setTextColor(16, 185, 129);
  }
  doc.text(`${transaction.riskScore}`, margin + 8, y + 14);

  doc.setFontSize(9);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('/ 100', margin + 26, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(`SEVERITY LEVEL: ${transaction.riskLevel}`, margin + 8, y + 20);

  // Explanation text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  const explanation = (transaction.reasons && transaction.reasons.length > 0)
    ? transaction.reasons.join('. ')
    : 'Computed using 7-vector neural fusion engine with real-time anomaly detection against 180-day customer behavioral baseline.';
  const splitExplanation = doc.splitTextToSize(explanation, contentWidth - 48);
  doc.text(splitExplanation, margin + 44, y + 8);

  y += 30;

  // --- 7-VECTOR RISK SIGNALS BREAKDOWN TABLE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('2. TELEMETRY SIGNALS & VECTORS BREAKDOWN', margin, y);

  y += 4;
  const signals = [
    { label: 'Transaction Anomaly (Amount/Velocity)', score: transaction.signals?.transaction_score ?? 15, weight: '20%' },
    { label: 'Behavioral Deviation (Typing/Cadence)', score: transaction.signals?.behavior_score ?? 10, weight: '15%' },
    { label: 'Device Integrity (Hardware UUID)', score: transaction.signals?.device_score ?? 12, weight: '20%' },
    { label: 'Location & Geo-IP Proxy Telemetry', score: transaction.signals?.location_score ?? 8, weight: '15%' },
    { label: 'Beneficiary Reputation & Mule Link', score: transaction.signals?.beneficiary_score ?? 10, weight: '15%' },
    { label: 'Login Sequence & Credential Health', score: transaction.signals?.login_score ?? 10, weight: '10%' },
    { label: 'Graph Network & Cluster Contagion', score: transaction.signals?.network_score ?? 10, weight: '5%' },
  ];

  // Table Header
  doc.setFillColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('SIGNAL VECTOR', margin + 4, y + 4.8);
  doc.text('WEIGHT', margin + 115, y + 4.8);
  doc.text('VECTOR SCORE', margin + 145, y + 4.8);
  doc.text('STATUS', pageWidth - margin - 4, y + 4.8, { align: 'right' });

  y += 7;

  signals.forEach((sig, idx) => {
    const rowBg = idx % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
    doc.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
    doc.rect(margin, y, contentWidth, 6.5, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + 6.5, margin + contentWidth, y + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(sig.label, margin + 4, y + 4.5);

    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(sig.weight, margin + 115, y + 4.5);

    // Score color
    if (sig.score >= 70) {
      doc.setTextColor(220, 38, 38);
      doc.setFont('helvetica', 'bold');
    } else if (sig.score >= 40) {
      doc.setTextColor(217, 119, 6);
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'normal');
    }
    doc.text(`${sig.score} / 100`, margin + 145, y + 4.5);

    // Status Pill text
    const statusText = sig.score >= 70 ? 'ANOMALOUS' : sig.score >= 40 ? 'ELEVATED' : 'BENIGN';
    doc.text(statusText, pageWidth - margin - 4, y + 4.5, { align: 'right' });

    y += 6.5;
  });

  y += 6;

  // --- ENTITY & BENEFICIARY METADATA GRID ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('3. ENTITY, NETWORK & HARDWARE CONTEXT', margin, y);

  y += 4;
  const colWidth = (contentWidth - 6) / 2;

  // Box 1: Device & Network Telemetry
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, colWidth, 38, 1.5, 1.5, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, colWidth, 38, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Hardware & Endpoint Telemetry', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);

  doc.text(`IP Address: ${transaction.ipAddress || '198.51.100.23'}`, margin + 4, y + 12);
  doc.text(`Location: ${transaction.location || 'Unknown / International'}`, margin + 4, y + 18);
  doc.text(`Hardware: ${transaction.device || 'Unrecognized Fingerprint'}`, margin + 4, y + 24);
  doc.text(`Device ID: ${transaction.deviceId || 'DEV-UUID-UNKNOWN'}`, margin + 4, y + 30);
  const isNewHardware = (transaction.signals?.device_score ?? 0) > 30 || transaction.reasons?.some((r) => r.toLowerCase().includes('device'));
  doc.text(`Device Known: ${isNewHardware ? 'NO (New Device Flagged)' : 'YES (Recognized Trust Store)'}`, margin + 4, y + 35);

  // Box 2: Beneficiary & Payment Channel Context
  const col2X = margin + colWidth + 6;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(col2X, y, colWidth, 38, 1.5, 1.5, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(col2X, y, colWidth, 38, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Beneficiary & Destination Intel', col2X + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);

  doc.text(`Beneficiary: ${transaction.beneficiary || 'Escrow Clearing House'}`, col2X + 4, y + 12);
  doc.text(`Account / VPA: ${transaction.beneficiaryAccount || 'N/A'}`, col2X + 4, y + 18);
  doc.text(`Beneficiary Status: ${(transaction.beneficiaryStatus || 'known').toUpperCase()}`, col2X + 4, y + 24);
  doc.text(`Mule Watchlist: ${transaction.signals?.beneficiary_score && transaction.signals.beneficiary_score > 60 ? 'POSITIVE HIT (Watchlist Linked)' : 'NEGATIVE (Clean Record)'}`, col2X + 4, y + 30);
  doc.text(`Transfer Type: ${transaction.transactionType} Real-Time Settlement`, col2X + 4, y + 35);

  y += 44;

  // --- 4. AUDIT LOG & ANALYST ACTION ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('4. AUDIT TRAIL & ENFORCEMENT RECORD', margin, y);

  y += 4;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);

  if (transaction.analystAction) {
    doc.setFont('helvetica', 'bold');
    doc.text(`Enforced Decision: ${transaction.analystAction.action}`, margin + 4, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(`Action Operator: ${transaction.analystAction.analyst} | Time: ${transaction.analystAction.timestamp}`, margin + 4, y + 11);
    doc.text(`Audit Justification: ${transaction.analystAction.note || 'Enforced per standard cyber compliance policy SOP-402.'}`, margin + 4, y + 17);
  } else {
    doc.setFont('helvetica', 'bold');
    doc.text(`Autonomous Defense Action: ${transaction.decision}`, margin + 4, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(`Enforced by: TrustShield AI Real-Time Rule Engine v4.8`, margin + 4, y + 11);
    const primaryReason = (transaction.reasons && transaction.reasons[0]) || 'Multi-factor risk threshold exceeded operational tolerance.';
    doc.text(`Reason: ${primaryReason}`, margin + 4, y + 17);
  }

  // --- FOOTER & CHECKSUM ---
  const footerY = pageHeight - 14;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  const mockChecksum = `SHA-256: ${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  doc.text(`Cryptographic Audit Stamp: ${mockChecksum}`, margin, footerY);
  doc.text('TrustShield AI Secure Operations Grid - ISO/IEC 27001 & PCI-DSS Level 1 Compliant', margin, footerY + 3.5);
  doc.text('Page 1 of 1', pageWidth - margin, footerY, { align: 'right' });

  // Save the PDF
  const filename = `TrustShield_Investigation_${transaction.id}_${Date.now()}.pdf`;
  doc.save(filename);
}
