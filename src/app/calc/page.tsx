
"use client";
import { CalculatorProvider } from '@/components/calculator/CalculatorProvider';
import { Calculator } from '@/components/calculator/Calculator';
import React, { Suspense } from 'react';
import Script from 'next/script';
import { useIframeHeight } from '@/lib/useIframeHeight';
import { CalculatorParamsLoader } from '@/components/calculator/CalculatorParamsLoader';

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
            <Script src="/js/bridge.js" type="module" strategy="lazyOnload" />
            <CalculatorProvider>
                <CalculatorParamsLoader>
                    <main className="w-full mx-auto">
                        <Calculator />
                    </main>
                </CalculatorParamsLoader>
            </CalculatorProvider>
        </>
    )
}

export default function CalculatorPage() {
  // O Suspense é crucial aqui para garantir que os componentes Client
  // que usam hooks como `useSearchParams` não causem erros de hidratação.
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  );
}
