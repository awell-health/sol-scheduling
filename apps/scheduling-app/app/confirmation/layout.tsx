import type { ReactNode } from 'react';
import { SchedulingHeader } from '../../components/layout/SchedulingHeader';

export default function ConfirmationLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SchedulingHeader />
      {children}
    </>
  );
}
