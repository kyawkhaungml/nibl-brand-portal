'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from './button';

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="nibl-card flex flex-col items-center gap-3 p-6 text-center">
      <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden />
      <div>
        <div className="font-medium">{title}</div>
        {message ? (
          <div className="text-sm text-muted-foreground">{message}</div>
        ) : null}
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}
