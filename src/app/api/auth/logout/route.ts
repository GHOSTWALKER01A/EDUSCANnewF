import { NextResponse } from 'next/server';

export async function POST() {
  const nextResponse = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  
  // Clear the HttpOnly cookie
  nextResponse.cookies.delete('accessToken');
  
  return nextResponse;
}
