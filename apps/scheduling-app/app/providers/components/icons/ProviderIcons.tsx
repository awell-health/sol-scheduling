'use client';

import * as React from 'react';

export const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10z'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <circle
      cx={12}
      cy={11}
      r={2}
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export const VideoCameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <rect
      x={3}
      y={6}
      width={11}
      height={12}
      rx={2}
      stroke='currentColor'
      strokeWidth={2}
    />
    <path
      d='M16 10.5 20 8v8l-4-2.5'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);


