import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding BidShield AI database...');

  // Hash passwords
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const officerPassword = await bcrypt.hash('Officer@123', 10);
  const bidderPassword = await bcrypt.hash('Bidder@123', 10);
  const auditorPassword = await bcrypt.hash('Auditor@123', 10);

  // Department
  const dept = await prisma.department.upsert({
    where: { code: 'MOPNG-IT' },
    update: {},
    create: {
      name: 'Ministry of Petroleum & Natural Gas - IT Division',
      code: 'MOPNG-IT',
      description: 'Digital Infrastructure & Procurement Verification Division',
    },
  });

  // Seed Users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bidshield.demo' },
    update: {},
    create: {
      name: 'Rajesh Verma',
      email: 'admin@bidshield.demo',
      passwordHash: adminPassword,
      role: 'ADMIN',
      departmentId: dept.id,
      designation: 'Chief Information Officer',
      avatar: '/avatars/admin.png',
    },
  });

  const officerUser = await prisma.user.upsert({
    where: { email: 'officer@bidshield.demo' },
    update: {},
    create: {
      name: 'Dr. Ananya Sharma',
      email: 'officer@bidshield.demo',
      passwordHash: officerPassword,
      role: 'PROCUREMENT_OFFICER',
      departmentId: dept.id,
      designation: 'Senior Procurement Officer',
      avatar: '/avatars/officer.png',
    },
  });

  const bidderUserA = await prisma.user.upsert({
    where: { email: 'bidder@novatech.demo' },
    update: {},
    create: {
      name: 'Suresh Kumar',
      email: 'bidder@novatech.demo',
      passwordHash: bidderPassword,
      role: 'BIDDER',
      departmentId: dept.id,
      designation: 'Authorized Bid Signatory - NovaTech Systems',
      avatar: '/avatars/bidder.png',
    },
  });

  const bidderUserB = await prisma.user.upsert({
    where: { email: 'bidder@apexdigital.demo' },
    update: {},
    create: {
      name: 'Vikram Mehta',
      email: 'bidder@apexdigital.demo',
      passwordHash: bidderPassword,
      role: 'BIDDER',
      departmentId: dept.id,
      designation: 'Vice President - Apex Digital Infrastructure',
      avatar: '/avatars/bidder2.png',
    },
  });

  const auditorUser = await prisma.user.upsert({
    where: { email: 'auditor@bidshield.demo' },
    update: {},
    create: {
      name: 'Priya Nair',
      email: 'auditor@bidshield.demo',
      passwordHash: auditorPassword,
      role: 'AUDITOR',
      departmentId: dept.id,
      designation: 'Principal Compliance Auditor',
      avatar: '/avatars/auditor.png',
    },
  });

  // Seed Tender
  const tender = await prisma.tender.upsert({
    where: { tenderNumber: 'GEM-DEMO-2026-IT-001' },
    update: {},
    create: {
      tenderNumber: 'GEM-DEMO-2026-IT-001',
      title: 'Enterprise Cloud & IT Infrastructure Modernization',
      departmentId: dept.id,
      category: 'Software & Infrastructure',
      description: 'Comprehensive IT infrastructure setup, high performance cloud compute, database clusters and 24x7 managed security operations for GeM procurement division.',
      estimatedValue: 250000000.0,
      submissionDeadline: new Date('2026-09-30T23:59:59Z'),
      status: 'UNDER_REVIEW',
      createdBy: officerUser.id,
      originalDocumentId: 'doc_tender_notice',
    },
  });

  // Clear existing requirements for seed refresh
  await prisma.requirement.deleteMany({ where: { tenderId: tender.id } });

  // Create 8 Tender Requirements
  const req1 = await prisma.requirement.create({
    data: {
      tenderId: tender.id,
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

  const req2 = await prisma.requirement.create({
    data: {
      tenderId: tender.id,
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

  const req3 = await prisma.requirement.create({
    data: {
      tenderId: tender.id,
      requirementCode: 'R3',
      title: 'Minimum Annual Turnover',
      description: 'Bidder must demonstrate average annual financial turnover of at least INR 10.0 Crore in the last 3 financial years.',
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

  const req4 = await prisma.requirement.create({
    data: {
      tenderId: tender.id,
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

  const req5 = await prisma.requirement.create({
    data: {
      tenderId: tender.id,
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

  const req6 = await prisma.requirement.create({
    data: {
      tenderId: tender.id,
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

  const req7 = await prisma.requirement.create({
    data: {
      tenderId: tender.id,
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

  const req8 = await prisma.requirement.create({
    data: {
      tenderId: tender.id,
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

  // Seed Bid A: NovaTech Systems Pvt Ltd (MEDIUM/HIGH RISK Scenario)
  const bidA = await prisma.bid.create({
    data: {
      tenderId: tender.id,
      bidderId: bidderUserA.id,
      bidderName: 'NovaTech Systems Private Limited',
      status: 'UNDER_REVIEW',
      complianceScore: 68.5,
      riskScore: 58.0,
      riskLevel: 'MEDIUM',
      finalReviewStatus: 'UNDER_REVIEW',
    },
  });

  // Seed Bid A Documents
  const docA_GST = await prisma.document.create({
    data: {
      bidId: bidA.id,
      filename: '02_BidderA_GST_Certificate.pdf',
      documentType: 'GST_CERTIFICATE',
      mimeType: 'application/pdf',
      fileSize: 45200,
      storagePath: 'storage/demo-documents/02_BidderA_GST_Certificate.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'GSTIN: 27AAACN1234Q1Z5, Legal Name: NovaTech Systems Private Limited, Status: ACTIVE',
      uploadedBy: bidderUserA.id,
    },
  });

  const docA_PAN = await prisma.document.create({
    data: {
      bidId: bidA.id,
      filename: '03_BidderA_PAN_Certificate.pdf',
      documentType: 'PAN',
      mimeType: 'application/pdf',
      fileSize: 38100,
      storagePath: 'storage/demo-documents/03_BidderA_PAN_Certificate.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'PAN: AAACN1234Q, Name: NovaTech Systems Private Limited, Date: 2018-04-05',
      uploadedBy: bidderUserA.id,
    },
  });

  const docA_Financial = await prisma.document.create({
    data: {
      bidId: bidA.id,
      filename: '05_BidderA_Financial_Statement.pdf',
      documentType: 'FINANCIAL_STATEMENT',
      mimeType: 'application/pdf',
      fileSize: 112000,
      storagePath: 'storage/demo-documents/05_BidderA_Financial_Statement.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Average Annual Turnover (Last 3 Years): INR 12.37 Crore (FY24: 11.2 Cr, FY25: 12.8 Cr, FY26: 13.1 Cr)',
      uploadedBy: bidderUserA.id,
    },
  });

  const docA_Experience = await prisma.document.create({
    data: {
      bidId: bidA.id,
      filename: '06_BidderA_Experience_Certificate.pdf',
      documentType: 'EXPERIENCE_CERTIFICATE',
      mimeType: 'application/pdf',
      fileSize: 64000,
      storagePath: 'storage/demo-documents/06_BidderA_Experience_Certificate.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Contract Period: June 2023 to May 2026. Total Demonstrated Experience: 3 Years',
      uploadedBy: bidderUserA.id,
    },
  });

  const docA_LocalContent = await prisma.document.create({
    data: {
      bidId: bidA.id,
      filename: '08_BidderA_Local_Content_Declaration.pdf',
      documentType: 'LOCAL_CONTENT_DECLARATION',
      mimeType: 'application/pdf',
      fileSize: 41000,
      storagePath: 'storage/demo-documents/08_BidderA_Local_Content_Declaration.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Declared Local Content Percentage: 42.0%. Class-II Local Supplier',
      uploadedBy: bidderUserA.id,
    },
  });

  const docA_ISO = await prisma.document.create({
    data: {
      bidId: bidA.id,
      filename: '07_BidderA_ISO9001_Certificate.pdf',
      documentType: 'ISO_CERTIFICATE',
      mimeType: 'application/pdf',
      fileSize: 52000,
      storagePath: 'storage/demo-documents/07_BidderA_ISO9001_Certificate.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'ISO 9001:2015 Quality Management Certificate ISO-9001-2024-NT8821. Valid until 2028-11-20',
      uploadedBy: bidderUserA.id,
    },
  });

  const docA_Udyam = await prisma.document.create({
    data: {
      bidId: bidA.id,
      filename: '04_BidderA_Udyam_Certificate.pdf',
      documentType: 'UDYAM',
      mimeType: 'application/pdf',
      fileSize: 48000,
      storagePath: 'storage/demo-documents/04_BidderA_Udyam_Certificate.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Udyam Registration Number: UDYAM-MH-03-0012345. Enterprise: NovaTech Systems Private Limited',
      uploadedBy: bidderUserA.id,
    },
  });

  const docA_Contradiction = await prisma.document.create({
    data: {
      bidId: bidA.id,
      filename: '17_BidderA_Company_Profile_Contradiction.pdf',
      documentType: 'COMPANY_PROFILE',
      mimeType: 'application/pdf',
      fileSize: 58000,
      storagePath: 'storage/demo-documents/17_BidderA_Company_Profile_Contradiction.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Company Incorporation Date: April 2018. Note: Relevant IT project experience starting 2023 (3 years).',
      uploadedBy: bidderUserA.id,
    },
  });

  // Seed Evidence for Bid A
  const evA_GST = await prisma.evidence.create({
    data: {
      documentId: docA_GST.id,
      requirementId: req1.id,
      extractedValue: '27AAACN1234Q1Z5 (ACTIVE)',
      normalizedValue: 'ACTIVE',
      pageNumber: 1,
      textSnippet: 'Registration Number (GSTIN): 27AAACN1234Q1Z5 | Status: ACTIVE',
      confidence: 0.98,
      verificationStatus: 'VERIFIED',
    },
  });

  const evA_PAN = await prisma.evidence.create({
    data: {
      documentId: docA_PAN.id,
      requirementId: req2.id,
      extractedValue: 'AAACN1234Q (VALID)',
      normalizedValue: 'VALID',
      pageNumber: 1,
      textSnippet: 'PAN: AAACN1234Q | Name: NovaTech Systems Private Limited',
      confidence: 0.98,
      verificationStatus: 'VERIFIED',
    },
  });

  const evA_Turnover = await prisma.evidence.create({
    data: {
      documentId: docA_Financial.id,
      requirementId: req3.id,
      extractedValue: 'INR 12.37 Crore',
      normalizedValue: '12.37',
      pageNumber: 1,
      textSnippet: 'Average Annual Turnover (Last 3 Years): INR 12.37 Crore',
      confidence: 0.96,
      verificationStatus: 'VERIFIED',
    },
  });

  const evA_Experience = await prisma.evidence.create({
    data: {
      documentId: docA_Experience.id,
      requirementId: req4.id,
      extractedValue: '3.0 Years',
      normalizedValue: '3.0',
      pageNumber: 1,
      textSnippet: 'Contract Period: June 2023 to May 2026 (3 Years Total)',
      confidence: 0.95,
      verificationStatus: 'VERIFIED',
    },
  });

  const evA_ISO = await prisma.evidence.create({
    data: {
      documentId: docA_ISO.id,
      requirementId: req6.id,
      extractedValue: 'ISO 9001:2015 Certified',
      normalizedValue: 'VALID',
      pageNumber: 1,
      textSnippet: 'Certificate Number: ISO-9001-2024-NT8821 | Valid Until: 2028-11-20',
      confidence: 0.96,
      verificationStatus: 'VERIFIED',
    },
  });

  const evA_LocalContent = await prisma.evidence.create({
    data: {
      documentId: docA_LocalContent.id,
      requirementId: req7.id,
      extractedValue: '42.0%',
      normalizedValue: '42.0',
      pageNumber: 1,
      textSnippet: 'Declared Local Content Percentage: 42.0%',
      confidence: 0.97,
      verificationStatus: 'VERIFIED',
    },
  });

  const evA_Udyam = await prisma.evidence.create({
    data: {
      documentId: docA_Udyam.id,
      requirementId: req8.id,
      extractedValue: 'UDYAM-MH-03-0012345',
      normalizedValue: 'VALID',
      pageNumber: 1,
      textSnippet: 'Udyam Registration Number: UDYAM-MH-03-0012345',
      confidence: 0.96,
      verificationStatus: 'VERIFIED',
    },
  });

  // Seed Compliance Results for Bid A (NovaTech)
  await prisma.complianceResult.createMany({
    data: [
      {
        bidId: bidA.id,
        requirementId: req1.id,
        status: 'COMPLIANT',
        score: 100.0,
        reason: 'Active GST registration confirmed via GSTIN 27AAACN1234Q1Z5.',
        evidenceId: evA_GST.id,
        aiExplanation: 'The submitted GST Certificate was verified against GST portal record and confirms active status.',
      },
      {
        bidId: bidA.id,
        requirementId: req2.id,
        status: 'COMPLIANT',
        score: 100.0,
        reason: 'Valid Income Tax PAN AAACN1234Q verified.',
        evidenceId: evA_PAN.id,
        aiExplanation: 'PAN certificate matches legal entity name NovaTech Systems Private Limited.',
      },
      {
        bidId: bidA.id,
        requirementId: req3.id,
        status: 'COMPLIANT',
        score: 100.0,
        reason: 'Average turnover of ₹12.37 Cr exceeds mandatory ₹10.0 Cr threshold.',
        evidenceId: evA_Turnover.id,
        aiExplanation: 'Audited CA turnover certificate confirms FY24 (11.2 Cr), FY25 (12.8 Cr), FY26 (13.1 Cr) average is 12.37 Cr.',
      },
      {
        bidId: bidA.id,
        requirementId: req4.id,
        status: 'NON_COMPLIANT',
        score: 40.0,
        reason: 'Submitted experience is 3 years against mandatory minimum requirement of 5 years.',
        evidenceId: evA_Experience.id,
        aiExplanation: 'Experience certificate from Western State Power covers June 2023-May 2026 (3 years). Mandatory threshold is 5 years.',
      },
      {
        bidId: bidA.id,
        requirementId: req5.id,
        status: 'MISSING',
        score: 0.0,
        reason: 'No OEM Authorization Letter document was uploaded in bid submission.',
        evidenceId: null,
        aiExplanation: 'Mandatory technical document missing. Bidder must submit direct OEM authorization letter.',
      },
      {
        bidId: bidA.id,
        requirementId: req6.id,
        status: 'COMPLIANT',
        score: 100.0,
        reason: 'Valid ISO 9001:2015 certificate verified (Valid until Nov 2028).',
        evidenceId: evA_ISO.id,
        aiExplanation: 'Quality Management System certificate is valid and unexpired.',
      },
      {
        bidId: bidA.id,
        requirementId: req7.id,
        status: 'NON_COMPLIANT',
        score: 0.0,
        reason: 'Declared local content is 42% against mandatory minimum of 50%.',
        evidenceId: evA_LocalContent.id,
        aiExplanation: 'Make in India declaration falls below mandatory Class-I threshold (50%). Bidder is categorized as Class-II Supplier.',
      },
      {
        bidId: bidA.id,
        requirementId: req8.id,
        status: 'COMPLIANT',
        score: 100.0,
        reason: 'Valid MSME Udyam Registration UDYAM-MH-03-0012345 verified.',
        evidenceId: evA_Udyam.id,
        aiExplanation: 'Small enterprise MSME status verified for purchase preference.',
      },
    ],
  });

  // Seed Bid B: Apex Digital Infrastructure Limited (HIGH COMPLIANCE Scenario)
  const bidB = await prisma.bid.create({
    data: {
      tenderId: tender.id,
      bidderId: bidderUserB.id,
      bidderName: 'Apex Digital Infrastructure Limited',
      status: 'COMPLETED',
      complianceScore: 98.0,
      riskScore: 12.0,
      riskLevel: 'LOW',
      finalReviewStatus: 'APPROVED',
    },
  });

  // Seed Bid B Documents & Evidences & Compliance Results
  const docB_GST = await prisma.document.create({
    data: {
      bidId: bidB.id,
      filename: '09_BidderB_GST_Certificate.pdf',
      documentType: 'GST_CERTIFICATE',
      mimeType: 'application/pdf',
      fileSize: 46000,
      storagePath: 'storage/demo-documents/09_BidderB_GST_Certificate.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'GSTIN: 07BBBCA9876R1Z2, Status: ACTIVE, Legal Name: Apex Digital Infrastructure Limited',
      uploadedBy: bidderUserB.id,
    },
  });

  const evB_GST = await prisma.evidence.create({
    data: {
      documentId: docB_GST.id,
      requirementId: req1.id,
      extractedValue: '07BBBCA9876R1Z2 (ACTIVE)',
      normalizedValue: 'ACTIVE',
      pageNumber: 1,
      textSnippet: 'GSTIN: 07BBBCA9876R1Z2 | Status: ACTIVE',
      confidence: 0.99,
      verificationStatus: 'VERIFIED',
    },
  });

  const docB_PAN = await prisma.document.create({
    data: {
      bidId: bidB.id,
      filename: '10_BidderB_PAN_Certificate.pdf',
      documentType: 'PAN',
      mimeType: 'application/pdf',
      fileSize: 39000,
      storagePath: 'storage/demo-documents/10_BidderB_PAN_Certificate.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'PAN: BBBCA9876R, Legal Name: Apex Digital Infrastructure Limited',
      uploadedBy: bidderUserB.id,
    },
  });

  const evB_PAN = await prisma.evidence.create({
    data: {
      documentId: docB_PAN.id,
      requirementId: req2.id,
      extractedValue: 'BBBCA9876R (VALID)',
      normalizedValue: 'VALID',
      pageNumber: 1,
      textSnippet: 'PAN: BBBCA9876R | Name: Apex Digital Infrastructure Limited',
      confidence: 0.99,
      verificationStatus: 'VERIFIED',
    },
  });

  const docB_Fin = await prisma.document.create({
    data: {
      bidId: bidB.id,
      filename: '12_BidderB_Financial_Statement.pdf',
      documentType: 'FINANCIAL_STATEMENT',
      mimeType: 'application/pdf',
      fileSize: 115000,
      storagePath: 'storage/demo-documents/12_BidderB_Financial_Statement.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Average Annual Turnover (Last 3 Years): INR 48.50 Crore',
      uploadedBy: bidderUserB.id,
    },
  });

  const evB_Turnover = await prisma.evidence.create({
    data: {
      documentId: docB_Fin.id,
      requirementId: req3.id,
      extractedValue: 'INR 48.50 Crore',
      normalizedValue: '48.50',
      pageNumber: 1,
      textSnippet: 'Average Annual Turnover (Last 3 Years): INR 48.50 Crore',
      confidence: 0.99,
      verificationStatus: 'VERIFIED',
    },
  });

  const docB_Exp = await prisma.document.create({
    data: {
      bidId: bidB.id,
      filename: '13_BidderB_Experience_Certificate.pdf',
      documentType: 'EXPERIENCE_CERTIFICATE',
      mimeType: 'application/pdf',
      fileSize: 68000,
      storagePath: 'storage/demo-documents/13_BidderB_Experience_Certificate.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Demonstrated Experience: 8 Years (National Oil & Gas Pipeline Grid Project)',
      uploadedBy: bidderUserB.id,
    },
  });

  const evB_Exp = await prisma.evidence.create({
    data: {
      documentId: docB_Exp.id,
      requirementId: req4.id,
      extractedValue: '8.0 Years',
      normalizedValue: '8.0',
      pageNumber: 1,
      textSnippet: 'Contract Period: 2017 to 2025 (8 Years Demonstrated Experience)',
      confidence: 0.98,
      verificationStatus: 'VERIFIED',
    },
  });

  const docB_OEM = await prisma.document.create({
    data: {
      bidId: bidB.id,
      filename: '14_BidderB_OEM_Authorization.pdf',
      documentType: 'OEM_AUTHORIZATION',
      mimeType: 'application/pdf',
      fileSize: 47000,
      storagePath: 'storage/demo-documents/14_BidderB_OEM_Authorization.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'OEM Authorization Ref OEM/APEX/2026/9941 issued by Global Hardware Tech Inc.',
      uploadedBy: bidderUserB.id,
    },
  });

  const evB_OEM = await prisma.evidence.create({
    data: {
      documentId: docB_OEM.id,
      requirementId: req5.id,
      extractedValue: 'Valid OEM Authorization (OEM/APEX/2026/9941)',
      normalizedValue: 'PRESENT',
      pageNumber: 1,
      textSnippet: 'Authorization Ref: OEM/APEX/2026/9941 | Global Hardware Technologies Inc.',
      confidence: 0.98,
      verificationStatus: 'VERIFIED',
    },
  });

  const docB_ISO = await prisma.document.create({
    data: {
      bidId: bidB.id,
      filename: '15_BidderB_ISO9001_Certificate.pdf',
      documentType: 'ISO_CERTIFICATE',
      mimeType: 'application/pdf',
      fileSize: 51000,
      storagePath: 'storage/demo-documents/15_BidderB_ISO9001_Certificate.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'ISO 9001:2015 Certificate ISO-9001-2025-APX1002 valid until June 2029',
      uploadedBy: bidderUserB.id,
    },
  });

  const evB_ISO = await prisma.evidence.create({
    data: {
      documentId: docB_ISO.id,
      requirementId: req6.id,
      extractedValue: 'ISO 9001:2015 Certified',
      normalizedValue: 'VALID',
      pageNumber: 1,
      textSnippet: 'Certificate Number: ISO-9001-2025-APX1002 | Valid Until: 2029-06-30',
      confidence: 0.99,
      verificationStatus: 'VERIFIED',
    },
  });

  const docB_Local = await prisma.document.create({
    data: {
      bidId: bidB.id,
      filename: '16_BidderB_Local_Content_Declaration.pdf',
      documentType: 'LOCAL_CONTENT_DECLARATION',
      mimeType: 'application/pdf',
      fileSize: 42000,
      storagePath: 'storage/demo-documents/16_BidderB_Local_Content_Declaration.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Declared Local Content: 68.5% (Class-I Local Supplier)',
      uploadedBy: bidderUserB.id,
    },
  });

  const evB_Local = await prisma.evidence.create({
    data: {
      documentId: docB_Local.id,
      requirementId: req7.id,
      extractedValue: '68.5%',
      normalizedValue: '68.5',
      pageNumber: 1,
      textSnippet: 'Declared Local Content Percentage: 68.5%',
      confidence: 0.99,
      verificationStatus: 'VERIFIED',
    },
  });

  const docB_Udyam = await prisma.document.create({
    data: {
      bidId: bidB.id,
      filename: '11_BidderB_Udyam_Certificate.pdf',
      documentType: 'UDYAM',
      mimeType: 'application/pdf',
      fileSize: 49000,
      storagePath: 'storage/demo-documents/11_BidderB_Udyam_Certificate.pdf',
      processingStatus: 'PROCESSED',
      extractedText: 'Udyam Registration: UDYAM-DL-01-0098765 Medium Enterprise',
      uploadedBy: bidderUserB.id,
    },
  });

  const evB_Udyam = await prisma.evidence.create({
    data: {
      documentId: docB_Udyam.id,
      requirementId: req8.id,
      extractedValue: 'UDYAM-DL-01-0098765',
      normalizedValue: 'VALID',
      pageNumber: 1,
      textSnippet: 'Udyam Registration Number: UDYAM-DL-01-0098765',
      confidence: 0.98,
      verificationStatus: 'VERIFIED',
    },
  });

  // Seed Compliance Results for Bid B (Apex Digital)
  await prisma.complianceResult.createMany({
    data: [
      { bidId: bidB.id, requirementId: req1.id, status: 'COMPLIANT', score: 100.0, reason: 'Active GST registration 07BBBCA9876R1Z2 verified.', evidenceId: evB_GST.id, aiExplanation: 'Active GST profile confirmed on portal.' },
      { bidId: bidB.id, requirementId: req2.id, status: 'COMPLIANT', score: 100.0, reason: 'Valid PAN BBBCA9876R verified.', evidenceId: evB_PAN.id, aiExplanation: 'PAN registration matches corporate entity.' },
      { bidId: bidB.id, requirementId: req3.id, status: 'COMPLIANT', score: 100.0, reason: 'Average turnover of ₹48.50 Cr far exceeds ₹10.0 Cr threshold.', evidenceId: evB_Turnover.id, aiExplanation: 'Audited CA turnover certificate confirms robust revenue trajectory.' },
      { bidId: bidB.id, requirementId: req4.id, status: 'COMPLIANT', score: 100.0, reason: 'Demonstrated experience of 8 years exceeds 5 years requirement.', evidenceId: evB_Exp.id, aiExplanation: 'National Oil Pipeline Grid project certificate confirms 8 years of successful IT operations.' },
      { bidId: bidB.id, requirementId: req5.id, status: 'COMPLIANT', score: 100.0, reason: 'Valid OEM Authorization OEM/APEX/2026/9941 present.', evidenceId: evB_OEM.id, aiExplanation: 'Official Global Hardware Tech Inc OEM authorization submitted.' },
      { bidId: bidB.id, requirementId: req6.id, status: 'COMPLIANT', score: 100.0, reason: 'Valid ISO 9001:2015 quality certificate unexpired.', evidenceId: evB_ISO.id, aiExplanation: 'Active ISO quality management certification verified.' },
      { bidId: bidB.id, requirementId: req7.id, status: 'COMPLIANT', score: 100.0, reason: 'Declared local content of 68.5% exceeds 50% Class-I threshold.', evidenceId: evB_Local.id, aiExplanation: 'Class-I Local Supplier declaration fully compliant with Make in India rules.' },
      { bidId: bidB.id, requirementId: req8.id, status: 'COMPLIANT', score: 100.0, reason: 'Valid MSME Udyam UDYAM-DL-01-0098765 verified.', evidenceId: evB_Udyam.id, aiExplanation: 'Medium enterprise MSME status verified.' },
    ],
  });

  // Seed Verification Results
  await prisma.verificationResult.createMany({
    data: [
      { evidenceId: evA_GST.id, provider: 'GST', referenceNumber: '27AAACN1234Q1Z5', status: 'VERIFIED', responseSummary: '{"legalName":"NovaTech Systems Private Limited","status":"ACTIVE","taxpayerType":"Regular","demo":true}' },
      { evidenceId: evA_PAN.id, provider: 'PAN', referenceNumber: 'AAACN1234Q', status: 'VERIFIED', responseSummary: '{"name":"NovaTech Systems Private Limited","status":"VALID","category":"Company","demo":true}' },
      { evidenceId: evA_Udyam.id, provider: 'UDYAM', referenceNumber: 'UDYAM-MH-03-0012345', status: 'VERIFIED', responseSummary: '{"enterpriseName":"NovaTech Systems Private Limited","category":"Small","status":"ACTIVE","demo":true}' },
      { evidenceId: evB_GST.id, provider: 'GST', referenceNumber: '07BBBCA9876R1Z2', status: 'VERIFIED', responseSummary: '{"legalName":"Apex Digital Infrastructure Limited","status":"ACTIVE","taxpayerType":"Regular","demo":true}' },
      { evidenceId: evB_PAN.id, provider: 'PAN', referenceNumber: 'BBBCA9876R', status: 'VERIFIED', responseSummary: '{"name":"Apex Digital Infrastructure Limited","status":"VALID","category":"Public Limited","demo":true}' },
    ],
  });

  // Seed Audit Logs
  await prisma.auditLog.createMany({
    data: [
      { userId: officerUser.id, userName: officerUser.name, action: 'TENDER_CREATE', entityType: 'TENDER', entityId: tender.id, metadata: '{"tenderNumber":"GEM-DEMO-2026-IT-001","title":"Enterprise Cloud & IT Infrastructure Modernization"}' },
      { userId: officerUser.id, userName: officerUser.name, action: 'AI_REQUIREMENT_EXTRACTION', entityType: 'TENDER', entityId: tender.id, metadata: '{"extractedCount":8,"confidence":0.96}' },
      { userId: bidderUserA.id, userName: bidderUserA.name, action: 'BID_SUBMIT', entityType: 'BID', entityId: bidA.id, metadata: '{"bidder":"NovaTech Systems Private Limited","documentsCount":8}' },
      { userId: officerUser.id, userName: officerUser.name, action: 'AI_COMPLIANCE_RUN', entityType: 'BID', entityId: bidA.id, metadata: '{"complianceScore":68.5,"riskScore":58.0,"riskLevel":"MEDIUM"}' },
      { userId: officerUser.id, userName: officerUser.name, action: 'CONTRADICTION_DETECTED', entityType: 'BID', entityId: bidA.id, metadata: '{"inconsistency":"Company Est. 2018 vs Relevant Experience 3 years"}' },
      { userId: bidderUserB.id, userName: bidderUserB.name, action: 'BID_SUBMIT', entityType: 'BID', entityId: bidB.id, metadata: '{"bidder":"Apex Digital Infrastructure Limited","documentsCount":8}' },
      { userId: officerUser.id, userName: officerUser.name, action: 'AI_COMPLIANCE_RUN', entityType: 'BID', entityId: bidB.id, metadata: '{"complianceScore":98.0,"riskScore":12.0,"riskLevel":"LOW"}' },
    ],
  });

  // Seed Default Rule Settings
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

  console.log('BidShield AI database successfully seeded!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
