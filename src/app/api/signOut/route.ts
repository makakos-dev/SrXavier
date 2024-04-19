import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  cookies().delete('session');
  return NextResponse.json({}, { status: 200 });
}
