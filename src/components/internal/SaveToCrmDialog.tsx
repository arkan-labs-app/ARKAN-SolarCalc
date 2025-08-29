"use client"
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCalculator } from '@/components/calculator/CalculatorProvider';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

interface SaveToCrmDialogProps {
  isConnected: boolean;
  locationId?: string;
}

export function SaveToCrmDialog({ isConnected, locationId }: SaveToCrmDialogProps) {
  const { data, results, updateData } = useCalculator();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    updateData({ whatsapp: value });
  };

  const handleSave = async () => {
    if (!data.nome || !data.whatsapp) {
        toast({ title: "Preencha nome e WhatsApp", variant: "destructive"});
        return;
    }
    // Basic phone validation for Brazil
    if (!/^\d{10,11}$/.test(data.whatsapp)) {
        toast({
            title: "WhatsApp Inválido",
            description: "O número de WhatsApp deve ter 10 ou 11 dígitos, incluindo o DDD.",
            variant: "destructive"
        });
        return;
    }


    setLoading(true);
    try {
        const payload = {
          locationId,
          name: data.nome,
          phone: data.whatsapp,
          email: data.email || '',
          entrada: {
            casa_ou_empresa: data.casa_ou_empresa,
            valor_da_conta_de_luz: data.valor_da_conta_de_luz,
            prazo_para_instalacao: data.prazo_para_instalacao,
            tipo_de_telha: data.tipo_de_telha,
            cidade: data.cidade,
            bairro: data.bairro,
            cep: data.cep,
          },
          saida: results
        };

        const response = await fetch('/api/ghl/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Falha ao salvar no CRM');
        }
        
        toast({ title: "Salvo no CRM!", description: `Contato e oportunidade atualizados. ID do Contato: ${result.contactId}`});
        setOpen(false);

    } catch (error) {
        toast({ title: "Erro ao Salvar", description: (error as Error).message, variant: 'destructive'});
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={!results || !isConnected}>
          <Save className="mr-2 h-4 w-4" /> Salvar no CRM (GHL)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Salvar Contato no CRM</DialogTitle>
          <DialogDescription>
            Preencha os dados do cliente para criar ou atualizar um contato e uma oportunidade no GoHighLevel.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input id="name" value={data.nome || ''} onChange={(e) => updateData({ nome: e.target.value })} className="col-span-3" placeholder="Nome do Cliente" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="whatsapp" className="text-right">
              WhatsApp
            </Label>
            <Input id="whatsapp" value={data.whatsapp || ''} onChange={handleWhatsappChange} className="col-span-3" placeholder="Apenas números (com DDD)" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" type="email" value={data.email || ''} onChange={(e) => updateData({ email: e.target.value })} className="col-span-3" placeholder="Email (opcional)" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
