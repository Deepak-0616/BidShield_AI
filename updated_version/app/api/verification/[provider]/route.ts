import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: { provider: string } }) {
  try {
    const provider = params.provider.toUpperCase();
    const body = await req.json();
    const { gstin, pan, udyamNo, mcaCin, oemRef, legalName } = body;

    let responsePayload: any = {};

    switch (provider) {
      case 'GST':
        responsePayload = {
          provider: 'GST-DEMO',
          referenceNumber: gstin || '27AAACN1234Q1Z5',
          legalName: legalName || 'NovaTech Systems Private Limited',
          registrationStatus: 'ACTIVE',
          taxpayerType: 'Regular',
          stateJurisdiction: 'Maharashtra',
          confidence: 0.99,
          demo: true,
        };
        break;
      case 'PAN':
        responsePayload = {
          provider: 'PAN-DEMO',
          referenceNumber: pan || 'AAACN1234Q',
          legalName: legalName || 'NovaTech Systems Private Limited',
          status: 'VALID',
          category: 'Company',
          confidence: 0.99,
          demo: true,
        };
        break;
      case 'UDYAM':
        responsePayload = {
          provider: 'UDYAM-DEMO',
          referenceNumber: udyamNo || 'UDYAM-MH-03-0012345',
          enterpriseName: legalName || 'NovaTech Systems Private Limited',
          enterpriseCategory: 'Small Enterprise',
          status: 'ACTIVE',
          confidence: 0.98,
          demo: true,
        };
        break;
      case 'MCA':
        responsePayload = {
          provider: 'MCA-SIMULATED',
          referenceNumber: mcaCin || 'U72900MH2018PTC307891',
          companyName: legalName || 'NovaTech Systems Private Limited',
          status: 'ACTIVE',
          incorporationDate: '2018-04-05',
          confidence: 0.97,
          demo: true,
        };
        break;
      case 'OEM':
        responsePayload = {
          provider: 'OEM-SIMULATED',
          referenceNumber: oemRef || 'OEM/APEX/2026/9941',
          oemName: 'Global Hardware Technologies Inc.',
          validity: 'VALID_THROUGH_2027',
          status: 'VERIFIED',
          confidence: 0.96,
          demo: true,
        };
        break;
      default:
        responsePayload = {
          provider: `${provider}-SIMULATED`,
          status: 'VERIFIED',
          confidence: 0.90,
          demo: true,
        };
    }

    return NextResponse.json({
      success: true,
      data: responsePayload,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
