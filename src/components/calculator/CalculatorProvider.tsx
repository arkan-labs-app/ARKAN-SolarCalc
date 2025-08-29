
"use client";

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import type { CalculatorData, CalculationParams, CalculationResults } from '@/types';
import { calculateROI } from '@/lib/calculator';
import defaults from '@/config/defaults.json';

type CalculatorContextType = {
  step: number;
  setStep: (step: number) => void;
  data: Partial<CalculatorData>;
  updateData: (update: Partial<CalculatorData>) => void;
  results: CalculationResults | null;
  params: CalculationParams;
  setParams: (params: CalculationParams) => void;
  reset: () => void;
};

const CalculatorContext = createContext<CalculatorContextType | null>(null);

const initialData: Partial<CalculatorData> = {
  valor_da_conta_de_luz: 1400,
  casa_ou_empresa: 'Minha Casa',
};

const postDataToParent = (data: any) => {
    // Garante que o código só será executado no lado do cliente
    if (typeof window !== 'undefined') {
        window.parent.postMessage({
            type: 'ARKAN_SOLAR_CALC_UPDATE',
            payload: data
        }, '*'); // Use um targetOrigin mais específico em produção se possível
        console.log("Data posted to parent:", data);
    }
}

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [step, _setStep] = useState(1);
  const [data, setData] = useState<Partial<CalculatorData>>(initialData);
  const [params, setParams] = useState<CalculationParams>(defaults);
  
  const searchParams = useSearchParams();

  const setStep = useCallback((newStep: number) => {
    _setStep(newStep);
    // Dispara a função global para recalcular a altura do iframe
    if (typeof window !== 'undefined' && (window as any).sendIframeHeight) {
      // Adiciona um pequeno delay para garantir que o DOM foi atualizado
      setTimeout(() => (window as any).sendIframeHeight(), 50);
    }
  }, []);

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
  }, [searchParams]);

  const updateData = (update: Partial<CalculatorData>) => {
    const newData = { ...data, ...update };
    setData(newData);
    postDataToParent(newData); // Envia os dados atualizados a cada mudança
  };
  
  const reset = () => {
      setData(initialData);
      setStep(1);
      postDataToParent(initialData); // Reseta os dados no GHL também
  }

  const results = useMemo(() => {
    if (data.valor_da_conta_de_luz && data.valor_da_conta_de_luz > 0) {
      return calculateROI(data.valor_da_conta_de_luz, params);
    }
    return null;
  }, [data.valor_da_conta_de_luz, params]);

  const value = { step, setStep, data, updateData, results, params, setParams, reset };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}
