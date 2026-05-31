'use client';

import { useCallback, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Clock,
  Lightbulb,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { RequestResupplyModal } from '@/components/campaigns/request-resupply-modal';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

type Severity = 'urgent' | 'warning' | 'opportunity' | 'insight';
type Action = 'log' | 'resupply';

type Alert = {
  id: string;
  severity: Severity;
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  action: Action;
  timeAgo: string;
};

const ALERTS: Alert[] = [
  {
    id: 'a1-purchase-intent',
    severity: 'urgent',
    icon: AlertTriangle,
    title: 'Purchase intent dropped 4pts below benchmark',
    description:
      '34% of customers say they’d buy again — NiBL average is 38%. Your QR landing page may not be converting.',
    actionLabel: 'Review QR strategy →',
    action: 'log',
    timeAgo: '2h ago',
  },
  {
    id: 'a2-samples-low',
    severity: 'warning',
    icon: Clock,
    title: '153 samples remaining · ~18 days left',
    description:
      'At current delivery rate you’ll run out before your campaign end date. Request resupply now to avoid gaps.',
    actionLabel: 'Request resupply →',
    action: 'resupply',
    timeAgo: '1d ago',
  },
  {
    id: 'a3-east-village',
    severity: 'opportunity',
    icon: TrendingUp,
    title: 'East Village scan rate hit 75% — best ever',
    description:
      'Your highest performing neighborhood just broke its own record. Friday dinner pairings are driving this spike.',
    actionLabel: 'Increase EV allocation →',
    action: 'log',
    timeAgo: '2d ago',
  },
  {
    id: 'a4-morningside',
    severity: 'insight',
    icon: Lightbulb,
    title: 'New opportunity: Morningside Heights',
    description:
      'Only 78 deliveries but 53% scan rate — above average for a new area. Strong growth signal worth investing in.',
    actionLabel: 'Expand to this area →',
    action: 'log',
    timeAgo: '3d ago',
  },
];

const SEVERITY = {
  urgent: {
    border: '#DC2626',
    bg: '#FEF2F2',
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
    linkColor: '#DC2626',
  },
  warning: {
    border: '#D97706',
    bg: '#FFFBEB',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    linkColor: '#D97706',
  },
  opportunity: {
    border: '#16A34A',
    bg: '#F0FDF4',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    linkColor: '#16A34A',
  },
  insight: {
    border: '#1D4ED8',
    bg: '#EFF6FF',
    iconBg: '#DBEAFE',
    iconColor: '#1D4ED8',
    linkColor: '#1D4ED8',
  },
} as const;

export function SmartAlerts() {
  const toast = useToast();
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [resupplyRequested, setResupplyRequested] = useState(false);
  const [resupplyOpen, setResupplyOpen] = useState(false);

  const activeCount = ALERTS.length - readIds.size;

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  function onActionClick(alert: Alert) {
    if (readIds.has(alert.id)) return;
    if (alert.action === 'resupply') {
      setResupplyOpen(true);
      return;
    }
    toast.show('✓ Noted — your account manager will follow up', 'success');
    markRead(alert.id);
  }

  return (
    <section className="nibl-card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-foreground p-5">
        <div>
          <div className="text-sm font-medium text-foreground">Smart alerts</div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            AI-powered · updated in real time
          </p>
        </div>
        {activeCount > 0 ? (
          <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-medium text-accent">
            {activeCount} active
          </span>
        ) : (
          <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
            All caught up
          </span>
        )}
      </div>

      <ul className="space-y-3 p-5">
        {ALERTS.map((alert) => {
          const c = SEVERITY[alert.severity];
          const isRead = readIds.has(alert.id);
          const Icon = isRead ? Check : alert.icon;
          const isResupply = alert.id === 'a2-samples-low';
          const descOverride =
            isResupply && resupplyRequested
              ? 'Resupply requested ✓'
              : null;
          return (
            <li
              key={alert.id}
              className={cn(
                'flex items-start gap-3 rounded-lg p-3 transition-opacity',
                isRead && 'opacity-50',
              )}
              style={{
                backgroundColor: c.bg,
                borderLeft: `3px solid ${c.border}`,
              }}
            >
              <span
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                style={{ backgroundColor: c.iconBg }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color: c.iconColor }} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-medium text-foreground">
                  {alert.title}
                </div>
                <div
                  className={cn(
                    'mt-0.5 text-[11px] leading-[1.5]',
                    descOverride ? 'font-medium text-success' : 'text-muted-foreground',
                  )}
                >
                  {descOverride ?? alert.description}
                </div>
                <div className="mt-2 flex items-end justify-between gap-3">
                  {!isRead ? (
                    <button
                      type="button"
                      onClick={() => onActionClick(alert)}
                      className="text-[10px] font-medium underline-offset-2 hover:underline"
                      style={{ color: c.linkColor }}
                    >
                      {alert.actionLabel}
                    </button>
                  ) : (
                    <span />
                  )}
                  <span className="text-[10px] text-muted-foreground">
                    {alert.timeAgo}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <RequestResupplyModal
        isOpen={resupplyOpen}
        onClose={() => setResupplyOpen(false)}
        onSubmitted={() => {
          setResupplyRequested(true);
          markRead('a2-samples-low');
        }}
      />
    </section>
  );
}
