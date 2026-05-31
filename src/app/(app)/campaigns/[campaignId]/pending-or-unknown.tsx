'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PendingCampaignView } from './pending-campaign-view';
import { useUserCampaigns } from '@/lib/use-user-campaigns';

export function PendingOrUnknown({ id }: { id: string }) {
  const router = useRouter();
  const { userCampaigns } = useUserCampaigns();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Wait one tick so localStorage has been read before deciding.
    return (
      <div className="nibl-card p-6 text-sm text-muted-foreground">
        Loading campaign…
      </div>
    );
  }

  const found = userCampaigns.find((c) => c.id === id);
  if (!found) {
    return (
      <div className="nibl-card p-6">
        <div className="text-sm font-medium text-foreground">
          Campaign not found
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          We couldn&apos;t find a campaign with that ID. It may have been
          deleted.
        </p>
        <button
          type="button"
          onClick={() => router.push('/campaigns')}
          className="mt-3 text-[12px] font-medium text-accent hover:underline"
        >
          ← Back to campaigns
        </button>
      </div>
    );
  }

  return <PendingCampaignView campaign={found} />;
}
