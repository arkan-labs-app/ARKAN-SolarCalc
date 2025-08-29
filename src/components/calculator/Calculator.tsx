
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

// Updated step content to match the reference image
const stepContent: { [key: number]: { component: React.ComponentType; title: React.ReactNode, description: React.ReactNode, stepQuestion?: string } } = {
  1: { component: StepType, title: 'Chega de pagar caro na conta de luz!', description: 'Descubra em menos de 1 minuto o quanto você pode economizar com energia solar e peça seu orçamento.', stepQuestion: 'Primeiro, nos diga: a instalação é para sua casa ou empresa?' },
  2: { component: StepBill, title: 'Chega de pagar caro na conta de luz!', description: 'Descubra em menos de 1 minuto o quanto você pode economizar com energia solar e peça seu orçamento.', stepQuestion: 'Qual o valor médio da sua conta de luz?' },
  3: { component: StepTimeline, title: 'Chega de pagar caro na conta de luz!', description: 'Descubra em menos de 1 minuto o quanto você pode economizar com energia solar e peça seu orçamento.', stepQuestion: 'Em quanto tempo você sonha em gerar sua própria energia?' },
  4: { component: StepRoof, title: 'Chega de pagar caro na conta de luz!', description: 'Descubra em menos de 1 minuto o quanto você pode economizar com energia solar e peça seu orçamento.', stepQuestion: 'Qual o tipo da sua cobertura?' },
  5: { component: StepLocation, title: 'Chega de pagar caro na conta de luz!', description: 'Descubra em menos de 1 minuto o quanto você pode economizar com energia solar e peça seu orçamento.', stepQuestion: 'Onde o futuro da sua energia será construído?' },
  6: { component: Results, title: 'Impressionante! Sua economia está pronta!', description: '' },
};

export function Calculator() {
  const { step } = useCalculator();
  
  const currentStepInfo = stepContent[step] || stepContent[1];
  const { component: CurrentStepComponent, title, description, stepQuestion } = currentStepInfo;

  return (
    <Card className="w-full max-w-lg overflow-hidden rounded-2xl shadow-lg border-none bg-card">
       {step !== 6 && (
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-400 text-center p-6 text-white">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-base text-blue-100 pt-1">{description}</CardDescription>
        </CardHeader>
      )}
      <CardContent className="p-6">
        {step <= TOTAL_STEPS && <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />}
        
        <div className="min-h-[280px] flex flex-col items-center justify-center pt-2">
            {stepQuestion && <h3 className="text-center text-lg text-foreground mb-6">{stepQuestion}</h3>}
            <CurrentStepComponent />
        </div>
      </CardContent>
    </Card>
  );
}
