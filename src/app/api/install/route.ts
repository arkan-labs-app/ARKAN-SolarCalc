import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function ghlRequest(accessToken: string, endpoint: string, method: 'POST' | 'GET', body?: any) {
  const url = `https://services.leadconnectorhq.com/v1${endpoint}`;
  const options: RequestInit = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Version': '2021-07-28',
    },
    body: body ? JSON.stringify(body) : undefined,
  };
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`GHL API Error: ${response.status} - ${errorBody}`);
  }
  return response.json().catch(() => ({}));
}

async function ensureCustomFields(accessToken: string, locationId: string) {
  const existingFields = await ghlRequest(accessToken, `/locations/${locationId}/customFields`, 'GET');
  const existingFieldKeys = new Set(existingFields.customFields?.map((f: any) => f.fieldKey) || []);
  
  const fieldsToCreate = [
    { name: 'ROI - Consumo (kWh/mês)', key: 'consumo_kwh_mes' },
    { name: 'ROI - Sistema (kWp)', key: 'sistema_kwp' },
    { name: 'ROI - Custo Estimado (R$)', key: 'custo_estimado_rs' },
    { name: 'ROI - Geração (kWh/mês)', key: 'geracao_kwh_mes' },
    { name: 'ROI - Economia Mensal (R$)', key: 'economia_mensal_rs' },
    { name: 'ROI - Payback (Meses)', key: 'payback_meses' },
  ];

  for (const field of fieldsToCreate) {
    if (!existingFieldKeys.has(field.key)) {
      console.log(`Creating custom field: ${field.name}`);
      await ghlRequest(accessToken, '/custom-fields/', 'POST', {
        name: field.name,
        fieldKey: field.key,
        dataType: 'TEXT',
        model: 'contact',
        locationId: locationId,
      });
    }
  }
}

async function ensureCustomMenuLink(accessToken: string, locationId: string) {
    const menuName = 'Calculadora ROI (Interna)';
    const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL}/internal`;

    const existingMenus = await ghlRequest(accessToken, `/locations/${locationId}/custom-menus`, 'GET');
    const existingLink = existingMenus.menus?.find((m: any) => m.menuName === menuName && m.url === menuUrl);

    if (!existingLink) {
        console.log(`Creating custom menu link: ${menuName}`);
        await ghlRequest(accessToken, `/locations/${locationId}/custom-menus`, 'POST', {
            menuName,
            url: menuUrl,
            openInIframe: true,
            userType: 'both',
        });
    }
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = cookies().get('ghl_access_token')?.value;
    const locationId = cookies().get('ghl_location_id')?.value;

    if (!locationId || !accessToken) {
      throw new Error('Localização ou token de acesso não encontrados para a instalação.');
    }

    await ensureCustomFields(accessToken, locationId);
    await ensureCustomMenuLink(accessToken, locationId);

    return NextResponse.json({ success: true, message: 'Instalação concluída com sucesso.' });
  } catch (error) {
    console.error("Install API error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
