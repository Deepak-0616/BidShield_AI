import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding BidShield AI database with expanded 4 Tenders & 8 Bidders...');

  // Clean existing tables in reverse dependency order
  await prisma.auditLog.deleteMany({});
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
      designation: 'Senior Procurement Officer',
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

  // 8 Bidders
  const bidder1 = await prisma.user.create({
    data: {
      name: 'Suresh Kumar',
      email: 'bidder@novatech.demo',
      passwordHash: bidderPassword,
      role: 'BIDDER',
      departmentId: dept1.id,
      designation: 'Authorized Signatory - NovaTech Systems',
    },
  });

  const bidder2 = await prisma.user.create({
    data: {
      name: 'Vikram Mehta',
      email: 'bidder@apexdigital.demo',
      passwordHash: bidderPassword,
      role: 'BIDDER',
      departmentId: dept1.id,
      designation: 'Vice President - Apex Digital Infrastructure',
    },
  });

  const bidder3 = await prisma.user.create({
    data: {
      name: 'Ramesh Patel',
      email: 'bidder@solaria.demo',
      passwordHash: bidderPassword,
      role: 'BIDDER',
      departmentId: dept2.id,
      designation: 'Director - Solaria CleanTech Energy',
    },
  });

  const bidder4 = await prisma.user.create({
    data: {
      name: 'Anish Sharma',
      email: 'bidder@sungrid.demo',
      passwordHash: bidderPassword,
      role: 'BIDDER',
      departmentId: dept2.id,
      designation: 'Head of Bids - SunGrid Power Infrastructure',
    },
  });

  const bidder5 = await prisma.user.create({
    data: {
      name: 'Neha Gupta',
      email: 'bidder@cybergrid.demo',
      passwordHash: bidderPassword,
      role: 'BIDDER',
      departmentId: dept3.id,
      designation: 'Chief Operations Officer - CyberGrid Security',
    },
  });

  const bidder6 = await prisma.user.create({
    data: {
      name: 'Alok Verma',
      email: 'bidder@visiontech.demo',
      passwordHash: bidderPassword,
      role: 'BIDDER',
      departmentId: dept3.id,
      designation: 'Technical Director - VisionTech Shield',
    },
  });

  const bidder7 = await prisma.user.create({
    data: {
      name: 'Dr. K. V. Rao',
      email: 'bidder@biomedcare.demo',
      passwordHash: bidderPassword,
      role: 'BIDDER',
      departmentId: dept4.id,
      designation: 'Managing Director - BioMedCare Health Solutions',
    },
  });

  const bidder8 = await prisma.user.create({
    data: {
      name: 'Meera Reddy',
      email: 'bidder@medequip.demo',
      passwordHash: bidderPassword,
      role: 'BIDDER',
      departmentId: dept4.id,
      designation: 'VP Sales - MedEquip Global Supplies',
    },
  });

  // ==========================================
  // TENDER 1: IT Infrastructure Modernization
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

  // Requirements for Tender 1
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

  // Bid 1: NovaTech Systems Pvt Ltd (Tender 1)
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

  // Bid 1 Documents & Compliance
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

  // Bid 2: Apex Digital Infrastructure Ltd (Tender 1)
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
  // TENDER 2: Solar PV Power Plant & Storage
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
      createdBy: officerUser.id,
      originalDocumentId: 'storage/demo-documents/tenders/02_Tender_GeM_Solar_Power_Plant.pdf',
    },
  });

  const t2_req1 = await prisma.requirement.create({
    data: {
      tenderId: tender2.id,
      requirementCode: 'SOL-R1',
      title: 'GST Registration (Active GSTIN)',
      description: 'Active GSTIN in Solar/Power sector',
      category: 'LEGAL',
      mandatory: true,
      threshold: 'ACTIVE',
      thresholdUnit: 'Status',
      sourcePage: 1,
      sourceSection: 'Commercial Requirements',
      confidence: 0.98,
      ruleType: 'MATCH_EXACT',
    },
  });

  const t2_req2 = await prisma.requirement.create({
    data: {
      tenderId: tender2.id,
      requirementCode: 'SOL-R2',
      title: 'Minimum Solar EPC Turnover',
      description: 'Average Annual Turnover >= INR 150.0 Crore',
      category: 'FINANCIAL',
      mandatory: true,
      threshold: '150.0',
      thresholdUnit: 'Crore INR',
      sourcePage: 1,
      sourceSection: 'Financial Eligibility',
      confidence: 0.95,
      ruleType: 'GREATER_THAN_EQUAL',
    },
  });

  const t2_req3 = await prisma.requirement.create({
    data: {
      tenderId: tender2.id,
      requirementCode: 'SOL-R3',
      title: 'Solar PV OEM Authorization',
      description: 'Tier-1 Solar PV Module OEM Authorization Letter',
      category: 'TECHNICAL',
      mandatory: true,
      threshold: 'PRESENT',
      thresholdUnit: 'Document',
      sourcePage: 2,
      sourceSection: 'Technical Specs',
      confidence: 0.96,
      ruleType: 'DOCUMENT_EXISTS',
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
      extractedText: 'GSTIN: 24CCCS9988P1Z3 Legal Name: Solaria CleanTech Energy Pvt Ltd Status: ACTIVE',
      uploadedBy: bidder3.id,
    },
  });

  await prisma.complianceResult.createMany({
    data: [
      { bidId: bid3.id, requirementId: t2_req1.id, status: 'COMPLIANT', score: 100.0, reason: 'Active GST registration 24CCCS9988P1Z3 verified.' },
      { bidId: bid3.id, requirementId: t2_req2.id, status: 'COMPLIANT', score: 100.0, reason: 'Annual turnover ₹165.0 Cr exceeds ₹150.0 Cr threshold.' },
      { bidId: bid3.id, requirementId: t2_req3.id, status: 'COMPLIANT', score: 100.0, reason: 'Tier-1 Solar PV OEM authorization verified.' },
    ],
  });

  // Bid 4: SunGrid Power (Tender 2 - High Risk)
  const bid4 = await prisma.bid.create({
    data: {
      tenderId: tender2.id,
      bidderId: bidder4.id,
      bidderName: 'SunGrid Power Infrastructure Ltd',
      status: 'UNDER_REVIEW',
      complianceScore: 50.0,
      riskScore: 72.0,
      riskLevel: 'HIGH',
      finalReviewStatus: 'UNDER_REVIEW',
    },
  });

  await prisma.complianceResult.createMany({
    data: [
      { bidId: bid4.id, requirementId: t2_req1.id, status: 'COMPLIANT', score: 100.0, reason: 'Active GST registration verified.' },
      { bidId: bid4.id, requirementId: t2_req2.id, status: 'NON_COMPLIANT', score: 40.0, reason: 'Turnover ₹85.0 Cr falls short of mandatory ₹150.0 Cr threshold.' },
      { bidId: bid4.id, requirementId: t2_req3.id, status: 'MISSING', score: 0.0, reason: 'Missing Solar PV OEM authorization letter.' },
    ],
  });

  // ==========================================
  // TENDER 3: Smart City AI Surveillance Grid
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
      title: 'Active GST & PAN Registration',
      description: 'Bidder must possess valid active GST and PAN registration in Smart City domain.',
      category: 'LEGAL',
      mandatory: true,
      threshold: 'ACTIVE',
      thresholdUnit: 'Status',
      sourcePage: 1,
      sourceSection: 'General Licensing',
      confidence: 0.98,
      ruleType: 'MATCH_EXACT',
    },
  });

  // Bid 5: CyberGrid Security (Tender 3)
  const bid5 = await prisma.bid.create({
    data: {
      tenderId: tender3.id,
      bidderId: bidder5.id,
      bidderName: 'CyberGrid Security & Surveillance Pvt Ltd',
      status: 'UNDER_REVIEW',
      complianceScore: 92.0,
      riskScore: 18.0,
      riskLevel: 'LOW',
      finalReviewStatus: 'UNDER_REVIEW',
    },
  });

  await prisma.complianceResult.create({
    data: { bidId: bid5.id, requirementId: t3_req1.id, status: 'COMPLIANT', score: 100.0, reason: 'Active GST and PAN verified.' },
  });

  // Bid 6: VisionTech Shield (Tender 3)
  const bid6 = await prisma.bid.create({
    data: {
      tenderId: tender3.id,
      bidderId: bidder6.id,
      bidderName: 'VisionTech Shield India Limited',
      status: 'UNDER_REVIEW',
      complianceScore: 78.0,
      riskScore: 38.0,
      riskLevel: 'MEDIUM',
      finalReviewStatus: 'UNDER_REVIEW',
    },
  });

  await prisma.complianceResult.create({
    data: { bidId: bid6.id, requirementId: t3_req1.id, status: 'COMPLIANT', score: 100.0, reason: 'Active GST verified.' },
  });

  // ==========================================
  // TENDER 4: AI Diagnostic Medical Equipment
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
      createdBy: officerUser.id,
      originalDocumentId: 'storage/demo-documents/tenders/04_Tender_GeM_Healthcare_ICU_Supply.pdf',
    },
  });

  const t4_req1 = await prisma.requirement.create({
    data: {
      tenderId: tender4.id,
      requirementCode: 'MED-R1',
      title: 'CDSCO Medical Device Import/Mfg License',
      description: 'Bidder must possess valid CDSCO registration for high-end medical equipment.',
      category: 'LEGAL',
      mandatory: true,
      threshold: 'VALID',
      thresholdUnit: 'License',
      sourcePage: 1,
      sourceSection: 'Regulatory Compliance',
      confidence: 0.99,
      ruleType: 'MATCH_EXACT',
    },
  });

  // Bid 7: BioMedCare Health (Tender 4)
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

  await prisma.complianceResult.create({
    data: { bidId: bid7.id, requirementId: t4_req1.id, status: 'COMPLIANT', score: 100.0, reason: 'Valid CDSCO License CDSCO-2025-MED-8821 verified.' },
  });

  // Bid 8: MedEquip Global (Tender 4)
  const bid8 = await prisma.bid.create({
    data: {
      tenderId: tender4.id,
      bidderId: bidder8.id,
      bidderName: 'MedEquip Global Supplies Limited',
      status: 'UNDER_REVIEW',
      complianceScore: 45.0,
      riskScore: 78.0,
      riskLevel: 'HIGH',
      finalReviewStatus: 'UNDER_REVIEW',
    },
  });

  await prisma.complianceResult.create({
    data: { bidId: bid8.id, requirementId: t4_req1.id, status: 'NON_COMPLIANT', score: 0.0, reason: 'CDSCO license expired in January 2026.' },
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

  console.log('Successfully seeded 4 Tenders, 8 Bidders, 8 Bids with organized document storage!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
