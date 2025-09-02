import { Progress } from '@/components/ui/progress';

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;
  return (
    <div className="w-full mb-4">
        <Progress value={progressPercentage} className="w-full progress-gradient" />
        <p className="text-sm text-muted-foreground text-center mt-2">
            Passo {currentStep} de {totalSteps}
        </p>
    </div>
  );
}
