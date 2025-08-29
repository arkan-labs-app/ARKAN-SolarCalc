"use client";

import { useCalculator } from '@/components/calculator/CalculatorProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ProgressBar } from './ProgressBar';
import StepType from './StepType';
import StepBill from './StepBill';
import StepTimeline from './StepTimeline';
import StepRoof from './StepRoof';
import StepLocation from './StepLocation';
import Results from './Results';

const TOTAL_STEPS = 5;

const stepContent: { [key: number]: { component: React.ComponentType; title: React.ReactNode, description: string } } = {
  1: { component: StepType, title: 'Chega de pagar caro na conta de luz!', description: 'Primeiro, nos diga: a instalação é para sua casa ou empresa?' },
  2: { component: StepBill, title: 'Qual o valor médio da sua conta de luz?', description: 'Use a barra para ajustar o valor médio mensal.' },
  3: { component: StepTimeline, title: 'Em quanto tempo você sonha em gerar sua própria energia?', description: 'Saber seu prazo nos ajuda a criar a proposta ideal para você.' },
  4.0: { component: StepRoof, title: 'Qual o tipo da sua cobertura?', description: 'Cada tipo tem uma forma especial de instalação - nos ajude a personalizar seu projeto!' },
  5: { component: StepLocation, title: 'Onde o futuro da sua energia será construído?', description: 'Preencha sua cidade e bairro para uma estimativa mais precisa.' },
  6: { component: Results, title: 'Impressionante! Sua economia está pronta!', description: '' },
};

export function Calculator() {
  const { step } = useCalculator();
  
  // Default to step 1 if step is out of bounds
  const currentStepInfo = stepContent[step] || stepContent[1];
  const { component: CurrentStepComponent, title, description } = currentStepInfo;


  return (
    <Card className="w-full max-w-2xl shadow-2xl overflow-hidden border-none rounded-2xl bg-gradient-to-br from-primary via-blue-500 to-cyan-400">
      <CardHeader className="text-primary-foreground p-6 md:p-8">
        {step === 1 ? (
            <>
                <h1 className="text-center text-2xl md:text-3xl font-bold">Chega de pagar caro na conta de luz!</h1>
                <CardDescription className="text-center text-primary-foreground/90 pt-2 text-base md:text-lg">
                    Descubra em 1 minuto o quanto você pode <span className="font-bold text-white">economizar com energia solar</span> e peça seu orçamento.
                </CardDescription>
            </>
        ) : (
             <h1 className="text-center text-2xl md:text-3xl font-bold">{title}</h1>
        )}
      </CardHeader>
      <CardContent className="p-4 md:p-6 bg-card">
        {step <= TOTAL_STEPS && <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />}
        <h2 className="text-sm md:text-base font-medium text-center my-4 md:my-6 text-foreground/80">{description}</h2>
        <div className="min-h-[250px] md:min-h-[280px] flex flex-col justify-center">
            <CurrentStepComponent />
        </div>
      </CardContent>
    </Card>
  );
}
