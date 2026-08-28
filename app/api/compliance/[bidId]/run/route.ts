import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { calculateBidRisk } from '@/lib/risk-engine';
import { createAuditLog } from '@/lib/audit';
import { broadcastRealtimeEvent } from '@/lib/events';

export async function POST(req: NextRequest, { params }: { params: { bidId: string } }) {
  try {
    const session = await getSession(req);
    const bid = await prisma.bid.findUnique({
      where: { id: params.bidId },
      include: {
        tender: {
          include: { requirements: true },
        },
        documents: {
          include: { evidences: true },
        },
      },
    });

    if (!bid) {
      return NextResponse.json({ success: false, error: { message: 'Bid not found' } }, { status: 404 });
    }

    const requirements = bid.tender.requirements;
    const documents = bid.documents;

    let missingCount = 0;
    let nonCompliantCount = 0;
    let partialCount = 0;
    let compliantCount = 0;
    let mandatoryCount = 0;

    for (const req of requirements) {
      if (req.mandatory) mandatoryCount++;

      // Check if evidence exists for requirement
      const matchingEvidence = documents
        .flatMap((d) => d.evidences)
        .find((e) => e.requirementId === req.id);

      let status = 'UNVERIFIED';
      let score = 0.0;
      let reason = '';

      if (!matchingEvidence) {
        if (req.mandatory) {
          status = 'MISSING';
          score = 0.0;
          reason = `Mandatory requirement ${req.requirementCode} (${req.title}) - No document evidence found in submission.`;
          missingCount++;
        } else {
          status = 'UNVERIFIED';
          score = 50.0;
          reason = `Optional requirement ${req.requirementCode} - No specific document attached.`;
        }
      } else {
        const val = matchingEvidence.extractedValue;
        const norm = matchingEvidence.normalizedValue || val;

        if (req.ruleType === 'GREATER_THAN_EQUAL') {
          const reqNum = parseFloat(req.threshold || '0');
          const evNum = parseFloat(norm.replace(/[^0-9.]/g, ''));
          if (!isNaN(reqNum) && !isNaN(evNum)) {
            if (evNum >= reqNum) {
              status = 'COMPLIANT';
              score = 100.0;
              reason = `Submitted ${evNum} ${req.thresholdUnit || ''} meets mandatory requirement threshold of ${reqNum}.`;
              compliantCount++;
            } else {
              status = 'NON_COMPLIANT';
              score = Math.max(0, (evNum / reqNum) * 100);
              reason = `Submitted ${evNum} ${req.thresholdUnit || ''} falls below mandatory requirement of ${reqNum}.`;
              nonCompliantCount++;
            }
          } else {
            status = 'COMPLIANT';
            score = 100.0;
            reason = 'Evidence text verified.';
            compliantCount++;
          }
        } else if (req.ruleType === 'MATCH_EXACT') {
          if (norm.toUpperCase().includes((req.threshold || '').toUpperCase())) {
            status = 'COMPLIANT';
            score = 100.0;
            reason = `Exact match verified for ${req.title}.`;
            compliantCount++;
          } else {
            status = 'NON_COMPLIANT';
            score = 0.0;
            reason = `Value ${norm} does not match expected threshold ${req.threshold}.`;
            nonCompliantCount++;
          }
        } else {
          status = 'COMPLIANT';
          score = 100.0;
          reason = 'Document evidence present and verified.';
          compliantCount++;
        }
      }

      // Upsert compliance result
      const existing = await prisma.complianceResult.findFirst({
        where: { bidId: bid.id, requirementId: req.id },
      });

      if (existing) {
        await prisma.complianceResult.update({
          where: { id: existing.id },
          data: {
            status,
            score,
            reason,
            evidenceId: matchingEvidence?.id || null,
            aiExplanation: `Deterministic rule validation evaluated evidence "${matchingEvidence?.extractedValue || 'None'}" against rule threshold "${req.threshold || 'Present'}". Result: ${status}.`,
          },
        });
      } else {
        await prisma.complianceResult.create({
          data: {
            bidId: bid.id,
            requirementId: req.id,
            status,
            score,
            reason,
            evidenceId: matchingEvidence?.id || null,
            aiExplanation: `Deterministic rule validation evaluated evidence "${matchingEvidence?.extractedValue || 'None'}" against rule threshold "${req.threshold || 'Present'}". Result: ${status}.`,
          },
        });
      }
    }

    // Risk Calculation
    const contradictionCount = (missingCount > 0 && nonCompliantCount > 0) ? 1 : 0;
    const riskResult = calculateBidRisk({
      totalRequirements: requirements.length,
      mandatoryRequirementsCount: mandatoryCount,
      missingMandatoryCount: missingCount,
      nonCompliantCount: nonCompliantCount,
      partialCount: partialCount,
      contradictionCount,
      unverifiedEvidenceCount: 0,
      averageConfidence: 0.95,
      lowQualityDocumentsCount: 0,
    });

    // Update Bid scores
    const updatedBid = await prisma.bid.update({
      where: { id: bid.id },
      data: {
        complianceScore: riskResult.complianceScore,
        riskScore: riskResult.riskScore,
        riskLevel: riskResult.riskLevel,
        status: 'UNDER_REVIEW',
      },
    });

    broadcastRealtimeEvent('COMPLIANCE_EVALUATED', {
      bidId: bid.id,
      bidderName: bid.bidderName,
      complianceScore: riskResult.complianceScore,
      riskScore: riskResult.riskScore,
      riskLevel: riskResult.riskLevel,
    });
    broadcastRealtimeEvent('BID_UPDATED', {
      bidId: bid.id,
      complianceScore: riskResult.complianceScore,
      riskLevel: riskResult.riskLevel,
    });

    await createAuditLog({
      userId: session?.userId,
      userName: session?.name || 'System Officer',
      action: 'AI_COMPLIANCE_RUN',
      entityType: 'BID',
      entityId: bid.id,
      metadata: {
        bidder: bid.bidderName,
        complianceScore: riskResult.complianceScore,
        riskScore: riskResult.riskScore,
        riskLevel: riskResult.riskLevel,
      },
    });

    return NextResponse.json({
      success: true,
      complianceScore: riskResult.complianceScore,
      riskScore: riskResult.riskScore,
      riskLevel: riskResult.riskLevel,
      breakdown: riskResult.breakdown,
      bid: updatedBid,
    });
  } catch (error: any) {
    console.error('Compliance calculation error:', error);
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
