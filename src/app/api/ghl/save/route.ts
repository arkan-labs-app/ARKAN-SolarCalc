import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { CalculatorData, CalculationResults } from '@/types';

interface GhlApiConfig {
  baseUrl: string;
  accessToken: string;
  locationId: string;
}

// Simple retry mechanism with exponential backoff
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, backoff = 500): Promise<Response> {
    try {
        const response = await fetch(url, options);
        if (response.status === 429 || response.status >= 500) {
            if (retries > 0) {
                console.log(`GHL API Error (${response.status}), retrying in ${backoff}ms...`);
                await new Promise(res => setTimeout(res, backoff));
                return fetchWithRetry(url, options, retries - 1, backoff * 2);
            }
        }
        return response;
    } catch (error) {
        if (retries > 0) {
            console.log(`Network error, retrying in ${backoff}ms...`, error);
            await new Promise(res => setTimeout(res, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2);
        }
        throw error;
    }
}

// Helper to make authenticated GHL API requests
async function ghlRequest(config: GhlApiConfig, endpoint: string, method: 'POST' | 'GET' | 'PUT' | 'DELETE', body?: any) {
    const url = `${config.baseUrl}${endpoint}`;
    const options: RequestInit = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.accessToken}`,
            'Version': '2021-07-28',
        },
        body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetchWithRetry(url, options);

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`GHL API Error (${response.status}) on ${url}:`, errorBody);
        throw new Error(`Failed to execute GHL API request. Status: ${response.status} - ${errorBody}`);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {};
    }
    
    try {
        return await response.json();
    } catch (e) {
        return {};
    }
}


// --- Contact and Opportunity Management ---

async function findContactByPhone(config: GhlApiConfig, phone: string) {
    try {
        const response = await ghlRequest(config, `/contacts/lookup?locationId=${config.locationId}&phone=${encodeURIComponent(phone)}`, 'GET');
        return response?.contacts?.[0] || null;
    } catch (e) {
        if ((e as Error).message.includes('404')) return null;
        throw e;
    }
}

async function createContact(config: GhlApiConfig, data: { name: string, phone: string, email?: string, customFields: any[] }) {
    const payload = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        locationId: config.locationId,
        customField: data.customFields.reduce((acc, { id, value }) => ({ ...acc, [id]: String(value) }), {}),
    };
    const newContact = await ghlRequest(config, '/contacts/', 'POST', payload);
    return newContact?.contact;
}

async function updateContactCustomFields(config: GhlApiConfig, contactId: string, customFields: any[]) {
    const payload = {
        customField: customFields.reduce((acc, { id, value }) => ({ ...acc, [id]: String(value) }), {}),
    };
    await ghlRequest(config, `/contacts/${contactId}`, 'PUT', payload);
}


async function findOrCreateOpportunity(config: GhlApiConfig, contactId: string, data: {name: string, custo_estimado_rs: number}) {
    const PIPELINE_NAME = "Pipeline de Vendas";
    const STAGE_NAME = "Lead";

    // 1. Get Pipeline ID
    const pipelines = await ghlRequest(config, `/pipelines?locationId=${config.locationId}`, 'GET');
    const pipelineId = pipelines?.pipelines?.find((p: any) => p.name === PIPELINE_NAME)?.id;
    if (!pipelineId) throw new Error(`Pipeline "${PIPELINE_NAME}" não encontrado.`);

    // 2. Get Stage ID
    const stages = await ghlRequest(config, `/pipelines/${pipelineId}/stages`, 'GET');
    const stageId = stages?.stages?.find((s: any) => s.name === STAGE_NAME)?.id;
    if (!stageId) throw new Error(`Estágio "${STAGE_NAME}" não encontrado no pipeline.`);
    
    // 3. Find existing opportunity
    const opportunities = await ghlRequest(config, `/opportunities/search?location_id=${config.locationId}&contact_id=${contactId}`, 'GET');
    let opportunity = opportunities?.opportunities?.[0];

    const opportunityPayload = {
        title: `Oportunidade - ${data.name} - ${new Date().toLocaleDateString()}`,
        contactId: contactId,
        pipelineId: pipelineId,
        pipelineStageId: stageId,
        status: 'open',
        monetaryValue: data.custo_estimado_rs || 0,
    };
    
    if (opportunity) {
        // Update existing
        await ghlRequest(config, `/opportunities/${opportunity.id}`, 'PUT', {
            monetaryValue: opportunityPayload.monetaryValue,
            status: 'open',
        });
    } else {
        // Create new
        opportunity = await ghlRequest(config, '/opportunities/', 'POST', opportunityPayload);
    }
    return opportunity;
}


// --- Main Handler ---
export async function POST(req: NextRequest) {
  try {
    const body: {
        locationId: string;
        name: string;
        phone: string;
        email?: string;
        entrada: Partial<CalculatorData>;
        saida: Partial<CalculationResults>;
    } = await req.json();

    const accessToken = cookies().get('ghl_access_token')?.value;
    if (!accessToken) {
        return NextResponse.json({ error: 'Não autenticado com o GoHighLevel.' }, { status: 401 });
    }
    if (!body.phone) {
        return NextResponse.json({ error: 'Número de telefone é obrigatório.' }, { status: 400 });
    }

    const ghlConfig: GhlApiConfig = {
        baseUrl: 'https://services.leadconnectorhq.com/v1',
        accessToken,
        locationId: body.locationId,
    };
    
    const normalizedPhone = `+55${body.phone.replace(/\D/g, '')}`;

    // 1. Find or Create Contact
    let contact = await findContactByPhone(ghlConfig, normalizedPhone);

    const allData = { ...body.entrada, ...body.saida };
    // This is a placeholder for fetching custom field IDs. In a real app, this would be cached.
    const customFieldsResponse = await ghlRequest(ghlConfig, `/locations/${ghlConfig.locationId}/customFields`, 'GET');
    const fieldIdMap = customFieldsResponse.customFields.reduce((acc: any, field: any) => {
        acc[field.fieldKey] = field.id;
        return acc;
    }, {});
    
    const customFieldsPayload = Object.entries(allData)
      .map(([key, value]) => ({ id: fieldIdMap[key], value: String(value) }))
      .filter(field => field.id && field.value !== undefined);

    if (contact) {
        // Contact exists, update it
        await updateContactCustomFields(ghlConfig, contact.id, customFieldsPayload);
    } else {
        // Contact does not exist, create it
        contact = await createContact(ghlConfig, {
            name: body.name,
            phone: normalizedPhone,
            email: body.email,
            customFields: customFieldsPayload
        });
    }

    if (!contact?.id) {
        throw new Error('Falha ao obter o ID do contato.');
    }

    // 2. Find or Create Opportunity
    const opportunity = await findOrCreateOpportunity(ghlConfig, contact.id, {
        name: body.name,
        custo_estimado_rs: body.saida.custo_estimado_rs || 0,
    });

    return NextResponse.json({ ok: true, contactId: contact.id, opportunityId: opportunity.id });

  } catch (error) {
    console.error('[GHL Save API Error]:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
