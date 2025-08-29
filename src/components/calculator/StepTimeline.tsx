"use client";
import { useCalculator } from './CalculatorProvider';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const timelineOptions = [
  'Imediatamente',
  'Em até 3 meses',
  'Em até 6 meses',
  'Ainda não sei',
];

export default function StepTimeline() {
  const { data, updateData, setStep } = useCalculator();

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <RadioGroup
        value={data.prazo_para_instalacao}
        onValueChange={(value) => updateData({ prazo_para_instalacao: value })}
        className="grid gap-3 w-full"
      >
        {timelineOptions.map((option) => (
          <Label
            key={option}
            htmlFor={option}
            className="flex items-center gap-4 rounded-md border p-3 cursor-pointer hover:bg-accent/10 has-[[data-state=checked]]:bg-primary has-[[data-state=checked]]:text-primary-foreground has-[[data-state=checked]]:border-primary"
          >
            <RadioGroupItem value={option} id={option} />
            {option}
          </Label>
        ))}
      </RadioGroup>
      <div className="flex justify-center gap-4 w-full mt-2">
        <Button variant="outline" onClick={() => setStep(2)}>
          &larr; Voltar
        </Button>
        <Button onClick={() => setStep(4)} disabled={!data.prazo_para_instalacao} className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:scale-105 transition-transform">
          Continuar &rarr;
        </Button>
      </div>
    </div>
  );
}
