import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';
import { verifyGstTaxpayer } from '@/lib/gst-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, gstin, designation } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Name, email, and password are required.' } },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_PASSWORD', message: 'Password must be at least 6 characters.' } },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_EXISTS', message: 'An account with this email already exists.' } },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let cleanGstin: string | null = null;
    let extractedPan: string | null = null;
    let verifiedGstStatus = 'UNVERIFIED';
    let verifiedAt: Date | null = null;
    let legalName: string | null = null;
    let tradeName: string | null = null;
    let constitution: string | null = null;
    let registrationDate: string | null = null;
    let registeredAddress: string | null = null;
    let gstVerificationRaw: string | null = null;

    if (gstin && typeof gstin === 'string' && gstin.trim().length === 15) {
      cleanGstin = gstin.trim().toUpperCase();
      const taxpayer = await verifyGstTaxpayer(cleanGstin);
      extractedPan = taxpayer.extractedPan;
      gstVerificationRaw = JSON.stringify(taxpayer);

      // Only assign company details if live provider returned actual data
      if (taxpayer.liveLookupStatus === 'LIVE_VERIFIED' && taxpayer.gstStatus === 'ACTIVE') {
        verifiedGstStatus = 'ACTIVE';
        verifiedAt = new Date();
        legalName = taxpayer.legalName || null;
        tradeName = taxpayer.tradeName || null;
        constitution = taxpayer.constitution || null;
        registrationDate = taxpayer.registrationDate || null;
        registeredAddress = taxpayer.registeredAddress || null;
      } else {
        verifiedGstStatus = 'UNVERIFIED';
        verifiedAt = null;
      }
    }

    // Create Bidder User
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: 'BIDDER',
        companyName: legalName || tradeName || null,
        legalName: legalName || null,
        tradeName: tradeName || null,
        gstin: cleanGstin,
        pan: extractedPan,
        constitution: constitution || null,
        registrationDate: registrationDate || null,
        gstStatus: verifiedGstStatus,
        gstVerifiedAt: verifiedAt,
        gstVerificationRaw,
        address: registeredAddress || null,
        designation: designation || (legalName ? `${legalName}` : 'Authorized Representative'),
        avatar: null,
      },
    });

    const token = await signToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: 'BIDDER',
      designation: user.designation || undefined,
    });

    await createAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'USER_REGISTERED',
      entityType: 'USER',
      entityId: user.id,
      metadata: {
        email: user.email,
        role: 'BIDDER',
        gstin: user.gstin,
        gstStatus: verifiedGstStatus,
      },
    });

    const response = NextResponse.json({
      success: true,
      message: 'Bidder account registered successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        gstin: user.gstin,
        pan: user.pan,
        companyName: user.companyName,
        legalName: user.legalName,
        tradeName: user.tradeName,
        gstStatus: user.gstStatus,
        gstVerifiedAt: user.gstVerifiedAt,
      },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
