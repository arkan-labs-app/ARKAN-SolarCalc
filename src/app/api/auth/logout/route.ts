import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    cookies().delete('ghl_access_token');
    cookies().delete('ghl_refresh_token');
    cookies().delete('ghl_location_id');
    
    return NextResponse.json({ success: true, message: 'Disconnected successfully.' });
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
