import { prisma } from './db';

export async function createAuditLog({
  userId,
  userName,
  action,
  entityType,
  entityId,
  metadata,
  ipAddress = '127.0.0.1',
}: {
  userId?: string;
  userName?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId: userId || null,
        userName: userName || 'System User',
        action,
        entityType,
        entityId: entityId || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        ipAddress,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
