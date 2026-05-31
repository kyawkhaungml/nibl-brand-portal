import { AffinityMatrix } from '@/components/intelligence/AffinityMatrix';
import { ChatInterface } from '@/components/intelligence/ChatInterface';
import { ProductPredictor } from '@/components/intelligence/ProductPredictor';

export const dynamic = 'force-dynamic';

export default function IntelligencePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <ChatInterface />
      </div>
      <div className="space-y-6 lg:col-span-2">
        <AffinityMatrix />
        <ProductPredictor />
      </div>
    </div>
  );
}
