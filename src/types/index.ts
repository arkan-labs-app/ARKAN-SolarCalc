import type {z} from 'zod';

export const CalculatorSchema = z.object({
  casa_ou_empresa: z.enum(['Minha Casa', 'Minha Empresa']),
  valor_da_conta_de_luz: z.number().min(300).max(5000),
  prazo_para_instalacao: z.string().min(1, 'Selecione um prazo'),
  tipo_de_telha: z.string().min(1, 'Selecione um tipo de telha'),
  cidade: z.string().min(1, "A cidade é obrigatória"),
  bairro: z.string().min(1, "O bairro é obrigatório"),
  cep: z.string().optional(),
  nome: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional(),
});

export type CalculatorData = z.infer<typeof CalculatorSchema>;

export interface CalculationParams {
  tarifa_rs_kwh: number;
  kwh_por_kwp_mes: number;
  custo_por_kwp_rs: number;
}

export interface CalculationResults {
  consumo_kwh_mes: number;
  sistema_kwp: number;
  custo_estimado_rs: number;
  geracao_kwh_mes: number;
  economia_mensal_rs: number;
  payback_meses: number;
  economia_25_anos: number;
}
