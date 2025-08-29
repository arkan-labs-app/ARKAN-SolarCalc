
"use client";
import { CalculatorProvider } from '@/components/calculator/CalculatorProvider';
import { Calculator } from '@/components/calculator/Calculator';
import React, { Suspense } from 'react';

function PageContent() {
    // This component is designed to be embedded in an iframe.
    // It has a transparent background to blend with the parent page.
    return (
        <CalculatorProvider>
            <main className="flex w-full flex-col items-center justify-center bg-transparent p-0 md:p-4">
                <Calculator />
            </main>
        </CalculatorProvider>
    )
}

export default function CalculatorPage() {
  // No skeleton here, as it should be handled by the parent page if needed.
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  );
}
