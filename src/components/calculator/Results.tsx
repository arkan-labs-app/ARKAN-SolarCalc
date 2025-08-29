"use client";
import { useCalculator } from './CalculatorProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Zap, Sun, PiggyBank } from 'lucide-react';
import { useState } from 'react';

export default function Results() {
  const { data, results, updateData, reset } = useCalculator();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    updateData({ whatsapp: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.nome || !data.whatsapp) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu nome e WhatsApp para receber o orçamento.",
        variant: "destructive"
      });
      return;
    }
     if (data.whatsapp.length !== 11) {
      toast({
        title: "WhatsApp Inválido",
        description: "O número de WhatsApp deve ter 11 dígitos, incluindo o DDD.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    const allData = { ...data, ...results };
    
    // Em um app real, o postMessage pode ser usado se o app estiver em um iFrame
    window.parent.postMessage({ type: 'ROI_FORM', payload: allData }, '*');
    console.log("postMessage sent to parent with payload:", allData);
    
    toast({
      title: "Proposta a caminho!",
      description: "Você será redirecionado para nossa página de agendamento.",
      className: "bg-green-500 text-white",
    });

    // Apenas para demo, resetamos o formulário. Em produção, redirecionar.
    // setTimeout(() => {
    //   window.location.href = 'https://sua-url-de-agendamento.gohighlevel.com';
    // }, 1000);

    setTimeout(() => {
        reset();
        setIsSubmitting(false);
    }, 5000); 
  };

  if (!results) {
    return (
      <div className="text-center">
        <p>Calculando seu potencial de economia...</p>
        <Button variant="link" onClick={() => reset()}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 animate-in fade-in duration-500">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
            <Card className="w-full bg-accent/10 border-accent col-span-1 md:col-span-2">
                <CardHeader className="p-3">
                <CardTitle className="text-center text-orange-600 flex items-center justify-center gap-2 text-base"><Sun className="w-5 h-5 text-orange-500"/>Sua economia mensal pode chegar a:</CardTitle>
                <CardDescription className="text-center text-3xl md:text-4xl font-bold text-accent">
                    {formatCurrency(results.economia_mensal_rs)}
                </CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-2 gap-2 w-full text-center col-span-1 md:col-span-2">
                 <Card>
                    <CardContent className="p-3">
                        <Zap className="mx-auto w-6 h-6 text-primary mb-1" />
                        <p className="font-semibold text-sm">{formatNumber(results.geracao_kwh_mes, 0)} kWh</p>
                        <p className="text-xs text-muted-foreground">Geração Mês</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-3">
                        <Sun className="mx-auto w-6 h-6 text-primary mb-1" />
                        <p className="font-semibold text-sm">{formatNumber(results.sistema_kwp, 2)} kWp</p>
                        <p className="text-xs text-muted-foreground">Potência</p>
                    </CardContent>
                </Card>
                <Card className="col-span-2">
                    <CardContent className="p-3">
                        <PiggyBank className="mx-auto w-6 h-6 text-orange-500 mb-1" />
                        <p className="font-semibold text-orange-600 text-sm">{formatCurrency(results.economia_25_anos)}</p>
                        <p className="text-xs text-muted-foreground">Economia em 25 anos</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      
      <Card className="w-full p-4 bg-primary/10 mt-1">
        <p className="text-base font-semibold text-center text-primary mb-2">Transforme essa economia em realidade! Preencha abaixo para receber seu orçamento detalhado e gratuito.</p>
        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <div className="grid gap-1">
            <Label htmlFor="nome" className="text-foreground/90">Nome Completo</Label>
            <Input id="nome" placeholder="Seu nome e sobrenome" required value={data.nome || ''} onChange={(e) => updateData({ nome: e.target.value })} />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="whatsapp" className="text-foreground/90">WhatsApp</Label>
            <Input id="whatsapp" type="tel" placeholder="(00) 90000-0000" required value={data.whatsapp || ''} onChange={handleWhatsappChange}/>
          </div>
          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 text-base md:text-lg font-bold py-3 md:py-7 shadow-lg hover:scale-105 transition-transform">
            {isSubmitting ? 'ENVIANDO...' : 'QUERO MEU ORÇAMENTO GRÁTIS!'}
          </Button>
        </form>
      </Card>
      
       <p className="text-xs text-muted-foreground text-center px-4 mt-1">
        *Esta é uma estimativa. A economia real pode variar.
      </p>

      <Button variant="link" onClick={reset} className="h-auto p-0 mt-1 text-xs">Fazer nova simulação</Button>
    </div>
  );
}
