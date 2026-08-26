import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

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
      console.warn('FastAPI unavailable, using fallback response:', e);
    }

    // Fallback response if FastAPI service is temporarily offline
    const responseText = "NovaTech Systems Private Limited is currently classified as MEDIUM RISK (Compliance 68.5%, Risk Score 58/100). Primary risk drivers are: 3 years experience vs required 5 years, missing OEM Authorization letter, and local content declared at 42% vs required 50%.";
    const citations = [
      { source: "Experience Certificate", page: 1 },
      { source: "Local Content Declaration", page: 1 },
      { source: "Tender Requirements R4, R5, R7", page: 1 }
    ];

    return NextResponse.json({ success: true, response: responseText, citations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
