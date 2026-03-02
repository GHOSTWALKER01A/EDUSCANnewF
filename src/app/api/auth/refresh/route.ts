import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
      return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
    }

    // Proxy the refresh request to the actual backend
    const response = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Pass existing token to get a new one
      }
    });

    const data = await response.json();

    if (!response.ok) {
        // Ensure we clear the cookie if refresh fails completely
        const failResponse = NextResponse.json(data, { status: response.status });
        failResponse.cookies.delete('accessToken');
        return failResponse;
    }

    const newAccessToken = data.data?.accesstoken || data.accesstoken;

    if (!newAccessToken) {
      return NextResponse.json(
        { message: 'New token not received from server' },
        { status: 500 }
      );
    }

    // Create the Next.js response
    const nextResponse = NextResponse.json({ message: 'Refreshed' }, { status: 200 });

    // Set the NEW HttpOnly cookie for the access token
    nextResponse.cookies.set({
      name: 'accessToken',
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days (adjust based on your JWT expiration)
    });

    return nextResponse;
  } catch (error: any) {
    console.error('Refresh proxy error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error during refresh proxy' },
      { status: 500 }
    );
  }
}
