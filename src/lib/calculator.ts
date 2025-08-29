import type { CalculationParams, CalculationResults } from '@/types';

const TAXA_MINIMA_PERCENTUAL = 0.05; // Representa a taxa de disponibilidade, geralmente 5%
const ANOS_GARANTIA = 25;

export function calculateROI(
  valor_da_conta_de_luz: number,
  params: CalculationParams
): CalculationResults {
  const { tarifa_rs_kwh, kwh_por_kwp_mes, custo_por_kwp_rs } = params;

  // Calcula o consumo considerando que uma pequena parte da conta sempre existirá (taxa mínima)
  const valor_consumo_real = valor_da_conta_de_luz * (1 - TAXA_MINIMA_PERCENTUAL);

  const consumo_kwh_mes = valor_consumo_real / tarifa_rs_kwh;
  const sistema_kwp = consumo_kwh_mes / kwh_por_kwp_mes;
  const custo_estimado_rs = sistema_kwp * custo_por_kwp_rs;
  const geracao_kwh_mes = sistema_kwp * kwh_por_kwp_mes;
  
  const economia_mensal_rs = Math.min(
    valor_consumo_real,
    geracao_kwh_mes * tarifa_rs_kwh
  );
  
  const payback_meses = custo_estimado_rs / Math.max(economia_mensal_rs, 1);
  const economia_25_anos = economia_mensal_rs * ANOS_GARANTIA * 12;

  return {
    consumo_kwh_mes: valor_da_conta_de_luz / tarifa_rs_kwh, // Mantém o consumo total para exibição
    sistema_kwp,
    custo_estimado_rs,
    geracao_kwh_mes,
    economia_mensal_rs,
    payback_meses,
    economia_25_anos,
  };
}
