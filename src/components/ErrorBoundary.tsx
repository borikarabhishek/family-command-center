import React, { ReactNode, ReactElement } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactElement;
  onError?: (error: Error, errorInfo: { componentStack: string }) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary catches JavaScript errors anywhere in the child component tree.
 * Displays a fallback UI and can log errors for monitoring.
 *
 * @example
 * <ErrorBoundary>
 *   <Dashboard />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  override render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return <DefaultErrorFallback error={this.state.error} reset={this.resetError} />;
    }

    return this.props.children;
  }
}

/**
 * Default error fallback UI
 */
export function DefaultErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}): ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md space-y-6 rounded-lg border border-border bg-card p-8 shadow-lg">
        <div className="flex items-center gap-3">
          <AlertCircle className="size-8 text-destructive" />
          <h1 className="text-xl font-semibold">Something went wrong</h1>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            An unexpected error occurred. We're sorry for the inconvenience.
          </p>
          {import.meta.env.DEV && (
            <details className="text-xs">
              <summary className="cursor-pointer font-mono text-destructive hover:underline">
                Error details
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">
                {error.toString()}
              </pre>
            </details>
          )}
        </div>

        <button
          onClick={reset}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
