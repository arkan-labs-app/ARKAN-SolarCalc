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

export function SaveToCrmDialog() {
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
    if (data.whatsapp.length !== 11) {
        toast({
            title: "WhatsApp Inválido",
            description: "O número de WhatsApp deve ter 11 dígitos, incluindo o DDD.",
            variant: "destructive"
        });
        return;
    }


    setLoading(true);
    try {
        const payload = { ...data, ...results };
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Falha ao salvar no CRM');
        }
        
        const result = await response.json();

        toast({ title: "Sucesso!", description: `Contato e oportunidade atualizados no CRM. ID: ${result.contactId}`});
        setOpen(false);

    } catch (error) {
        toast({ title: "Erro", description: (error as Error).message, variant: 'destructive'});
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={!results}>
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
