
import { SELECTORS } from './selectors.js';

// ================================================================================================
// CONFIGURAÇÃO
// ================================================================================================
// Domínio da página pai autorizada a receber mensagens. Altere para o seu domínio de produção.
const PARENT_ORIGIN = 'https://funil.solar.arkanlabs.com.br';
// Chave usada para salvar o estado no localStorage.
const STORAGE_KEY = 'arkan_calc_payload';


// ================================================================================================
// HELPERS - Funções Utilitárias
// ================================================================================================

/**
 * Funções de persistência de dados no localStorage.
 */
const stateManager = {
  get: () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'),
  set: (newData) => localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stateManager.get(), ...newData })),
  clear: () => localStorage.removeItem(STORAGE_KEY),
};

/**
 * Converte um número de telefone brasileiro para o formato internacional E.164.
 * @param {string} brPhone - Ex: '(11) 98888-7777'
 * @returns {string} - Ex: '+5511988887777'
 */
function toE164(brPhone) {
  const digitsOnly = String(brPhone || '').replace(/\D/g, '');
  if (!digitsOnly || digitsOnly.length < 10) return '';
  return digitsOnly.length === 11 || digitsOnly.length === 10 ? `+55${digitsOnly}` : '';
}

/**
 * Extrai um valor numérico de uma string (ex: "R$ 1.234,56" -> 1234.56).
 * @param {string | null} value - A string a ser convertida.
 * @returns {number | undefined} - O número convertido ou undefined.
 */
function getNumber(value) {
  if (value === '' || value == null) return undefined;
  const cleaned = String(value).replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
}

/**
 * Busca um elemento no DOM de forma segura.
 * @param {string} selector - O seletor CSS.
 * @returns {HTMLElement | null}
 */
const $ = (selector) => document.querySelector(selector);


// ================================================================================================
// LÓGICA PRINCIPAL - Captura e Envio de Dados
// ================================================================================================

/**
 * Coleta dados dos campos da etapa atual e salva no estado.
 */
function collectAndSaveStepData() {
    const data = {};
    const fields = SELECTORS.fields;

    // A lógica para extrair os valores depende de como eles estão no DOM.
    // Adapte conforme necessário (ex: .innerText, .value, data-attributes).
    
    if ($(fields.cidade)) data.cidade = $(fields.cidade).value;
    if ($(fields.bairro)) data.bairro = $(fields.bairro).value;
    if ($(fields.cep)) data.cep = $(fields.cep).value;
    if ($(fields.nome)) data.nome = $(fields.nome).value;
    if ($(fields.whatsapp)) data.whatsapp = $(fields.whatsapp).value;

    const valorContaEl = $(fields.valor_da_conta_de_luz);
    if(valorContaEl) data.valor_da_conta_de_luz = getNumber(valorContaEl.innerText);

    const prazoEl = $(fields.prazo_para_instalacao);
    if(prazoEl) data.prazo_para_instalacao = prazoEl.value;
    
    // Para seleções baseadas em cliques, o valor é capturado no listener do clique.
    
    console.log('Saving step data:', data);
    stateManager.set(data);
}


/**
 * Constrói o payload final a partir do estado salvo e dos resultados na UI.
 * @returns {object | null} - O payload completo ou null se dados essenciais faltarem.
 */
function buildFinalPayload() {
    const state = stateManager.get();
    const results = SELECTORS.results;

    const economiaEl = $(results.economia_mensal_rs);
    const kwpEl = $(results.sistema_kwp);
    const custoEl = $(results.custo_estimado_rs);

    const finalPayload = {
      // Identificação
      whatsapp: toE164(state.whatsapp),
      nome: state.nome || '',
      
      // Perfil
      cidade: state.cidade || '',
      cep: state.cep || '',
      bairro: state.bairro || '',
      casa_ou_empresa: state.casa_ou_empresa || '',
      valor_da_conta_de_luz: state.valor_da_conta_de_luz,
      prazo_para_instalacao: state.prazo_para_instalacao || '',
      tipo_de_telha: state.tipo_de_telha || '',

      // Resultados
      economia_mensal_rs: economiaEl ? getNumber(economiaEl.innerText) : undefined,
      sistema_kwp: kwpEl ? getNumber(kwpEl.innerText) : undefined,
      custo_estimado_rs: custoEl ? getNumber(custoEl.innerText) : undefined,
    };
    
    // Validação Mínima
    if (!finalPayload.whatsapp) {
        alert('Por favor, preencha um número de WhatsApp válido.');
        return null;
    }

    return finalPayload;
}


/**
 * Envia os dados para a página pai via postMessage.
 */
function submitData() {
    const payload = buildFinalPayload();
    
    if (payload) {
        console.log('Submitting final payload to parent:', payload);
        window.parent.postMessage(
          { type: 'ARKAN_SOLAR_CALC_SUBMIT', payload },
          PARENT_ORIGIN
        );
        // Limpa o estado após o envio bem-sucedido
        stateManager.clear();
    }
}


// ================================================================================================
// INSTRUMENTAÇÃO - Anexa os listeners aos elementos da UI
// ================================================================================================

function instrument() {
    console.log('Bridge Instrumenting...');

    // Listener para o botão final de submissão
    const finalButton = $(SELECTORS.navigation.finalSubmitButton);
    if (finalButton) {
        finalButton.addEventListener('click', (e) => {
            e.preventDefault();
            collectAndSaveStepData(); // Garante que os últimos campos (nome/whats) sejam salvos
            submitData();
        });
    } else {
        console.warn('Final submit button not found with selector:', SELECTORS.navigation.finalSubmitButton);
    }

    // Listeners para salvar dados ao avançar de etapa
    Object.values(SELECTORS.navigation.nextButtons).forEach(selector => {
        document.querySelectorAll(selector).forEach(button => {
            button.addEventListener('click', collectAndSaveStepData);
        });
    });

    // Listeners especiais para elementos que não são inputs diretos
    const { residencial, comercial } = SELECTORS.fields.casa_ou_empresa;
    if ($(residencial)) $(residencial).addEventListener('click', () => stateManager.set({ casa_ou_empresa: 'Residencial' }));
    if ($(comercial)) $(comercial).addEventListener('click', () => stateManager.set({ casa_ou_empresa: 'Comercial' }));

    const telhaSelector = SELECTORS.fields.tipo_de_telha;
    if(telhaSelector) {
        // Assume que o clique adiciona uma classe ou atributo que podemos observar
        // ou que o texto do card clicado pode ser capturado.
        document.body.addEventListener('click', (e) => {
            const card = e.target.closest(telhaSelector);
            if (card) {
                // Exemplo: buscando o texto dentro do card. Adapte se for outra lógica.
                const textEl = card.querySelector('p');
                if (textEl) {
                    stateManager.set({ tipo_de_telha: textEl.innerText.trim() });
                }
            }
        });
    }

    // Auto-resizing do Iframe
    try {
        new ResizeObserver(() => {
            const h = document.documentElement.scrollHeight;
            window.parent.postMessage({ type: 'ARKAN_SOLAR_CALC_RESIZE', height: h }, PARENT_ORIGIN);
        }).observe($(SELECTORS.mainContainer) || document.body);
    } catch(e) {
        console.warn("ResizeObserver not supported or failed to initialize.", e);
    }

    console.log('Bridge Instrumented Successfully.');
}


// Inicia a instrumentação quando o DOM estiver pronto.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', instrument);
} else {
    instrument();
}
