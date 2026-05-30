import { Suspense } from 'react';
import { SignupForm } from './signup-form';

export const dynamic = 'force-dynamic';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4">
      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
