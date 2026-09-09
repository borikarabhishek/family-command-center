import type { ReactNode } from "react";

/**
 * EmptyState displays a centered message when no content is available.
 * Used when lists are empty, searches return no results, or no data is loaded.
 *
 * @param title - Main empty state title (e.g., "No documents found")
 * @param description - Explanation of why the state is empty
 * @param action - Optional action button or element to help user proceed
 * @param icon - Optional icon to visually represent the empty state
 *
 * @example
 * <EmptyState
 *   title="No documents yet"
 *   description="Upload your first family document to get started."
 *   action={<Button>Upload document</Button>}
 *   icon={<FolderIcon />}
 * />
 */
export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="surface flex flex-col items-center justify-center px-6 py-14 text-center">
      {icon ? <div className="mb-3 text-muted-foreground">{icon}</div> : null}
      <h3 className="text-lg">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
