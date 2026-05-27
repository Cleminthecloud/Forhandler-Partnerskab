import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Shadcn-standard `cn` helper — merges Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
