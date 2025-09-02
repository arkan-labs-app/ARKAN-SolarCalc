
/**
 * ==================================================================================
 * ARKAN SOLAR CALC <> GOHIGHLEVEL - BRIDGE SCRIPT (IFRAME SIDE)
 * ==================================================================================
 * Este script roda DENTRO do iframe da calculadora.
 *
 * Funcionalidades:
 * 1. Captura dados dos formulários da calculadora em cada etapa.
 * 2. Persiste os dados no localStorage para não perdê-los entre os passos.
 * 3. Monta um payload final com nomes de campo compatíveis com o GHL.
 * 4. Envia o payload final para a página pai (Landing Page) via `postMessage`.
 * 5. Tenta chamar um proxy `GHL_WEBHOOK_PROXY` na página pai para redundância.
 * 6. Envia mensagens de redimensionamento para o iframe não ter scrollbars.
 */

// ============== CONFIGURAÇÃO ==============

/**
 * @description A origem (domínio) da Landing Page do GoHighLevel onde o iframe está embutido.
 *              Isso é crucial para a segurança do `postMessage`.
 */
const PARENT_ORIGIN = "https://funil.solar.arkanlabs.com.br";

// ==========================================


// --- Utilitários ---

const KEY = "arkan_calc_payload";
const getState = () => JSON.parse(localStorage.getItem(KEY) || "{}");
const setState = (patch) => localStorage.setItem(KEY, JSON.stringify({ ...getState(), ...patch }));

const toE164 = (brPhone) => {
    const d = String(brPhone || "").replace(/\D/g, "");
    if (!d) return "";
    return d.startsWith("55") ? `+${d}` : `+55${d}`;
};

const toNumber = (x) => {
    if (x == null || x === "") return undefined;
    const s = String(x).replace(/[^\d,.-]/g, "").replace(/\.(?=\d{3})/g, "").replace(",", ".");
    return Number(s);
};

const round = (num, places) => {
    if (num == null) return undefined;
    const factor = Math.pow(10, places);
    return Math.round(num * factor) / factor;
}

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => document.querySelectorAll(selector);
const val = (el) => (el ? (el.value ?? el.textContent ?? "").trim() : "");
const on = (el, event, handler) => el?.addEventListener(event, handler);


// --- Lógica de Coleta de Dados ---

// Mapeia os botões "Continuar" para as funções que coletam os dados da etapa atual.
// A chave é o texto do botão de continuar/avançar.
const stepCollectors = {
    "Continuar →": () => {
        // Step 1: Tipo (Casa/Empresa) é pego pelo clique direto
        // Step 2: Conta de luz
        const billValue = val(qs(".text-3xl.font-bold.text-primary"));
        setState({ valor_da_conta_de_luz: toNumber(billValue) });

        // Step 3: Prazo de instalação
        const selectedTimeline = qs('input[name="radix-group-0"]:checked');
        if (selectedTimeline) {
            setState({ prazo_para_instalacao: val(selectedTimeline.nextElementSibling) });
        }

        // Step 4: Tipo de telha
        const selectedCard = qs('.ring-2.ring-primary');
        if(selectedCard) {
           const roofType = val(selectedCard.querySelector('p'));
           setState({ tipo_de_telha: roofType });
        }
    },
    "Ver Minha Economia →": () => {
        // Step 5: Localização
        setState({
            cidade: val(qs("#cidade")),
            bairro: val(qs("#bairro")),
            cep: val(qs("#cep")),
        });
    }
};


