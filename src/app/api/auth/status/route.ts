import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const accessToken = cookies().get('ghl_access_token');
  const locationId = cookies().get('ghl_location_id');

  if (accessToken && locationId) {
    // In a real app, you might want to verify the token here by making a simple API call to GHL
    return NextResponse.json({
      connected: true,
      locationId: locationId.value,
    });
  }

  return NextResponse.json({ connected: false });
}
