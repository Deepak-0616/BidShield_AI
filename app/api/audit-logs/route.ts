import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || '';
    const entityType = searchParams.get('entityType') || '';

    const where: any = {};
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: {
          select: { name: true, email: true, role: true },
        },
      },
    });

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
