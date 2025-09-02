
"use client";

import { CalculatorProvider } from '@/components/calculator/CalculatorProvider';
import { Calculator } from '@/components/calculator/Calculator';
import React from 'react';
import { useIframeHeight } from '@/lib/useIframeHeight';
import { CalculatorParamsLoader } from '@/components/calculator/CalculatorParamsLoader';

// Este é o componente principal que será embutido no iframe.
// Ele contém toda a lógica da calculadora e a comunicação com a página pai.
export function CalculatorEmbed() {
    // Hook para ajustar a altura do iframe dinamicamente
    useIframeHeight("*");

    return (
        <>
            {/* Garante um canvas limpo no embed, sem margens ou fundos inesperados */}
            <style jsx global>{`
              html, body { 
                margin: 0; 
                padding: 0; 
                background: transparent; 
              }
            `}</style>

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
