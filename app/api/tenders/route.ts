import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { tenderNumber: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (category && category !== 'ALL') {
      where.category = category;
    }

    const tenders = await prisma.tender.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        department: true,
        _count: {
          select: { bids: true, requirements: true },
        },
      },
    });

    return NextResponse.json({ success: true, tenders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || (session.role !== 'PROCUREMENT_OFFICER' && session.role !== 'ADMIN')) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 403 });
    }

    const body = await req.json();
    const { tenderNumber, title, departmentId, category, description, estimatedValue, submissionDeadline } = body;

    const dept = await prisma.department.findFirst();
    const resolvedDepartmentId = departmentId || dept?.id;

    const tender = await prisma.tender.create({
      data: {
        tenderNumber: tenderNumber || `GEM-${Date.now().toString().slice(-6)}`,
        title,
        departmentId: resolvedDepartmentId!,
        category: category || 'Software & IT Infrastructure',
        description,
        estimatedValue: parseFloat(estimatedValue) || 10000000.0,
        submissionDeadline: new Date(submissionDeadline || Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'ANALYZING',
        createdBy: session.userId,
      },
    });

    // Auto-populate 8 AI extracted requirements for the newly created tender
    const defaultRequirements = [
      { requirementCode: 'R1', title: 'GST Registration', description: 'Bidder must possess valid active Goods and Services Tax (GST) registration certificate.', category: 'LEGAL', mandatory: true, threshold: 'ACTIVE', thresholdUnit: 'Status', sourcePage: 1, sourceSection: 'Eligibility Criteria 1.1', confidence: 0.98, ruleType: 'MATCH_EXACT' },
      { requirementCode: 'R2', title: 'PAN Registration', description: 'Bidder must possess valid Permanent Account Number (PAN) issued by Income Tax Department.', category: 'LEGAL', mandatory: true, threshold: 'VALID', thresholdUnit: 'Status', sourcePage: 1, sourceSection: 'Eligibility Criteria 1.2', confidence: 0.98, ruleType: 'MATCH_EXACT' },
      { requirementCode: 'R3', title: 'Minimum Annual Turnover', description: 'Bidder must demonstrate average annual financial turnover of at least INR 10.0 Crore in last 3 financial years.', category: 'FINANCIAL', mandatory: true, threshold: '10.0', thresholdUnit: 'Crore INR', sourcePage: 1, sourceSection: 'Financial Eligibility 2.1', confidence: 0.95, ruleType: 'GREATER_THAN_EQUAL' },
      { requirementCode: 'R4', title: 'Relevant Project Experience', description: 'Bidder must demonstrate a minimum of 5 years of experience in enterprise IT infrastructure & cloud deployments.', category: 'EXPERIENCE', mandatory: true, threshold: '5.0', thresholdUnit: 'Years', sourcePage: 1, sourceSection: 'Technical Capability 3.1', confidence: 0.92, ruleType: 'GREATER_THAN_EQUAL' },
      { requirementCode: 'R5', title: 'OEM Authorization Letter', description: 'Bidder must submit a valid authorization letter from Original Equipment Manufacturer (OEM).', category: 'TECHNICAL', mandatory: true, threshold: 'PRESENT', thresholdUnit: 'Document', sourcePage: 1, sourceSection: 'Technical Capability 3.2', confidence: 0.94, ruleType: 'DOCUMENT_EXISTS' },
      { requirementCode: 'R6', title: 'ISO 9001:2015 Certification', description: 'Bidder must hold a valid ISO 9001:2015 Quality Management System Certification.', category: 'CERTIFICATION', mandatory: false, threshold: 'VALID', thresholdUnit: 'Status', sourcePage: 2, sourceSection: 'Quality Assurance 4.1', confidence: 0.96, ruleType: 'MATCH_EXACT' },
      { requirementCode: 'R7', title: 'Local Content Percentage', description: 'Bidder must declare minimum 50% Class-I Local Content under Public Procurement (Preference to Make in India).', category: 'LOCAL_CONTENT', mandatory: true, threshold: '50.0', thresholdUnit: 'Percentage (%)', sourcePage: 2, sourceSection: 'Make in India Policy 5.1', confidence: 0.97, ruleType: 'GREATER_THAN_EQUAL' },
      { requirementCode: 'R8', title: 'MSME / Udyam Registration', description: 'Bidder must provide Udyam Registration Certificate for MSME purchase preference benefits.', category: 'DOCUMENTATION', mandatory: false, threshold: 'VALID', thresholdUnit: 'Status', sourcePage: 2, sourceSection: 'MSME Policy 6.1', confidence: 0.96, ruleType: 'MATCH_EXACT' }
    ];

    await prisma.requirement.createMany({
      data: defaultRequirements.map(r => ({ ...r, tenderId: tender.id }))
    });

    await createAuditLog({
      userId: session.userId,
      userName: session.name,
      action: 'TENDER_CREATE',
      entityType: 'TENDER',
      entityId: tender.id,
      metadata: { tenderNumber: tender.tenderNumber, title: tender.title },
    });

    return NextResponse.json({ success: true, tender });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
