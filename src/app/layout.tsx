import { GoogleReCaptchaProvider } from '@/components/GoogleReCaptchaProvider';
import { Galada, Poppins, Raleway } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/ThemeProvider';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';

import '@/stylesheets/globals.css';

export const metadata: Metadata = {
  title: 'Barbearia Sr. Xavier',
  description:
    'Olá, eu me chamo Eduardo e sou um apaixonado pela arte de cortar cabelos. Para mim, não há nada mais gratificante do que ver um cliente satisfeito com a sua aparência, e é por isso que faço isso há tanto tempo. Uma das minhas habilidades é criar cortes que combinam com a personalidade de cada um. Não importa se você prefere algo tradicional ou ousado, atual ou clássico, eu posso te ajudar a descobrir o estilo ideal para o seu tipo de rosto e cabelo.',
};

const poppins = Poppins({
  subsets: ['latin'],
  fallback: ['system-ui'],
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const raleway = Raleway({
  subsets: ['latin'],
  fallback: ['system-ui'],
  variable: '--font-raleway',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const galada = Galada({
  weight: ['400'],
  subsets: ['latin'],
  fallback: ['system-ui'],
  variable: '--font-galada',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fonts = `${GeistSans.className} ${poppins.variable} ${raleway.variable} ${galada.variable}`;

  return (
    <html lang='pt-BR'>
      <body className={`${fonts} flex flex-col`}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <GoogleReCaptchaProvider>{children}</GoogleReCaptchaProvider>
          <Toaster richColors position='bottom-right' />
        </ThemeProvider>
      </body>
    </html>
  );
}
