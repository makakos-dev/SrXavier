import Link from 'next/link';

export const ReCaptchaBadge = () => {
  return (
    <div className='py-1'>
      Este site é protegido pelo reCAPTCHA e se aplicam a{' '}
      <Link
        href='https://policies.google.com/privacy'
        className='underline underline-offset-4 hover:text-primary'
      >
        Política de Privacidade
      </Link>{' '}
      e os{' '}
      <Link
        href='https://policies.google.com/terms'
        className='underline underline-offset-4 hover:text-primary'
      >
        Termos de Serviço
      </Link>{' '}
      do Google.
    </div>
  );
};
