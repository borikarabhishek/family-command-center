import { cn } from "@/lib/utils";

interface FilterButtonProps {
  /**
   * The filter value/name to display
   */
  label: string;

  /**
   * Whether this filter is currently active/selected
   */
  isActive: boolean;

  /**
   * Callback when filter is clicked
   */
  onClick: () => void;

  /**
   * Optional CSS class name for custom styling
   */
  className?: string;

  /**
   * Optional aria-label override (auto-generated from label if not provided)
   */
  ariaLabel?: string;

  /**
   * Optional category/group type for aria-label context
   */
  category?: string;

  /**
   * Whether this is a rounded pill button (default) or squared
   */
  variant?: "pill" | "square";
}

/**
 * FilterButton is a reusable filter toggle button component
 * Used across vault, tasks, and services pages for category/status filtering
 *
 * Features:
 * - Accessible with aria-label and aria-pressed
 * - Responsive styling with active/inactive states
 * - Flexible for different filter categories
 *
 * @example
 * <FilterButton
 *   label="Identity"
 *   isActive={category === "Identity"}
 *   onClick={() => setCategory("Identity")}
 *   category="document"
 * />
 */
export function FilterButton({
  label,
  isActive,
  onClick,
  className,
  ariaLabel,
  category,
  variant = "pill",
}: FilterButtonProps) {
  const defaultAriaLabel = category ? `Filter by ${label} ${category}` : `Filter by ${label}`;

  const buttonAriaLabel = ariaLabel || defaultAriaLabel;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={buttonAriaLabel}
      aria-pressed={isActive}
      className={cn(
        "transition-colors",
        variant === "pill"
          ? "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs"
          : "rounded-md border px-3 py-2 text-sm",
        isActive
          ? "border-accent bg-accent/15 text-foreground"
          : "border-border text-muted-foreground hover:border-accent/50",
        className,
      )}
    >
      {label}
    </button>
  );
}
