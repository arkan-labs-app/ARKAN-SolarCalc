import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Helper function to make API calls to GHL
async function ghlRequest(endpoint: string, method: 'POST' | 'GET' | 'PUT' | 'DELETE', body?: any) {
  const accessToken = cookies().get('ghl_access_token')?.value;
  if (!accessToken) {
    throw new Error('GHL Access Token not found.');
  }

  const url = `https://services.leadconnectorhq.com${endpoint}`;
  
  const options: RequestInit = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Version': '2021-07-28',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`GHL API Error (${response.status}) on ${url}:`, errorBody);
    throw new Error(`Failed to execute GHL API request. Status: ${response.status} - ${errorBody}`);
  }

  // some GHL API calls return 204 No Content or other statuses with an empty body
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {};
  }
  try {
    return await response.json();
  } catch (e) {
    // Handle cases where response is not JSON but still valid (e.g., successful delete)
    return {};
  }
}

async function findContactByPhone(phone: string, locationId: string) {
    try {
        const response = await ghlRequest(`/v1/contacts/lookup?locationId=${locationId}&phone=${encodeURIComponent(phone)}`, 'GET');
        if (response && response.contacts && response.contacts.length > 0) {
            return response.contacts[0];
        }
    } catch (e) {
        // If lookup fails (e.g. 404), it means contact doesn't exist.
        if ((e as Error).message.includes('404')) {
            return null;
        }
        // For other errors, re-throw.
        throw e;
    }
    return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ...data } = body;
    const locationId = cookies().get('ghl_location_id')?.value;

    if (!locationId) {
        return NextResponse.json({ error: 'Location ID not found' }, { status: 400 });
    }
    if (!data.whatsapp) {
        return NextResponse.json({ error: 'WhatsApp number is required to find or create a contact.' }, { status: 400 });
    }

    // 1. Find or Create Contact
    let contact = await findContactByPhone(data.whatsapp, locationId);
    let contactId;

    const customFieldsPayload = Object.entries({
      valor_da_conta_de_luz: data.valor_da_conta_de_luz,
      casa_ou_empresa: data.casa_ou_empresa,
      prazo_para_instalacao: data.prazo_para_instalacao,
      tipo_de_telha: data.tipo_de_telha,
      cidade: data.cidade,
      bairro: data.bairro,
      consumo_kwh_mes: data.consumo_kwh_mes,
      sistema_kwp: data.sistema_kwp,
      custo_estimado_rs: data.custo_estimado_rs,
      geracao_kwh_mes: data.geracao_kwh_mes,
      economia_mensal_rs: data.economia_mensal_rs,
      payback_meses: data.payback_meses,
      economia_25_anos: data.economia_25_anos,
    }).map(([key, value]) => ({
      key,
      value: String(value),
    })).filter(field => field.value !== undefined && field.value !== null && field.value !== 'undefined');
    
    
    if (contact) {
        // Contact exists, update it
        contactId = contact.id;
        const updatePayload = {
            customField: customFieldsPayload.reduce((acc, { key, value }) => {
                acc[key] = value;
                return acc;
            }, {} as Record<string, string>),
        };
        await ghlRequest(`/v1/contacts/${contactId}`, 'PUT', updatePayload);
    } else {
        // Contact does not exist, create it
        const createPayload = {
            name: data.nome,
            phone: data.whatsapp,
            locationId: locationId,
            customField: customFieldsPayload.reduce((acc, { key, value }) => {
                acc[key] = value;
                return acc;
            }, {} as Record<string, string>),
        };
        const newContact = await ghlRequest('/v1/contacts/', 'POST', createPayload);
        contactId = newContact.contact.id;
    }

    // 2. Find or Create Opportunity
    const pipelines = await ghlRequest(`/v1/pipelines?locationId=${locationId}`, 'GET');
    const pipelineId = pipelines?.pipelines?.find((p: any) => p.name === "Pipeline de Vendas")?.id;
    
    if (!pipelineId) {
        // This is a fallback pipeline if "Pipeline de Vendas" is not found.
        // You might want to handle this more gracefully.
        console.warn("Could not find pipeline 'Pipeline de Vendas', using first available.");
        const fallbackPipelineId = pipelines?.pipelines?.[0]?.id;
        if (!fallbackPipelineId) {
             throw new Error('No pipelines found for this location.');
        }
        // In a real app, you might want to create the pipeline or throw a more specific error.
        throw new Error("Pipeline 'Pipeline de Vendas' not found. Please create it in GoHighLevel.");
    }
    
    const pipelineStages = await ghlRequest(`/v1/pipelines/${pipelineId}/stages`, 'GET');
    const stageId = pipelineStages?.stages?.find((s: any) => s.name === "Lead")?.id;

    if (!stageId) {
       throw new Error("Stage 'Lead' not found in the 'Pipeline de Vendas'. Please create it.");
    }

    const opportunitiesResponse = await ghlRequest(`/v1/pipelines/${pipelineId}/opportunities?contact_id=${contactId}&location_id=${locationId}`, 'GET');
    
    let opportunityId;
    if (opportunitiesResponse && opportunitiesResponse.opportunities && opportunitiesResponse.opportunities.length > 0) {
        opportunityId = opportunitiesResponse.opportunities[0].id; // Use the first existing opportunity
    }

    const opportunityPayload = {
        title: `Oportunidade - ${data.nome || contact?.name} - ${new Date().toLocaleDateString()}`,
        contactId: contactId,
        monetaryValue: data.custo_estimado_rs || 0,
        pipelineId: pipelineId,
        pipelineStageId: stageId,
        status: 'open',
    };

    if (opportunityId) {
        // Update existing opportunity
        await ghlRequest(`/v1/opportunities/${opportunityId}`, 'PUT', {
             monetaryValue: opportunityPayload.monetaryValue,
             pipelineStageId: opportunityPayload.pipelineStageId, // Ensure it stays in the correct stage
             status: 'open'
        });
    } else {
        // Create new opportunity if none exists
        await ghlRequest('/v1/opportunities/', 'POST', opportunityPayload);
    }

    return NextResponse.json({ success: true, contactId: contactId });

  } catch (error) {
    console.error('[Save API Error]:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
