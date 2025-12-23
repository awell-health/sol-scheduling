import type { Metadata } from 'next';
import { ConfirmationPageClient } from './ConfirmationPageClient';

export const metadata: Metadata = {
  title: 'Appointment confirmed | SOL Mental Health',
  description:
    'View the details of your booked appointment with a SOL Mental Health provider.'
};

type ConfirmationPageProps = {
  params: Promise<{
    /** Confirmation ID (workflow run ID) */
    id: string;
  }>;
};

export default async function AppointmentConfirmationPage({
  params
}: ConfirmationPageProps) {
  const { id: confirmationId } = await params;

  return <ConfirmationPageClient confirmationId={confirmationId} />;
}

