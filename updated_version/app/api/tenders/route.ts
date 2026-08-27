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
