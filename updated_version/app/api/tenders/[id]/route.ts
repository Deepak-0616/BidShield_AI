import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tender = await prisma.tender.findUnique({
      where: { id: params.id },
      include: {
        department: true,
        requirements: {
          orderBy: { requirementCode: 'asc' },
        },
        bids: {
          include: {
            documents: true,
            _count: { select: { complianceResults: true } },
          },
        },
        creator: {
          select: { name: true, email: true },
        },
      },
    });

    if (!tender) {
      return NextResponse.json({ success: false, error: { message: 'Tender not found' } }, { status: 404 });
    }

    return NextResponse.json({ success: true, tender });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
