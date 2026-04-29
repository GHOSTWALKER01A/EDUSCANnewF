import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Proxy the login request to the actual backend
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const { accessToken, user } = data.data || {};

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Token not received from server' },
        { status: 500 }
      );
    }

    // Create the Next.js response
    const nextResponse = NextResponse.json({ data: { user, accessToken } }, { status: 200 });

    // Set the HttpOnly cookie for the access token
    nextResponse.cookies.set({
      name: 'accessToken',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days (adjust based on your JWT expiration)
    });

    return nextResponse;
  } catch (error: any) {
    console.error('Login proxy error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error during login proxy' },
      { status: 500 }
    );
  }
}
