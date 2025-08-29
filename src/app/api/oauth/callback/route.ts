import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

function getPopupResponse(success: boolean, error?: string) {
    const message = JSON.stringify({ type: 'GHL_OAUTH_DONE', success, error });
    return new NextResponse(`
        <!DOCTYPE html>
        <html>
        <head>
            <script>
                window.opener.postMessage(${message}, '*');
                window.close();
            </script>
        </head>
        <body>
            <p>Conectando, por favor aguarde...</p>
        </body>
        </html>
    `, { headers: { 'Content-Type': 'text/html' }});
}


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return getPopupResponse(false, 'Código de autorização não fornecido.');
  }

  try {
    const tokenResponse = await fetch('https://services.leadconnectorhq.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        client_id: process.env.GHL_CLIENT_ID!,
        client_secret: process.env.GHL_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.GHL_REDIRECT_URI!,
      }),
    });

    const tokens = await tokenResponse.json();

    if (tokens.error) {
        throw new Error(tokens.error_description || 'Ocorreu um erro desconhecido durante a troca de tokens.');
    }
    
    const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' };
    cookies().set('ghl_access_token', tokens.access_token, { ...cookieOptions, maxAge: tokens.expires_in });
    cookies().set('ghl_refresh_token', tokens.refresh_token, cookieOptions);
    cookies().set('ghl_location_id', tokens.locationId, cookieOptions);
    
    return getPopupResponse(true);

  } catch (error) {
    console.error('OAuth callback error:', error);
    return getPopupResponse(false, (error as Error).message);
  }
}
