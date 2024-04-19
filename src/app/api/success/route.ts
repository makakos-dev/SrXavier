import { markAppointmentAsPaid } from '@/services/server-side/markAppointmentAsPaid';
import { type NextRequest, NextResponse } from 'next/server';
import { paymentLinkTokenSchema } from '@/lib/schemas';
import { serverEnv } from '@/lib/env/server';
import { verify } from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')?.trim();
    if (!token) throw new Error('missing token');

    const decodedToken = paymentLinkTokenSchema.parse(verify(token, serverEnv.JWT_SECRET));
    const { a: appointmentId, h: haircutId } = decodedToken.data;
    await markAppointmentAsPaid(appointmentId);

    return NextResponse.redirect(new URL(`corte/${haircutId}?id=${appointmentId}`, request.nextUrl.origin));
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return NextResponse.redirect(request.nextUrl.origin);
  }
}
