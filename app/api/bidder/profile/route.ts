import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';
import { verifyGstTaxpayer } from '@/lib/gst-service';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || (session.role !== 'BIDDER' && session.role !== 'ADMIN')) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Only authenticated bidders can update their profile.' } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { gstin, companyName, tradeName } = body;

    if (!gstin || typeof gstin !== 'string') {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Valid GSTIN is required.' } },
        { status: 400 }
      );
    }

    const cleanGstin = gstin.trim().toUpperCase();
    const taxpayerProfile = await verifyGstTaxpayer(cleanGstin);

    if (!taxpayerProfile.isValid) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_GSTIN', message: 'GSTIN format or checksum validation failed.' } },
        { status: 400 }
      );
    }

    const isLive = taxpayerProfile.liveLookupStatus === 'LIVE_VERIFIED' && taxpayerProfile.gstStatus === 'ACTIVE';
    const verifiedStatus = isLive ? 'ACTIVE' : 'UNVERIFIED';

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        gstin: cleanGstin,
        pan: taxpayerProfile.extractedPan || (cleanGstin.length >= 12 ? cleanGstin.substring(2, 12) : null),
        companyName: isLive ? (taxpayerProfile.legalName || taxpayerProfile.tradeName || null) : null,
        legalName: isLive ? taxpayerProfile.legalName : null,
        tradeName: isLive ? taxpayerProfile.tradeName : null,
        constitution: isLive ? taxpayerProfile.constitution : null,
        registrationDate: isLive ? taxpayerProfile.registrationDate : null,
        address: isLive ? taxpayerProfile.registeredAddress : null,
        gstStatus: verifiedStatus,
        gstVerifiedAt: isLive ? new Date() : null,
        gstVerificationRaw: JSON.stringify(taxpayerProfile.evidence),
      },
    });

    await createAuditLog({
      userId: session.userId,
      userName: session.name,
      action: 'BIDDER_GST_PROFILE_UPDATED',
      entityType: 'USER',
      entityId: session.userId,
      metadata: {
        gstin: cleanGstin,
        status: verifiedStatus,
        checksumValid: taxpayerProfile.checksumValid,
        state: taxpayerProfile.stateJurisdiction,
      },
    });

    return NextResponse.json({
      success: true,
      message: isLive
        ? 'GSTIN verified and live taxpayer profile saved to database.'
        : 'GSTIN recorded as Unverified (Live verification unavailable).',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        gstin: updatedUser.gstin,
        pan: updatedUser.pan,
        companyName: updatedUser.companyName,
        legalName: updatedUser.legalName,
        tradeName: updatedUser.tradeName,
        constitution: updatedUser.constitution,
        registrationDate: updatedUser.registrationDate,
        gstStatus: updatedUser.gstStatus,
        gstVerifiedAt: updatedUser.gstVerifiedAt,
        address: updatedUser.address,
      },
      verificationDetails: taxpayerProfile,
    });
  } catch (error: any) {
    console.error('Bidder profile update error:', error);
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
