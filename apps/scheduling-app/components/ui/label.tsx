'use client';

import * as React from 'react';
import clsx from 'clsx';

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={clsx('text-sm font-medium text-slate-700', className)}
        {...props}
      />
    );
  }
);

Label.displayName = 'Label';


