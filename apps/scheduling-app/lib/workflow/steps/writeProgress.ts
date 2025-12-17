import { getWritable } from 'workflow';

/**
 * Progress update types for the booking workflow stream
 */
export type BookingProgressType =
  | 'booking_started'
  | 'appointment_booked'
  | 'careflow_started'
  | 'session_ready'
  | 'error';

/**
 * Progress update sent to the client via stream
 */
export interface BookingProgress {
  type: BookingProgressType;
  message: string;
  data?: {
    eventId?: string;
    careflowId?: string;
    patientId?: string;
    sessionUrl?: string;
    confirmationId?: string;
    error?: string;
  };
  timestamp: string;
}

/**
 * Write a progress update to the workflow's stream.
 * Must be called from a step function (not workflow context).
 */
export async function writeProgressStep(progress: Omit<BookingProgress, 'timestamp'>): Promise<void> {
  "use step";

  const writable = getWritable<BookingProgress>();
  const writer = writable.getWriter();
  
  const update: BookingProgress = {
    ...progress,
    timestamp: new Date().toISOString(),
  };

  await writer.write(update);
  writer.releaseLock();

  console.log('[writeProgressStep] Progress written:', update);
}

/**
 * Close the progress stream.
 * Call this when the workflow is complete.
 */
export async function closeProgressStreamStep(): Promise<void> {
  "use step";

  const writable = getWritable<BookingProgress>();
  await writable.close();

  console.log('[closeProgressStreamStep] Stream closed');
}

