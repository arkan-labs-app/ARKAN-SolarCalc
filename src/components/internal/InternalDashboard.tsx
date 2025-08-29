"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCalculator } from "@/components/calculator/CalculatorProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { SaveToCrmDialog } from "./SaveToCrmDialog";
import { useToast } from "@/hooks/use-toast";
import { Wifi, Copy, Settings, Sun, BarChart, FileText, WifiOff } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


interface GhlStatus {
    connected: boolean;
    locationId?: string;
}

const roofTypes = [
    'Telha Cerâmica',
    'Telha de Concreto',
    'Telha Metálica',
    'Laje',
    'Outro',
]

const timelineOptions = [
  'Imediatamente',
  'Em até 3 meses',
  'Em até 6 meses',
  'Ainda não sei',
];

const clientTypes = [
    'Minha Casa',
    'Minha Empresa',
]

export function InternalDashboard() {
  const { data, updateData, results, params, setParams } = useCalculator();
  const [ghlStatus, setGhlStatus] = useState<GhlStatus>({ connected: false });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const checkGhlStatus = () => {
     fetch('/api/auth/status')
        .then(res => res.json())
        .then(status => {
            setGhlStatus(status);
        });
  }

  useEffect(() => {
    checkGhlStatus();
    if (searchParams.get('fresh_connection') === 'true') {
        toast({ title: "Conectado com sucesso!", description: "Iniciando configuração..." });
        fetch('/api/install', { method: 'POST' })
            .then(res => res.json())
            .then(installResult => {
                if (installResult.success) {
                    toast({ title: 'Instalação completa!', description: 'Campos e menu customizados foram configurados.' });
                } else {
                    throw new Error(installResult.error);
                }
            })
            .catch(err => toast({ title: 'Erro na Instalação', description: err.message, variant: 'destructive' }));
    }
        
    const error = searchParams.get('error_description');
    if (error) {
        toast({
            title: 'Falha na conexão',
            description: error || 'Não foi possível conectar ao GoHighLevel.',
            variant: 'destructive',
        });
    }
    setLoading(false);
  }, [searchParams, toast]);
  
  const handleDisconnect = async () => {
    try {
        await fetch('/api/auth/logout', { method: 'POST'});
        toast({ title: 'Desconectado', description: 'Você foi desconectado do GoHighLevel.' });
        checkGhlStatus(); // Re-check status to update the UI
    } catch (err) {
        toast({ title: 'Erro', description: 'Não foi possível desconectar.', variant: 'destructive'});
    }
  };

  const handleCopy = () => {
    if (!results) return;
    const summary = `Resumo da Simulação ROI:\n- Economia Mensal: ${formatCurrency(results.economia_mensal_rs)}\n- Sistema: ${formatNumber(results.sistema_kwp, 2)} kWp\n- Custo Estimado: ${formatCurrency(results.custo_estimado_rs)}\n- Payback: ${formatNumber(results.payback_meses, 0)} meses`;
    navigator.clipboard.writeText(summary);
    toast({ title: 'Resumo copiado!' });
  };
  
  if (loading) {
      return (
        <div className="space-y-8 container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center">
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-10 w-48" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-80 w-full" />
                </div>
            </div>
        </div>
      );
  }


  return (
    <div className="space-y-8 container mx-auto p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
            <Sun className="h-10 w-10 text-primary hidden sm:block" />
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">SolarCalc</h1>
                <p className="text-muted-foreground">Versão para Vendedores</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            {ghlStatus.connected ? (
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-sm text-green-700 border border-green-200 bg-green-50 rounded-lg px-3 py-2 shrink-0">
                        <Wifi className="h-4 w-4"/>
                        <span className="font-medium">Conectado: {ghlStatus.locationId}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleDisconnect} aria-label="Desconectar">
                        <WifiOff className="h-4 w-4 text-muted-foreground"/>
                    </Button>
                </div>
            ) : (
                <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Link href="/api/oauth/start">
                        <Wifi className="mr-2 h-4 w-4" /> Conectar ao HighLevel
                    </Link>
                </Button>
            )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/> Dados do Cliente</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Tipo</Label>
                        <Select value={data.casa_ou_empresa} onValueChange={(value) => updateData({ casa_ou_empresa: value as any })}>
                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>
                                {clientTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="valor_conta">Valor da Conta de Luz (R$)</Label>
                        <Input id="valor_conta" type="number" placeholder="Ex: 500" value={data.valor_da_conta_de_luz || ''} onChange={e => updateData({ valor_da_conta_de_luz: Number(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Prazo para Instalação</Label>
                        <Select value={data.prazo_para_instalacao} onValueChange={(value) => updateData({ prazo_para_instalacao: value })}>
                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>
                                {timelineOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Tipo de Telha</Label>
                        <Select value={data.tipo_de_telha} onValueChange={(value) => updateData({ tipo_de_telha: value })}>
                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>
                                {roofTypes.map(roof => <SelectItem key={roof} value={roof}>{roof}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input id="cidade" placeholder="Ex: São Paulo" value={data.cidade || ''} onChange={e => updateData({ cidade: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bairro">Bairro</Label>
                        <Input id="bairro" placeholder="Ex: Centro" value={data.bairro || ''} onChange={e => updateData({ bairro: e.target.value })} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5"/> Parâmetros do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="tarifa">Tarifa (R$/kWh)</Label>
                        <Input id="tarifa" type="number" step="0.01" value={params.tarifa_rs_kwh} onChange={e => setParams({...params, tarifa_rs_kwh: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="kwh_kwp">kWh/kWp/mês</Label>
                        <Input id="kwh_kwp" type="number" value={params.kwh_por_kwp_mes} onChange={e => setParams({...params, kwh_por_kwp_mes: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="custo_kwp">Custo (R$/kWp)</Label>
                        <Input id="custo_kwp" type="number" step="100" value={params.custo_por_kwp_rs} onChange={e => setParams({...params, custo_por_kwp_rs: Number(e.target.value)})} />
                    </div>
                </CardContent>
            </Card>
        </div>
        
        <div className="space-y-6">
            <Card>
                <CardHeader>
                     <CardTitle className="flex items-center gap-2"><BarChart className="h-5 w-5"/> Resultados da Simulação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {results ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                                <Card>
                                    <CardHeader className="p-4">
                                        <CardDescription>Sistema Solar</CardDescription>
                                        <CardTitle className="text-xl md:text-2xl text-primary">{formatNumber(results.sistema_kwp, 2)} kWp</CardTitle>
                                        <p className="text-xs text-muted-foreground">{formatNumber(results.geracao_kwh_mes,0)} kWh/mês</p>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="p-4">
                                        <CardDescription>Investimento</CardDescription>
                                        <div className="text-accent font-bold flex items-baseline justify-center gap-1 text-xl md:text-2xl">
                                            <span className="text-lg">R$</span>
                                            <span>{formatNumber(results.custo_estimado_rs,0).split(',')[0]}</span>
                                            <span className="text-sm">,{formatNumber(results.custo_estimado_rs, 2).split(',')[1]}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Valor total</p>
                                    </CardHeader>
                                </Card>
                               <Card>
                                    <CardHeader className="p-4">
                                        <CardDescription>Economia Mensal</CardDescription>
                                        <div className="text-primary font-bold flex items-baseline justify-center gap-1 text-xl md:text-2xl">
                                            <span className="text-lg">R$</span>
                                            <span>{formatNumber(results.economia_mensal_rs, 0).split(',')[0]}</span>
                                            <span className="text-sm">,{formatNumber(results.economia_mensal_rs, 2).split(',')[1]}</span>
                                        </div>
                                         <p className="text-xs text-muted-foreground">Por mês</p>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="p-4">
                                        <CardDescription>Payback</CardDescription>
                                        <CardTitle className="text-xl md:text-2xl text-primary">{formatNumber(results.payback_meses, 1)} meses</CardTitle>
                                         <p className="text-xs text-muted-foreground">Retorno</p>
                                    </CardHeader>
                                </Card>
                            </div>
                             <div className="space-y-2 pt-4">
                                <SaveToCrmDialog />
                                <Button variant="outline" className="w-full" onClick={handleCopy} disabled={!results}>
                                    <Copy className="mr-2 h-4 w-4" /> Copiar p/ WhatsApp
                                </Button>
                            </div>
                        </>
                    ) : (
                        <p className="text-muted-foreground text-center py-10">Preencha os dados do cliente para calcular.</p>
                    )}
                </CardContent>
            </Card>
           
        </div>
      </div>
    </div>
  );
}
