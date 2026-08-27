import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const rules = await prisma.ruleSetting.findMany({
      orderBy: { category: 'asc' },
    });
    return NextResponse.json({ success: true, rules });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 403 });
    }

    const { rules } = await req.json();

    if (Array.isArray(rules)) {
      for (const r of rules) {
        await prisma.ruleSetting.upsert({
          where: { category: r.category },
          update: {
            weight: parseFloat(r.weight) || 1.0,
            mandatoryImpact: parseFloat(r.mandatoryImpact) || 30.0,
          },
          create: {
            category: r.category,
            weight: parseFloat(r.weight) || 1.0,
            mandatoryImpact: parseFloat(r.mandatoryImpact) || 30.0,
          },
        });
      }

      await createAuditLog({
        userId: session.userId,
        userName: session.name,
        action: 'UPDATE_RULE_SETTINGS',
        entityType: 'RULE_SETTING',
        metadata: { updatedCount: rules.length },
      });
    }

    const updatedRules = await prisma.ruleSetting.findMany({
      orderBy: { category: 'asc' },
    });

    return NextResponse.json({ success: true, rules: updatedRules, message: 'Rules updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
