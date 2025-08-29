"use client";
import { useCalculator } from './CalculatorProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StepLocation() {
  const { data, updateData, setStep } = useCalculator();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid gap-3 w-full max-w-md">
        <div className="grid gap-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              placeholder="Ex: São Paulo"
              value={data.cidade || ''}
              onChange={(e) => updateData({ cidade: e.target.value })}
              required
            />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="bairro">Bairro</Label>
            <Input
              id="bairro"
              placeholder="Ex: Centro"
              value={data.bairro || ''}
              onChange={(e) => updateData({ bairro: e.target.value })}
              required
            />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="cep">CEP (Opcional)</Label>
            <Input
              id="cep"
              placeholder="Ex: 12345-678"
              value={data.cep || ''}
              onChange={(e) => updateData({ cep: e.target.value })}
            />
        </div>
      </div>
      <div className="flex justify-center gap-4 w-full mt-2">
        <Button variant="outline" onClick={() => setStep(4)}>
          &larr; Voltar
        </Button>
        <Button onClick={() => setStep(6)} disabled={!data.cidade || !data.bairro} className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:scale-105 transition-transform">
          Ver Minha Economia &rarr;
        </Button>
      </div>
    </div>
  );
}
