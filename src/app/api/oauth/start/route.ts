import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GHL_CLIENT_ID;
  const redirectUri = process.env.GHL_REDIRECT_URI;
  
  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: 'GoHighLevel client ID or redirect URI is not configured.' }, { status: 500 });
  }

  const baseUrl = 'https://marketplace.gohighlevel.com/oauth/chooselocation';
  const scopes = [
    'locations.readonly',
    'users.readonly',
    'locations/customFields.write',
    'contacts.write',
    'contacts.readonly',
    'opportunities.write',
    'opportunities.readonly',
    'locations/customMenus.write'
  ];

  const authUrl = `${baseUrl}?response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&client_id=${clientId}&scope=${scopes.join(' ')}`;

  return NextResponse.redirect(authUrl);
}
