'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/helpers';

const navigationMenuTriggerStyle = cva(
  'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[active]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground',
);

const navigationMenu = cva('relative z-10 flex max-w-max flex-1 items-center justify-center', {
  variants: {
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

const navigationMenuList = cva(
  'flex flex-1 list-none gap-1',
  { variants: { orientation: { horizontal: 'flex-row', vertical: 'flex-col' } } },
);

const navigationMenuItem = cva('relative');

const navigationMenuContent = cva(
  'absolute left-0 top-full z-50 flex w-max flex-col gap-2 bg-popover p-2 shadow-lg border border-border rounded-md shadow-sm data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-5 data-[motion=from-start]:slide-in-from-left-5 data-[motion=to-end]:slide-out-to-right-5 data-[motion=to-start]:slide-out-to-left-5 md:absolute md:w-auto',
);

const navigationMenuLink = cva(
  'block select-none rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
);

const navigationMenuIndicator = cva(
  'absolute z-[-1] flex h-1.5 items-center justify-center overflow-hidden bg-primary transition-all duration-200',
);

const navigationMenuViewport = cva(
  'absolute left-0 top-full z-50 flex w-full flex-col gap-2 bg-popover p-2 shadow-lg border border-border rounded-md shadow-sm',
);

const NavigationMenu = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'nav'> & VariantProps<typeof navigationMenu>
>(({ className, orientation = 'horizontal', children, ...props }, ref) => {
  return (
    <nav
      ref={ref}
      className={cn(navigationMenu({ orientation }), className)}
      {...props}
    >
      <ul className={cn(navigationMenuList({ orientation }))}>{children}</ul>
    </nav>
  );
});
NavigationMenu.displayName = 'NavigationMenu';

const NavigationMenuList = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<'ul'>
>(({ className, ...props }, ref) => {
  return (
    <ul ref={ref} className={cn(navigationMenuList({ orientation: 'horizontal' }), className)} {...props} />
  );
});
NavigationMenuList.displayName = 'NavigationMenuList';

const NavigationMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => {
  return (
    <li ref={ref} className={cn(navigationMenuItem(), className)} {...props} />
  );
});
NavigationMenuItem.displayName = 'NavigationMenuItem';

const NavigationMenuContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & {
    forceMount?: boolean;
  }
>(({ className, forceMount, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(navigationMenuContent(), className)}
      data-force-mount={forceMount ? '' : undefined}
      {...props}
    />
  );
});
NavigationMenuContent.displayName = 'NavigationMenuContent';

const NavigationMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      {children}
    </button>
  );
});
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

const NavigationMenuLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> & {
    asChild?: boolean;
  }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a';
  return (
    <Comp
      ref={ref}
      className={cn(navigationMenuLink(), className)}
      {...props}
    />
  );
});
NavigationMenuLink.displayName = 'NavigationMenuLink';

const NavigationMenuIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & {
    forceMount?: boolean;
  }
>(({ className, forceMount, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(navigationMenuIndicator(), className)}
      data-force-mount={forceMount ? '' : undefined}
      {...props}
    />
  );
});
NavigationMenuIndicator.displayName = 'NavigationMenuIndicator';

const NavigationMenuViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(navigationMenuViewport(), className)}
      {...props}
    />
  );
});
NavigationMenuViewport.displayName = 'NavigationMenuViewport';

export {
  navigationMenu,
  navigationMenuList,
  navigationMenuItem,
  navigationMenuContent,
  navigationMenuTriggerStyle,
  navigationMenuLink,
  navigationMenuIndicator,
  navigationMenuViewport,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};