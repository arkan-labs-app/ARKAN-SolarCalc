
"use client";
import { CalculatorProvider } from '@/components/calculator/CalculatorProvider';
import { Calculator } from '@/components/calculator/Calculator';
import React, { Suspense } from 'react';
import { useIframeHeight } from '@/lib/useIframeHeight';

function PageContent() {
    // This component is designed to be embedded in an iframe.
    // It has a transparent background to blend with the parent page.
    useIframeHeight("*");

    return (
        <>
            {/* garantir canvas limpo no embed */}
            <style jsx global>{`
              html, body { margin: 0; padding: 0; background: transparent; }
            `}</style>
            <CalculatorProvider>
                <main className="w-full mx-auto">
                    <Calculator />
                </main>
            </CalculatorProvider>
        </>
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
