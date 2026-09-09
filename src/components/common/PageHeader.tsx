import type { ReactNode } from "react";

/**
 * PageHeader component displays a page title, optional description, and action element.
 * Provides consistent heading styling across all pages.
 *
 * @param title - Main page heading (required)
 * @param description - Subtitle or page description (optional)
 * @param action - Action button or element (optional, positioned on right)
 *
 * @example
 * <PageHeader
 *   title="Document Vault"
 *   description="Every important family document in one place."
 *   action={<Button>Upload document</Button>}
 * />
 */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
