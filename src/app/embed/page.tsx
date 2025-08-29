import { CalculatorProvider } from '@/components/calculator/CalculatorProvider';
import { Calculator } from '@/components/calculator/Calculator';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingFallback() {
    return <Skeleton className="w-full max-w-2xl h-[600px] rounded-2xl" />
}

function EmbedPageContent() {
    return (
        <CalculatorProvider>
            <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
                <Calculator />
            </main>
        </CalculatorProvider>
    )
}

export default function EmbedPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <Suspense fallback={<LoadingFallback />}>
          <EmbedPageContent />
        </Suspense>
    </main>
  );
}
