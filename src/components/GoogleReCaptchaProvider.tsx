'use client';

import { GoogleReCaptchaProvider as ReCaptchaProvider } from 'react-google-recaptcha-v3';
import { clientEnv } from '@/lib/env/client';

export const GoogleReCaptchaProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReCaptchaProvider reCaptchaKey={clientEnv.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>{children}</ReCaptchaProvider>
  );
};
