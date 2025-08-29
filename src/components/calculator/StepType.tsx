"use client";
import { Home, Building } from 'lucide-react';
import { useCalculator } from './CalculatorProvider';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function StepType() {
  const { data, updateData, setStep } = useCalculator();

  const handleSelect = (value: 'Minha Casa' | 'Minha Empresa') => {
    updateData({ casa_ou_empresa: value });
    setStep(2);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Card
        onClick={() => handleSelect('Minha Casa')}
        className={cn(
          'cursor-pointer hover:shadow-lg transition-shadow w-full sm:w-64',
          data.casa_ou_empresa === 'Minha Casa' && 'ring-2 ring-primary'
        )}
      >
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Home className="w-16 h-16 text-orange-500 mb-4" />
          <p className="text-lg font-semibold">Minha Casa</p>
        </CardContent>
      </Card>
      <Card
        onClick={() => handleSelect('Minha Empresa')}
        className={cn(
          'cursor-pointer hover:shadow-lg transition-shadow w-full sm:w-64',
          data.casa_ou_empresa === 'Minha Empresa' && 'ring-2 ring-primary'
        )}
      >
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Building className="w-16 h-16 text-orange-500 mb-4" />
          <p className="text-lg font-semibold">Minha Empresa</p>
        </CardContent>
      </Card>
    </div>
  );
}
