import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding BidShield AI database with expanded 4 Tenders & 8 Bidders...');

  // Clean existing tables in reverse dependency order
  await prisma.auditLog.deleteMany({});
  await prisma.debarmentRegistry.deleteMany({});
  await prisma.ruleSetting.deleteMany({});
  await prisma.verificationResult.deleteMany({});
  await prisma.complianceResult.deleteMany({});
  await prisma.evidence.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.bid.deleteMany({});
  await prisma.requirement.deleteMany({});
  await prisma.tender.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.department.deleteMany({});

  // Hash passwords
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const officerPassword = await bcrypt.hash('Officer@123', 10);
  const bidderPassword = await bcrypt.hash('Bidder@123', 10);
  const auditorPassword = await bcrypt.hash('Auditor@123', 10);

  // Departments
  const dept1 = await prisma.department.create({
    data: {
      name: 'Ministry of Petroleum & Natural Gas - IT Division',
      code: 'MOPNG-IT',
      description: 'Digital Infrastructure & Cloud Computing Division',
    },
  });

  const dept2 = await prisma.department.create({
    data: {
      name: 'Ministry of New & Renewable Energy - Solar Division',
      code: 'MNRE-SOLAR',
      description: 'Renewable Power & Energy Storage Procurement Division',
    },
  });

  const dept3 = await prisma.department.create({
    data: {
      name: 'Ministry of Housing & Urban Affairs - Smart Cities',
      code: 'MOHUA-SMART',
      description: 'Smart City Urban Surveillance & AI Command Division',
    },
  });

  const dept4 = await prisma.department.create({
    data: {
      name: 'Ministry of Health & Family Welfare - Medical Tech',
      code: 'MOHFW-MED',
      description: 'Healthcare Technology & Medical ICU Procurement Division',
    },
  });

  // System Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'Rajesh Verma',
      email: 'admin@bidshield.demo',
      passwordHash: adminPassword,
      role: 'ADMIN',
      departmentId: dept1.id,
      designation: 'Chief Information Officer',
      avatar: '/avatars/admin.png',
    },
  });

  const officerUser = await prisma.user.create({
    data: {
      name: 'Dr. Ananya Sharma',
      email: 'officer@bidshield.demo',
      passwordHash: officerPassword,
      role: 'PROCUREMENT_OFFICER',
      departmentId: dept1.id,
      designation: 'Senior Procurement Officer (MoPNG & MoHUA)',
      avatar: '/avatars/officer.png',
    },
  });

  const officerUser2 = await prisma.user.create({
    data: {
      name: 'Rajesh Varma',
      email: 'officer2@bidshield.demo',
      passwordHash: officerPassword,
      role: 'PROCUREMENT_OFFICER',
      departmentId: dept2.id,
      designation: 'Executive Procurement Officer (MNRE & MoHFW)',
      avatar: '/avatars/officer.png',
    },
  });

  const auditorUser = await prisma.user.create({
    data: {
      name: 'Priya Nair',
      email: 'auditor@bidshield.demo',
      passwordHash: auditorPassword,
      role: 'AUDITOR',
      departmentId: dept1.id,
      designation: 'Principal Compliance Auditor',
      avatar: '/avatars/auditor.png',
    },
  });

  // 8 Bidders (Testing accounts seeded as UNVERIFIED until real GSTIN is submitted and verified)
  const bidder1 = await prisma.user.create({
    data: {
      name: 'Suresh Kumar',
      email: 'bidder@novatech.demo',
      passwordHash: bidderPassword,
      role: 'BIDDER',
      departmentId: dept1.id,
      designation: 'Authorized Representative',
      gstStatus: 'UNVERIFIED',
      gstin: null,
      pan: null,
      companyName: null,
    },
  });

  const bidder2 = await prisma.user.create({
    data: {
      name: 'Vikram Mehta',
      email: 'bidder@apexdigital.demo',
      passwordHash: bidderPassword,
      role: 'BIDDER',
      departmentId: dept1.id,
      designation: 'Authorized Representative',
      gstStatus: 'UNVERIFIED',
      gstin: null,
      pan: null,
      companyName: null,
    },
  });

  const bidder3 = await prisma.user.create({
    data: {
      name: 'Ramesh Patel',
      email: 'bidder@solaria.demo',
      passwordHash: bidderPassword,
      role: 'BIDDER',
      departmentId: dept2.id,
      designation: 'Authorized Representative',
      gstStatus: 'UNVERIFIED',
      gstin: null,
      pan: null,
      companyName: null,
    },
  });

  const bidder4 = await prisma.user.create({
    data: {
      name: 'Anish Sharma',
      email: 'bidder@sungrid.demo',
      passwordHash: bidderPassword,
      role: 'BIDDER',
      departmentId: dept2.id,
      designation: 'Authorized Representative',
      gstStatus: 'UNVERIFIED',
      gstin: null,
      pan: null,
      companyName: null,
    },
  });

  const bidder5 = await prisma.user.create({
    data: {
      name: 'Neha Gupta',
      email: 'bidder@cybergrid.demo',
      passwordHash: bidderPassword,
      role: 'BIDDER',
      departmentId: dept3.id,
      designation: 'Authorized Representative',
      gstStatus: 'UNVERIFIED',
      gstin: null,
      pan: null,
      companyName: null,
    },
  });

  const bidder6 = await prisma.user.create({
    data: {
      name: 'Alok Verma',
      email: 'bidder@visiontech.demo',
      passwordHash: bidderPassword,
      role: 'BIDDER',
      departmentId: dept3.id,
      designation: 'Authorized Representative',
      gstStatus: 'UNVERIFIED',
      gstin: null,
      pan: null,
      companyName: null,
    },
  });

  const bidder7 = await prisma.user.create({
    data: {
      name: 'Dr. K. V. Rao',
      email: 'bidder@biomedcare.demo',
      passwordHash: bidderPassword,
      role: 'BIDDER',
      departmentId: dept4.id,
      designation: 'Authorized Representative',
      gstStatus: 'UNVERIFIED',
      gstin: null,
      pan: null,
      companyName: null,
    },
  });

  const bidder8 = await prisma.user.create({
    data: {
      name: 'Meera Reddy',
      email: 'bidder@medequip.demo',
      passwordHash: bidderPassword,
      role: 'BIDDER',
      departmentId: dept4.id,
      designation: 'Authorized Representative',
      gstStatus: 'UNVERIFIED',
      gstin: null,
      pan: null,
      companyName: null,
    },
  });

  // ==========================================
  // TENDER 1: IT Infrastructure Modernization (MoPNG)
  // ==========================================
  const tender1 = await prisma.tender.create({
    data: {
      tenderNumber: 'GEM-DEMO-2026-IT-001',
      title: 'Enterprise Cloud & IT Infrastructure Modernization',
      departmentId: dept1.id,
      category: 'Software & Infrastructure',
      description: 'Comprehensive IT infrastructure setup, high performance cloud compute, database clusters and 24x7 managed security operations for GeM procurement division.',
      estimatedValue: 250000000.0,
      submissionDeadline: new Date('2026-09-30T23:59:59Z'),
      status: 'UNDER_REVIEW',
      createdBy: officerUser.id,
      originalDocumentId: 'storage/demo-documents/tenders/01_Tender_GeM_IT_Infrastructure.pdf',
    },
  });

  const t1_req1 = await prisma.requirement.create({
    data: {
      tenderId: tender1.id,
      requirementCode: 'R1',
      title: 'GST Registration',
      description: 'Bidder must possess valid active Goods and Services Tax (GST) registration certificate.',
      category: 'LEGAL',
      mandatory: true,
      threshold: 'ACTIVE',
      thresholdUnit: 'Status',
      sourcePage: 1,
      sourceSection: 'Eligibility Criteria 1.1',
      confidence: 0.98,
      ruleType: 'MATCH_EXACT',
    },
  });

  const t1_req2 = await prisma.requirement.create({
    data: {
      tenderId: tender1.id,
      requirementCode: 'R2',
      title: 'PAN Registration',
      description: 'Bidder must possess valid Permanent Account Number (PAN) issued by Income Tax Department.',
      category: 'LEGAL',
      mandatory: true,
      threshold: 'VALID',
      thresholdUnit: 'Status',
      sourcePage: 1,
      sourceSection: 'Eligibility Criteria 1.2',
      confidence: 0.98,
      ruleType: 'MATCH_EXACT',
    },
  });

  const t1_req3 = await prisma.requirement.create({
    data: {
      tenderId: tender1.id,
      requirementCode: 'R3',
      title: 'Minimum Annual Turnover',
      description: 'Bidder must demonstrate average annual financial turnover of at least INR 10.0 Crore in last 3 financial years.',
      category: 'FINANCIAL',
      mandatory: true,
      threshold: '10.0',
      thresholdUnit: 'Crore INR',
      sourcePage: 1,
      sourceSection: 'Financial Eligibility 2.1',
      confidence: 0.95,
      ruleType: 'GREATER_THAN_EQUAL',
    },
  });

  const t1_req4 = await prisma.requirement.create({
    data: {
      tenderId: tender1.id,
      requirementCode: 'R4',
      title: 'Relevant Project Experience',
      description: 'Bidder must demonstrate a minimum of 5 years of experience in enterprise IT infrastructure & cloud deployments.',
      category: 'EXPERIENCE',
      mandatory: true,
      threshold: '5.0',
      thresholdUnit: 'Years',
      sourcePage: 1,
      sourceSection: 'Technical Capability 3.1',
      confidence: 0.92,
      ruleType: 'GREATER_THAN_EQUAL',
    },
  });

  const t1_req5 = await prisma.requirement.create({
    data: {
      tenderId: tender1.id,
      requirementCode: 'R5',
      title: 'OEM Authorization Letter',
      description: 'Bidder must submit a valid authorization letter from Original Equipment Manufacturer (OEM).',
      category: 'TECHNICAL',
      mandatory: true,
      threshold: 'PRESENT',
      thresholdUnit: 'Document',
      sourcePage: 1,
      sourceSection: 'Technical Capability 3.2',
      confidence: 0.94,
      ruleType: 'DOCUMENT_EXISTS',
    },
  });

  const t1_req6 = await prisma.requirement.create({
    data: {
      tenderId: tender1.id,
      requirementCode: 'R6',
      title: 'ISO 9001:2015 Certification',
      description: 'Bidder must hold a valid ISO 9001:2015 Quality Management System Certification.',
      category: 'CERTIFICATION',
      mandatory: false,
      threshold: 'VALID',
      thresholdUnit: 'Status',
      sourcePage: 2,
      sourceSection: 'Quality Assurance 4.1',
      confidence: 0.96,
      ruleType: 'MATCH_EXACT',
    },
  });

  const t1_req7 = await prisma.requirement.create({
    data: {
      tenderId: tender1.id,
      requirementCode: 'R7',
      title: 'Local Content Percentage',
      description: 'Bidder must declare minimum 50% Class-I Local Content under Public Procurement (Preference to Make in India).',
      category: 'LOCAL_CONTENT',
      mandatory: true,
      threshold: '50.0',
      thresholdUnit: 'Percentage (%)',
      sourcePage: 2,
      sourceSection: 'Make in India Policy 5.1',
      confidence: 0.97,
      ruleType: 'GREATER_THAN_EQUAL',
    },
  });

  const t1_req8 = await prisma.requirement.create({
    data: {
      tenderId: tender1.id,
      requirementCode: 'R8',
      title: 'MSME / Udyam Registration',
      description: 'Bidder must provide Udyam Registration Certificate for MSME purchase preference benefits.',
      category: 'DOCUMENTATION',
      mandatory: false,
      threshold: 'VALID',
      thresholdUnit: 'Status',
      sourcePage: 2,
      sourceSection: 'MSME Policy 6.1',
      confidence: 0.96,
      ruleType: 'MATCH_EXACT',
    },
  });

  // Bid 1: NovaTech Systems Pvt Ltd (Tender 1 - Medium Risk)
  const bid1 = await prisma.bid.create({
    data: {
      tenderId: tender1.id,
      bidderId: bidder1.id,
      bidderName: 'NovaTech Systems Private Limited',
      status: 'UNDER_REVIEW',
      complianceScore: 68.5,
      riskScore: 58.0,
      riskLevel: 'MEDIUM',
      finalReviewStatus: 'UNDER_REVIEW',
    },
  });

  const b1_doc_gst = await prisma.document.create({
    data: {
      bidId: bid1.id,
      filename: 'GST_Registration_Certificate_NovaTech.pdf',
      documentType: 'GST_CERTIFICATE',
      mimeType: 'application/pdf',
      fileSize: 45200,
      storagePath: 'storage/demo-documents/legal/GST_Registration_Certificate_NovaTech.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'GSTIN: 27AAACN1234Q1Z5, Legal Name: NovaTech Systems Private Limited, Status: ACTIVE',
      uploadedBy: bidder1.id,
    },
  });

  const b1_doc_pan = await prisma.document.create({
    data: {
      bidId: bid1.id,
      filename: 'PAN_Card_NovaTech.pdf',
      documentType: 'PAN',
      mimeType: 'application/pdf',
      fileSize: 38500,
      storagePath: 'storage/demo-documents/legal/PAN_Card_NovaTech.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'PAN: AAACN1234Q, Name: NovaTech Systems Private Limited',
      uploadedBy: bidder1.id,
    },
  });

  const b1_doc_fin = await prisma.document.create({
    data: {
      bidId: bid1.id,
      filename: 'Turnover_Statement_NovaTech.pdf',
      documentType: 'FINANCIAL_STATEMENT',
      mimeType: 'application/pdf',
      fileSize: 82000,
      storagePath: 'storage/demo-documents/financial/Turnover_Statement_NovaTech.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Audited Average Turnover: INR 12.37 Crore',
      uploadedBy: bidder1.id,
    },
  });

  const b1_doc_exp = await prisma.document.create({
    data: {
      bidId: bid1.id,
      filename: 'Work_Experience_NovaTech.pdf',
      documentType: 'EXPERIENCE_CERTIFICATE',
      mimeType: 'application/pdf',
      fileSize: 64000,
      storagePath: 'storage/demo-documents/experience/Work_Experience_NovaTech.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Contract Experience: 3 Years Enterprise IT Support',
      uploadedBy: bidder1.id,
    },
  });

  const b1_doc_iso = await prisma.document.create({
    data: {
      bidId: bid1.id,
      filename: 'ISO_9001_NovaTech.pdf',
      documentType: 'ISO_CERTIFICATE',
      mimeType: 'application/pdf',
      fileSize: 41000,
      storagePath: 'storage/demo-documents/certification/ISO_9001_NovaTech.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'ISO 9001:2015 Quality Management Certified',
      uploadedBy: bidder1.id,
    },
  });

  const b1_doc_local = await prisma.document.create({
    data: {
      bidId: bid1.id,
      filename: 'Local_Content_Declaration_NovaTech.pdf',
      documentType: 'LOCAL_CONTENT_DECLARATION',
      mimeType: 'application/pdf',
      fileSize: 32000,
      storagePath: 'storage/demo-documents/local_content/Local_Content_Declaration_NovaTech.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Declared Local Content: 42%',
      uploadedBy: bidder1.id,
    },
  });

  const b1_ev_gst = await prisma.evidence.create({
    data: {
      documentId: b1_doc_gst.id,
      requirementId: t1_req1.id,
      extractedValue: '27AAACN1234Q1Z5 (ACTIVE)',
      normalizedValue: 'ACTIVE',
      pageNumber: 1,
      textSnippet: 'GSTIN: 27AAACN1234Q1Z5 | Status: ACTIVE',
      confidence: 0.98,
      verificationStatus: 'VERIFIED',
    },
  });

  await prisma.complianceResult.createMany({
    data: [
      { bidId: bid1.id, requirementId: t1_req1.id, status: 'COMPLIANT', score: 100.0, reason: 'Active GST registration confirmed.', evidenceId: b1_ev_gst.id },
      { bidId: bid1.id, requirementId: t1_req2.id, status: 'COMPLIANT', score: 100.0, reason: 'Valid Income Tax PAN AAACN1234Q verified.' },
      { bidId: bid1.id, requirementId: t1_req3.id, status: 'COMPLIANT', score: 100.0, reason: 'Average turnover of ₹12.37 Cr meets threshold.' },
      { bidId: bid1.id, requirementId: t1_req4.id, status: 'NON_COMPLIANT', score: 40.0, reason: 'Submitted experience is 3 years vs 5 years required.' },
      { bidId: bid1.id, requirementId: t1_req5.id, status: 'MISSING', score: 0.0, reason: 'No OEM Authorization Letter document uploaded.' },
      { bidId: bid1.id, requirementId: t1_req6.id, status: 'COMPLIANT', score: 100.0, reason: 'Valid ISO 9001:2015 certificate verified.' },
      { bidId: bid1.id, requirementId: t1_req7.id, status: 'NON_COMPLIANT', score: 0.0, reason: 'Declared local content is 42% vs 50% required.' },
      { bidId: bid1.id, requirementId: t1_req8.id, status: 'COMPLIANT', score: 100.0, reason: 'Valid MSME Udyam Registration verified.' },
    ],
  });

  // Bid 2: Apex Digital Infrastructure Ltd (Tender 1 - Low Risk)
  const bid2 = await prisma.bid.create({
    data: {
      tenderId: tender1.id,
      bidderId: bidder2.id,
      bidderName: 'Apex Digital Infrastructure Limited',
      status: 'COMPLETED',
      complianceScore: 98.0,
      riskScore: 12.0,
      riskLevel: 'LOW',
      finalReviewStatus: 'APPROVED',
    },
  });

  const b2_doc_gst = await prisma.document.create({
    data: {
      bidId: bid2.id,
      filename: 'GST_Registration_Certificate_Apex.pdf',
      documentType: 'GST_CERTIFICATE',
      mimeType: 'application/pdf',
      fileSize: 46000,
      storagePath: 'storage/demo-documents/legal/GST_Registration_Certificate_Apex.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'GSTIN: 07BBBCA9876R1Z2, Status: ACTIVE, Legal Name: Apex Digital Infrastructure Limited',
      uploadedBy: bidder2.id,
    },
  });

  const b2_doc_pan = await prisma.document.create({
    data: {
      bidId: bid2.id,
      filename: 'PAN_Card_Apex.pdf',
      documentType: 'PAN',
      mimeType: 'application/pdf',
      fileSize: 39000,
      storagePath: 'storage/demo-documents/legal/PAN_Card_Apex.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'PAN: BBBCA9876R, Name: Apex Digital Infrastructure Limited',
      uploadedBy: bidder2.id,
    },
  });

  const b2_doc_fin = await prisma.document.create({
    data: {
      bidId: bid2.id,
      filename: 'Turnover_Statement_Apex.pdf',
      documentType: 'FINANCIAL_STATEMENT',
      mimeType: 'application/pdf',
      fileSize: 91000,
      storagePath: 'storage/demo-documents/financial/Turnover_Statement_Apex.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Audited Average Turnover: INR 48.50 Crore',
      uploadedBy: bidder2.id,
    },
  });

  const b2_doc_oem = await prisma.document.create({
    data: {
      bidId: bid2.id,
      filename: 'OEM_Authorization_Apex.pdf',
      documentType: 'OEM_AUTHORIZATION',
      mimeType: 'application/pdf',
      fileSize: 52000,
      storagePath: 'storage/demo-documents/technical/OEM_Authorization_Apex.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Authorized Gold Tier Cloud OEM Partner',
      uploadedBy: bidder2.id,
    },
  });

  const b2_ev_gst = await prisma.evidence.create({
    data: {
      documentId: b2_doc_gst.id,
      requirementId: t1_req1.id,
      extractedValue: '07BBBCA9876R1Z2 (ACTIVE)',
      normalizedValue: 'ACTIVE',
      pageNumber: 1,
      textSnippet: 'GSTIN: 07BBBCA9876R1Z2 | Status: ACTIVE',
      confidence: 0.99,
      verificationStatus: 'VERIFIED',
    },
  });

  await prisma.complianceResult.createMany({
    data: [
      { bidId: bid2.id, requirementId: t1_req1.id, status: 'COMPLIANT', score: 100.0, reason: 'Active GST registration verified.', evidenceId: b2_ev_gst.id },
      { bidId: bid2.id, requirementId: t1_req2.id, status: 'COMPLIANT', score: 100.0, reason: 'Valid PAN BBBCA9876R verified.' },
      { bidId: bid2.id, requirementId: t1_req3.id, status: 'COMPLIANT', score: 100.0, reason: 'Average turnover of ₹48.50 Cr exceeds threshold.' },
      { bidId: bid2.id, requirementId: t1_req4.id, status: 'COMPLIANT', score: 100.0, reason: '8 years experience exceeds 5 years required.' },
      { bidId: bid2.id, requirementId: t1_req5.id, status: 'COMPLIANT', score: 100.0, reason: 'Valid OEM Authorization present.' },
      { bidId: bid2.id, requirementId: t1_req6.id, status: 'COMPLIANT', score: 100.0, reason: 'Valid ISO 9001:2015 certificate verified.' },
      { bidId: bid2.id, requirementId: t1_req7.id, status: 'COMPLIANT', score: 100.0, reason: '68.5% local content exceeds 50% Class-I threshold.' },
      { bidId: bid2.id, requirementId: t1_req8.id, status: 'COMPLIANT', score: 100.0, reason: 'Valid MSME Udyam Registration verified.' },
    ],
  });

  // ==========================================
  // TENDER 2: Solar PV Power Plant & Storage (MNRE)
  // ==========================================
  const tender2 = await prisma.tender.create({
    data: {
      tenderNumber: 'GEM-DEMO-2026-SOLAR-002',
      title: '100MW Floating Solar PV Power Plant & Battery Storage',
      departmentId: dept2.id,
      category: 'Solar Power Infrastructure',
      description: 'Turnkey EPC contract for design, supply, installation and commissioning of 100MW Floating Solar PV Grid with 20MWh Battery Energy Storage System (BESS).',
      estimatedValue: 4500000000.0,
      submissionDeadline: new Date('2026-10-15T23:59:59Z'),
      status: 'UNDER_REVIEW',
      createdBy: officerUser2.id,
      originalDocumentId: 'storage/demo-documents/tenders/02_Tender_GeM_Solar_Power_Plant.pdf',
    },
  });

  const t2_req1 = await prisma.requirement.create({
    data: {
      tenderId: tender2.id,
      requirementCode: 'SOL-R1',
      title: 'GST Registration',
      description: 'Active GSTIN registration certificate in renewable energy / power domain.',
      category: 'LEGAL',
      mandatory: true,
      threshold: 'ACTIVE',
      thresholdUnit: 'Status',
      sourcePage: 1,
      sourceSection: 'Commercial Eligibility 1.1',
      confidence: 0.98,
      ruleType: 'MATCH_EXACT',
    },
  });

  const t2_req2 = await prisma.requirement.create({
    data: {
      tenderId: tender2.id,
      requirementCode: 'SOL-R2',
      title: 'Income Tax PAN Registration',
      description: 'Valid Corporate PAN card issued by Income Tax Department.',
      category: 'LEGAL',
      mandatory: true,
      threshold: 'VALID',
      thresholdUnit: 'Status',
      sourcePage: 1,
      sourceSection: 'Commercial Eligibility 1.2',
      confidence: 0.98,
      ruleType: 'MATCH_EXACT',
    },
  });

  const t2_req3 = await prisma.requirement.create({
    data: {
      tenderId: tender2.id,
      requirementCode: 'SOL-R3',
      title: 'Minimum Solar EPC Turnover',
      description: 'Average Annual Turnover >= INR 150.0 Crore in the last 3 financial years.',
      category: 'FINANCIAL',
      mandatory: true,
      threshold: '150.0',
      thresholdUnit: 'Crore INR',
      sourcePage: 1,
      sourceSection: 'Financial Capability 2.1',
      confidence: 0.95,
      ruleType: 'GREATER_THAN_EQUAL',
    },
  });

  const t2_req4 = await prisma.requirement.create({
    data: {
      tenderId: tender2.id,
      requirementCode: 'SOL-R4',
      title: 'Solar PV Module OEM Authorization',
      description: 'Valid Tier-1 ALMM listed Solar PV Module manufacturer OEM authorization letter.',
      category: 'TECHNICAL',
      mandatory: true,
      threshold: 'PRESENT',
      thresholdUnit: 'Document',
      sourcePage: 2,
      sourceSection: 'Technical Specs 3.1',
      confidence: 0.96,
      ruleType: 'DOCUMENT_EXISTS',
    },
  });

  const t2_req5 = await prisma.requirement.create({
    data: {
      tenderId: tender2.id,
      requirementCode: 'SOL-R5',
      title: 'Grid Solar Project Experience',
      description: 'Minimum 3 years of grid-connected solar power project execution experience.',
      category: 'EXPERIENCE',
      mandatory: true,
      threshold: '3.0',
      thresholdUnit: 'Years',
      sourcePage: 2,
      sourceSection: 'Technical Experience 3.2',
      confidence: 0.94,
      ruleType: 'GREATER_THAN_EQUAL',
    },
  });

  const t2_req6 = await prisma.requirement.create({
    data: {
      tenderId: tender2.id,
      requirementCode: 'SOL-R6',
      title: 'Local Content Declaration',
      description: 'Class-I Local Content Declaration >= 50% under MNRE domestic content requirement.',
      category: 'LOCAL_CONTENT',
      mandatory: true,
      threshold: '50.0',
      thresholdUnit: 'Percentage (%)',
      sourcePage: 2,
      sourceSection: 'DCR Policy 4.1',
      confidence: 0.97,
      ruleType: 'GREATER_THAN_EQUAL',
    },
  });

  // Bid 3: Solaria CleanTech (Tender 2 - Low Risk)
  const bid3 = await prisma.bid.create({
    data: {
      tenderId: tender2.id,
      bidderId: bidder3.id,
      bidderName: 'Solaria CleanTech Energy Pvt Ltd',
      status: 'UNDER_REVIEW',
      complianceScore: 95.0,
      riskScore: 15.0,
      riskLevel: 'LOW',
      finalReviewStatus: 'UNDER_REVIEW',
    },
  });

  const b3_doc_gst = await prisma.document.create({
    data: {
      bidId: bid3.id,
      filename: 'GST_Registration_Certificate_Solaria.pdf',
      documentType: 'GST_CERTIFICATE',
      mimeType: 'application/pdf',
      fileSize: 47000,
      storagePath: 'storage/demo-documents/legal/GST_Registration_Certificate_Solaria.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'GSTIN: 24CCCS9988P1Z3, Legal Name: Solaria CleanTech Energy Pvt Ltd, Status: ACTIVE',
      uploadedBy: bidder3.id,
    },
  });

  const b3_doc_pan = await prisma.document.create({
    data: {
      bidId: bid3.id,
      filename: 'PAN_Card_Solaria.pdf',
      documentType: 'PAN',
      mimeType: 'application/pdf',
      fileSize: 39000,
      storagePath: 'storage/demo-documents/legal/PAN_Card_Solaria.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'PAN: CCCS9988P, Legal Name: Solaria CleanTech Energy Pvt Ltd',
      uploadedBy: bidder3.id,
    },
  });

  const b3_doc_fin = await prisma.document.create({
    data: {
      bidId: bid3.id,
      filename: 'Turnover_Statement_Solaria.pdf',
      documentType: 'FINANCIAL_STATEMENT',
      mimeType: 'application/pdf',
      fileSize: 88000,
      storagePath: 'storage/demo-documents/financial/Turnover_Statement_Solaria.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Audited Average Annual Turnover: INR 165.0 Crore',
      uploadedBy: bidder3.id,
    },
  });

  const b3_doc_oem = await prisma.document.create({
    data: {
      bidId: bid3.id,
      filename: 'OEM_Authorization_Tier1_Solar.pdf',
      documentType: 'OEM_AUTHORIZATION',
      mimeType: 'application/pdf',
      fileSize: 55000,
      storagePath: 'storage/demo-documents/technical/OEM_Authorization_Tier1_Solar.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Tier-1 ALMM Certified Solar PV Module Authorization Letter',
      uploadedBy: bidder3.id,
    },
  });

  const b3_doc_exp = await prisma.document.create({
    data: {
      bidId: bid3.id,
      filename: 'Solar_Grid_Experience_Solaria.pdf',
      documentType: 'EXPERIENCE_CERTIFICATE',
      mimeType: 'application/pdf',
      fileSize: 72000,
      storagePath: 'storage/demo-documents/experience/Solar_Grid_Experience_Solaria.pdf',
      processingStatus: 'PROCESSED',
      extractedText: '5 Years Grid-Connected Solar EPC Project Track Record',
      uploadedBy: bidder3.id,
    },
  });

  const b3_doc_local = await prisma.document.create({
    data: {
      bidId: bid3.id,
      filename: 'Local_Content_Declaration_Solaria.pdf',
      documentType: 'LOCAL_CONTENT_DECLARATION',
      mimeType: 'application/pdf',
      fileSize: 34000,
      storagePath: 'storage/demo-documents/local_content/Local_Content_Declaration_Solaria.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Declared Class-I Local Content: 65.0%',
      uploadedBy: bidder3.id,
    },
  });

  await prisma.complianceResult.createMany({
    data: [
      { bidId: bid3.id, requirementId: t2_req1.id, status: 'COMPLIANT', score: 100.0, reason: 'Active GST registration 24CCCS9988P1Z3 verified.' },
      { bidId: bid3.id, requirementId: t2_req2.id, status: 'COMPLIANT', score: 100.0, reason: 'Valid Corporate PAN CCCS9988P verified.' },
      { bidId: bid3.id, requirementId: t2_req3.id, status: 'COMPLIANT', score: 100.0, reason: 'Annual turnover ₹165.0 Cr exceeds ₹150.0 Cr threshold.' },
      { bidId: bid3.id, requirementId: t2_req4.id, status: 'COMPLIANT', score: 100.0, reason: 'Tier-1 Solar PV OEM authorization verified.' },
      { bidId: bid3.id, requirementId: t2_req5.id, status: 'COMPLIANT', score: 100.0, reason: '5 years experience exceeds 3 years required.' },
      { bidId: bid3.id, requirementId: t2_req6.id, status: 'COMPLIANT', score: 100.0, reason: '65% local content meets Class-I requirement.' },
    ],
  });

  // Bid 4: SunGrid Power (Tender 2 - High Risk)
  const bid4 = await prisma.bid.create({
    data: {
      tenderId: tender2.id,
      bidderId: bidder4.id,
      bidderName: 'SunGrid Power Infrastructure Ltd',
      status: 'UNDER_REVIEW',
      complianceScore: 48.0,
      riskScore: 72.0,
      riskLevel: 'HIGH',
      finalReviewStatus: 'UNDER_REVIEW',
    },
  });

  const b4_doc_gst = await prisma.document.create({
    data: {
      bidId: bid4.id,
      filename: 'GST_Certificate_SunGrid.pdf',
      documentType: 'GST_CERTIFICATE',
      mimeType: 'application/pdf',
      fileSize: 44000,
      storagePath: 'storage/demo-documents/legal/GST_Certificate_SunGrid.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'GSTIN: 06DDDP1122K1Z4, Status: ACTIVE',
      uploadedBy: bidder4.id,
    },
  });

  const b4_doc_fin = await prisma.document.create({
    data: {
      bidId: bid4.id,
      filename: 'Turnover_Statement_SunGrid.pdf',
      documentType: 'FINANCIAL_STATEMENT',
      mimeType: 'application/pdf',
      fileSize: 76000,
      storagePath: 'storage/demo-documents/financial/Turnover_Statement_SunGrid.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Audited Average Turnover: INR 85.0 Crore',
      uploadedBy: bidder4.id,
    },
  });

  await prisma.complianceResult.createMany({
    data: [
      { bidId: bid4.id, requirementId: t2_req1.id, status: 'COMPLIANT', score: 100.0, reason: 'Active GST registration verified.' },
      { bidId: bid4.id, requirementId: t2_req2.id, status: 'COMPLIANT', score: 100.0, reason: 'Valid Corporate PAN DDDP1122K verified.' },
      { bidId: bid4.id, requirementId: t2_req3.id, status: 'NON_COMPLIANT', score: 40.0, reason: 'Turnover ₹85.0 Cr falls short of mandatory ₹150.0 Cr threshold.' },
      { bidId: bid4.id, requirementId: t2_req4.id, status: 'MISSING', score: 0.0, reason: 'Missing Solar PV OEM authorization letter.' },
      { bidId: bid4.id, requirementId: t2_req5.id, status: 'COMPLIANT', score: 100.0, reason: '4 years experience meets 3 years requirement.' },
      { bidId: bid4.id, requirementId: t2_req6.id, status: 'NON_COMPLIANT', score: 0.0, reason: 'Declared local content is 35% vs 50% required.' },
    ],
  });

  // ==========================================
  // TENDER 3: Smart City AI Surveillance Grid (MoHUA)
  // ==========================================
  const tender3 = await prisma.tender.create({
    data: {
      tenderNumber: 'GEM-DEMO-2026-SMART-003',
      title: 'Smart City AI Surveillance Grid & Integrated Command Center',
      departmentId: dept3.id,
      category: 'Smart City & Surveillance',
      description: 'Implementation of 5000+ AI CCTV Surveillance Nodes, Automatic License Plate Recognition (ANPR), Facial Recognition Engine, and Centralized Command Center.',
      estimatedValue: 1800000000.0,
      submissionDeadline: new Date('2026-11-10T23:59:59Z'),
      status: 'OPEN',
      createdBy: officerUser.id,
      originalDocumentId: 'storage/demo-documents/tenders/03_Tender_GeM_Smart_City_Grid.pdf',
    },
  });

  const t3_req1 = await prisma.requirement.create({
    data: {
      tenderId: tender3.id,
      requirementCode: 'SC-R1',
      title: 'Active GST Registration',
      description: 'Bidder must possess valid active GST registration certificate.',
      category: 'LEGAL',
      mandatory: true,
      threshold: 'ACTIVE',
      thresholdUnit: 'Status',
      sourcePage: 1,
      sourceSection: 'Commercial Eligibility 1.1',
      confidence: 0.98,
      ruleType: 'MATCH_EXACT',
    },
  });

  const t3_req2 = await prisma.requirement.create({
    data: {
      tenderId: tender3.id,
      requirementCode: 'SC-R2',
      title: 'Income Tax PAN Registration',
      description: 'Bidder must possess valid PAN card issued by Income Tax Department.',
      category: 'LEGAL',
      mandatory: true,
      threshold: 'VALID',
      thresholdUnit: 'Status',
      sourcePage: 1,
      sourceSection: 'Commercial Eligibility 1.2',
      confidence: 0.98,
      ruleType: 'MATCH_EXACT',
    },
  });

  const t3_req3 = await prisma.requirement.create({
    data: {
      tenderId: tender3.id,
      requirementCode: 'SC-R3',
      title: 'Smart City Financial Turnover',
      description: 'Average annual turnover >= INR 50.0 Crore in the last 3 financial years.',
      category: 'FINANCIAL',
      mandatory: true,
      threshold: '50.0',
      thresholdUnit: 'Crore INR',
      sourcePage: 1,
      sourceSection: 'Financial Requirements 2.1',
      confidence: 0.96,
      ruleType: 'GREATER_THAN_EQUAL',
    },
  });

  const t3_req4 = await prisma.requirement.create({
    data: {
      tenderId: tender3.id,
      requirementCode: 'SC-R4',
      title: 'AI Surveillance VMS OEM Authorization',
      description: 'OEM Authorization Letter from Enterprise Video Management System manufacturer.',
      category: 'TECHNICAL',
      mandatory: true,
      threshold: 'PRESENT',
      thresholdUnit: 'Document',
      sourcePage: 2,
      sourceSection: 'Technical Architecture 3.1',
      confidence: 0.95,
      ruleType: 'DOCUMENT_EXISTS',
    },
  });

  const t3_req5 = await prisma.requirement.create({
    data: {
      tenderId: tender3.id,
      requirementCode: 'SC-R5',
      title: 'Smart City CCTV Project Experience',
      description: 'Minimum 4 years of experience executing city surveillance or command center projects.',
      category: 'EXPERIENCE',
      mandatory: true,
      threshold: '4.0',
      thresholdUnit: 'Years',
      sourcePage: 2,
      sourceSection: 'Experience Criteria 3.2',
      confidence: 0.93,
      ruleType: 'GREATER_THAN_EQUAL',
    },
  });

  const t3_req6 = await prisma.requirement.create({
    data: {
      tenderId: tender3.id,
      requirementCode: 'SC-R6',
      title: 'ISO 27001:2022 Information Security',
      description: 'Valid ISO 27001 Information Security Management System certification.',
      category: 'CERTIFICATION',
      mandatory: true,
      threshold: 'VALID',
      thresholdUnit: 'Status',
      sourcePage: 2,
      sourceSection: 'Cybersecurity Assurance 4.1',
      confidence: 0.97,
      ruleType: 'MATCH_EXACT',
    },
  });

  // Bid 5: CyberGrid Security (Tender 3 - Low Risk)
  const bid5 = await prisma.bid.create({
    data: {
      tenderId: tender3.id,
      bidderId: bidder5.id,
      bidderName: 'CyberGrid Security & Surveillance Pvt Ltd',
      status: 'UNDER_REVIEW',
      complianceScore: 94.0,
      riskScore: 16.0,
      riskLevel: 'LOW',
      finalReviewStatus: 'UNDER_REVIEW',
    },
  });

  const b5_doc_gst = await prisma.document.create({
    data: {
      bidId: bid5.id,
      filename: 'GST_Certificate_CyberGrid.pdf',
      documentType: 'GST_CERTIFICATE',
      mimeType: 'application/pdf',
      fileSize: 45000,
      storagePath: 'storage/demo-documents/legal/GST_Certificate_CyberGrid.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'GSTIN: 29EEEK3344M1Z8, Status: ACTIVE',
      uploadedBy: bidder5.id,
    },
  });

  const b5_doc_fin = await prisma.document.create({
    data: {
      bidId: bid5.id,
      filename: 'Turnover_Statement_CyberGrid.pdf',
      documentType: 'FINANCIAL_STATEMENT',
      mimeType: 'application/pdf',
      fileSize: 84000,
      storagePath: 'storage/demo-documents/financial/Turnover_Statement_CyberGrid.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Audited Average Turnover: INR 72.5 Crore',
      uploadedBy: bidder5.id,
    },
  });

  const b5_doc_oem = await prisma.document.create({
    data: {
      bidId: bid5.id,
      filename: 'VMS_OEM_Authorization_CyberGrid.pdf',
      documentType: 'OEM_AUTHORIZATION',
      mimeType: 'application/pdf',
      fileSize: 51000,
      storagePath: 'storage/demo-documents/technical/VMS_OEM_Authorization_CyberGrid.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Authorized VMS Enterprise Solution Provider',
      uploadedBy: bidder5.id,
    },
  });

  const b5_doc_iso = await prisma.document.create({
    data: {
      bidId: bid5.id,
      filename: 'ISO_27001_CyberGrid.pdf',
      documentType: 'ISO_CERTIFICATE',
      mimeType: 'application/pdf',
      fileSize: 42000,
      storagePath: 'storage/demo-documents/certification/ISO_27001_CyberGrid.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'ISO 27001:2022 Certified Information Security',
      uploadedBy: bidder5.id,
    },
  });

  await prisma.complianceResult.createMany({
    data: [
      { bidId: bid5.id, requirementId: t3_req1.id, status: 'COMPLIANT', score: 100.0, reason: 'Active GST registration verified.' },
      { bidId: bid5.id, requirementId: t3_req2.id, status: 'COMPLIANT', score: 100.0, reason: 'Valid Corporate PAN verified.' },
      { bidId: bid5.id, requirementId: t3_req3.id, status: 'COMPLIANT', score: 100.0, reason: 'Turnover ₹72.5 Cr exceeds ₹50.0 Cr threshold.' },
      { bidId: bid5.id, requirementId: t3_req4.id, status: 'COMPLIANT', score: 100.0, reason: 'VMS OEM Authorization letter present.' },
      { bidId: bid5.id, requirementId: t3_req5.id, status: 'COMPLIANT', score: 100.0, reason: '6 years experience exceeds 4 years required.' },
      { bidId: bid5.id, requirementId: t3_req6.id, status: 'COMPLIANT', score: 100.0, reason: 'Valid ISO 27001:2022 certificate verified.' },
    ],
  });

  // Bid 6: VisionTech Shield (Tender 3 - Medium Risk)
  const bid6 = await prisma.bid.create({
    data: {
      tenderId: tender3.id,
      bidderId: bidder6.id,
      bidderName: 'VisionTech Shield India Limited',
      status: 'UNDER_REVIEW',
      complianceScore: 75.0,
      riskScore: 42.0,
      riskLevel: 'MEDIUM',
      finalReviewStatus: 'UNDER_REVIEW',
    },
  });

  const b6_doc_gst = await prisma.document.create({
    data: {
      bidId: bid6.id,
      filename: 'GST_Certificate_VisionTech.pdf',
      documentType: 'GST_CERTIFICATE',
      mimeType: 'application/pdf',
      fileSize: 43000,
      storagePath: 'storage/demo-documents/legal/GST_Certificate_VisionTech.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'GSTIN: 33FFFR5566L1Z1, Status: ACTIVE',
      uploadedBy: bidder6.id,
    },
  });

  const b6_doc_fin = await prisma.document.create({
    data: {
      bidId: bid6.id,
      filename: 'Turnover_Statement_VisionTech.pdf',
      documentType: 'FINANCIAL_STATEMENT',
      mimeType: 'application/pdf',
      fileSize: 79000,
      storagePath: 'storage/demo-documents/financial/Turnover_Statement_VisionTech.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Audited Average Turnover: INR 54.0 Crore',
      uploadedBy: bidder6.id,
    },
  });

  await prisma.complianceResult.createMany({
    data: [
      { bidId: bid6.id, requirementId: t3_req1.id, status: 'COMPLIANT', score: 100.0, reason: 'Active GST registration verified.' },
      { bidId: bid6.id, requirementId: t3_req2.id, status: 'COMPLIANT', score: 100.0, reason: 'Valid Corporate PAN verified.' },
      { bidId: bid6.id, requirementId: t3_req3.id, status: 'COMPLIANT', score: 100.0, reason: 'Turnover ₹54.0 Cr meets ₹50.0 Cr threshold.' },
      { bidId: bid6.id, requirementId: t3_req4.id, status: 'COMPLIANT', score: 100.0, reason: 'VMS OEM Authorization present.' },
      { bidId: bid6.id, requirementId: t3_req5.id, status: 'COMPLIANT', score: 100.0, reason: '4 years experience meets requirement.' },
      { bidId: bid6.id, requirementId: t3_req6.id, status: 'MISSING', score: 0.0, reason: 'Mandatory ISO 27001 Information Security certificate missing.' },
    ],
  });

  // ==========================================
  // TENDER 4: AI Diagnostic Medical Equipment (MoHFW)
  // ==========================================
  const tender4 = await prisma.tender.create({
    data: {
      tenderNumber: 'GEM-DEMO-2026-MED-004',
      title: 'AI Diagnostic Medical Equipment & ICU Infrastructure Supply',
      departmentId: dept4.id,
      category: 'Medical Equipment & Healthcare',
      description: 'Procurement of High-End Multi-Slice CT Scanners, MRI Imaging Units, AI Diagnostic Workstations, and Advanced ICU Patient Ventilators across 12 AIIMS Hospitals.',
      estimatedValue: 850000000.0,
      submissionDeadline: new Date('2026-10-30T23:59:59Z'),
      status: 'OPEN',
      createdBy: officerUser2.id,
      originalDocumentId: 'storage/demo-documents/tenders/04_Tender_GeM_Healthcare_ICU_Supply.pdf',
    },
  });

  const t4_req1 = await prisma.requirement.create({
    data: {
      tenderId: tender4.id,
      requirementCode: 'MED-R1',
      title: 'CDSCO Medical Device License',
      description: 'Valid Central Drugs Standard Control Organisation (CDSCO) manufacturing or import license.',
      category: 'LEGAL',
      mandatory: true,
      threshold: 'VALID',
      thresholdUnit: 'License',
      sourcePage: 1,
      sourceSection: 'Regulatory Compliance 1.1',
      confidence: 0.99,
      ruleType: 'MATCH_EXACT',
    },
  });

  const t4_req2 = await prisma.requirement.create({
    data: {
      tenderId: tender4.id,
      requirementCode: 'MED-R2',
      title: 'Active GST Registration',
      description: 'Active GST registration certificate in Medical & Healthcare domain.',
      category: 'LEGAL',
      mandatory: true,
      threshold: 'ACTIVE',
      thresholdUnit: 'Status',
      sourcePage: 1,
      sourceSection: 'Commercial Eligibility 1.2',
      confidence: 0.98,
      ruleType: 'MATCH_EXACT',
    },
  });

  const t4_req3 = await prisma.requirement.create({
    data: {
      tenderId: tender4.id,
      requirementCode: 'MED-R3',
      title: 'Healthcare Supply Turnover',
      description: 'Average annual turnover >= INR 40.0 Crore in last 3 financial years.',
      category: 'FINANCIAL',
      mandatory: true,
      threshold: '40.0',
      thresholdUnit: 'Crore INR',
      sourcePage: 1,
      sourceSection: 'Financial Capacity 2.1',
      confidence: 0.96,
      ruleType: 'GREATER_THAN_EQUAL',
    },
  });

  const t4_req4 = await prisma.requirement.create({
    data: {
      tenderId: tender4.id,
      requirementCode: 'MED-R4',
      title: 'CT / MRI Diagnostic OEM Authorization',
      description: 'Direct OEM authorization from certified Diagnostic Imaging Device manufacturer.',
      category: 'TECHNICAL',
      mandatory: true,
      threshold: 'PRESENT',
      thresholdUnit: 'Document',
      sourcePage: 2,
      sourceSection: 'Technical Specs 3.1',
      confidence: 0.97,
      ruleType: 'DOCUMENT_EXISTS',
    },
  });

  const t4_req5 = await prisma.requirement.create({
    data: {
      tenderId: tender4.id,
      requirementCode: 'MED-R5',
      title: 'ISO 13485:2016 Medical Devices QMS',
      description: 'Valid ISO 13485:2016 Medical Devices Quality Management System certification.',
      category: 'CERTIFICATION',
      mandatory: true,
      threshold: 'VALID',
      thresholdUnit: 'Status',
      sourcePage: 2,
      sourceSection: 'Quality Standards 4.1',
      confidence: 0.98,
      ruleType: 'MATCH_EXACT',
    },
  });

  // Bid 7: BioMedCare Health (Tender 4 - Low Risk)
  const bid7 = await prisma.bid.create({
    data: {
      tenderId: tender4.id,
      bidderId: bidder7.id,
      bidderName: 'BioMedCare Health Solutions Pvt Ltd',
      status: 'COMPLETED',
      complianceScore: 96.0,
      riskScore: 10.0,
      riskLevel: 'LOW',
      finalReviewStatus: 'APPROVED',
    },
  });

  const b7_doc_cdsco = await prisma.document.create({
    data: {
      bidId: bid7.id,
      filename: 'CDSCO_License_BioMedCare.pdf',
      documentType: 'COMPANY_PROFILE',
      mimeType: 'application/pdf',
      fileSize: 49000,
      storagePath: 'storage/demo-documents/legal/CDSCO_License_BioMedCare.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'CDSCO License No: CDSCO-2025-MED-8821, Status: VALID',
      uploadedBy: bidder7.id,
    },
  });

  const b7_doc_gst = await prisma.document.create({
    data: {
      bidId: bid7.id,
      filename: 'GST_Certificate_BioMedCare.pdf',
      documentType: 'GST_CERTIFICATE',
      mimeType: 'application/pdf',
      fileSize: 45000,
      storagePath: 'storage/demo-documents/legal/GST_Certificate_BioMedCare.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'GSTIN: 36GGGH7788J1Z9, Status: ACTIVE',
      uploadedBy: bidder7.id,
    },
  });

  const b7_doc_fin = await prisma.document.create({
    data: {
      bidId: bid7.id,
      filename: 'Turnover_Statement_BioMedCare.pdf',
      documentType: 'FINANCIAL_STATEMENT',
      mimeType: 'application/pdf',
      fileSize: 85000,
      storagePath: 'storage/demo-documents/financial/Turnover_Statement_BioMedCare.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Audited Average Turnover: INR 62.0 Crore',
      uploadedBy: bidder7.id,
    },
  });

  const b7_doc_oem = await prisma.document.create({
    data: {
      bidId: bid7.id,
      filename: 'OEM_Authorization_BioMedCare.pdf',
      documentType: 'OEM_AUTHORIZATION',
      mimeType: 'application/pdf',
      fileSize: 53000,
      storagePath: 'storage/demo-documents/technical/OEM_Authorization_BioMedCare.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Authorized Medical Imaging Equipment OEM Representative',
      uploadedBy: bidder7.id,
    },
  });

  const b7_doc_iso = await prisma.document.create({
    data: {
      bidId: bid7.id,
      filename: 'ISO_13485_BioMedCare.pdf',
      documentType: 'ISO_CERTIFICATE',
      mimeType: 'application/pdf',
      fileSize: 44000,
      storagePath: 'storage/demo-documents/certification/ISO_13485_BioMedCare.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'ISO 13485:2016 Medical Devices Quality Management System',
      uploadedBy: bidder7.id,
    },
  });

  await prisma.complianceResult.createMany({
    data: [
      { bidId: bid7.id, requirementId: t4_req1.id, status: 'COMPLIANT', score: 100.0, reason: 'Valid CDSCO License CDSCO-2025-MED-8821 verified.' },
      { bidId: bid7.id, requirementId: t4_req2.id, status: 'COMPLIANT', score: 100.0, reason: 'Active GST registration 36GGGH7788J1Z9 verified.' },
      { bidId: bid7.id, requirementId: t4_req3.id, status: 'COMPLIANT', score: 100.0, reason: 'Turnover ₹62.0 Cr exceeds mandatory ₹40.0 Cr threshold.' },
      { bidId: bid7.id, requirementId: t4_req4.id, status: 'COMPLIANT', score: 100.0, reason: 'CT/MRI OEM Authorization letter present.' },
      { bidId: bid7.id, requirementId: t4_req5.id, status: 'COMPLIANT', score: 100.0, reason: 'Valid ISO 13485:2016 certificate verified.' },
    ],
  });

  // Bid 8: MedEquip Global (Tender 4 - High Risk)
  const bid8 = await prisma.bid.create({
    data: {
      tenderId: tender4.id,
      bidderId: bidder8.id,
      bidderName: 'MedEquip Global Supplies Limited',
      status: 'UNDER_REVIEW',
      complianceScore: 42.0,
      riskScore: 78.0,
      riskLevel: 'HIGH',
      finalReviewStatus: 'UNDER_REVIEW',
    },
  });

  const b8_doc_gst = await prisma.document.create({
    data: {
      bidId: bid8.id,
      filename: 'GST_Certificate_MedEquip.pdf',
      documentType: 'GST_CERTIFICATE',
      mimeType: 'application/pdf',
      fileSize: 42000,
      storagePath: 'storage/demo-documents/legal/GST_Certificate_MedEquip.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'GSTIN: 27HHHJ9900Q1Z2, Status: ACTIVE',
      uploadedBy: bidder8.id,
    },
  });

  const b8_doc_fin = await prisma.document.create({
    data: {
      bidId: bid8.id,
      filename: 'Turnover_Statement_MedEquip.pdf',
      documentType: 'FINANCIAL_STATEMENT',
      mimeType: 'application/pdf',
      fileSize: 74000,
      storagePath: 'storage/demo-documents/financial/Turnover_Statement_MedEquip.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Audited Average Turnover: INR 28.0 Crore',
      uploadedBy: bidder8.id,
    },
  });

  await prisma.complianceResult.createMany({
    data: [
      { bidId: bid8.id, requirementId: t4_req1.id, status: 'NON_COMPLIANT', score: 0.0, reason: 'CDSCO license expired in January 2026.' },
      { bidId: bid8.id, requirementId: t4_req2.id, status: 'COMPLIANT', score: 100.0, reason: 'Active GST registration verified.' },
      { bidId: bid8.id, requirementId: t4_req3.id, status: 'NON_COMPLIANT', score: 40.0, reason: 'Turnover ₹28.0 Cr falls short of mandatory ₹40.0 Cr threshold.' },
      { bidId: bid8.id, requirementId: t4_req4.id, status: 'MISSING', score: 0.0, reason: 'Missing CT/MRI Diagnostic OEM authorization letter.' },
      { bidId: bid8.id, requirementId: t4_req5.id, status: 'COMPLIANT', score: 100.0, reason: 'ISO 13485:2016 certificate verified.' },
    ],
  });

  // Default Rule Settings
  await prisma.ruleSetting.createMany({
    data: [
      { category: 'LEGAL', weight: 1.0, mandatoryImpact: 30.0 },
      { category: 'FINANCIAL', weight: 1.0, mandatoryImpact: 30.0 },
      { category: 'TECHNICAL', weight: 1.0, mandatoryImpact: 30.0 },
      { category: 'EXPERIENCE', weight: 1.0, mandatoryImpact: 30.0 },
      { category: 'LOCAL_CONTENT', weight: 1.0, mandatoryImpact: 30.0 },
      { category: 'CERTIFICATION', weight: 0.8, mandatoryImpact: 15.0 },
      { category: 'DOCUMENTATION', weight: 0.8, mandatoryImpact: 15.0 },
    ],
  });

  // Statutory Debarment Registry (Real Gazetted / Authority Orders)
  const historicalDebarments = [
    {
      firmName: 'M/s Raja Builders',
      panNumber: null,
      vendorCode: null,
      debarringAuthority: 'Delhi Development Authority (DDA) / MoHUA',
      orderNumber: 'F.4(8)75/27/2014/II(Hort.)/CRB/DDA/64',
      orderDate: new Date('2023-02-23'),
      periodFrom: new Date('2023-02-13'),
      periodTo: new Date('2024-02-12'),
      reason: 'Contractual default, performance failure, and tendering non-compliance under DDA Bidding Rules.',
      debarmentScope: 'MINISTRY_SPECIFIC',
      sourceType: 'GAZETTE_NOTICE',
      sourceUrl: 'https://dda.gov.in/sites/default/files/tender/2023-02/Debarment_Raja_Builders_64.pdf',
    },
    {
      firmName: 'M/s Mi2C Security & Facilities Pvt. Ltd.',
      panNumber: null,
      vendorCode: null,
      debarringAuthority: 'Delhi Development Authority (DDA)',
      orderNumber: 'Office Order No. 49/2020, modified by Office Order No. 99/2020',
      orderDate: new Date('2020-02-10'),
      periodFrom: new Date('2020-02-10'),
      periodTo: new Date('2020-12-31'),
      reason: 'Serious deficiency in deployment of statutory security personnel and breach of contract conditions.',
      debarmentScope: 'MINISTRY_SPECIFIC',
      sourceType: 'GAZETTE_NOTICE',
      sourceUrl: 'https://dda.gov.in/sites/default/files/tender/2020-06/Office_Order_99_2020_Mi2C.pdf',
    },
    {
      firmName: 'M/s Theme Engineering Services Pvt. Ltd.',
      panNumber: null,
      vendorCode: null,
      debarringAuthority: 'National Highways & Infrastructure Development Corporation Ltd. (NHIDCL) / MoRTH',
      orderNumber: 'NHIDCL/Tech/Debarment/2020/01',
      orderDate: new Date('2020-10-20'),
      periodFrom: new Date('2020-10-20'),
      periodTo: new Date('2022-10-19'),
      reason: 'Serious technical lapses, design deficiencies, and failure to meet quality benchmarks in highway consultancy works.',
      debarmentScope: 'CENTRAL_PROCUREMENT',
      sourceType: 'GAZETTE_NOTICE',
      sourceUrl: 'https://nhidcl.com/wp-content/uploads/2020/10/Debarment-Order-Theme-Engineering.pdf',
    },
  ];

  for (const record of historicalDebarments) {
    const existing = await prisma.debarmentRegistry.findFirst({
      where: {
        firmName: record.firmName,
        orderNumber: record.orderNumber,
      },
    });

    if (!existing) {
      await prisma.debarmentRegistry.create({
        data: record,
      });
    }
  }

  console.log('Successfully seeded 4 Tenders, 8 Bidders, 8 Bids, and 3 Historical Debarment Records!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
