import { prisma } from './db';

export interface DebarmentCheckResult {
  hasActiveDebarment: boolean;
  activeMatches: any[];
  historicalMatches: any[];
  totalMatchesCount: number;
  standingStatus: 'CLEAR' | 'DEBARRED_ACTIVE' | 'HISTORICAL_RECORD';
  warningMessage?: string;
}

export async function checkDebarmentStatus(params: {
  pan?: string | null;
  firmName?: string | null;
}): Promise<DebarmentCheckResult> {
  const { pan, firmName } = params;
  const now = new Date();

  const conditions: any[] = [];
  if (pan && pan.trim().length >= 5) {
    conditions.push({ panNumber: pan.trim().toUpperCase() });
  }

  if (firmName && firmName.trim().length >= 3) {
    const cleanName = firmName.trim();
    conditions.push({
      firmName: { contains: cleanName },
    });
  }

  if (conditions.length === 0) {
    return {
      hasActiveDebarment: false,
      activeMatches: [],
      historicalMatches: [],
      totalMatchesCount: 0,
      standingStatus: 'CLEAR',
    };
  }

  const allMatches = await prisma.debarmentRegistry.findMany({
    where: { OR: conditions },
    orderBy: { periodTo: 'desc' },
  });

  const activeMatches = allMatches.filter((record) => {
    const from = new Date(record.periodFrom);
    const to = new Date(record.periodTo);
    return now >= from && now <= to;
  });

  const historicalMatches = allMatches.filter((record) => {
    const to = new Date(record.periodTo);
    return now > to;
  });

  let standingStatus: 'CLEAR' | 'DEBARRED_ACTIVE' | 'HISTORICAL_RECORD' = 'CLEAR';
  let warningMessage: string | undefined = undefined;

  if (activeMatches.length > 0) {
    standingStatus = 'DEBARRED_ACTIVE';
    warningMessage = `CRITICAL STATUTORY BLOCK: Entity matches active debarment order ${activeMatches[0].orderNumber || ''} issued by ${activeMatches[0].debarringAuthority}. Active through ${new Date(activeMatches[0].periodTo).toLocaleDateString()}.`;
  } else if (historicalMatches.length > 0) {
    standingStatus = 'HISTORICAL_RECORD';
    warningMessage = `Advisory Note: Entity has ${historicalMatches.length} historical/expired debarment record(s) on file. Period expired on ${new Date(historicalMatches[0].periodTo).toLocaleDateString()}. Not actively blocked.`;
  }

  return {
    hasActiveDebarment: activeMatches.length > 0,
    activeMatches,
    historicalMatches,
    totalMatchesCount: allMatches.length,
    standingStatus,
    warningMessage,
  };
}
