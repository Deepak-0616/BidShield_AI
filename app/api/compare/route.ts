import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { bidIds, tenderId } = body;

    const where: any = {};
    if (tenderId && tenderId !== 'ALL') {
      where.tenderId = tenderId;
    }
    if (bidIds && Array.isArray(bidIds) && bidIds.length > 0) {
      where.id = { in: bidIds };
    }

    const bids = await prisma.bid.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
      include: {
        tender: {
          include: {
            requirements: { orderBy: { requirementCode: 'asc' } },
          },
        },
        complianceResults: {
          include: { requirement: true },
        },
        documents: true,
      },
    });

    return NextResponse.json({ success: true, count: bids.length, bids });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
