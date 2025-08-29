"use client";
import { useCalculator } from './CalculatorProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StepLocation() {
  const { data, updateData, setStep } = useCalculator();

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    updateData({ cep: value });
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <div className="grid gap-4 w-full">
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
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              placeholder="Ex: 01000-000"
              value={data.cep || ''}
              onChange={handleCepChange}
              maxLength={8}
              required
            />
        </div>
      </div>
      <div className="flex justify-center gap-4 w-full mt-4">
        <Button variant="outline" onClick={() => setStep(4)}>
          &larr; Voltar
        </Button>
        <Button onClick={() => setStep(6)} disabled={!data.cidade || !data.bairro || !data.cep} className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:scale-105 transition-transform">
          Ver Minha Economia &rarr;
        </Button>
      </div>
    </div>
  );
}
