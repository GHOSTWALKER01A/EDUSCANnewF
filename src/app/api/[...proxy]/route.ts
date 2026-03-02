import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export async function GET(request: Request) {
  return handleProxy(request);
}

export async function POST(request: Request) {
  return handleProxy(request);
}

export async function PUT(request: Request) {
  return handleProxy(request);
}

export async function PATCH(request: Request) {
  return handleProxy(request);
}

export async function DELETE(request: Request) {
  return handleProxy(request);
}

async function handleProxy(request: Request) {
  try {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api/, ''); // Remove /api prefix
    const backendUrl = `${BACKEND_URL}${path}${url.search}`;

    // Get the HttpOnly cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const headers = new Headers(request.headers);
    headers.delete('host'); // Let fetch set the correct host for the backend
    headers.delete('connection'); // Let fetch manage connections
    headers.delete('content-length');

    // Attach Authorization header if we have a token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let body = null;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const contentType = headers.get('content-type') || '';
      if (contentType.includes('multipart/form-data')) {
          // If sending FormData we should just pass the raw bytes
          body = await request.arrayBuffer();
          // We MUST KEEP the content-type header because it contains the boundary!
      } else {
        body = await request.text();
      }
    }

    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
      // Pass cache to 'no-store' to ensure dynamic proxying
      cache: 'no-store'
    });

    const dataBuffer = await response.arrayBuffer();

    const nextResponseHeaders = new Headers(response.headers);
    nextResponseHeaders.delete('content-encoding'); // Let Next.js handle it
    
    return new NextResponse(dataBuffer, {
      status: response.status,
      statusText: response.statusText,
      headers: nextResponseHeaders,
    });
  } catch (error: any) {
    console.error('API Proxy error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error during proxied request' },
      { status: 500 }
    );
  }
}
