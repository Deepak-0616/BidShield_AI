import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { department: true },
  });

  if (!user) {
    return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department?.name || 'Ministry Division',
      designation: user.designation,
      avatar: user.avatar,
      gstin: user.gstin,
      pan: user.pan,
      companyName: user.companyName,
      legalName: user.legalName,
      tradeName: user.tradeName,
      gstStatus: user.gstStatus || 'UNVERIFIED',
      constitution: user.constitution,
      registrationDate: user.registrationDate,
      gstVerifiedAt: user.gstVerifiedAt,
      gstVerificationRaw: user.gstVerificationRaw,
      address: user.address,
    },
  });
}
