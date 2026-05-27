"use client";

/* =====================================================================
   DropdownMenu — shadcn/ui pattern over Radix UI primitives.
   Styled to match Carl Ras tokens (rounded-md, shadow-3, line-2 border,
   ink/canvas colors). Drop-in replacement for hand-rolled popover menus.
   Use: <DropdownMenu><DropdownMenuTrigger asChild><Button/></DropdownMenuTrigger>
        <DropdownMenuContent>…items…</DropdownMenuContent></DropdownMenu>
   ===================================================================== */

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-[var(--r-md)] border border-[var(--line-2)] bg-white p-1.5 text-[var(--ink-2)] shadow-[var(--shadow-3)]",
        "origin-[var(--radix-dropdown-menu-content-transform-origin)] transition-[opacity,transform] duration-150 ease-out",
        "data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[state=open]:opacity-100 data-[state=open]:scale-100",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    /** Adds destructive (red-toned) styling. */
    destructive?: boolean;
  }
>(({ className, destructive, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2.5 rounded-[8px] px-3 py-2 text-[14px] outline-none transition-colors",
      "focus:bg-[var(--canvas-2)] focus:text-[var(--ink)]",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      destructive && "text-[#7A2E00] focus:bg-[#FDE3D3] focus:text-[#7A2E00]",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 pt-2 pb-1 text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-3)]",
      className,
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1.5 h-px bg-[var(--line-2)]", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
};
