import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || searchParams.get('q') || searchParams.get('query') || '').trim();
    const pan = (searchParams.get('pan') || '').trim().toUpperCase();
    const firmName = (searchParams.get('firmName') || searchParams.get('name') || '').trim();
    const statusFilter = (searchParams.get('status') || 'ALL').trim().toUpperCase(); // ALL, ACTIVE, EXPIRED

    const where: any = {};

    if (pan) {
      where.panNumber = { contains: pan };
    }

    if (firmName) {
      where.firmName = { contains: firmName };
    }

    if (search && !pan && !firmName) {
      where.OR = [
        { firmName: { contains: search } },
        { panNumber: { contains: search.toUpperCase() } },
        { vendorCode: { contains: search } },
        { debarringAuthority: { contains: search } },
        { orderNumber: { contains: search } },
        { reason: { contains: search } },
      ];
    }

    const rawRecords = await prisma.debarmentRegistry.findMany({
      where,
      orderBy: { periodTo: 'desc' },
    });

    const now = new Date();

    const processedRecords = rawRecords.map((record) => {
      const from = new Date(record.periodFrom);
      const to = new Date(record.periodTo);
      const isCurrentlyActive = from <= now && now <= to;
      const isUpcoming = from > now;
      const isExpired = to < now;

      let standingStatus: 'ACTIVE_DEBARMENT' | 'UPCOMING_DEBARMENT' | 'EXPIRED_DEBARMENT' = 'EXPIRED_DEBARMENT';
      if (isCurrentlyActive) standingStatus = 'ACTIVE_DEBARMENT';
      else if (isUpcoming) standingStatus = 'UPCOMING_DEBARMENT';

      const daysRemaining = isCurrentlyActive
        ? Math.max(0, Math.ceil((to.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

      return {
        id: record.id,
        firmName: record.firmName,
        panNumber: record.panNumber,
        vendorCode: record.vendorCode,
        debarringAuthority: record.debarringAuthority,
        orderNumber: record.orderNumber,
        orderDate: record.orderDate,
        periodFrom: record.periodFrom,
        periodTo: record.periodTo,
        reason: record.reason,
        debarmentScope: record.debarmentScope,
        sourceUrl: record.sourceUrl,
        sourceType: record.sourceType,
        isCurrentlyActive,
        isUpcoming,
        isExpired,
        standingStatus,
        daysRemaining,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      };
    });

    let filteredRecords = processedRecords;
    if (statusFilter === 'ACTIVE') {
      filteredRecords = processedRecords.filter((r) => r.isCurrentlyActive);
    } else if (statusFilter === 'EXPIRED') {
      filteredRecords = processedRecords.filter((r) => r.isExpired);
    }

    const activeCount = processedRecords.filter((r) => r.isCurrentlyActive).length;

    return NextResponse.json({
      success: true,
      count: filteredRecords.length,
      totalMatches: processedRecords.length,
      activeDebarmentsCount: activeCount,
      records: filteredRecords,
      sourceRegistry: 'Statutory Debarment Registry (CPPP / DoE Framework)',
      timestamp: now.toISOString(),
    });
  } catch (error: any) {
    console.error('Debarment registry GET error:', error);
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to query debarment registry.' } },
      { status: 500 }
    );
  }
}
