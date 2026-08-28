import { EventEmitter } from 'events';

declare global {
  var __bidshield_event_emitter__: EventEmitter | undefined;
}

// Global singleton EventEmitter to ensure all Route Handlers share the same event bus
export const realtimeEmitter: EventEmitter =
  globalThis.__bidshield_event_emitter__ ||
  (globalThis.__bidshield_event_emitter__ = new EventEmitter());

// Set generous listener limit for concurrent dashboard clients
realtimeEmitter.setMaxListeners(200);

export type RealtimeEventType =
  | 'BID_CREATED'
  | 'BID_UPDATED'
  | 'BID_SUBMITTED'
  | 'COMPLIANCE_EVALUATED'
  | 'DOCUMENT_UPLOADED'
  | 'TENDER_CREATED'
  | 'USER_REGISTERED'
  | 'DASHBOARD_UPDATE';

export interface RealtimeEventPayload {
  type: RealtimeEventType;
  data?: any;
  timestamp: string;
}

/**
 * Broadcast an event to all connected dashboard SSE streams
 */
export function broadcastRealtimeEvent(type: RealtimeEventType, data?: any) {
  try {
    const payload: RealtimeEventPayload = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };
    realtimeEmitter.emit('realtime-event', payload);
  } catch (err) {
    console.warn('Realtime event broadcast note:', err);
  }
}
