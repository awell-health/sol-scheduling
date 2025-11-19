'use client';

import * as React from 'react';
import { Drawer as VaulDrawer } from 'vaul';
import clsx from 'clsx';

type ClassValue = string | number | null | false | undefined;

const cn = (...values: ClassValue[]) => clsx(values);

const Drawer = VaulDrawer.Root;
const DrawerTrigger = VaulDrawer.Trigger;
const DrawerPortal = VaulDrawer.Portal;
const DrawerClose = VaulDrawer.Close;
const DrawerTitle = VaulDrawer.Title;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof VaulDrawer.Overlay>,
  React.ComponentPropsWithoutRef<typeof VaulDrawer.Overlay>
>(({ className, ...props }, ref) => (
  <VaulDrawer.Overlay
    ref={ref}
    className={cn('fixed inset-0 bg-black/30', className)}
    {...props}
  />
));
DrawerOverlay.displayName = 'DrawerOverlay';

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof VaulDrawer.Content>,
  React.ComponentPropsWithoutRef<typeof VaulDrawer.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <VaulDrawer.Content
      ref={ref}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl border border-slate-200 bg-white shadow-card outline-none',
        className
      )}
      {...props}
    >
      <div className='mx-auto mt-2 h-1 w-10 rounded-full bg-slate-200' />
      {children}
    </VaulDrawer.Content>
  </DrawerPortal>
));
DrawerContent.displayName = 'DrawerContent';

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex items-center justify-between border-b border-slate-200 px-4 py-3',
      className
    )}
    {...props}
  />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-3',
      className
    )}
    {...props}
  />
);
DrawerFooter.displayName = 'DrawerFooter';

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerClose,
  DrawerOverlay,
  DrawerTitle
};


