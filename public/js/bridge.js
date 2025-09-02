// /public/js/bridge.js
const PARENT_ORIGIN = "https://funil.solar.arkanlabs.com.br";

const KEY="arkan_calc_payload";
const getState=()=>JSON.parse(localStorage.getItem(KEY)||"{}");
const setState=(p)=>localStorage.setItem(KEY, JSON.stringify({ ...getState(), ...p }));

// --- Utils ---
function toE164(t){ const d=String(t||"").replace(/\D/g,""); return d? (d.startsWith("55")? "+"+d : "+55"+d) : ""; }
function toNumber(x){ if(x==null||x==="") return undefined; return Number(String(x).replace(/[^\d,.-]/g,"").replace(/\.(?=\d{3})/g,"").replace(",",".")); }
function round2(n){ return n==null? undefined : Math.round(n*100)/100; }
function round0(n){ return n==null? undefined : Math.round(n); }

function qs(sel){ return document.querySelector(sel); }
function val(sel){ const el=qs(sel); return el? (el.value ?? el.textContent ?? "").trim() : ""; }
function click(sel, handler) { const el = qs(sel); if (el) el.addEventListener("click", handler); }

// --- Data Collection ---

function collectStepType(value) {
    const map = { 'Minha Casa': 'Residencial', 'Minha Empresa': 'Comercial' };
    setState({ casa_ou_empresa: map[value] || value });
}

function collectStepBill() {
    setState({ valor_da_conta_de_luz: toNumber(val('.text-3xl.font-bold.text-primary')) });
}

function collectStepTimeline() {
    // This value is tricky as it's inside a label with a sibling radio.
    // The component structure is complex, so we grab the checked radio's ID, which is the value.
    const checkedRadio = qs('input[type="radio"][name="r1"]:checked');
    if (checkedRadio) {
        setState({ prazo_para_instalacao: checkedRadio.id });
    }
}

function collectStepRoof() {
    // The selected card has a specific class `ring-2`. We find it and get the text.
    const selectedCard = qs('.ring-2.ring-primary.border-primary p');
    if (selectedCard) {
        setState({ tipo_de_telha: selectedCard.textContent.trim() });
    }
}

function collectStepLocationAndResults() {
    setState({
        cidade: val("#cidade"),
        bairro: val("#bairro"),
        cep: val("#cep"),
    });

    // Results are calculated, but let's grab them from the final screen
    // This is safer in case calculation logic changes.
    const economia = val(".text-3xl.md\\:text-4xl.font-bold.text-accent");
    const geracao = val("div.grid.grid-cols-3 > div:nth-child(1) > div > p.font-semibold");
    const economia25anos = val("div.grid.grid-cols-3 > div:nth-child(2) > div > p.font-semibold");
    const potencia = val("div.grid.grid_cols-3 > div:nth-child(3) > div > p.font-semibold");
    
    // We can't get all payload fields from the DOM, but we can get some.
    // The most important ones are the results.
    setState({
        economia_mensal_rs: round2(toNumber(economia)),
        sistema_kwp: round2(toNumber(potencia)),
        // Custo estimado não está visível no DOM, teremos que confiar no cálculo anterior
        // Se precisar que ele seja lido da tela, adicione-o em algum lugar visível.
    });
}


function submitFinal() {
    const s = getState();
    const nome = val("#nome");
    const whatsapp = toE164(val("#whatsapp"));

    if (!whatsapp || whatsapp.length < 12) { // ex: +5511987654321
        console.error("GHL Bridge: Invalid WhatsApp number. Aborting submission.");
        alert("Por favor, insira um número de WhatsApp válido com DDD.");
        return;
    }

    const payload = {
        whatsapp,
        nome: nome,
        cidade: s.cidade,
        cep: s.cep,
        casa_ou_empresa: s.casa_ou_empresa,
        valor_da_conta_de_luz: s.valor_da_conta_de_luz,
        prazo_para_instalacao: s.prazo_para_instalacao,
        tipo_de_telha: s.tipo_de_telha,
        bairro: s.bairro,
        economia_mensal_rs: s.economia_mensal_rs,
        sistema_kwp: s.sistema_kwp,
        custo_estimado_rs: s.custo_estimado_rs // This is not on screen, comes from state
    };
    
    console.log("GHL Bridge: Submitting payload...", payload);

    try {
        const h = document.documentElement.scrollHeight;
        window.parent.postMessage({ type: "ARKAN_SOLAR_CALC_RESIZE", height: h }, PARENT_ORIGIN);
    } catch(e) {
        console.warn("GHL Bridge: Could not send resize message.", e);
    }

    window.parent.postMessage({ type: "ARKAN_SOLAR_CALC_SUBMIT", payload }, PARENT_ORIGIN);

    try {
        if (typeof window.top?.GHL_WEBHOOK_PROXY === "function") {
            window.top.GHL_WEBHOOK_PROXY(payload);
            console.log("GHL Bridge: GHL_WEBHOOK_PROXY called.");
        }
    } catch(e) {
        console.warn("GHL Bridge: Could not call GHL_WEBHOOK_PROXY.", e);
    }

    localStorage.removeItem(KEY);
}

// ====== BINDINGS ======
function bind() {
    // Step 1: Type selection (auto-advances)
    click('div.sm\\:w-48:nth-child(1)', () => collectStepType('Minha Casa'));
    click('div.sm\\:w-48:nth-child(2)', () => collectStepType('Minha Empresa'));

    // Step 2 -> 3
    click('div.flex.justify-center.gap-4.w-full.mt-4 > button:nth-child(2)', collectStepBill);

    // Step 3 -> 4
    click('div.flex.justify-center.gap-4.w-full.mt-2 > button:nth-child(2)', collectStepTimeline);

    // Step 4 -> 5
    click('button.font-bold', collectStepRoof);

    // Step 5 -> Results
    click('button[disabled=false].bg-gradient-to-r', collectStepLocationAndResults);

    // Final Submit
    click('button[type="submit"]', submitFinal);

    // Auto-resize listener
    try {
        const ro = new ResizeObserver(() => {
          const h = document.documentElement.scrollHeight;
          window.parent.postMessage({ type: "ARKAN_SOLAR_CALC_RESIZE", height: h }, PARENT_ORIGIN);
        });
        ro.observe(document.body);
    } catch(e) {
      console.warn("GHL Bridge: ResizeObserver not supported or failed to init.", e);
    }
}

// Clear state on first load to prevent stale data
localStorage.removeItem(KEY);
document.addEventListener("DOMContentLoaded", bind);
