import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const activeTendersCount = await prisma.tender.count();
    const totalBidsCount = await prisma.bid.count();
    const bidsUnderReviewCount = await prisma.bid.count({
      where: { finalReviewStatus: 'UNDER_REVIEW' },
    });
    const approvedBidsCount = await prisma.bid.count({
      where: { finalReviewStatus: 'APPROVED' },
    });
    const rejectedBidsCount = await prisma.bid.count({
      where: { finalReviewStatus: 'REJECTED' },
    });
    const highRiskBidsCount = await prisma.bid.count({
      where: { riskLevel: 'HIGH' },
    });

    const officersCount = await prisma.user.count({
      where: { role: 'PROCUREMENT_OFFICER' },
    });
    const biddersCount = await prisma.user.count({
      where: { role: 'BIDDER' },
    });
    const verifiedBiddersCount = await prisma.user.count({
      where: { role: 'BIDDER', gstStatus: 'ACTIVE' },
    });

    const now = new Date();
    const allDebarments = await prisma.debarmentRegistry.findMany();
    const activeDebarmentsCount = allDebarments.filter((d) => {
      const from = new Date(d.periodFrom);
      const to = new Date(d.periodTo);
      return now >= from && now <= to;
    }).length;

    const bids = await prisma.bid.findMany();
    const totalBids = bids.length || 1;
    const avgCompliance = bids.reduce((acc, b) => acc + b.complianceScore, 0) / totalBids;

    const pendingReviewsCount = await prisma.complianceResult.count({
      where: { status: { in: ['UNVERIFIED', 'MANUAL_REVIEW', 'PARTIAL'] } },
    });

    const completedAssessmentsCount = await prisma.bid.count({
      where: { status: 'COMPLETED' },
    });

    // Risk distribution calculation
    const lowRiskCount = await prisma.bid.count({ where: { riskLevel: 'LOW' } });
    const mediumRiskCount = await prisma.bid.count({ where: { riskLevel: 'MEDIUM' } });
    const highRiskCount = await prisma.bid.count({ where: { riskLevel: 'HIGH' } });

    // Recent Bids list with tender & bidder profile details
    const recentBids = await prisma.bid.findMany({
      take: 10,
      orderBy: { submittedAt: 'desc' },
      include: {
        bidder: {
          select: { id: true, name: true, gstin: true, gstStatus: true },
        },
        tender: {
          select: {
            id: true,
            tenderNumber: true,
            title: true,
          },
        },
      },
    });

    // Category compliance breakdown dynamically calculated from compliance results
    const complianceResults = await prisma.complianceResult.findMany({
      include: { requirement: true },
    });

    const categoryMap: Record<string, { total: number; compliant: number }> = {
      LEGAL: { total: 0, compliant: 0 },
      FINANCIAL: { total: 0, compliant: 0 },
      TECHNICAL: { total: 0, compliant: 0 },
      EXPERIENCE: { total: 0, compliant: 0 },
      LOCAL_CONTENT: { total: 0, compliant: 0 },
      CERTIFICATION: { total: 0, compliant: 0 },
    };

    complianceResults.forEach((cr) => {
      const cat = cr.requirement?.category || 'LEGAL';
      if (!categoryMap[cat]) categoryMap[cat] = { total: 0, compliant: 0 };
      categoryMap[cat].total += 1;
      if (cr.status === 'COMPLIANT') {
        categoryMap[cat].compliant += 1;
      }
    });

    const complianceOverview = Object.entries(categoryMap).map(([catKey, stats]) => {
      const label = catKey
        .replace('_', ' ')
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase());
      const passRate = stats.total > 0 ? Math.round((stats.compliant / stats.total) * 100) : 100;
      return {
        category: label,
        compliant: passRate,
        threshold: 100,
        totalEvaluated: stats.total,
        passedCount: stats.compliant,
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        activeTenders: activeTendersCount,
        totalBids: totalBidsCount,
        bidsUnderReview: bidsUnderReviewCount,
        approvedBids: approvedBidsCount,
        rejectedBids: rejectedBidsCount,
        highRiskBids: highRiskBidsCount,
        averageCompliance: Math.round(avgCompliance * 10) / 10,
        pendingReviews: pendingReviewsCount,
        completedAssessments: completedAssessmentsCount,
        officersCount,
        biddersCount,
        verifiedBiddersCount,
        activeDebarmentsCount,
        totalDebarmentsCount: allDebarments.length,
      },
      riskDistribution: [
        { name: 'Low Risk', value: lowRiskCount, color: '#138A4B' },
        { name: 'Medium Risk', value: mediumRiskCount, color: '#D98200' },
        { name: 'High Risk', value: highRiskCount, color: '#C62828' },
      ],
      complianceOverview,
      recentBids,
    });
  } catch (error: any) {
    console.error('Dashboard summary API error:', error);
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
