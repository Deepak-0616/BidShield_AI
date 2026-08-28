import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { broadcastRealtimeEvent } from '@/lib/events';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const requirements = await prisma.requirement.findMany({
      where: { tenderId: params.id },
      orderBy: { requirementCode: 'asc' },
    });
    return NextResponse.json({ success: true, requirements });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(req);
    if (!session || (session.role !== 'PROCUREMENT_OFFICER' && session.role !== 'ADMIN')) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, category, mandatory, threshold, thresholdUnit, ruleType } = body;

    const count = await prisma.requirement.count({ where: { tenderId: params.id } });
    const reqCode = `R${count + 1}`;

    const requirement = await prisma.requirement.create({
      data: {
        tenderId: params.id,
        requirementCode: reqCode,
        title,
        description,
        category: category || 'TECHNICAL',
        mandatory: mandatory !== undefined ? Boolean(mandatory) : true,
        threshold: threshold || null,
        thresholdUnit: thresholdUnit || null,
        ruleType: ruleType || 'MATCH_EXACT',
        confidence: 1.0,
      },
    });

    broadcastRealtimeEvent('TENDER_CREATED', {
      tenderId: params.id,
      requirementId: requirement.id,
    });

    return NextResponse.json({ success: true, requirement });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