function collectResultsAndSubmit() {
    const s = getState();

    // Os resultados finais são exibidos em cards.
    const economiaEl = qs(".text-accent");
    const geracaoEl = qsa(".text-center .font-semibold.text-sm")[0];
    const potenciaEl = qsa(".text-center .font-semibold.text-sm")[2];
    
    // O custo é calculado a partir de outros valores
    const economiaMensal = toNumber(val(economiaEl));
    const sistemaKwp = toNumber(val(potenciaEl));
    const geracaoKwh = toNumber(val(geracaoEl));

    // Estimativa do custo (lógica reversa simplificada da calculadora original)
    // Custo = Payback (meses) * Economia Mensal
    // Payback (meses) não está na tela, mas podemos inferir um custo aproximado
    // se tivermos o custo por kwp, que não está presente.
    // Vamos usar a geração para estimar o custo, assumindo um custo por kwp.
    // Esta é uma aproximação. A lógica mais precisa está na calculadora.
    const custoEstimado = s.custo_estimado_rs || (sistemaKwp ? sistemaKwp * 5000 : 0);


    const finalState = {
        ...s,
        nome: val(qs("#nome")),
        whatsapp: toE164(val(qs("#whatsapp"))),
        economia_mensal_rs: round(economiaMensal, 2),
        sistema_kwp: round(sistemaKwp, 2),
        custo_estimado_rs: round(custoEstimado, 0)
    };

    if (!finalState.whatsapp || finalState.whatsapp.length < 12) {
        console.warn("ARKAN_CALC_BRIDGE: WhatsApp inválido. Envio cancelado.");
        // A UI já mostra um toast, então não precisamos de um alerta aqui.
        return;
    }
    
    const payload = {
        whatsapp: finalState.whatsapp,
        nome: finalState.nome,
        cidade: finalState.cidade,
        cep: finalState.cep,
        casa_ou_empresa: finalState.casa_ou_empresa === 'Minha Casa' ? 'Residencial' : 'Comercial',
        valor_da_conta_de_luz: finalState.valor_da_conta_de_luz,
        prazo_para_instalacao: finalState.prazo_para_instalacao,
        tipo_de_telha: finalState.tipo_de_telha,
        bairro: finalState.bairro,
        economia_mensal_rs: finalState.economia_mensal_rs,
        sistema_kwp: finalState.sistema_kwp,
        custo_estimado_rs: finalState.custo_estimado_rs,
    };
    
    console.log("ARKAN_CALC_BRIDGE: Enviando payload final...", payload);

    try {
        const h = document.documentElement.scrollHeight;
        window.parent.postMessage({ type: "ARKAN_SOLAR_CALC_RESIZE", height: h }, PARENT_ORIGIN);
    } catch (_) {}

    window.parent.postMessage({ type: "ARKAN_SOLAR_CALC_SUBMIT", payload }, PARENT_ORIGIN);
    
    try {
        if (typeof window.top?.GHL_WEBHOOK_PROXY === "function") {
            console.log("ARKAN_CALC_BRIDGE: Proxy GHL encontrado, chamando...");
            window.top.GHL_WEBHOOK_PROXY(payload);
        } else {
             console.log("ARKAN_CALC_BRIDGE: Proxy GHL não encontrado.");
        }
    } catch (e) {
        console.error("ARKAN_CALC_BRIDGE: Erro ao chamar proxy GHL.", e);
    }

    localStorage.removeItem(KEY);
}

// --- Bindings nos Elementos da UI ---

function bind() {
    // Etapa 1: Seleção de tipo (Casa/Empresa)
    qsa('.w-full.sm\\:w-48.h-32').forEach(card => {
        on(card, 'click', () => {
            const type = val(card.querySelector('p'));
            setState({ casa_ou_empresa: type });
        });
    });

    // Botões de "Continuar" e "Ver Economia" que avançam as etapas
    qsa('button').forEach(btn => {
        const btnText = val(btn);
        const collector = stepCollectors[btnText];
        if (collector) {
            on(btn, 'click', collector);
        }
    });
    
    // Botão final de envio
    const submitButton = qs('button[type="submit"]');
    on(submitButton, 'click', (event) => {
        // A validação de campos obrigatórios já é feita no componente React.
        // O `handleSubmit` do componente `Results.tsx` previne o default se a validação falhar.
        // Nós só precisamos coletar os dados e enviar DEPOIS que a validação do React passar.
        // A forma mais simples é coletar e enviar aqui, pois o clique só completa se o form for válido.
        setTimeout(collectResultsAndSubmit, 50); // Pequeno delay para garantir que o state do React atualizou
    });


    // Enviar altura do iframe em mudanças de layout
    try {
        const ro = new ResizeObserver(() => {
            const h = document.documentElement.scrollHeight;
            window.parent.postMessage({ type: "ARKAN_SOLAR_CALC_RESIZE", height: h }, PARENT_ORIGIN);
        });
        ro.observe(document.body);
    } catch (_) {}
    
    console.log("ARKAN_CALC_BRIDGE: Listeners prontos.");
}

// Inicia os bindings após o carregamento do DOM.
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
} else {
    bind();
}
