"use client";
import { useCalculator } from './CalculatorProvider';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/utils';

export default function StepBill() {
  const { data, updateData, setStep } = useCalculator();

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md">
      <div className="w-full">
        <div className="text-center text-3xl sm:text-4xl font-bold text-primary mb-4 truncate">
          {formatCurrency(data.valor_da_conta_de_luz || 0)}
        </div>
        <Slider
          value={[data.valor_da_conta_de_luz || 300]}
          onValueChange={(value) => updateData({ valor_da_conta_de_luz: value[0] })}
          min={300}
          max={2500}
          step={50}
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>{formatCurrency(300)}</span>
          <span>{formatCurrency(2500)}</span>
        </div>
      </div>
      <div className="flex justify-center gap-4 w-full mt-4">
        <Button variant="outline" onClick={() => setStep(1)}>
          &larr; Voltar
        </Button>
        <Button onClick={() => setStep(3)} className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:scale-105 transition-transform">
          Continuar &rarr;
        </Button>
      </div>
    </div>
  );
}
