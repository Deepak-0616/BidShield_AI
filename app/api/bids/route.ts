import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { broadcastRealtimeEvent } from '@/lib/events';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const { searchParams } = new URL(req.url);
    const tenderId = searchParams.get('tenderId');
    const riskLevel = searchParams.get('riskLevel');
    const bidderId = searchParams.get('bidderId');
    const viewAll = searchParams.get('all') === 'true';

    const where: any = {};
    if (tenderId && tenderId !== 'ALL') where.tenderId = tenderId;
    if (riskLevel && riskLevel !== 'ALL') where.riskLevel = riskLevel;

    // Role-based filtering:
    // 1. Bidder: only sees their own bids
    if (session?.role === 'BIDDER') {
      where.bidderId = session.userId;
    } else if (bidderId) {
      where.bidderId = bidderId;
    }

    // 2. Officer: only sees bids for tenders created by that officer (unless viewAll is explicitly set by admin)
    if (session?.role === 'PROCUREMENT_OFFICER' && !viewAll) {
      where.tender = {
        createdBy: session.userId,
      };
    }

    const bids = await prisma.bid.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
      include: {
        bidder: {
          select: {
            id: true,
            name: true,
            email: true,
            gstin: true,
            pan: true,
            companyName: true,
            gstStatus: true,
          },
        },
        tender: {
          select: {
            id: true,
            title: true,
            tenderNumber: true,
            category: true,
            estimatedValue: true,
            submissionDeadline: true,
            status: true,
            createdBy: true,
          },
        },
        documents: {
          select: {
            id: true,
            filename: true,
            documentType: true,
            processingStatus: true,
            fileSize: true,
            createdAt: true,
          },
        },
        complianceResults: {
          include: {
            requirement: {
              select: {
                id: true,
                requirementCode: true,
                title: true,
                category: true,
                mandatory: true,
              },
            },
          },
        },
        _count: { select: { complianceResults: true, documents: true } },
      },
    });

    return NextResponse.json({ success: true, count: bids.length, bids });
  } catch (error: any) {
    console.error('Bids GET error:', error);
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    const body = await req.json();
    const { tenderId, bidderName } = body;

    const effectiveBidderId = body.bidderId || session?.userId;
    if (!effectiveBidderId || !tenderId) {
      return NextResponse.json(
        { success: false, error: { message: 'tenderId and bidderId are required' } },
        { status: 400 }
      );
    }

    const effectiveBidderName = bidderName || session?.name || 'Registered Bidder';

    // Check if bid already exists for this tender and bidder
    const existing = await prisma.bid.findFirst({
      where: { tenderId, bidderId: effectiveBidderId },
      include: {
        documents: true,
        complianceResults: { include: { requirement: true } },
      },
    });

    if (existing) {
      return NextResponse.json({ success: true, bid: existing, message: 'Existing bid loaded' });
    }

    const newBid = await prisma.bid.create({
      data: {
        tenderId,
        bidderId: effectiveBidderId,
        bidderName: effectiveBidderName,
        status: 'DRAFT',
        complianceScore: 0.0,
        riskScore: 0.0,
        riskLevel: 'LOW',
        finalReviewStatus: 'UNDER_REVIEW',
      },
      include: {
        documents: true,
        complianceResults: true,
      },
    });

    broadcastRealtimeEvent('BID_CREATED', {
      bidId: newBid.id,
      tenderId: newBid.tenderId,
      bidderName: newBid.bidderName,
      status: newBid.status,
    });

    return NextResponse.json({ success: true, bid: newBid, message: 'Draft bid initialized' });
  } catch (error: any) {
    console.error('Bid POST error:', error);
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
