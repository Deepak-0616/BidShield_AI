import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';
    const createdBy = searchParams.get('createdBy');
    const viewAll = searchParams.get('all') === 'true';

    const where: any = {};

    // Role-based visibility:
    // If logged in as PROCUREMENT_OFFICER (and not explicitly requesting public catalog as bidder/auditor),
    // show only tenders created by this officer.
    if (session?.role === 'PROCUREMENT_OFFICER' && !viewAll) {
      where.createdBy = session.userId;
    } else if (createdBy) {
      where.createdBy = createdBy;
    }

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
        creator: {
          select: { id: true, name: true, email: true, role: true },
        },
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
      return NextResponse.json({ success: false, error: { message: 'Unauthorized: Only Procurement Officers can create tenders.' } }, { status: 403 });
    }

    const body = await req.json();
    const {
      tenderNumber,
      title,
      departmentId,
      category,
      description,
      estimatedValue,
      submissionDeadline,
      requirements,
    } = body;

    if (!title || !description) {
      return NextResponse.json({ success: false, error: { message: 'Title and description are required.' } }, { status: 400 });
    }

    let resolvedDepartmentId = departmentId;
    if (!resolvedDepartmentId) {
      const officer = await prisma.user.findUnique({
        where: { id: session.userId },
        include: { department: true },
      });
      resolvedDepartmentId = officer?.departmentId;
    }

    if (!resolvedDepartmentId) {
      const defaultDept = await prisma.department.findFirst();
      resolvedDepartmentId = defaultDept?.id;
    }

    const generatedTenderNumber = tenderNumber || `GEM-${new Date().getFullYear()}-${category ? category.substring(0, 3).toUpperCase() : 'GEN'}-${Date.now().toString().slice(-4)}`;

    const tender = await prisma.tender.create({
      data: {
        tenderNumber: generatedTenderNumber,
        title: title.trim(),
        departmentId: resolvedDepartmentId!,
        category: category || 'General Goods & Services',
        description: description.trim(),
        estimatedValue: parseFloat(estimatedValue) || 10000000.0,
        submissionDeadline: new Date(submissionDeadline || Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'OPEN',
        createdBy: session.userId,
      },
    });

    // Populate requirements (custom from request or standard baseline)
    const reqList = Array.isArray(requirements) && requirements.length > 0
      ? requirements.map((r, idx) => ({
          requirementCode: r.requirementCode || `REQ-${idx + 1}`,
          title: r.title || `Requirement ${idx + 1}`,
          description: r.description || '',
          category: r.category || 'TECHNICAL',
          mandatory: r.mandatory !== false,
          threshold: r.threshold ? String(r.threshold) : null,
          thresholdUnit: r.thresholdUnit || null,
          sourcePage: r.sourcePage || 1,
          sourceSection: r.sourceSection || 'Section 1.0',
          confidence: r.confidence || 0.95,
          ruleType: r.ruleType || 'THRESHOLD',
          tenderId: tender.id,
        }))
      : [
          { requirementCode: 'R1', title: 'GST Registration', description: 'Bidder must possess valid Goods and Services Tax (GST) registration.', category: 'LEGAL', mandatory: true, threshold: 'ACTIVE', thresholdUnit: 'Status', sourcePage: 1, sourceSection: 'Section 1.1', confidence: 0.98, ruleType: 'MATCH_EXACT', tenderId: tender.id },
          { requirementCode: 'R2', title: 'PAN Registration', description: 'Bidder must possess valid Permanent Account Number (PAN).', category: 'LEGAL', mandatory: true, threshold: 'VALID', thresholdUnit: 'Status', sourcePage: 1, sourceSection: 'Section 1.2', confidence: 0.98, ruleType: 'MATCH_EXACT', tenderId: tender.id },
          { requirementCode: 'R3', title: 'Annual Turnover', description: 'Average annual financial turnover requirement.', category: 'FINANCIAL', mandatory: true, threshold: '5.0', thresholdUnit: 'Crore INR', sourcePage: 1, sourceSection: 'Section 2.1', confidence: 0.95, ruleType: 'GREATER_THAN_EQUAL', tenderId: tender.id },
          { requirementCode: 'R4', title: 'Relevant Experience', description: 'Minimum years of domain experience.', category: 'EXPERIENCE', mandatory: true, threshold: '3.0', thresholdUnit: 'Years', sourcePage: 1, sourceSection: 'Section 3.1', confidence: 0.92, ruleType: 'GREATER_THAN_EQUAL', tenderId: tender.id },
          { requirementCode: 'R5', title: 'Make in India Local Content', description: 'Minimum local content declaration under DPIIT guidelines.', category: 'LOCAL_CONTENT', mandatory: true, threshold: '50.0', thresholdUnit: 'Percentage (%)', sourcePage: 2, sourceSection: 'Section 4.1', confidence: 0.97, ruleType: 'GREATER_THAN_EQUAL', tenderId: tender.id },
        ];

    await prisma.requirement.createMany({
      data: reqList,
    });

    await createAuditLog({
      userId: session.userId,
      userName: session.name,
      action: 'TENDER_CREATE',
      entityType: 'TENDER',
      entityId: tender.id,
      metadata: { tenderNumber: tender.tenderNumber, title: tender.title, requirementsCount: reqList.length },
    });

    return NextResponse.json({ success: true, tender });
  } catch (error: any) {
    console.error('Tender creation error:', error);
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
