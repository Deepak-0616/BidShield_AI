import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const activeTendersCount = await prisma.tender.count({
      where: { status: { in: ['OPEN', 'UNDER_REVIEW', 'ANALYZING'] } },
    });

    const bidsUnderReviewCount = await prisma.bid.count({
      where: { status: 'UNDER_REVIEW' },
    });

    const highRiskBidsCount = await prisma.bid.count({
      where: { riskLevel: 'HIGH' },
    });

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

    // Recent Bids list
    const recentBids = await prisma.bid.findMany({
      take: 10,
      orderBy: { submittedAt: 'desc' },
      include: {
        tender: {
          select: {
            id: true,
            tenderNumber: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      stats: {
        activeTenders: activeTendersCount,
        bidsUnderReview: bidsUnderReviewCount,
        highRiskBids: highRiskBidsCount,
        averageCompliance: Math.round(avgCompliance * 10) / 10,
        pendingReviews: pendingReviewsCount,
        completedAssessments: completedAssessmentsCount,
      },
      riskDistribution: [
        { name: 'Low Risk', value: lowRiskCount, color: '#138A4B' },
        { name: 'Medium Risk', value: mediumRiskCount, color: '#D98200' },
        { name: 'High Risk', value: highRiskCount, color: '#C62828' },
      ],
      complianceOverview: [
        { category: 'Legal', compliant: 100, threshold: 100 },
        { category: 'Financial', compliant: 100, threshold: 100 },
        { category: 'Technical', compliant: 50, threshold: 100 },
        { category: 'Experience', compliant: 50, threshold: 100 },
        { category: 'Local Content', compliant: 50, threshold: 100 },
      ],
      recentBids: recentBids.map((b) => ({
        id: b.id,
        bidderName: b.bidderName,
        tenderTitle: b.tender.title,
        tenderNumber: b.tender.tenderNumber,
        complianceScore: b.complianceScore,
        riskScore: b.riskScore,
        riskLevel: b.riskLevel,
        status: b.status,
        submittedAt: b.submittedAt,
      })),
    });
  } catch (error: any) {
    console.error('Dashboard summary error:', error);
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
