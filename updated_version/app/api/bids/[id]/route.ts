import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bid = await prisma.bid.findUnique({
      where: { id: params.id },
      include: {
        tender: {
          include: {
            requirements: { orderBy: { requirementCode: 'asc' } },
            department: true,
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
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
