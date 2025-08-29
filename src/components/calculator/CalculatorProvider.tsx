"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
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

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<CalculatorData>>(initialData);
  const [params, setParams] = useState<CalculationParams>(defaults);
  
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
  }, [searchParams]);

  const updateData = (update: Partial<CalculatorData>) => {
    setData((prev) => ({ ...prev, ...update }));
  };
  
  const reset = () => {
      setData(initialData);
      setStep(1);
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
