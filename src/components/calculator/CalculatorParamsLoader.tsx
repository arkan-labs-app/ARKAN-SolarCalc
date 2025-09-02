
"use client";

import { useSearchParams } from 'next/navigation';
import { useCalculator } from './CalculatorProvider';
import { useEffect } from 'react';

// Este componente é um "Client Component" cuja única responsabilidade é
// ler os parâmetros da URL e atualizar o estado do CalculatorProvider.
// Isso isola o uso do hook `useSearchParams` e evita erros de hidratação
// durante a renderização no servidor (SSR).

export function CalculatorParamsLoader({ children }: { children: React.ReactNode }) {
    const { setParams } = useCalculator();
    const searchParams = useSearchParams();

    useEffect(() => {
        const tarifa = searchParams.get('tarifa');
        const kwhkwp = searchParams.get('kwhkwp');
        const custo = searchParams.get('custo');
        
        if (tarifa || kwhkwp || custo) {
            setParams(prev => ({
                tarifa_rs_kwh: tarifa ? Number(tarifa) : prev.tarifa_rs_kwh,
                kwh_por_kwp_mes: kwhkwp ? Number(kwhkwp) : prev.kwh_por_kwp_mes,
                custo_por_kwp_rs: custo ? Number(custo) : prev.custo_por_kwp_rs,
            }));
        }
    // `setParams` é estável e `searchParams` é o gatilho da mudança.
    // A execução única no carregamento do componente é o comportamento desejado.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    return <>{children}</>;
}
