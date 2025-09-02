
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
    <div className="w-full flex flex-col items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
            <Card
                onClick={() => handleSelect('Minha Casa')}
                className={cn(
                'cursor-pointer hover:shadow-md transition-shadow w-full sm:w-48 h-32 flex items-center justify-center',
                data.casa_ou_empresa === 'Minha Casa' && 'ring-2 ring-primary border-primary'
                )}
            >
                <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                <Home className="w-10 h-10 text-orange-500" />
                <p className="text-base font-semibold">Minha Casa</p>
                </CardContent>
            </Card>
            <Card
                onClick={() => handleSelect('Minha Empresa')}
                className={cn(
                'cursor-pointer hover:shadow-md transition-shadow w-full sm:w-48 h-32 flex items-center justify-center',
                data.casa_ou_empresa === 'Minha Empresa' && 'ring-2 ring-primary border-primary'
                )}
            >
                <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                <Building className="w-10 h-10 text-orange-500" />
                <p className="text-base font-semibold">Minha Empresa</p>
                </CardContent>
            </Card>
        </div>
         {/* No navigation buttons here as selection auto-advances */}
    </div>
  );
}
