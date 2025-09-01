
// ================================================================================================
// SELETOR MAP - Onde a ponte de integração encontra o HTML existente.
// ================================================================================================
// INSTRUÇÕES:
// 1. Abra a calculadora no navegador e use a ferramenta "Inspecionar Elemento".
// 2. Encontre o seletor CSS exato para cada elemento listado abaixo.
// 3. Substitua os placeholders (ex: '#SELETOR_...') pelo seletor real.
//
// DICA: IDs são ideais (ex: '#meu-botao'). Classes também funcionam (ex: '.classe-unica .btn-proximo').
// EVITE seletores frágeis baseados na ordem (ex: 'div:nth-child(2)').
// ================================================================================================

export const SELECTORS = {
  // Navegação entre as etapas da calculadora
  navigation: {
    // Botões que avançam para a próxima etapa
    nextButtons: {
      step1: '#step-type-card-casa, #step-type-card-empresa', // Exemplo: seletor para ambos os cards que avançam
      step2: '#step-bill-continue-button', // Botão 'Continuar' da etapa de conta
      step3: '#step-timeline-continue-button', // Botão 'Continuar' da etapa de prazo
      step4: '#step-roof-continue-button', // Botão 'Continuar' da etapa de telha
      step5: '#step-location-continue-button', // Botão 'Ver Minha Economia' que leva aos resultados
    },
    // Botão final que dispara o envio dos dados
    finalSubmitButton: '#results-submit-button',
  },

  // Campos de entrada de dados do usuário
  fields: {
    // Etapa 1: Tipo de Instalação (o valor é pego do botão clicado)
    casa_ou_empresa: {
        residencial: '#step-type-card-casa',
        comercial: '#step-type-card-empresa'
    },
    // Etapa 2: Valor da Conta
    valor_da_conta_de_luz: '#slider-bill-value', // O span que mostra o valor formatado
    // Etapa 3: Prazo para Instalação
    prazo_para_instalacao: 'input[name="prazo_para_instalacao"]:checked', // Pega o radio button selecionado
    // Etapa 4: Tipo de Telha (o valor é pego do card clicado)
    tipo_de_telha: '.roof-card[data-selected="true"]', // Um card com um atributo que indica seleção
    // Etapa 5: Localização
    cidade: '#cidade',
    bairro: '#bairro',
    cep: '#cep',
    // Etapa Final: Dados de Contato
    nome: '#nome',
    whatsapp: '#whatsapp',
  },

  // Elementos que exibem os resultados calculados na UI
  results: {
    economia_mensal_rs: '#result-economia-mensal',
    sistema_kwp: '#result-sistema-kwp',
    custo_estimado_rs: '#result-custo-estimado',
  },

  // Container principal para observação de redimensionamento
  mainContainer: 'body',
};
