'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  maxWidth = '600px',
  children,
  footer,
  bodyClassName,
  // When set, the modal portal element gets this id. Used by the export-report
  // print-CSS hack to isolate the printable content to just the modal.
  portalId,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  maxWidth?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  bodyClassName?: string;
  portalId?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const node = (
    <div
      id={portalId}
      className="fixed inset-0 z-[9000] flex items-end justify-center sm:items-center print:relative print:inset-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/40 print:hidden"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cn(
          'relative z-10 max-h-[90vh] w-full overflow-hidden bg-card text-card-foreground shadow-flat-lg',
          'border border-foreground',
          'rounded-t-[20px] rounded-b-none sm:rounded-2xl',
          'animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-150 ease-out sm:slide-in-from-bottom-0',
          'print:max-h-none print:w-full print:rounded-none print:border-0 print:shadow-none',
        )}
        style={{ maxWidth }}
      >
        {title ? (
          <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4 print:hidden">
            <div>
              <div className="font-heading text-base font-semibold text-foreground">
                {title}
              </div>
              {subtitle ? (
                <div className="mt-0.5 text-[13px] text-muted-foreground">
                  {subtitle}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}
        <div
          className={cn(
            'max-h-[calc(90vh-3.5rem)] overflow-y-auto px-5 py-5 sm:px-6',
            'print:max-h-none print:overflow-visible',
            bodyClassName,
          )}
        >
          {children}
        </div>
        {footer ? (
          <div className="border-t border-border px-5 py-3 print:hidden">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
