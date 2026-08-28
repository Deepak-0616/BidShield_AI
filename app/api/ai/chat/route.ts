import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    const { query, bidId } = await req.json();

    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

    try {
      const res = await fetch(`${aiServiceUrl}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, bid_id: bidId }),
      });

      if (res.ok) {
        const data = await res.json();
        if (session) {
          await prisma.chatMessage.create({
            data: {
              userId: session.userId,
              bidId: bidId || null,
              role: 'ASSISTANT',
              message: data.response,
              citations: JSON.stringify(data.citations),
            },
          });
        }
        return NextResponse.json({ success: true, response: data.response, citations: data.citations });
      }
    } catch (e) {
      console.warn('FastAPI backend offline, grounding response from database records:', e);
    }

    // Database grounded intelligent response for the specific bid
    let responseText = 'No specific bid selected for grounding.';
    let citations: any[] = [];

    if (bidId) {
      const bid = await prisma.bid.findUnique({
        where: { id: bidId },
        include: {
          tender: { include: { requirements: true } },
          complianceResults: { include: { requirement: true } },
          documents: true,
        },
      });

      if (bid) {
        const nonCompliant = bid.complianceResults.filter((c) => c.status === 'NON_COMPLIANT');
        const missing = bid.complianceResults.filter((c) => c.status === 'MISSING');
        const compliant = bid.complianceResults.filter((c) => c.status === 'COMPLIANT');

        const nonCompliantSummary = nonCompliant.map((n) => `${n.requirement?.title} (${n.reason})`).join('; ');
        const missingSummary = missing.map((m) => `${m.requirement?.title} (Document Missing)`).join('; ');

        let findingsText = '';
        if (nonCompliant.length > 0 || missing.length > 0) {
          findingsText = `Primary risk drivers identified: ${[nonCompliantSummary, missingSummary].filter(Boolean).join('. ')}.`;
        } else {
          findingsText = `All ${compliant.length} mandatory evaluation criteria have been fully verified with high confidence.`;
        }

        responseText = `${bid.bidderName} is classified as ${bid.riskLevel} RISK (Compliance Score: ${bid.complianceScore}%, Risk Score: ${bid.riskScore}/100) for tender ${bid.tender?.tenderNumber} ("${bid.tender?.title}"). ${findingsText}`;

        citations = bid.documents.map((d) => ({
          source: d.filename,
          page: 1,
        }));

        if (citations.length === 0) {
          citations = [{ source: `Tender Requirements (${bid.tender?.tenderNumber})`, page: 1 }];
        }
      }
    }

    return NextResponse.json({ success: true, response: responseText, citations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
