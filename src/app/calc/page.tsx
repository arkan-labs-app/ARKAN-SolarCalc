
"use client";
import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { CalculatorEmbed } from '@/components/calculator/CalculatorEmbed';

function LoadingFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-[520px] p-4 md:p-6 space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-8 w-1/2 mx-auto" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-40 w-full" />
                <div className="flex justify-center gap-4 pt-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>
        </div>
    );
}

export default function CalculatorPage() {
  // O Suspense é crucial para componentes que usam hooks como `useSearchParams`
  // para evitar erros de hidratação durante a renderização no servidor (SSR).
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CalculatorEmbed />
    </Suspense>
  );
}
