import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenderId = searchParams.get('tenderId');
    const riskLevel = searchParams.get('riskLevel');

    const where: any = {};
    if (tenderId && tenderId !== 'ALL') where.tenderId = tenderId;
    if (riskLevel && riskLevel !== 'ALL') where.riskLevel = riskLevel;

    const bids = await prisma.bid.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
      include: {
        tender: {
          select: { title: true, tenderNumber: true, category: true },
        },
        documents: {
          select: { id: true, filename: true, documentType: true, processingStatus: true },
        },
        _count: { select: { complianceResults: true } },
      },
    });

    return NextResponse.json({ success: true, bids });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
