import { CalculatorProvider } from '@/components/calculator/CalculatorProvider';
import { Calculator } from '@/components/calculator/Calculator';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingFallback() {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <Skeleton className="w-full max-w-2xl h-[600px] rounded-2xl" />
      </div>
    )
}

function PageContent() {
    return (
        <CalculatorProvider>
            <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
                <Calculator />
            </main>
        </CalculatorProvider>
    )
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PageContent />
    </Suspense>
  );
}
