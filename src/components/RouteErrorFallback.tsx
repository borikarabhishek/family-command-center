import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * RouteErrorFallback component for TanStack Router error handling.
 * Displays user-friendly error messages for route-level errors.
 */
export function RouteErrorFallback({ error }: { error: Error }) {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md space-y-6 rounded-lg border border-border bg-card p-8 shadow-lg">
        <div className="flex items-center gap-3">
          <AlertCircle className="size-8 text-destructive" />
          <div>
            <h1 className="text-xl font-semibold">Page not found</h1>
            <p className="text-sm text-muted-foreground">Error 404</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            The page you're looking for doesn't exist or encountered an error.
          </p>
          {import.meta.env.DEV && (
            <details className="text-xs">
              <summary className="cursor-pointer font-mono text-destructive hover:underline">
                Error details
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">
                {error?.toString() || "Unknown error"}
              </pre>
            </details>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReload} className="flex-1">
            <RefreshCw className="mr-2 size-4" />
            Reload
          </Button>
          <Button onClick={handleGoHome} className="flex-1">
            <Home className="mr-2 size-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
