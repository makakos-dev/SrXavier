import { type NextRequest, NextResponse } from 'next/server';
import { serverEnv } from '@/lib/env/server';
import { sign } from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const appointmentData = await request.json();

    const paymentLinkToken = sign(
      { data: { h: appointmentData.haircutId, a: appointmentData.appointmentId } },
      serverEnv.JWT_SECRET,
      { noTimestamp: true },
    );

    const paymentLinkData = {
      name: appointmentData.name,
      value: appointmentData.value,
      chargeType: appointmentData.chargeType,
      description: appointmentData.description,
      billingType: appointmentData.billingType,
      dueDateLimitDays: appointmentData.dueDateLimitDays,
      notificationEnabled: appointmentData.notificationEnabled,
      callback: {
        autoRedirect: true,
        successUrl: `${request.nextUrl.origin}/api/success?token=${paymentLinkToken}`,
      },
    };

    const ASSAS_ACCESS_TOKEN =
      serverEnv.NODE_ENV === 'development' || serverEnv.NODE_ENV === 'test'
        ? serverEnv.ASSAS_SANDBOX_ACCESS_TOKEN
        : serverEnv.ASSAS_SANDBOX_ACCESS_TOKEN;

    const ASSAS_URL =
      serverEnv.NODE_ENV === 'development' || serverEnv.NODE_ENV === 'test'
        ? serverEnv.ASSAS_SANDBOX_URL
        : serverEnv.ASSAS_SANDBOX_URL;

    const paymentLinkOptions = {
      method: 'POST',
      body: JSON.stringify(paymentLinkData),
      headers: {
        accept: 'application/json',
        access_token: ASSAS_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${ASSAS_URL}/paymentLinks`, paymentLinkOptions);

    if (!response.ok) {
      return NextResponse.json(
        { message: 'an error occurred during the payment link creation' },
        { status: response.status },
      );
    }

    return NextResponse.json(
      { data: await response.json(), message: 'payment link successfully created' },
      { status: 200 },
    );
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return NextResponse.json({ data: undefined, message: error.message }, { status: 500 });
  }
}
