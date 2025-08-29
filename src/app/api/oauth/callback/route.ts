import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  
  if (!code) {
    const errorUrl = new URL('/internal', req.nextUrl.origin);
    errorUrl.searchParams.set('error', 'oauth_failed');
    errorUrl.searchParams.set('error_description', 'Authorization code not provided.');
    return NextResponse.redirect(errorUrl);
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
        throw new Error(tokens.error_description || 'An unknown error occurred during token exchange.');
    }
    
    // Securely store tokens in an HTTPOnly cookie
    const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' };
    cookies().set('ghl_access_token', tokens.access_token, { ...cookieOptions, maxAge: tokens.expires_in });
    cookies().set('ghl_refresh_token', tokens.refresh_token, cookieOptions);
    cookies().set('ghl_location_id', tokens.locationId, cookieOptions);

    const internalUrl = new URL('/internal', req.nextUrl.origin);
    internalUrl.searchParams.set('fresh_connection', 'true');
    return NextResponse.redirect(internalUrl);

  } catch (error) {
    console.error('OAuth callback error:', error);
    const errorUrl = new URL('/internal', req.nextUrl.origin);
    errorUrl.searchParams.set('error', 'oauth_failed');
    errorUrl.searchParams.set('error_description', (error as Error).message);
    return NextResponse.redirect(errorUrl);
  }
}
