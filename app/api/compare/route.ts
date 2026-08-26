import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { bidIds } = await req.json();

    if (!bidIds || !Array.isArray(bidIds) || bidIds.length === 0) {
      // Default to returning all available bids for comparison
      const allBids = await prisma.bid.findMany({
        take: 3,
        include: {
          tender: { include: { requirements: { orderBy: { requirementCode: 'asc' } } } },
          complianceResults: { include: { requirement: true } },
          documents: true,
        },
      });
      return NextResponse.json({ success: true, bids: allBids });
    }

    const bids = await prisma.bid.findMany({
      where: { id: { in: bidIds } },
      include: {
        tender: { include: { requirements: { orderBy: { requirementCode: 'asc' } } } },
        complianceResults: { include: { requirement: true } },
        documents: true,
      },
    });

    return NextResponse.json({ success: true, bids });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
