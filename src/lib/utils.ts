import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper precedence handling.
 * Combines clsx for conditional class handling with tailwind-merge for precedence.
 * This resolves conflicts when the same Tailwind utility appears multiple times.
 *
 * @param inputs - Variable number of class values (strings, arrays, objects, or null)
 * @returns Merged class string with proper Tailwind precedence
 *
 * @example
 * cn("px-2", "px-4")  // "px-4" (px-4 takes precedence)
 * cn("text-red-500", isActive && "text-green-500")  // "text-green-500" if isActive
 * cn({ "font-bold": isBold, "text-lg": isLarge })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
