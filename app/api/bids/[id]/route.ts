import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { checkDebarmentStatus } from '@/lib/debarment-check';
import { createAuditLog } from '@/lib/audit';
import { broadcastRealtimeEvent } from '@/lib/events';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bid = await prisma.bid.findUnique({
      where: { id: params.id },
      include: {
        bidder: {
          select: {
            id: true,
            name: true,
            email: true,
            gstin: true,
            pan: true,
            companyName: true,
            legalName: true,
            tradeName: true,
            gstStatus: true,
            gstVerifiedAt: true,
            address: true,
          },
        },
        tender: {
          include: {
            requirements: { orderBy: { requirementCode: 'asc' } },
            department: true,
            creator: { select: { id: true, name: true, email: true, role: true } },
          },
        },
        documents: {
          include: { evidences: true },
        },
        complianceResults: {
          include: {
            requirement: true,
            evidence: {
              include: { document: true, verificationResults: true },
            },
          },
        },
      },
    });

    if (!bid) {
      return NextResponse.json({ success: false, error: { message: 'Bid not found' } }, { status: 404 });
    }

    // Perform live Debarment Registry Check against bidder's PAN & legal/firm name
    const debarmentStatus = await checkDebarmentStatus({
      pan: bid.bidder?.pan || null,
      firmName: bid.bidderName || bid.bidder?.companyName || null,
    });

    // Category breakdown
    const categories = ['LEGAL', 'FINANCIAL', 'TECHNICAL', 'EXPERIENCE', 'DOCUMENTATION', 'CERTIFICATION', 'LOCAL_CONTENT'];
    const categoryScores: Record<string, { total: number; passed: number; scorePercent: number }> = {};

    categories.forEach((cat) => {
      categoryScores[cat] = { total: 0, passed: 0, scorePercent: 100 };
    });

    bid.complianceResults.forEach((cr) => {
      const cat = cr.requirement.category;
      if (!categoryScores[cat]) {
        categoryScores[cat] = { total: 0, passed: 0, scorePercent: 100 };
      }
      categoryScores[cat].total += 1;
      if (cr.status === 'COMPLIANT') {
        categoryScores[cat].passed += 1;
      }
    });

    Object.keys(categoryScores).forEach((cat) => {
      const item = categoryScores[cat];
      item.scorePercent = item.total > 0 ? Math.round((item.passed / item.total) * 100) : 100;
    });

    return NextResponse.json({
      success: true,
      bid,
      categoryScores,
      debarmentStatus,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(req);
    if (!session || (session.role !== 'AUDITOR' && session.role !== 'ADMIN')) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Unauthorized: Final approval decisions belong exclusively to Auditor or Admin workflow.' },
        },
        { status: 403 }
      );
    }

    const { finalReviewStatus, reviewComments, overrideReason } = await req.json();

    if (!['APPROVED', 'REJECTED', 'CLARIFICATION_REQUESTED', 'UNDER_REVIEW'].includes(finalReviewStatus)) {
      return NextResponse.json({ success: false, error: { message: 'Invalid final review status' } }, { status: 400 });
    }

    const currentBid = await prisma.bid.findUnique({
      where: { id: params.id },
      include: { bidder: true },
    });

    if (!currentBid) {
      return NextResponse.json({ success: false, error: { message: 'Bid not found' } }, { status: 404 });
    }

    // If approving, verify there is no active debarment match
    if (finalReviewStatus === 'APPROVED') {
      const debarment = await checkDebarmentStatus({
        pan: currentBid.bidder?.pan || null,
        firmName: currentBid.bidderName || currentBid.bidder?.companyName || null,
      });

      if (debarment.hasActiveDebarment && !overrideReason) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message:
                'Statutory Block: Cannot approve a bid with an ACTIVE statutory debarment match unless an explicit Auditor statutory override justification is provided.',
              debarmentMatches: debarment.activeMatches,
            },
          },
          { status: 422 }
        );
      }
    }

    const updatedBid = await prisma.bid.update({
      where: { id: params.id },
      data: {
        finalReviewStatus,
        status: finalReviewStatus === 'APPROVED' ? 'COMPLETED' : finalReviewStatus === 'REJECTED' ? 'REJECTED' : 'UNDER_REVIEW',
      },
    });

    broadcastRealtimeEvent('BID_UPDATED', {
      bidId: updatedBid.id,
      finalReviewStatus: updatedBid.finalReviewStatus,
      status: updatedBid.status,
    });

    await createAuditLog({
      userId: session.userId,
      userName: session.name,
      action: `AUDIT_DECISION_${finalReviewStatus}`,
      entityType: 'BID',
      entityId: params.id,
      metadata: {
        previousStatus: currentBid.finalReviewStatus,
        newStatus: finalReviewStatus,
        comments: reviewComments || 'No comments provided',
        overrideReason: overrideReason || null,
      },
    });

    return NextResponse.json({
      success: true,
      bid: updatedBid,
      message: `Audit decision recorded: ${finalReviewStatus}`,
    });
  } catch (error: any) {
    console.error('Bid PATCH audit decision error:', error);
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
