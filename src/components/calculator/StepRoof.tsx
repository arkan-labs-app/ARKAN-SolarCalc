"use client";
import { useCalculator } from './CalculatorProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Home, Building2, Grid, HelpCircle } from 'lucide-react';

const roofTypes = [
  { name: 'Telha Cerâmica', icon: <Home className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" /> },
  { name: 'Telha Metálica', icon: <Building2 className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" /> },
  { name: 'Laje', icon: <Grid className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" /> },
  { name: 'Outro', icon: <HelpCircle className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" /> },
]

export default function StepRoof() {
  const { data, updateData, setStep } = useCalculator();

  const handleSelect = (value: string) => {
    updateData({ tipo_de_telha: value });
  };
  
  const handleContinue = () => {
      if (data.tipo_de_telha) {
          setStep(5);
      }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <div className="w-full">
        <div className="grid grid-cols-2 gap-3">
            {roofTypes.map((roof) => (
            <Card
                key={roof.name}
                onClick={() => handleSelect(roof.name)}
                className={cn(
                'cursor-pointer hover:shadow-lg hover:border-primary transition-all group h-28 flex items-center justify-center',
                data.tipo_de_telha === roof.name && 'ring-2 ring-primary border-primary shadow-lg'
                )}
            >
                <CardContent className="flex flex-col items-center text-center p-3 gap-2">
                {roof.icon}
                <p className="font-semibold text-sm text-foreground">{roof.name}</p>
                </CardContent>
            </Card>
            ))}
        </div>
      </div>
      <div className="flex justify-center gap-4 w-full mt-4">
        <Button variant="outline" onClick={() => setStep(3)}>
          &larr; Voltar
        </Button>
        <Button onClick={handleContinue} disabled={!data.tipo_de_telha} className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:scale-105 transition-transform font-bold">
            Continuar &rarr;
        </Button>
      </div>
    </div>
  );
}
