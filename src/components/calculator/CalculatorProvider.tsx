
"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
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
  setParams: (params: CalculationParams | ((prev: CalculationParams) => CalculationParams)) => void;
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
        // Tenta chamar a função proxy na janela pai, se existir
        if (window.parent && typeof (window.parent as any).GHL_WEBHOOK_PROXY === 'function') {
            (window.parent as any).GHL_WEBHOOK_PROXY(data);
        } else {
            // Fallback para postMessage se o proxy não estiver disponível
            window.parent.postMessage({
                type: 'ARKAN_SOLAR_CALC_UPDATE',
                payload: data
            }, '*'); // Use um targetOrigin mais específico em produção se possível
        }
        console.log("Data posted to parent:", data);
    }
}

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [step, _setStep] = useState(1);
  const [data, setData] = useState<Partial<CalculatorData>>(initialData);
  const [params, setParams] = useState<CalculationParams>(defaults);
  
  const setStep = useCallback((newStep: number) => {
    _setStep(newStep);
    // Dispara a função global para recalcular a altura do iframe
    if (typeof window !== 'undefined' && (window as any).sendIframeHeight) {
      // Adiciona um pequeno delay para garantir que o DOM foi atualizado
      setTimeout(() => (window as any).sendIframeHeight(), 50);
    }
  }, []);

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
